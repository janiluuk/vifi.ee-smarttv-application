Vifi.Player.FilmContent = Backbone.Model.extend({
    url: "",
    params: "",
    session: false,
    defaults: {
        'id': '',
        'title': '',
        'year': '',
        'director': '',
        'genre': '',
        'running_time': '',
        'videos': [{
                'mp4': '',
                'profile': '',
                'code': ''
            }

        ],
        'images': {
            'thumb': '',
            'poster': ''
        },
        'subtitles': [{
            'filename': '/cloud_atlas_ee.srt',
            'code': 'ee',
            'language': 'Estonian'
        }]
    },

    initialize: function(options) {

        this.on("change:params", this.updateParams, this);
        this.on("change:id", this.refresh, this);
        this.on("change:videos", this.loadFilm, this);
        this.on("change:subtitles", this.loadSubtitles, this);

        if (options && undefined != options.params) {

            this.setParams(options.params);

        }
        if (options && undefined != options.movie) {
            this.set("id", options.movie);
        }

    },


    loadFilm: function() {
        if (!this.session)
            app.player.trigger("player:load", this.get("id"));
    },

    loadSubtitles: function() {
        app.player.trigger("subtitles:ready", app.player.content);
    },

    setParams: function(params) {

        this.set("params", params);
    },
    updateParams: function() {


        if (this.get("params") != "") {
            var params = this.get("params");

            var sessionId = params.data.sessionId;
            var authId = params.data.authId;
            var apiKey = params.data.api_key;

            this.url = Vifi.Settings.api_url + "content/" + this.get("id") + "?jsoncallback=?&sessionId=" + sessionId + "&authId=" + authId + "&api_key=" + apiKey;
        }

    },

    refresh: function() {
        this.updateParams();
        this.fetch();
    }
});



Vifi.Player.PlayerView = Backbone.View.extend({
    tagName: 'div',
    el: $("#" + Vifi.Settings.playerPageId),
    hideVideoNavigationTimeout: false,
    optionsEl: '#player-options',
    infoEl: '#player-info',
    model: false,
    initialize: function(options) {


        if (options && undefined != options.model) {

            this.model = options.model;

        }

        _.bindAll(this, 'onPlayerPageExit', 'onPlayerPageEnter', 'closeDetails', 'showDetails', 'showNavigation', 'hideNavigation', "clearAllTimeouts", "touchVideoNavigationTimeout", "onBufferingStart");
        Vifi.Event.on("mediaplayer:bufferingstart", this.onBufferingStart, this);
        Vifi.Event.on("mediaplayer:bufferingstop", this.onBufferingStop, this);
        this.on("player:show", this.onPlayerPageEnter);
        this.on("player:exit", this.onPlayerPageExit);
        this.render();
    },

    onBufferingStart: function() {

        this.$("#player-loading").css("visibility", "visible");


    },

    onBufferingStop: function() {

        this.$("#player-loading").css("visibility", "hidden");

    },

    render: function() {
        this.$el.html(ich.playerTemplate(this.model.get("content").toJSON()));
        $("#playerPage .tab-content").each(function() {
            $(this).find("div:first").addClass("no-left");
            $(this).find("div:last").addClass("no-right");
        });
        return this;
    },

    closeDetails: function() {
        $(this.infoEl).hide();
        this.clearAllTimeouts();
        this.hideMenuTimeout = setTimeout(hideNavigation, 7000);
    },

    showDetails: function() {
        this.clearAllTimeouts();
        $(this.infoEl).show();
    },

    showNavigation: function() {
        Vifi.KeyHandler.unbind("all", this.touchVideoNavigationTimeout);
        this.clearAllTimeouts();
        this.showDetails();
        $(this.optionsEl).fadeIn();
        this.touchVideoNavigationTimeout();
        Vifi.KeyHandler.bind("all", this.touchVideoNavigationTimeout, this);
    },
    hideNavigation: function() {
        if (Vifi.MediaPlayer.playing()) {
            this.clearAllTimeouts();
            $(this.optionsEl).fadeOut();
            Vifi.KeyHandler.bind("all", this.touchVideoNavigationTimeout, this);
        }
    },

    returnToMenu: function() {
        Vifi.Engine.exit(false);
    },
    clearAllTimeouts: function() {
        clearTimeout(this.hideVideoNavigationTimeout);
    },

    onPlayerPageEnter: function() {
        Vifi.Event.trigger("page:change", "player");

        $.scrollTo(0);

        $(".container:visible:not(#playerPage)").addClass("container-hidden").fadeOut();
        this.$el.fadeIn();

        setTimeout(function() {
            Vifi.PageManager.decorateHandler.addClassHandler('action-button', function(component) {
                component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, app.page.onActionEvent, false, app.page)
            });
            tv.ui.decorateChildren(goog.dom.getElement("playerPage"), app.page.pageManager.decorateHandler.getHandler());
            var focus = tv.ui.getComponentByElement(goog.dom.getElement("player-options")).tryFocus();

        }, 1200);
        this.showNavigation();

    },
    onPlayerPageExit: function() {

        app.player.trigger("mediaplayer:stop", this);
        tv.ui.getComponentByElement(goog.dom.getElement("application")).removeChildren();
        tv.ui.decorate(document.body);
        $("#playerPage").empty().fadeOut();

        $(".container-hidden").fadeIn().removeClass("container-hidden");

        tv.ui.decorateChildren(goog.dom.getElement("application"));

        Vifi.Event.trigger("page:change", "movie");

    },

    touchVideoNavigationTimeout: function() {
        if (!$(this.optionsEl).is(":visible")) {
            $(this.optionsEl).fadeIn();
        }
        if (!$(this.infoEl).is(":visible")) {
            $(this.infoEl).fadeIn();
        }

        clearTimeout(this.hideVideoNavigationTimeout);
        this.hideVideoNavigationTimeout = setTimeout(function() {
            $(this.optionsEl).fadeOut();
            $(this.infoEl).fadeOut();
        }.bind(this), 7000);
    }
});

Vifi.Player.Player = Backbone.Model.extend({
    movie: false,
    session: false,
    content: false,
    playerPage: false,
    subtitles: {},
    playerId: 'player',
    playerControlsId: 'player-controls',
    debug: true,
    ready: false,


    initialize: function(options) {
        this.unbind('all');
        if (options && undefined != options.session) {
            this.setSession(options.session);
        }
        if (options && undefined != options.content) {
            this.content = options.content;
        }
        $log("Player initializing...");

        this.on('all', function(event) {
            $log(event);
        });

        this.subtitles = new Vifi.Player.Subtitles();

        this.on('player:load', this.onLoadFilm, this);
        this.on('player:ready', this.onPlayerReady, this);
        this.on('subtitles:ready', this.onSubtitlesReady, this);


        this.on('mediaplayer:stop', this.onPlayerStop, this);
    },

    onPlayerReady: function(playerPage) {
        playerPage.trigger("player:show");
    },



    onPlayerStop: function(event) {

        Vifi.MediaPlayer.stop();

    },

    onBufferingStart: function(event) {



    },
    onSubtitlesReady: function(event) {

        var subtitles = app.player.content.get("subtitles");
        this.subtitles.load(subtitles);

    },



    /*
     * Load defined film content to the player
     */

    onLoadFilm: function(id) {
        var content = false;
        var movie = app.collection.get(id);

        if (this.verifySession(movie) == true) {

            this.movie = app.collection.get(id);

            if (content = this.getContentFiles()) {
                this.getVideo();
                this.playerPage = new Vifi.Player.PlayerView({
                    model: this
                });

                Vifi.MediaPlayer.init();
                Vifi.MediaPlayer.setContent(content);


                Vifi.KeyHandler.unbind("keyhandler:onReturn");
                Vifi.KeyHandler.bind("keyhandler:onReturn", this.playerPage.onPlayerPageExit, this);
                this.trigger("player:ready", this.playerPage, this);


                return true;
            }
        }
        $log("!! Error loading movie content for id " + id + " - invalid session");
        return false;

    },

    getVideo: function(profile_name) {
        var url = false;

        if (this.content) {

            var videos = this.content.get("videos")[0];
            if (!profile_name) {

                url = videos.mp4;
                this.url = url;
            }
        }

        return url;
    },

    getContentFiles: function() {


        if (this.movie && this.movie.get("id")) {
            if (this.get("content") && this.get("content").id == this.movie.get("id")) return this.get("content");
            var params = this.session.getParams();
            var time = new Date();
            var details = this.movie.get("film");
            var duration = details.running_time;


            var endingtime = new Date(time.getTime() + duration * 60000);
            var endingtimestring = endingtime.getHours();
            var string = ":";
            if (endingtime.getMinutes() < 10) string += '0' + endingtime.getMinutes();
            else string += endingtime.getMinutes();
            endingtimestring += string;

            this.content = new Vifi.Player.FilmContent({

                movie: this.movie.get("id"),
                params: this.session.getParams(),
                title: details.title,
                year: details.year,
                director: details.director,
                endingtime: endingtimestring,
                genre: details.genres[0].name
            });

            this.set("content", this.content);

            return this.content;

        }
        return false;
    },

    loadContent: function() {

        console.log(this.content);
    },
    verifyContent: function() {

        return true;

    },
    verifySession: function(movie) {

        // Check if user is paired at all

        if (!this.session || !this.session.isLoggedIn()) {
            Vifi.Event.trigger("activation:show");
            return false;
        }
        var profile = this.session.get("profile");

        if (profile.purchase(movie) == true) {
            return true;
        }

        return false;
    },
    setSession: function(session) {

        this.session = session;
        return true;
    },




});


_.extend(Vifi.Player.Player, Backbone.Events);