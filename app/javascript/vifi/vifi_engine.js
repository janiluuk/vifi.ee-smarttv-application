/**
 * Vifi Engine - Core application module and initialization system
 * 
 * @file vifi_engine.js
 * @author Jani Luukkanen <janiluuk@gmail.com>
 * @version 0.99.101214
 * 
 * @description
 * The Vifi Engine is the central module that manages the entire application lifecycle.
 * It handles module registration, initialization, and coordination between different
 * components of the Smart TV application.
 * 
 * @namespace Vifi
 */
var Vifi = {};

/**
 * Root namespace for the Vifi Smart TV Application
 * @namespace Vifi
 */
Vifi = {
    /** @namespace Vifi.Utils - Utility functions */
    Utils: {},
    /** @namespace Vifi.Views - Backbone views */
    Views: {},
    /** @namespace Vifi.Films - Movie-related functionality */
    Films: {},
    /** @namespace Vifi.Browser - Browsing and search functionality */
    Browser: {},
    /** @namespace Vifi.Player - Video player functionality */
    Player: {},
    /** @namespace Vifi.Pages - Page views and management */
    Pages: {},
    /** @namespace Vifi.User - User authentication and profile */
    User: {},
    /** @namespace Vifi.Event - Application-wide event bus */
    Event: {},
    
    /**
     * Application configuration settings
     * @namespace Vifi.Settings
     */
    Settings: {
        /** Application version number */
        version: "0.99.101214",
        /** Debug mode flag - set to true for development */
        debug: false,
        /** Backend API base URL */
        api_url: 'http://backend.vifi.ee/api/',
        /** API authentication key */
        api_key: '27ah12A3d76f32',
        /** DOM ID for browser page */
        browserpageId: 'browserPage',
        /** DOM ID for movie detail page */
        moviepageId: 'moviePage',
        /** DOM ID for player page */
        playerPageId: 'playerPage',
        /** DOM ID for account page */
        accountpageId: 'accountPage',
        /** DOM ID for toolbar */
        toolbarId: 'toolbar',
        /** DOM ID for home page */
        homePageId: 'homePage',
        /** DOM ID for alert page */
        alertPageId: 'alertPage',
        /** DOM ID for error page */
        errorPageId: 'errorPage',
        /** DOM ID for exit page */
        exitPageId: 'exitPage',
        /** DOM ID for activation page */
        activationPageId: 'activationPage',
        /** DOM ID for purchase page */
        purchasePageId: 'purchasePage'
    }
}

/**
 * Core engine module for application initialization and lifecycle management
 * @namespace Vifi.Engine
 */
Vifi.Engine = {
    /** Collection of registered modules */
    modules: {},
    /** Array of completion event names */
    _doneEvents: [],
    /** Count of modules waiting to load */
    _modulesToLoad: 0,
    /** Default configuration object */
    _defConfig: {},
    /** Device identifier */
    device_id: false,

    /**
     * Register a module with the engine
     * @param {string} name - Module name identifier
     * @param {Object} module - Module object with init() method
     * @param {Object} [conf] - Optional configuration object
     * @param {Array} [conf.callbacks] - Array of callback event names
     */
    addModule: function(name, module, conf) {
        this.modules[name] = module;
        conf = conf || {}
        conf = _.defaults(conf, {
            callbacks: []
        })
        this._doneEvents = _.union(this._doneEvents, conf.callbacks);
        _.each(conf.callbacks, function(callback) {
            module.bind(callback, function() {
                this.itemLoaded(callback);
            }, this)
        }, this)
    },

    /**
     * Check if a module exists in the registry
     * @param {string} name - Module name to check
     * @returns {boolean} True if module exists
     */
    moduleExists: function(name) {
        return (!_.isNull(this.modules[name]))
    },

    /**
     * Handle module loading completion
     * @param {string} callback - Callback event name that completed
     */
    itemLoaded: function(callback) {
        $log("<<< ITEM LOADED >>>");
        this._modulesToLoad = _.without(this._modulesToLoad, callback);
        if (this._modulesToLoad.length == 0) {
            $log(" NOT WAITING FOR MORE MODULES, TRIGGERING READY ")
            this.trigger("modules:ready");
        }
    },

    /**
     * Start the application engine
     * Initializes platform, key handler, and all registered modules
     * @param {Object} config - Configuration object to merge with defaults
     */
    start: function(config) {
        this.config = _.defaults(config, this._defConfig);

        this.getPlatform().start();
        this.trigger("app:starting");
        Vifi.KeyHandler.init();

        this._modulesToLoad = this._doneEvents;
        _.each(this.modules, function(m) {
            $log(" <<< INIT MODULE " + m.name + ">>> ");
            if (_.isFunction(m.init)) m.init();
            $log("<<< END INIT MODULE >>>");
        });
        $("<<< END Vifi Engine Start >>>");
        var _this = this;
        Vifi.KeyHandler.bind("keyhandler:onExit", function() {
            $log(" GOT EXIT FROM KEYHANDLER ")
            _this.getPlatform().exit(true);
        })
    },


    /**
     * Exit the application
     * @param {boolean} fullexit - If true, perform complete exit; if false, partial exit
     */
    exit: function(fullexit) {
        $log("********************************\n       EXIT     \n ********************************");
        this.getPlatform().exit(fullexit);
    },

    /**
     * Get the current platform adapter
     * @returns {Object|null} Platform adapter object or null if not available
     */
    getPlatform: function() {
        if (Vifi.Platforms && Vifi.Platforms.platform) {
            return Vifi.Platforms.platform;
        } else {
            return null;
        }
    },




    util: {
        error: function(msg) {
            if (typeof(console) != "undefined" && console.error) {
                console.error(msg);
            } else {
                alert(Vifi.Utils.dump(msg, 4));
            }
        },
        debug: function(msg) {
            this.log(msg, 'debug')
        },
        dump: function(arr, level) {
            var dumped_text = "";
            if (!level)
                level = 0;

            // The padding given at the beginning of the line.
            var level_padding = "";
            for (var j = 0; j < level + 1; j++)
                level_padding += "    ";

            if (typeof(arr) == 'object') { // Array/Hashes/Objects
                for (var item in arr) {
                    var value = arr[item];

                    if (typeof(value) == 'object') { // If it is an array,
                        dumped_text += level_padding + "'" + item + "' ...\n";
                        dumped_text += Vifi.util.dump(value, level + 1);
                    } else {
                        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                    }
                }
            } else { // Stings/Chars/Numbers etc.
                dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
            }
            return dumped_text;
        },

        log: function(msg) {
            msg = msg || "No Message";
            if (_.isString(msg)) {
                now = new Date();
                msg = "[" + now.getFullYear() + "-" + (now.getMonth() + 1).toString() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds() + "] " + msg;
            };
            // The ADEngine box sometimes has issues with the console. Comment
            // this out when deploying
            if (typeof(console) != "undefined" && console.log) {
                $.log(msg);
            } else {
                alert(msg);
            }
        },

        getImageForResolution: function(imgPath, conf) {
            conf = _.defaults(conf, {
                src: "images/" + Vifi.Platforms.platform.matrix() + "/" + imgPath
            });
            // Kind of strange but its a consistent way to get the html of the element
            // that we want.
            document.write($('<div>').append($("<img />", conf).clone()).remove().html());
        },
        convertMstoHumanReadable: function(ms, leadingZeros) {
            leadingZeros = typeof(leadingZerons) == 'undefined' ? true : !!leadingZeros // Make sure its boolean

            var x = ms / 1000
            var numSecs = seconds = Math.floor(x % 60)
            x /= 60
            var numMins = minutes = Math.floor(x % 60)
            x /= 60
            hours = Math.floor(x % 24)
            x /= 24
            days = Math.floor(x);

            var numMs = ms - (seconds * 1000);

            if (leadingZeros) {
                if (numSecs < 10) {
                    numSecs = "0" + numSecs.toString();
                }
                if (numMins < 10) {
                    numMins = "0" + numMins.toString();
                }
            }

            return {
                millis: numMs,
                seconds: numSecs,
                minutes: Math.floor(numMins),
                hours: Math.floor(hours),
                toString: function() {
                    var str = numSecs;
                    if (Math.floor(numMins))
                        str = numMins + ":" + str;
                    else
                        str = "00:" + str;
                    if (Math.floor(hours))
                        str = hours + ":" + str;
                    return str;
                }
            }
        },
        stringToDate: function(s) {
            var dateParts = s.split(' ')[0].split('-');
            var timeParts = s.split(' ')[1].split(':');
            return new Date(dateParts[0], dateParts[1], dateParts[2], timeParts[0], timeParts[1], 00, 0);
        },
        /* Return date as human readable format */

        dateToHumanreadable: function(s) {
            return s.getDate() + "." + s.getMonth() + " " + s.getHours() + ":" + ("0" + s.getMinutes()).slice(-2);
        },
        /* Return time after certain duration in minutes */
        minutesToTime: function(duration) {

            if (!duration) return false;
            var time = new Date();
            var helsinkiOffset = 10800000;
            var userOffset = time.getTimezoneOffset()*60000; 
            helsinkiOffset+=userOffset;
            var endingtime = new Date(time.getTime()+helsinkiOffset + (duration * 60000));
            var endingtimestring = endingtime.getHours();
            endingtimestring += ":";
            endingtimestring += ("0" + endingtime.getMinutes()).slice(-2);
            return endingtimestring;
        }
    }
};

_.extend(Vifi.Engine, Backbone.Events);