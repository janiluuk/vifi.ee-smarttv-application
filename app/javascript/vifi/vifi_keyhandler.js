/**
 *
 *  Vifi KeyHandler
 *
 *  author: Jani Luukkanen
 *  janiluuk@gmail.com
 *
 */
// This is pretty straightforward.
Vifi.KeyHandler = {

    keyActions: {
        KEY_UP: 'onUp',
        KEY_DOWN: 'onDown',
        KEY_LEFT: 'onLeft',
        KEY_RIGHT: 'onRight',
        KEY_ENTER: 'onClick',
        KEY_RETURN: 'onReturn',
        KEY_STOP: 'onStop',
        KEY_FF: 'onFF',
        KEY_RW: 'onRew',
        KEY_PLAY: 'onPlay',
        KEY_PAUSE: 'onPause',
        KEY_YELLOW: 'onYellow',
        KEY_RED: 'onRed',
        KEY_BLUE: 'onBlue',
        KEY_GREEN: 'onGreen',
        KEY_EXIT: 'onExit',
        KEY_MENU: 'onMenu',
        KEY_BACK: 'onReturn',
        KEY_CANCEL: 'onReturn',
        KEY_SKIPFFORWARD: 'onSkipForward',
        KEY_SKIPBACK: 'onSkipBack',
        KEY_VOL_UP: 'onVolumeUp',
        KEY_VOL_DOWN: 'onVolumeDown',
        KEY_MUTE: 'onMute'

    },
    enabled: true,
    keyMap: {},

    init: function() {
        //$log("Initializing keyhandler")
        // Maps system key list to ours
        $KEYS = Vifi.Engine.getPlatform().keys();
        // Transforming Samsung keymap into something we like slightly better.
        for (key in $KEYS) {
            this.keyMap[$KEYS[key]] = key;
        }
        this._initializeKeyHandler();
    },
    _cleared: true,
    _initializeKeyHandler: function() {
        var _this = this;
        var clear;
        $(document).bind("keydown", function(event) {

            var action = _this.keyActions[_this.keyMap[event.keyCode]];

            /* Return button event */

            if (action == "onReturn") {
                var activePage = app.pagemanager.activePage;
                
                if (activePage != "#homePage") { 
                    if (typeof(widgetAPI) != "undefined") widgetAPI.blockNavigation(event);

                } else { 
                    Vifi.Event.trigger("exit", false); 
                    return false; 
                }
            } 
            /* Handling exit event to show confirm dialog or exit */

            if (action == "onExit") {
                if (activePage != "#exitPage") { 
                    if (activePage == "#purchasePage") {
                        setTimeout(function() { Vifi.Event.trigger("exit", true); },1500);
                    } 

                    Vifi.Event.trigger("exit", true);
                } else {

                    Vifi.Engine.getPlatform().exit();
                }
                return false;
            }


            $log("<<< GOT KEY ACTION: " + action + " (" + event.keyCode + ")    >>>");
            if (action && _this.enabled) _this.trigger("keyhandler:" + action);
            else {
                event.stopPropagation();
                return false;
            }

            return true;
        });
        $(document).bind("keyup", function(event) {
            var action = _this.keyActions[_this.keyMap[event.keyCode]] + "Release";
            // $log("<<< GOT KEY ACTION: " + action + " >>>");
            if (action) _this.trigger("keyhandler:" + action);
            return true;
        })
    },
    enable: function() {
        this.enabled = true;
    },
    disable: function() {
        this.enabled = false;
    }
};
// Now we can subscribe to the keyhandler from anywhere. 
_.extend(Vifi.KeyHandler, Backbone.Events);