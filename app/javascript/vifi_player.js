Vifi.Player.FilmContent = Vifi.Utils.ApiModel.extend({
    'path': 'content',
    defaults: {
        'id': false,
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
            'filename': '',
            'code': '',
            'language': ''
        }]
    },

    initialize: function(options) {
        this.refresh();

        this.on("change:id", this.refresh, this);
        this.on("change:videos", this.onLoadContent, this);
        this.on("change:subtitles", this.onLoadSubtitles, this);


    },


    onLoadContent: function(event) {
        if (this.get("videos").length > 0)
            this.trigger("content:ready", this.get("videos"));
        $log("Loaded videos");

    },

    onLoadSubtitles: function(event) {
        if (this.get("subtitles").length > 0)
            this.trigger("subtitles:ready", this.get("subtitles"));
        $log("Loaded new subtitles");

    },



    refresh: function() {
        this.path = "content/" + this.get("id");
        $log("Initializing new content with " + this.path);
    }
});



Vifi.Player.PlayerView = Backbone.View.extend({
    tagName: 'div',

    el: $("#" + Vifi.Settings.playerPageId),
    hideVideoNavigationTimeout: false,
    optionsEl: '#player-options',
    infoEl: '#player-info',
    initialize: function(options) {



        _.bindAll(this, 'render', 'onPlayerPageExit', 'onPlayerPageEnter', 'closeDetails', 'showDetails', 'showNavigation', 'hideNavigation', "clearAllTimeouts", "touchVideoNavigationTimeout", "onBufferingStart");
        Vifi.MediaPlayer.on("mediaplayer:bufferingstart", this.onBufferingStart, this);
        Vifi.MediaPlayer.on("mediaplayer:bufferingend", this.onBufferingStop, this);
        this.on("player:show", this.onPlayerPageEnter, this);
        this.on("player:exit", this.onPlayerPageExit, this);
        this.render();

    },


    onBufferingStart: function() {

        this.$("#player-loading").css("visibility", "visible");


    },

    onBufferingStop: function() {

        this.$("#player-loading").css("visibility", "hidden");

    },

    render: function() {
        this.$el.html(ich.playerTemplate(app.player.content.toJSON()));
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
        this.showNavigation();

        setTimeout(function() {
            Vifi.PageManager.decorateHandler.addClassHandler('action-button', function(component) {
                component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, app.pagemanager.onActionEvent, false, app.pagemanager)
            });
            tv.ui.decorateChildren(goog.dom.getElement("playerPage"), app.pagemanager.decorateHandler.getHandler());
            var focus = tv.ui.getComponentByElement(goog.dom.getElement("player-options")).tryFocus();
            Vifi.MediaPlayer.play();
        }, 1200);


    },
    onPlayerPageExit: function() {

        Vifi.MediaPlayer.trigger("mediaplayer:stop");
        tv.ui.getComponentByElement(goog.dom.getElement("application")).removeChildren();
        tv.ui.decorate(document.body);
        $("#playerPage").empty().fadeOut();

        $(".container-hidden").fadeIn();
        $(".container-hidden").removeClass("container-hidden");

        tv.ui.decorateChildren(goog.dom.getElement("application"));

        Vifi.Event.trigger("page:change", "movie");
        this.hideNavigation();

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
    debug: true,
    ready: false,
    endingTime: "",

    initialize: function(options) {
        if (options && undefined != options.session) {
            this.setSession(options.session);
        }



        this.subtitles = new Vifi.Player.Subtitles();

        this.on('player:load', this.onLoadFilm, this);
        this.on('subtitles:ready', this.onSubtitlesReady, this);



    },



    onSubtitlesReady: function(subtitles) {

        app.player.subtitles.load(subtitles);

    },
    onContentReady: function(content) {


        this.set("endingtime", app.player.getEndingTime(this.get("running_time")));
        this.set("genres_text", app.player.movie.genres_text);

        app.player.playerPage = new Vifi.Player.PlayerView({
            model: this,
        });

        var content = this.get("videos");
        Vifi.MediaPlayer.setContent(content);

        Vifi.KeyHandler.unbind("keyhandler:onReturn");
        Vifi.KeyHandler.bind("keyhandler:onReturn", app.player.playerPage.onPlayerPageExit, this);

        app.player.playerPage.trigger("player:show");
    },

    getEndingTime: function(duration) {
        if (!duration || duration == "") return false;
        var time = new Date();
        var endingtime = new Date(time.getTime() + duration * 60000);
        var endingtimestring = endingtime.getHours();
        var string = ":";
        if (endingtime.getMinutes() < 10) string += '0' + endingtime.getMinutes();
        else string += endingtime.getMinutes();
        endingtimestring += string;
        return endingtimestring;
    },

    /*
     * Load defined film content to the player
     */

    onLoadFilm: function(id) {
        var content = false;
        var movie = app.collection.get(id);

        if (this.verifySession(movie) == true) {

            this.movie = movie.get("film");
            var content = new Vifi.Player.FilmContent({
                id: id,
                session: this.session,
                running_time: movie.running_time

            });
            content.fetch();
            content.bind("content:ready", this.onContentReady);
            content.bind("subtitles:ready", this.onSubtitlesReady);


            this.content = content;
            return true;
        }

        $log("!! Error loading movie content for id " + id + " - invalid session");
        return false;

    },

    getVideo: function(profile_name) {
        var url = false;
        var content = this.get("content");

        if (content) {
            var videos = content.get("videos")[0];
            if (!profile_name) {

                url = videos.mp4;
                this.url = url;
            }
        }

        return url;
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