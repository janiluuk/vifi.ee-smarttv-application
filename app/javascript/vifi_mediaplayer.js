/**
 *
 *  Vifi Media Player
 *
 *  author: Jani Luukkanen
 *  janiluuk@gmail.com
 *
 */

Vifi.MediaPlayerCore = {
    _testUrl: null, // "http://assets.adifferentengine.com/SizedDownloads/512KB.json",
    _testSize: 512000,
    _active: false,
    userBitrate: 10000,
    speedtest: function(callback) {
        // $log(" ___ PERFORMING SPEEDTEST ___ ");
        callback = callback || $noop;
        this.startTestTime = new Date().getTime();
        var _this = this;
        if (!Vifi.Settings.speedTestUrl) return;
        $.get(Vifi.Settings.speedTestUrl, function() {
            // $log(" ___ SPEEDTEST SUCCESS ___ ");''
            var bitrate = Math.round(_this._testSize / (new Date().getTime() - _this.startTestTime) * 1000 / 1024 * 8);
            // $log( "___ USER BITRATE DETECTED: " + bitrate + " ____");
            _this.userBitrate = bitrate;
        });
    },

    active: function() {
        this._active = true;
        Vifi.KeyHandler.bind("all", this._keyhandler, this);
    },

    deactive: function() {
        this._active = false;
        Vifi.KeyHandler.unbind("all", this._keyhandler);
    },

    _keyMap: {
        'onPlay': this.play,
        'onPause': this.pause,
        'onRew': this.rewind,
        'onFF': this.fastforward,
        'onStop': this.stop,
    },

    _keyhandler: function(event) {
        $log("MediaPlayer Event Handler Got: " + event);
        var event = event.replace("keyhandler:", "");
        switch (event) {
            case 'onPause':
                this.pause();
                break;
            case 'onPlay':
                this.play();
                break;
            case 'onStop':
                this.stop();
                break;
            case 'onRew':
                this.rewind();
                break;
            case 'onFF':
                this.fastforward();
                break;
        }
    }

}