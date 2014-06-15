/**
 *
 *  Vifi Platform handling
 *
 *  author: Jani Luukkanen
 *  janiluuk@gmail.com
 *
 */

window.$noop = function(input) {
    // if more then one return an array.
    if (arguments.length > 1) return Array.prototype.slice.call(arguments, 0);
    else return arguments[0]; // Don't return an array if only one thing came in.
}

Vifi.Platforms = {

    // 4 Primary Platforms (for now) samsung, lg, googletv, browser
    platform: null,
    proxy: "", // Default

    supportedPlatforms: {},
    addSupportedPlatform: function(platform) {
        this.supportedPlatforms[platform.name] = platform;
        if (platform.defaultPlatform == true) {
            this.defaultPlatform = platform;
        }
    },

    init: function() {
        // $.each(['appCodeName','appName','appVersion','userAgent','platform'], function(index, item) {
        //  $log(" ___ NAVIGATOR."+item + ": " + navigator[item] + " ___");
        // });

        _.each(this.supportedPlatforms, function(platform) {
            if (!platform.defaultPlatform && platform.detectPlatform()) {
                this.platform = platform;
                return;
            }
        }, this);
        if (!this.platform && !this.defaultPlatform) {
            console.log("!!!! NO PLATFORM DETECTED, AND NO DEFAULT PLATFORM !!!!");
            return;
        } else if (!this.platform) {
            console.log(" COULD NOT DETECT PLATFORM, USING DEFAULT (" + this.defaultPlatform.name + ")");
            this.platform = this.defaultPlatform;
        }
        $log("<< PLATFORM IS: (" + this.platform.name + ") >>")
        this.platform.init();
        this.platform.addPlatformCSS();
        this.platform.fetchMediaPlayer();

        // Going to add our proxy adding an ajax prefilter to switch to route the url
        // through a proxy for cross domain requests.
        var platform = this.platform;
        if (_.isFunction($.ajaxPrefilter)) {
            $.ajaxPrefilter(function(options, originalOptions) {
                var proxy = platform.proxy();
                if (proxy !== "") {
                    // Create the URL.
                    var data = originalOptions.data || {};
                    data['url'] = originalOptions.url;
                    options.data = $.param(data);
                    options.url = proxy;
                }
            });
        }

    }
}

// Master "Class" for Platforms.

Vifi.Platform = function(name) {
    this.name = name;
    this.defaultPlatform = false;
    this._mediaPlayer = "browser";

    this.start = $noop;
    this.exit = $noop;
    this._keys = {
        KEY_RETURN: 8,
        KEY_UP: 38,
        KEY_DOWN: 40,
        KEY_LEFT: 37,
        KEY_RIGHT: 39,
        KEY_ENTER: 13,
        KEY_RED: 65,
        KEY_GREEN: 66,
        KEY_YELLOW: 67,
        KEY_BLUE: 68,
        KEY_BACK: 8,
        KEY_PLAY: 80,
        KEY_FF: 190,
        KEY_RW: 188,
        KEY_PAUSE: 189,
        KEY_STOP: 83,

    }
    this.resolution = {
        height: 720,
        width: 1280
    }

    // You can override this if you'd like
    this.init = $noop;

    // Might want to set this to something different
    this.needsProxy = null;

}
// override this if necessary
Vifi.Platform.prototype.keys = function() {
    return this._keys;
}
Vifi.Platform.prototype.setMediaPlayer = function(mediaplayer) {
    this._mediaPlayer = mediaplayer;
}
Vifi.Platform.prototype.fetchMediaPlayer = function() {
    if (this._mediaPlayer) {
        //  $log("Adding media player path");
        var path = "app/javascript/vifi_mediaplayer_" + this._mediaPlayer.toLowerCase() + ".js?" + new Date().getTime();
        $log("Adding media player path: " + path);
        $("<script />", {
            src: path,
            type: 'text/javascript'
        }).appendTo("head");
    }
}

Vifi.Platform.prototype.cleanAppVersion = function() {
    var version = navigator.appVersion.match(/^[^\s]*/)[0] || null;
    if (version == null) return null;
    split = version.split(".")
    return {
        major: split[0],
        minor: split[1],
        mod: split[2]
    }
};

Vifi.Platform.prototype.setResolution = function(width, height) {
    this.resolution.height = height;
    this.resolution.width = width;
}
Vifi.Platform.prototype.matrix = function() {
    return this.resolution.width + "x" + this.resolution.height;
}

Vifi.Platform.prototype.addPlatformCSS = function() {
    // $log(" ADDING PLATFORM CSS FOR PLATFORM: " + this.name  + " path: css/platforms/"+this.name.toLowerCase()+".css and resolution: css/resolutions/"+this.matrix()+".css" );

    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "app/stylesheets/resolutions/" + this.matrix() + ".css"
    }).appendTo("head");
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "app/stylesheets/platforms/" + this.name.toLowerCase() + ".css"
    }).appendTo("head");
}

// Override this 
Vifi.Platform.prototype.detectPlatform = function() {
    if (!this.defaultPlatform) $log(" <<< PLATFORM MUST OVERRIDE THE DETECT PLATFORM METHOD >>>");
}


Vifi.Platform.prototype.proxy = function() {
    return this.needsProxy ? "proxy.php" : "";
}


/* The first default platform "browser" */
;
(function() {
    var browser = new Vifi.Platform('browser');
    // browser.needsProxy = true;
    // We want this to fail, and get added as default
    browser.setResolution(window.screen.width, window.screen.height);
    browser.defaultPlatform = true;
    Vifi.Platforms.addSupportedPlatform(browser);
}());

/* The second default platform "browser" */

(function() {
    var browser = new Vifi.Platform('flash');
    // browser.needsProxy = true;
    // We want this to fail, and get added as default
    browser.setResolution(window.screen.width, window.screen.height);

    browser.detectPlatform = function() {
        try {
            if (navigator.plugins != null && navigator.plugins.length > 0) {
                return navigator.plugins["Shockwave Flash"] && true;
            }
            if (~navigator.userAgent.toLowerCase().indexOf("webtv")) {
                return true;
            }
            if (~navigator.appVersion.indexOf("MSIE") && !~navigator.userAgent.indexOf("Opera")) {
                try {
                    return new ActiveXObject("ShockwaveFlash.ShockwaveFlash") && true;
                } catch (e) {}
            }
            return false;
        } catch (error) {

        }
    }

    browser.defaultPlatform = true;
    Vifi.Platforms.addSupportedPlatform(browser);
    browser.setMediaPlayer("flash");

}());

(function() {
    var platform = new Vifi.Platform('Samsung');
    platform.setResolution(1280, 800);
    platform.detectPlatform = function() {
        var supported = false;
        try {
            webapis.avplay.getAVPlay(function(avplay) {
                supported = true;
            }, function(error) {

            });
        } catch (error) {
            console.log("Samsung platform not supported");

        }
        return supported;

    }
    platform.keys = function() {
        return new Common.API.TVKeyValue();
    }
    platform.setMediaPlayer("samsung");
    platform.exit = function(fullexit) {
        $log(" SAMSUNG EXIT? " + fullexit);
        try {
            if (fullexit) {
                $log(" CALLING EXIT EVENT ")
                widgetAPI.sendExitEvent();
            } else {
                widgetAPI.sendReturnEvent();
            }
        } catch (e) {
            $log("Error with full exit on samung: " + e);
        }
    }


    Vifi.Platforms.addSupportedPlatform(platform);
}());