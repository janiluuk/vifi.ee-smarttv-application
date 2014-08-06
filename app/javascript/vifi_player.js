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
        if (this.get("subtitles") != null && this.get("subtitles").length > 0)
            this.trigger("subtitles:ready", this.get("subtitles"));
    },



    refresh: function() {
        if (this.get("id") > 0) {
            this.path = "content/" + this.get("id");
            $log("Initializing new content with " + this.path);
        }
    }
});



Vifi.Player.PlayerView = Backbone.View.extend({
    tagName: 'div',
    playerTag: 'player',

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
        this.listenTo(this.model, "content:load", this.onContentLoad);

    },


    onContentLoad: function() {


        this.renderPlayerInfo();
        this.renderPlayerControls();

    },
    renderPlayerControls: function() {

        this.$("#player-options").html(ich.playerControlsTemplate(this.model.content.toJSON()));
        $("#playerPage .tab-content").each(function() {
            $(this).find("div:first").addClass("no-left");
            $(this).find("div:last").addClass("no-right");
        });

        Vifi.PageManager.decorateHandler.addClassHandler('action-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, Vifi.PageManager.onActionEvent, false, Vifi.PageManager)
        });
        tv.ui.decorateChildren(goog.dom.getElement("playerPage"), Vifi.PageManager.decorateHandler.getHandler());
        var focus = tv.ui.getComponentByElement(goog.dom.getElement("player-options"));
        if (focus) focus.tryFocus();
        this.setSubtitleSelection();

    },

    setSubtitleSelection: function() {

        var code = this.model.subtitles.language;
        this.$("#playerSubtitles div[data-value=" + code + "]").click();

    },
    renderPlayerInfo: function() {

        this.$("#player-info").html(ich.playerInfoTemplate(this.model.content.toJSON()));

    },
    onBufferingStart: function() {

        this.$("#player-loading").css("visibility", "visible");


    },

    onBufferingStop: function() {

        this.$("#player-loading").css("visibility", "hidden");

    },

    render: function() {

        this.$el.html(ich.playerTemplate(this.model.content.toJSON()));

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
        this.render();

        $(".container:visible:not(#playerPage)").addClass("container-hidden").fadeOut();
        this.$el.fadeIn();
        this.showNavigation();
        $("body").scrollTo("#playerPage");
        this.onContentLoad();

        Vifi.Navigation.setReturnButton(this.onPlayerPageExit, this);

        setTimeout(function() {

            Vifi.MediaPlayer.play();

        }, 1200);
    },
    onPlayerPageExit: function() {

        Vifi.MediaPlayer.stop();
        tv.ui.getComponentByElement(goog.dom.getElement("playerPage")).removeChildren();

        $("#playerPage").empty().fadeOut();

        $(".container-hidden").fadeIn();
        $(".container-hidden").removeClass("container-hidden");
        tv.ui.decorate(document.body);
        tv.ui.decorateChildren(goog.dom.getElement("application"), app.pagemanager.decorateHandler.getHandler(), tv.ui.getComponentByElement(goog.dom.getElement("application")));
        $("#film-results .tv-container-selected-child").removeClass("tv-container-selected-child");

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
    debug: true,
    ready: false,
    endingTime: "",

    initialize: function(options) {
        if (options && undefined != options.session) {
            this.setSession(options.session);
        }

        this.subtitles = new Vifi.Player.Subtitles();
        this.content = new Vifi.Player.FilmContent();
        this.on('player:load', this.onLoadFilm, this);
        this.on('subtitles:ready', this.onSubtitlesReady, this);
    },

    onSubtitlesReady: function(subtitles) {


        this.subtitles.load(subtitles);

    },

    onContentReady: function(content) {

        this.content.set("endingtime", this.getEndingTime(this.content.get("running_time")));
        this.content.set("genres_text", this.movie.genres_text);

        var content = this.content.get("videos");
        Vifi.MediaPlayer.setContent(content);

        app.player.playerPage.trigger("player:show");
    },
    /*
     * Calculate ending time for the film.
     * @params duration - total length of film in minutes
     * @params offset - current position of the film which will be reducted
     */
    getEndingTime: function(duration, offset) {
        if (!offset) offset = 0;
        if (!duration || duration == "") return false;
        duration = duration - offset;
        return Vifi.Engine.util.minutesToTime(duration);
    },

    updateCurrentTime: function() {

        var currentTime = Vifi.MediaPlayer.getCurrentTime();

    },


    /*
     * Load defined film content to the player
     */

    onLoadFilm: function(id) {
        var content = false;
        var movie = app.collection.get(id);
        if (undefined == movie) {
            movie = app.browser.options.featured.get(id);
        }
        if (this.verifySession(movie) == true) {

            this.movie = movie.get("film");
            var content = new Vifi.Player.FilmContent({
                id: id,
                session: this.session,
                running_time: movie.running_time

            });
            content.fetch();
            content.bind("content:ready", this.onContentReady, this);
            content.bind("subtitles:ready", this.onSubtitlesReady, this);

            this.content = content;
            return true;
        }

        $log("!! Error loading movie content for id " + id + " - invalid session");
        return false;

    },

    /* 
     * Get video file information from the content
     * @params profile = id of the profile, defaults to the first available
     *
     */

    getVideo: function(profile) {

        var content = this.content;
        var videos = false;
        if (content) {
            if (profile) {
                videos = _.find(content.get("videos"), function(video) {
                    return video.code == profile;
                });
            } else {
                videos = content.get("videos")[0];
            }

        }

        return videos;
    },

    verifyContent: function() {

        return true;

    },
    verifySession: function(movie) {

        // Check if user is paired at all

        if (!this.session.get("profile").hasMovie(movie)) {
            app.purchasePage.model = movie;
            app.purchasePage.render();

            Vifi.Event.trigger("purchase:show");
            return false;
        }

        return true;
    },

    setSession: function(session) {

        this.session = session;
        return true;
    },

});


_.extend(Vifi.Player.Player, Backbone.Events);