Vifi.Player.FilmContent = Backbone.Model.extend({
    url: "",
    params: "",
    movie: new Vifi.Films.FilmModel,
    session: false,
    defaults: {
        'id': '',
        'title': '',
        'year': '',
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
            'filename': '',
            'code': '',
            'language': ''
        }]
    },

    initialize: function(options) {

        this.on("change:params", this.updateParams, this);
        this.on("change:id", this.refresh, this);
        this.on("change:videos", this.loadFilm, this);
        if (options && undefined != options.params) {

            this.setParams(options.params);

        }
        if (options && undefined != options.movie) {
            this.set("id", options.movie);
        }

    },

    loadFilm: function() {
        Vifi.Event.trigger("player:content:ready", this);
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

    url: 'machete/machete.mp4',
    playerId: 'player',
    playerControlsId: 'player-controls',
    debug: true,
    ready: false,


    initialize: function(options) {

        if (options && undefined != options.session) {
            this.setSession(options.session);
        }
        if (options && undefined != options.content) {
            this.content = options.content;
        }

        Vifi.Event.on("player:content:ready", this.verify, this);
        Vifi.Event.on("player:play", this.initPlayer, this);
    },

    loadFilm: function(id) {

        if (this.verifySession() == true) {
            this.movie = app.collection.get(id);
            this.getContentFiles();
            return true;
        }
        return false;

    },

    getVideo: function(profile_name) {
        if (this.content) {
            var videos = this.content.get("videos");
            if (!profile_name) {
                var url = videos[0].mp4;

                this.url = url;
            }
        }
        return url;
    },
    getContentFiles: function() {


        if (this.movie && this.movie.get("id")) {
            var params = this.session.getParams();

            this.content = new Vifi.Player.FilmContent({
                movie: this.movie.get("id"),
                params: this.session.getParams()
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
    verifySession: function() {


        return true;

    },
    setSession: function(session) {

        if (this.verifySession(session)) {
            this.session = session;

            return true;
        }

        return false;
    },

    verify: function() {


        if (this.verifySession() == true && this.verifyContent() == true) {
            this.set("ready", true);
            Vifi.Event.trigger("player:ready", this);

            var url = this.getVideo();
            return true;
        }

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

Vifi.Player.PlayerView = Backbone.View.extend({
    tagName: 'div',
    el: $("#" + Vifi.Settings.playerPageId),
    model: new Vifi.Player.Player(),
    content: false,
    initialize: function(options) {

        if (options && undefined != options.content) {

            this.content = options.content;

        }
        if (options && undefined != options.model) {

            this.model = options.model;

        }
        this.render();
    },
    render: function() {
        this.$el.html(ich.playerTemplate(this.content.toJSON()));
        return this;
    }
});

var closeDetails = function() {
    $("#player-info").hide();
    clearAllTimeouts();
    Vifi.Navigation.setFocus("brightcove:mainmenu");
    hideMenuTimeout = setTimeout(hideNavigation, 7000);
}

var showDetails = function() {
    clearAllTimeouts()
    $("#player-info").show();
}

var showNavigation = function() {
    Vifi.KeyHandler.unbind("all", touchVideoNavigationTimeout);
    clearAllTimeouts();

    $("#player-controls").fadeIn();

    Vifi.Navigation.enable();
    touchVideoNavTimeout();
    Vifi.KeyHandler.bind("all", touchVideoNavigationTimeout);
}

var returnToMenu = function() {
    Vifi.Engine.exit(false);
}
var hideNavigation = function() {
    if (Vifi.MediaPlayer.playing() && $("#player-info").is(":hidden")) {
        clearAllTimeouts();
        $("#player-controls").fadeOut();
        Vifi.KeyHandler.bind("all", touchVideoNavigationTimeout);
    }
}


var hideVideoNavigationTimeout;
var clearAllTimeouts = function() {
    clearTimeout(hideVideoNavigationTimeout);
}

var touchVideoNavigationTimeout = function() {
    if (!$("#player-controls").is(":visible")) {
        $("#player-controls:hidden").fadeIn();
    }
    clearTimeout(hideVideoNavigationTimeout);
    hideVideoNavigationTimeout = setTimeout(function() {
        $("#player-controls").fadeOut();
    }, 7000);
}