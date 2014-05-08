Vifi.Player.Subtitles = Backbone.Model.extend({
    videoElement: 'player',
    subtitleElement: 'subtitles',
    subtitledata: null,
    currentSubtitle: null,
    defaultCode: 'ee',
    srtUrl: 'http://app.vifi.ee/subs/',
    subtitleFile: 'cloud-atlas_ee.srt',
    language: 'ee',
    subtitleName: 'Subs',
    ival: false,
    enabled: true,
    initialize: function() {

        _.bindAll(this, 'load', 'start', 'playSubtitles', 'strip', 'toSeconds', 'loadLanguage');
        Vifi.Event.on("button:player-subtitles", this.handleSubtitleSelection, this);
    },
    toSeconds: function(t) {
        var s = 0.0;
        if (t) {
            var p = t.split(':');
            for (i = 0; i < p.length; i++)
                s = s * 60 + parseFloat(p[i].replace(',', '.'))
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
        this.enabled = false;
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
                    for (j = 3; j < st.length; j++)
                        t += '\n' + st[j];
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

        app.player.subtitles.currentSubtitle = -1;
        var ival = setInterval(function() {
            if (!this.enabled) clearInterval(this.ival);
            var currentTime = Vifi.MediaPlayer.getCurrentTime();
            var subtitle = -1;

            for (s in app.player.subtitles.subtitledata) {

                if (s > currentTime)
                    break;
                subtitle = s;

            }

            if (subtitle > 0) {

                if (subtitle != app.player.subtitles.currentSubtitle) {

                    if (currentTime > 0) $("#" + this.subtitleElement).html(app.player.subtitles.subtitledata[subtitle].t);
                    app.player.subtitles.currentSubtitle = subtitle;
                    $log("Setting subtitle at " + currentTime + " - " + app.player.subtitles.subtitledata[subtitle].t);
                    $log(app.player.subtitles.subtitledata[subtitle]);

                } else if (app.player.subtitles.subtitledata[subtitle].os < currentTime) {
                    $("#" + this.subtitleElement).html('');
                }
            }
        }.bind(this), 100);
    },

    start: function() {
        this.enabled = true;
        var subtitleElement = document.getElementById(this.subtitleElement);
        var videoId = this.videoElement;
        if (!videoId) return;
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

        if (!nodefault) this.loadLanguage(this.defaultCode);
        $log("loaded " + i + " subtitles");

    },
    loadLanguage: function(code) {

        if (this.subtitles && this.subtitles[code]) {
            this.subtitleFile = this.srtUrl + this.subtitles[code].file;
        }
        if (this.ival) clearInterval(this.ival);
        this.start();

    }

});

_.extend(Vifi.Player.Subtitles, Backbone.Events);