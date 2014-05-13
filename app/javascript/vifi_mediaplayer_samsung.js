/**
 *
 *  Vifi Media Player for samsung
 *
 *  author: Jani Luukkanen
 *  janiluuk@gmail.com
 *
 */

var avplayObj;

Vifi.MediaPlayer = {
    plugin: avplayObj,
    audioPlugin: null,
    initialized: false,
    state: -1,
    skipState: -1,
    stopCallback: null,
    /* Callback function to be set by client */
    originalSource: null,
    streamready: false,
    currentTime: 0,
    allowFastForward: true,
    content: null,
    visible: false,
    STOPPED: 10,
    PLAYING: 11,
    PAUSED: 12,
    FORWARD: 13,
    REWIND: 14,
    userBitrate: null,
    _active: false,
    loop: false,

    currentInfoDefaults: {
        duration: "unknown",
        height: "unkown",
        width: "unknown",
    },

    currentInfo: {},



    init: function() {
        $log(" ___  SAMSUNG PLAYER INIT ___ ");

        if (this.initialized) return false;
        var _this = this;
        var success = true;
        try {
            webapis.avplay.getAVPlay(function(avplay) {
                avplayObj = _this.plugin = avplay;

            }, function(error) {
                alert(error.message);

            });
        } catch (error) {
            success = false;
            $log(error.name);
            return false;
        }

        var success = true;
        this.state = this.STOPPED;
        this.initialized = true;





        $log("<<< END SAMSUNG NATIVE PLAYER INIT >>>");
        return true;
    },
    setContent: function(content) {


        this.content = content;
        this.currentStream = content[0];
        var url = this.getUrl();

        this.trigger("mediaplayer:oncontentchange", url);

    },


    getCurrentTime: function() {

        return parseInt(Vifi.MediaPlayer.currentTime.millisecond);

    },

    setPlaylist: function(playlist) {
        this.playlist = playlist;
        this.currentIndex = 0;
        this.trigger("mediaplayer:onnewplaylist", playlist);
    },

    setCurrentIndex: function(index) {
        if (this.playlist) {
            this.playlist.setCurrentIndex(index);
        }
    },

    play: function() {

        $log("Playing Media");

        var height = Vifi.Engine.getPlatform().resolution.height;
        var width = Vifi.Engine.getPlatform().resolution.width;



        avplayObj.init({

            zIndex: 14,
            displayRect: {
                width: width,
                height: height,
                top: 0,
                left: 0,
            },
            bufferingCallback: bufferingCB,
            playCallback: playCB,
            autoratio: true
        });


        avplayObj.onerror = 'Vifi.MediaPlayer.videoError';

        this.active();



        if (!this.currentStream || this.currentStream.mp4 == "") {
            $log("NO VIDEO URL SET");
            return false;
        }

        $log("SAMSUNG PLAYER URL SET TO: " + this.currentStream.mp4);
        if (this.state == this.PLAYING) {
            $log("Pausing ...");

            this.pause();
        } else if (this.state == this.PAUSED) {
            if (!avplayObj.resume()) {
                this.videoError("FAILED TO RESUME STREAM");
                this.state = this.PLAYING;
                return false;
            } else {
                this.state = this.PLAYING;
                this.trigger("mediaplayer:onresume");
                return true;
            }
        } else {

            this._playVideo();
        };

    },
    getUrl: function() {
        var video = this.currentStream.mp4;
        var url = "http://media.vifi.ee:1935/tv/_definst_" + video + "/playlist.m3u8|COMPONENT=HLS";

        $log("Video URL is " + url.replace("//", "/"));
        return url;
    },
    _playVideo: function() {


        var url = this.getUrl();

        avplayObj.open(url, {

        });

        var status = false;
        avplayObj.play(function() {
            status = true;
        }, function(error) {
            $log("ERROR!! " + error.message);
        });

        if (status)
            this.state = this.PLAYING;
        else {
            this.videoError("FAILED TO START STREAM");
            this.state = this.STOPPED;
        }

        //  this.streamready = false;
        this.trigger("mediaplayer:onplay", this.currentStream.mp4);
        //   if (this.plugin.Play(this.currentStream.url)) {

    },

    nextVideo: function() {
        $log("___ NEXT VIDEO ___ ");
        this.currentStream = this.playlist.nextFile();
        if (this.currentStream) {
            this.trigger('mediaplayer:onnextvideo', this.playlist.currentItemIndex());
            this._playVideo();
        } else {
            $log(" NO NEXT VIDEO, CALLING PLAYLIST END ")
            this.plugin.stop();
            this.state = this.STOPPED;
            this.trigger("mediaplayer:onplaylistend");
        }
    },
    show: function() {

        $("body") scrollTo(0);
        avplayObj.show();
        $("#_pluginObjectPlayerContainer_1").css("visibility", "visible");
        this.visible = true;
    },
    hide: function() {

        avplayObj.hide();
        $("#_pluginObjectPlayerContainer_1").css("visibility", "hidden");
        this.visible = false;
    },

    // Controls
    // 'play','pause','rewind','fastforward', 'show', 'setCoordinates', 'next','setUserBitrate','stop', 'playing','hide', 'mute']
    stop: function() {
        $log("HARD STOPPING VIDEO");
        this.state = this.STOPPED;
        if (this.visible) this.hide();

        if (avplayObj) {
            $log(" Calling MediaPlayer Stop ")
            avplayObj.stop();
            avplayObj.clear();
            this.deactive();

            this.currentStream = null;
            this.trigger('mediaplayer:onstop');
        }
    },



    pause: function() {
        this.trigger("mediaplayer:onpause");
        avplayObj.pause();
        this.state = this.PAUSED;
    },

    fastforward: function() {
        if (this.allowFastForward) {
            this.trigger("mediaplayer:onfastforward");
            avplayObj.jumpForward(10);
        }
    },

    rewind: function() {
        this.trigger("mediaplayer:onrewind");
        avplayObj.jumpBackward(10);
    },

    mute: function() {
        var currentMute = this.audioPlugin.GetSystemMute();
        this.audioPlugin.SetSystemMute(currentMute == PLR_FALSE);
        Vifi.MediaPlayer.trigger("mediaplayer:onmute", !currentMute);
    },

    setCoordinates: function(x, y, width, height) {
        $log(" SETTING COORDINATES TO: x: " + x + " y: " + y + " width: " + width + " height: " + height);
        if (this.plugin.setDisplayRect) {
            $log("have display area, settings")
            this.plugin.setDisplayRect({
                top: x,
                left: y,
                width: width,
                height: height
            });
        }
    },


    setUserBitrate: function(bitrate) {
        $log(" SETTING BITRATE TO " + bitrate);
        this.userBitrate = bitrate;
    },


    playing: function() {
        $log("TESTING PLAYING ON SAMSUNG PLYAER, STATE: " + this.state);
        return (this.state == this.PLAYING);
    },



    duration: function() {
        if (this.streamready) {
            return avplayObj.duration;
        } else {
            return null;
        }
    },


    // Events

    onDone: function() {
        $log("Video play done");
        if (this.loop) this.play();
        else this.videoUrl = null;
    },



    shutdown: function() {
        this.stop();
        var mwPlugin = document.getElementById("pluginTVMW");
        if (mwPlugin && (this.originalSource != null)) {
            /* Restore original TV source before closing the widget */
            mwPlugin.SetSource(this.originalSource);
            alert("Restore source to " + this.originalSource);
        }
    },




    videoError: function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift("mediaplayer:videoerror");
        this.trigger.apply(this, args)
    },
    bufferingStart: function() {
        this.trigger("mediaplayer:bufferingstart");
    },
    bufferingProgress: function(progress) {
        this.trigger("mediaplayer:bufferingprogress", progress)
    },
    bufferingComplete: function() {
        this.trigger("mediaplayer:bufferingend");
    },

    currentPlayTime: function(currentTime) {

        this.trigger("mediaplayer:timeupdate", currentTime.toString());

    },
    streamEnded: function() {
        this.trigger("mediaplayer:mediaend", this.playlist.currentItemIndex());
        this.nextVideo();
    },
    mute: function(mute) {
        this.trigger("mediaplayer:muted", mute);
    },
    _streamInfoReady: function() {
        $log("Stream info ready: " + Array.prototype.slice.call(arguments, 0).join("\n "));
        this.streamready = true;
        this.trigger("mediaplayer:streaminfoready")
    },
    streamNotFound: function() {
        $log(" STREAM NOT FOUND ");
        this.trigger("mediaplayer:videoerror", "stream not found");
    },
}
_.extend(Vifi.MediaPlayer, Backbone.Events);
_.extend(Vifi.MediaPlayer, Vifi.MediaPlayerCore);

Vifi.MediaPlayer.bind("mediaplayer:timeupdate", function(time) {

    $("#player-progress").css({
        width: Math.floor(time / Vifi.MediaPlayer.duration() * 100) + "%"
    });


    $("#player-current-time").text(Vifi.MediaPlayer.currentTime.toString());
});


/*

avplayObj.onerror = '';
avplayObj.onbufferingcomplete = '';
avplayObj.onbufferingprogress = '';
avplayObj.onbufferingstart = '';
avplayObj.OnConnectionFailed = 'Vifi.MediaPlayer.videoError';
avplayObj.oncurrentplaytime = 
avplayObj.OnNetworkDisconnected = 'Vifi.MediaPlayer.videoError';
avplayObj.OnRenderError = 'Vifi.MediaPlayer.videoError';
avplayObj.OnMute = "Vifi.MediaPlayer.Events.mute";
avplayObj.onstreamcompleted = "";
avplayObj.OnStreamInfoReady = 'Vifi.MediaPlayer._streamInfoReady';
avplayObj.OnStreamNotFound = 'Vifi.MediaPlayer.streamNotFound';
*/

function playSuccessCB() {

    $log("playing the video is successfully.");
}

function errorCB(error) {
    $log("Cannot get avplay object : " + error.name);
}

function succCB() {
    alert("setting source is successful");
}

function err(error) {
    alert(error.name);
}

/* Samsung API methods */

var bufferingCB = {
    onbufferingstart: function() {
        Vifi.MediaPlayer.bufferingStart();
    },
    onbufferingprogress: function(percent) {
        Vifi.MediaPlayer.bufferingProgress(percent);
    },
    onbufferingcomplete: function() {
        Vifi.MediaPlayer.bufferingComplete();
    }
};

var playCB = {
    oncurrentplaytime: function(time) {
        Vifi.MediaPlayer.currentTime = time;
        Vifi.MediaPlayer.currentPlayTime(time);

    },
    onresolutionchanged: function(width, height) {
        $log('resolution changed : ' + width + ', ' + height);
    },
    onstreamcompleted: function() {
        Vifi.MediaPlayer.nextVideo();
    },
    onerror: function(error) {
        Vifi.MediaPlayer.videoError(error);
    }
};

Vifi.Engine.addModule("MediaPlayer", Vifi.MediaPlayer);