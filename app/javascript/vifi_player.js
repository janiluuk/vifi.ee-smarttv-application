Vifi.Player.FilmContent = Backbone.Model.extend({
    url: "",
    params: "",
    movie: new Vifi.Films.FilmModel,
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
            app.player.trigger("player:ready", app.player.content);
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


Vifi.Player.Player = Backbone.Model.extend({
    movie: false,
    session: false,
    content: false,

    subtitles: {},
    url: 'machete/machete.mp4',
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

        this.on('player:init', this.onPlayerStart, this);
        this.on('player:load', this.onLoadFilm, this);
        this.on('player:ready', this.onPlayerReady, this);
        this.on("player:play", this.initPlayer, this);
        this.on('subtitles:ready', this.onSubtitlesReady, this);


        this.on('mediaplayer:stop', this.onPlayerStop, this);
    },



    onPlayerStart: function(event) {
 

        Vifi.Event.trigger("page:change", "player", this.onPlayerPageEnter);
        Vifi.Event.trigger("page:focus");
        this.set("ready", false);
        this.trigger("player:ready");


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
    onPlayerReady: function(event) {


        app.playerPage = new Vifi.Player.PlayerView({
            model: this,
            content: app.player.content
        });


        if (Vifi.Engine.getPlatform().name == "Samsung") {
            Vifi.MediaPlayer.init();
            Vifi.MediaPlayer.setContent(app.player.content);
        } else {
            this.url = app.player.content.get("videos")[0].mp4;

            this.trigger("player:play");
        }

 
        Vifi.KeyHandler.unbind("keyhandler:onReturn");
        Vifi.KeyHandler.bind("keyhandler:onReturn", this.onPlayerExit, this);
        app.playerPage.showNavigation();
    },


    onPlayerExit: function(event) {

        this.trigger("mediaplayer:stop", this);

        var lastActivePageId = "home";

        if (Vifi.PageManager.lastActivePage) {
            lastActivePageId = $(Vifi.PageManager.lastActivePage).attr("id");
        }

        this.onPlayerPageExit();


    },

    onPlayerPageEnter: function() {
       
       $(".container:visible:not(#playerPage)").find(".tv-component").each(function() {
            $(this).removeClass("tv-component").addClass("tv-component-disabled").addClass("tv-component-hidden");
        });

        $(".container:not(.container-hidden):visible").addClass("container-hidden").fadeOut(
            function() {
                tv.ui.getComponentByElement(goog.dom.getElement("application")).removeChildren();
                tv.ui.decorateChildren(goog.dom.getElement("playerPage"));
                $.scrollTo("#playerPage");
                $("#playerPage").fadeIn();
                tv.ui.decorate(document.body);



            }
        );
        setTimeout(function() {
            Vifi.PageManager.decorateHandler.addClassHandler('action-button', function(component) {
                component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, app.page.onActionEvent, false, app.page)
            });
            tv.ui.decorate(document.body, app.page.pageManager.decorateHandler.getHandler(), app.page.pageManager.appComponent);
            var jee = tv.ui.getComponentByElement(goog.dom.getElement("player-controls")).tryFocus()
        }, 2000);

    },
    onPlayerPageExit: function() {
        $(".container-hidden").css("opacity", 0);

        $(".container:not(#playerPage)").find(".tv-component-hidden").each(function() {
            $(this).removeClass("tv-component-disabled").removeClass("tv-component-hidden").addClass("tv-component");

        });
        $("#playerPage").find(".tv-component").each(function() {
            $(this).removeClass("tv-component").addClass("tv-component-disabled");

        });
        $("#playerPage").fadeOut("slow");

        $(".container, #browserPage").css("opacity", 1);

        $(".container-hidden, #browserPage").removeClass("container-hidden").fadeIn(
            function() {    


          

                tv.ui.getComponentByElement(goog.dom.getElement("application")).removeChildren();
                tv.ui.decorateChildren(goog.dom.getElement("application"), app.pagemanager.decorateHandler.getHandler());

            }

        );
        Vifi.Event.trigger("page:back");
        Vifi.Event.trigger("page:focus");



    },
    /*
     * Load defined film content to the player
     */

    onLoadFilm: function(id) {
        var content = false;
        var movie =  app.collection.get(id);

        if (this.verifySession(movie) == true) {

            this.movie = app.collection.get(id);

            if (this.getContentFiles()) {
                this.getVideo();

                this.trigger("player:init", this.content, this);


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
            var params = this.session.getParams();
            var time = new Date();
            var details = this.movie.get("film");
            var duration = details.running_time;


            var endingtime = new Date(time.getTime() + duration * 60000);
            var endingtimestring = endingtime.getHours();
            var string = ":";
            if  (endingtime.getMinutes() < 10)  string +=  '0' + endingtime.getMinutes();
            else string += endingtime.getMinutes();
            endingtimestring +=string;

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



    initPlayer: function() {

        flowplayer(this.playerId, {
            src: 'http://app.vifi.ee/app/swf/flowplayer.commercial.swf',
            wmode: 'opaque'
        }, {
            key: '#$05466e2f492e2ca07a3',
            log: {
                level: 'none'
            },
            // change the default controlbar to modern
            onStart: function(clip) {
                var f = this;

            },
            onResume: function() {
                if (!this.isFullscreen()) {
                    this.toggleFullscreen();
                }
            },


            clip: {
                baseUrl: 'rtmpe://media.vifi.ee/vod/',
                autoBuffering: true,
                scaling: 'fit',
                provider: 'rtmp',
                connectionProvider: 'secure',
                url: this.url.substring(this.url.length - 3, this.url.length) == 'mp4' ? this.url.substring(this.url.length - 3, this.url.length) + ':' + this.url : this.url,
                accelerated: true,
                fadeInSpeed: 7000,
                // on last second, fade out screen
                onLastSecond: function() {
                    this.getScreen().animate({
                        opacity: 0
                    }, 3000);
                },
                // if screen is hidden, show it upon startup
                onStart: function() {
                    this.getScreen().css({
                        opacity: 1
                    });

                },
                onKeypress: function(key) {

                    alert(key);


                },
            },
            plugins: {
                rtmp: {
                    url: 'http://app.vifi.ee/app/swf/flowplayer.rtmp-3.2.3.swf',
                },
                // the captions plugin
                captions: {
                    url: 'http://app.vifi.ee/app/swf/flowplayer.captions-3.2.3.swf',
                    captionTarget: 'content',
                    button: null
                },
                secure: {
                    url: 'http://app.vifi.ee/app/swf/flowplayer.securestreaming.swf',
                },
                controls: null,
                content: {
                    url: 'http://app.vifi.ee/app/swf/flowplayer.content-3.2.0.swf',
                    bottom: 15,
                    height: 70,
                    backgroundColor: 'transparent',
                    backgroundGradient: 'none',
                    border: 0,
                    textDecoration: 'outline',
                    style: {
                        body: {
                            fontSize: '18%',
                            fontFamily: 'Arial',
                            textAlign: 'center',
                            color: '#ffffff'
                        }
                    }
                }
            }
        }).controls(this.playerControlsId);
    }
});


_.extend(Vifi.Player.Player, Backbone.Events);


Vifi.Player.PlayerView = Backbone.View.extend({
    tagName: 'div',
    el: $("#" + Vifi.Settings.playerPageId),
    hideVideoNavigationTimeout: false,
    optionsEl: '#player-options',
    infoEl: '#player-info',
    model: false,
    content: false,
    initialize: function(options) {

        if (options && undefined != options.content) {

            this.content = options.content;

        }
        if (options && undefined != options.model) {

            this.model = options.model;

        }

        _.bindAll(this, 'closeDetails', 'showDetails', 'showNavigation', 'hideNavigation', "clearAllTimeouts", "touchVideoNavigationTimeout", "onBufferingStart");
        Vifi.Event.on("mediaplayer:bufferingstart", this.onBufferingStart, this);
        Vifi.Event.on("mediaplayer:bufferingstop", this.onBufferingStop, this);
      
        this.render();
    },

    onBufferingStart: function() {

        this.$("#player-loading").css("visibility", "visible");


    },

    onBufferingStop: function() {

        this.$("#player-loading").css("visibility", "hidden");
        
    },

    render: function() {
        this.$el.html(ich.playerTemplate(this.content.toJSON()));
        $("#playerPage .tab-content").each(function() { $(this).find("div:first").addClass("no-left"); $(this).find("div:last").addClass("no-right"); });
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