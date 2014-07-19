Vifi.Player.Subtitles = Backbone.Model.extend({
    videoElement: 'player',
    subtitleElement: 'subtitles',
    subtitledata: null,
    currentSubtitle: null,
    defaultCode: 'ee',
    srtUrl: 'http://app.vifi.ee/subs/',
    subtitleFile: '',
    language: 'ee',
    ival: false,
    enabled: true,
    initialize: function() {
        _.bindAll(this, 'load', 'start', 'playSubtitles', 'strip', 'disable', 'toSeconds', 'loadLanguage');
        Vifi.Event.on("button:player-subtitles", this.handleSubtitleSelection, this);
    },
    toSeconds: function(t) {
        var s = 0.0;
        if (t) {
            var p = t.split(':');
            for (i = 0; i < p.length; i++) s = s * 60 + parseFloat(p[i].replace(',', '.'))
        }
        return parseInt(s * 1000);
    },
    strip: function(s) {
        return s.replace(/^\s+|\s+$/g, "");
    },
    handleSubtitleSelection: function(sel) {
        if (sel == "none") this.disable();
        if (this.subtitles) {
            this.loadLanguage(sel);
        }
    },
    disable: function() {
        this.subtitleFile = "";
        this.subtitledata = {};
        this.language = '';
        $("#" + this.subtitleElement).html('');
        this.enabled = false;
        this.trigger("subtitles:disable");
        $log("Disabling subtitles");

    },
    playSubtitles: function(subtitleElement) {
        var videoId = this.videoElement;
        var el = $(subtitleElement);
        var srt = el.text();
        $(subtitleElement).text('');
        srt = srt.replace(/\r\n|\r|\n/g, '\n')
        this.subtitledata = {};
        srt = this.strip(srt);
        var srt_ = srt.split('\n\n');
        for (s in srt_) {
            st = srt_[s].split('\n');
            if (st.length >= 2) {
                n = st[0];
                i = this.strip(st[1].split(' --> ')[0]);
                o = this.strip(st[1].split(' --> ')[1]);
                t = st[2];
                if (st.length > 2) {
                    for (j = 3; j < st.length; j++) t += '\n' + st[j];
                }
                is = this.toSeconds(i);
                os = this.toSeconds(o);
                this.subtitledata[is] = {
                    i: i,
                    is: is,
                    os: os,
                    o: o,
                    t: t
                };
            }
        }
        $("#" + this.subtitleElement).html('');
        this.currentSubtitle = -1;
        var _this = this;
        var ival = setInterval(function() {
            if (!this.enabled) clearInterval(this.ival);
            var currentTime = Vifi.MediaPlayer.getCurrentTime();
            var subtitle = -1;
            for (s in this.subtitledata) {
                if (s > currentTime) break;
                subtitle = s;
            }
            if (subtitle > 0) {
                if (subtitle != this.currentSubtitle) {
                    if (currentTime > 0) $("#" + this.subtitleElement).html(this.subtitledata[subtitle].t);
                    this.currentSubtitle = subtitle;
                    //$log("Setting subtitle at " + currentTime + " - " + app.player.subtitles.subtitledata[subtitle].t);
                    //$log(app.player.subtitles.subtitledata[subtitle]);
                } else if (this.subtitledata[subtitle].os < currentTime) {
                    $("#" + this.subtitleElement).text('');
                }
            }
        }.bind(this), 100);
        this.ival = ival;
    },
    start: function() {
        this.enabled = true;
        var subtitleElement = document.getElementById(this.subtitleElement);
        var videoId = this.videoElement;
        if (!videoId || !subtitleElement) {
            $log("Aborting subtitle loading");
            return;

        }
        var srtUrl = this.subtitleFile;
        var that = this;
        if (srtUrl) {
            $(subtitleElement).load(srtUrl, function(responseText, textStatus, req) {
                that.playSubtitles(subtitleElement);
            });
        } else {
            this.playSubtitles(subtitleElement);
        }
    },
    load: function(subtitles, nodefault) {
        if (!subtitles) return false;
        this.subtitles = {}
        var that = this;
        var i = 0;
        $(subtitles).each(function() {
            var code = this.code;
            that.subtitles[code] = this;
            i++;
        });

        $log("Downloaded " + i + " subtitles");
        if (!nodefault) this.loadLanguage(this.defaultCode);
    },
    loadLanguage: function(code) {
        if (this.subtitles && this.subtitles[code]) {
            this.subtitleFile = this.srtUrl + this.subtitles[code].file;
            $log("Loaded " + code + " language from " + this.subtitleFile);
            if (this.ival) clearInterval(this.ival);
            this.start();
            this.language = code;
            this.trigger("subtitles:load", code);

            return true;
        }
        return false;
    }
});
_.extend(Vifi.Player.Subtitles, Backbone.Events);