///////////////////////////////////////////////////////////////////////////////
// utility function to print message with timestamp to log
// e.g.: log("Hello")   : print Hello
//       log(123)       : print 123
//       log()          : print a blank line
function log(msg) {
    if (arguments.length == 0)
        Vifi.Logger.print(""); // print a blank line
    else
        Vifi.Logger.print(msg);
};



///////////////////////////////////////////////////////////////////////////////
Vifi.Utils.Logger = (function() {
    var self = {
        containerDiv: null,
        tabDiv: null,
        logDiv: null,
        statusTabDiv: null,
        statusDiv: null,
        visible: false, // tab is still visible even if it is false
        enabled: true, // does not accept log messages any more if it is false
        logHeight: 215, // 204 + 2*padding + border-top
        tabHeight: 26, // 20 + padding-top + border-top
        // for animation
        animTime: 0,
        animDuration: 200, // ms
        animFrameTime: 16, // ms
        log: function(msg, print) {
            if (arguments.length == 0)
                Vifi.Utils.Logger.print(""); // print a blank line
            else
                Vifi.Utils.Logger.print(msg, print);
        },
        ///////////////////////////////////////////////////////////////////////
        // create a div for log and attach it to document
        init: function() {
            // avoid redundant call
            if (this.containerDiv)
                return true;
            // check if DOM is ready
            if (!document || !document.createElement || !document.body || !document.body.appendChild)
                return false;

            // constants
            var CONTAINER_DIV = "loggerContainer";
            var TAB_DIV = "loggerTab";
            var LOG_DIV = "logger";
            var STATUS_TAB_DIV = "statusDiv";
            var STATUS_CONTAINER_DIV = "statusContainer";
            var Z_INDEX = 17;
            var DEBUG = Vifi.Settings.debug;

            // create logger DOM element
            this.containerDiv = document.getElementById(CONTAINER_DIV);
            if (!this.containerDiv) {
                // container
                this.containerDiv = document.createElement("div");
                this.containerDiv.id = CONTAINER_DIV;
                this.containerDiv.setAttribute("style", "width:100%; " +
                    "height: " + this.logHeight + "px; " +
                    "margin:0; " +
                    "padding:0; " +
                    "position:fixed; " +
                    "left:0; " +
                    "z-index:" + Z_INDEX + ";");
                this.containerDiv.style.bottom = "" + -this.logHeight + "px"; // hide it initially


                cssHeight = "height:" + (this.tabHeight - 6) + "px; "; // subtract padding-top and border-top

                // Status Tab
                this.statusTabDiv = document.createElement("div");
                this.statusTabDiv.id = STATUS_TAB_DIV;
                var currentPage = document.createTextNode(Vifi.PageManager.getActivePage().attr("id").replace("Page", ""));
                currentPage.id = "statusCurrentPage"
                this.statusTabDiv.appendChild(document.createTextNode("PAGE: "));
                this.statusTabDiv.appendChild(currentPage);
                this.statusTabDiv.setAttribute("style", "width:160px; " +
                    cssHeight +
                    "overflow:hidden; " +
                    "font:bold 12px verdana,helvetica,sans-serif;" +
                    "color:#fff; " +
                    "position:absolute; " +
                    "right:0px; " +
                    "top:" + -this.tabHeight + "px; " +
                    "margin:0; padding:5px 0 0 0; " +
                    "text-align:center; " +
                    "border:1px solid #aaa; " +
                    "border-bottom:none; " +
                    "background:#333; " +
                    "background:rgba(0,0,0,0.8); " +
                    "-webkit-border-top-right-radius:10px; " +
                    "-webkit-border-top-left-radius:10px; " +
                    "-khtml-border-radius-topright:10px; " +
                    "-khtml-border-radius-topleft:10px; " +
                    "-moz-border-radius-topright:10px; " +
                    "-moz-border-radius-topleft:10px; " +
                    "border-top-right-radius:10px; " +
                    "border-top-left-radius:10px; ");

                // tab
                this.tabDiv = document.createElement("div");
                this.tabDiv.id = TAB_DIV;
                this.tabDiv.appendChild(document.createTextNode("LOG"));
                this.tabDiv.setAttribute("style", "width:60px; " +
                    cssHeight +
                    "overflow:hidden; " +
                    "font:bold 12px verdana,helvetica,sans-serif;" +
                    "color:#fff; " +
                    "position:absolute; " +
                    "left:20px; " +
                    "top:" + -this.tabHeight + "px; " +
                    "margin:0; padding:5px 0 0 0; " +
                    "text-align:center; " +
                    "border:1px solid #aaa; " +
                    "border-bottom:none; " +
                    "background:#333; " +
                    "background:rgba(0,0,0,0.8); " +
                    "-webkit-border-top-right-radius:10px; " +
                    "-webkit-border-top-left-radius:10px; " +
                    "-khtml-border-radius-topright:10px; " +
                    "-khtml-border-radius-topleft:10px; " +
                    "-moz-border-radius-topright:10px; " +
                    "-moz-border-radius-topleft:10px; " +
                    "border-top-right-radius:10px; " +
                    "border-top-left-radius:10px; ");
                // add mouse event handlers
                this.tabDiv.onmouseover = function() {
                    this.style.cursor = "pointer";
                    this.style.textShadow = "0 0 1px #fff, 0 0 2px #0f0, 0 0 6px #0f0";
                };
                this.tabDiv.onmouseout = function() {
                    this.style.cursor = "auto";
                    this.style.textShadow = "none";
                };
                this.tabDiv.onclick = function() {
                    if (Vifi.Utils.Logger.visible)
                        Vifi.Utils.Logger.hide();
                    else
                        Vifi.Utils.Logger.show();
                };
                // add mouse event handlers
                this.statusTabDiv.onmouseover = function() {
                    this.style.cursor = "pointer";
                    this.style.textShadow = "0 0 1px #fff, 0 0 2px #0f0, 0 0 6px #0f0";
                };
                this.statusTabDiv.onmouseout = function() {
                    this.style.cursor = "auto";
                    this.style.textShadow = "none";
                };
                this.statusTabDiv.onclick = function() {
                    if (Vifi.Utils.Logger.visible)
                        Vifi.Utils.Logger.hide("status");
                    else
                        Vifi.Utils.Logger.show("status");
                };
                // log message
                this.statusDiv = document.createElement("div");
                this.statusDiv.id = STATUS_CONTAINER_DIV;
                var cssHeight = "height:" + (this.logHeight - 11) + "px; "; // subtract paddings and border-top
                this.statusDiv.setAttribute("style", "font:12px monospace; " +
                    cssHeight +
                    "color:#fff; " +
                    "overflow-x:hidden; " +
                    "overflow-y:scroll; " +
                    "visibility:hidden; " +
                    "position:relative; " +
                    "bottom:0px; " +
                    "right:0px; " +
                    "margin:0px; " +
                    "width:180px; " +

                    "padding:5px; " +
                    "background:#333; " +
                    "background:rgba(0, 0, 0, 0.8); " +
                    "border-top:1px solid #aaa; ");

                // log message
                this.logDiv = document.createElement("div");
                this.logDiv.id = LOG_DIV;
                // subtract paddings and border-top
                this.logDiv.setAttribute("style", "font:12px monospace; " +
                    cssHeight +
                    "color:#fff; " +
                    "overflow-x:hidden; " +
                    "overflow-y:scroll; " +
                    "visibility:hidden; " +
                    "position:relative; " +
                    "bottom:0px; " +
                    "margin:0px; " +
                    "padding:5px; " +
                    "background:#333; " +
                    "background:rgba(0, 0, 0, 0.8); " +
                    "border-top:1px solid #aaa; ");

                // style for log message
                var span = document.createElement("span"); // for coloring text
                span.style.color = "#afa";
                span.style.fontWeight = "bold";

                // the first message in log
                var msg = "===== Log Started at " +
                    this.getDate() + ", " + this.getTime() + ", " +
                    "(Vifi App Version: " + Vifi.Settings.version + ", jQuery version: " + $().jquery + ") " +
                    "=====";

                span.appendChild(document.createTextNode(msg));
                this.logDiv.appendChild(span);
                this.logDiv.appendChild(document.createElement("br")); // blank line
                this.logDiv.appendChild(document.createElement("br")); // blank line



                this.statusDiv.appendChild(span);
                this.statusDiv.appendChild(document.createElement("br")); // blank line
                this.statusDiv.appendChild(document.createElement("br")); // blank line

                // add divs to document
                this.containerDiv.appendChild(this.tabDiv);
                this.containerDiv.appendChild(this.statusTabDiv);
                this.containerDiv.appendChild(this.logDiv);


                document.body.appendChild(this.containerDiv);
                document.body.appendChild(this.statusDiv);
                if (DEBUG === true) this.show();


            }

            return true;
        },
        ///////////////////////////////////////////////////////////////////////
        // print log message to logDiv
        print: function(msg, level) {
            // ignore message if it is disabled
            if (!this.enabled)
                return;

            // check if this object is initialized
            if (!this.containerDiv) {
                var ready = this.init();
                if (!ready)
                    return;
            }


            var msgDefined = "#AAF";

            // convert non-string type to string
            if (typeof msg == "undefined") // print "undefined" if param is not defined
            {
                msg = "undefined";
                msgDefined = false;
            } else if (msg === null) // print "null" if param has null value
            {
                msg = "null";
                msgDefined = false;
            } else {

                msg = Vifi.Utils.Logger.dump(msg); // for "object", "function", "boolean", "number" types
            }
            if (typeof level != "undefined") // print "undefined" if param is not defined
            {
                msgDefined = "#F00";

            }
            var lines = msg.split(/\r\n|\r|\n/);
            for (var i in lines) {
                // format time and put the text node to inline element
                var timeDiv = document.createElement("div"); // color for time
                timeDiv.setAttribute("style", "color:#999;" +
                    "float:left;");

                var timeNode = document.createTextNode(this.getTime() + "\u00a0");
                timeDiv.appendChild(timeNode);

                // create message span
                var msgDiv = document.createElement("div");
                msgDiv.setAttribute("style", "float:left;" +
                    "word-wrap:break-word;" + // wrap msg
                    "width:90%;"); // the width must be defined here
                if (!msgDefined)
                    msgDiv.style.color = "#afa"; // override color if msg is not defined
                else msgDiv.style.color = msgDefined;
                // put message  into a text node
                var line = lines[i].replace(/ /g, "\u00a0");
                var msgNode = document.createTextNode(line);
                msgDiv.appendChild(msgNode);

                // new line div with clearing css float property
                var newLineDiv = document.createElement("div");
                newLineDiv.setAttribute("style", "clear:both;");

                this.logDiv.appendChild(timeDiv); // add time
                this.logDiv.appendChild(msgDiv); // add message
                this.logDiv.appendChild(newLineDiv); // add message

                this.logDiv.scrollTop = this.logDiv.scrollHeight; // scroll to last line
            }
        },
        ///////////////////////////////////////////////////////////////////////
        // get time and date as string with a trailing space
        getTime: function() {
            var now = new Date();
            var hour = "0" + now.getHours();
            hour = hour.substring(hour.length - 2);
            var minute = "0" + now.getMinutes();
            minute = minute.substring(minute.length - 2);
            var second = "0" + now.getSeconds();
            second = second.substring(second.length - 2);
            var ms = now.getMilliseconds()
            return hour + ":" + minute + ":" + second + "." + ms;
        },
        getDate: function() {
            var now = new Date();
            var year = "" + now.getFullYear();
            var month = "0" + (now.getMonth() + 1);
            month = month.substring(month.length - 2);
            var date = "0" + now.getDate();
            date = date.substring(date.length - 2);
            return year + "-" + month + "-" + date;
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
                        dumped_text += Vifi.Utils.Logger.dump(value, level + 1);
                    } else {
                        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                    }
                }
            } else if (typeof(arr) == 'string') {
                dumped_text = arr;
            } else { // Stings/Chars/Numbers etc.
                dumped_text = "" + arr + "  (" + typeof(arr) + ") ";
            }
            return dumped_text;
        },

        ///////////////////////////////////////////////////////////////////////
        // slide log container up and down
        show: function(panel) {
            if (!this.containerDiv) {
                if (!this.init())
                    return;
            }

            if (this.visible)
                return;
            var div = Vifi.Utils.Logger.containerDiv;
            if (panel == "status") {
                this.statusDiv.style.visibility = "visible";
                div = Vifi.Utils.Logger.statusDiv;
            } else {
                this.logDiv.style.visibility = "visible";
            }


            this.animTime = Date.now();
            var requestAnimationFrame = getRequestAnimationFrameFunction();
            requestAnimationFrame(slideUp);

            function slideUp() {
                var duration = Date.now() - Vifi.Utils.Logger.animTime;
                if (duration >= Vifi.Utils.Logger.animDuration) {
                    div.style.bottom = 0;

                    Vifi.Utils.Logger.visible = true;
                    return;
                }
                var y = Math.round(-Vifi.Utils.Logger.logHeight * (1 - 0.5 * (1 - Math.cos(Math.PI * duration / Vifi.Utils.Logger.animDuration))));
                div.style.bottom = "" + y + "px";
                requestAnimationFrame(slideUp);
            }
        },
        hide: function(panel) {
            if (!this.containerDiv) {
                if (!this.init())
                    return;
            }
            var div = Vifi.Utils.Logger.containerDiv;
            if (panel == "status") {
                this.statusDiv.style.visibility = "visible";
                div = Vifi.Utils.Logger.statusDiv;
            } else {
                this.logDiv.style.visibility = "visible";
            }

            if (!this.visible)
                return;

            this.animTime = Date.now();
            var requestAnimationFrame = getRequestAnimationFrameFunction();
            requestAnimationFrame(slideDown);

            function slideDown() {
                var duration = Date.now() - Vifi.Utils.Logger.animTime;
                if (duration >= Vifi.Utils.Logger.animDuration) {
                    div.style.bottom = "" + -Vifi.Utils.Logger.logHeight + "px";
                    Vifi.Utils.Logger.logDiv.style.visibility = "hidden";
                    Vifi.Utils.Logger.statusDiv.style.visibility = "hidden";
                    Vifi.Utils.Logger.visible = false;
                    return;
                }
                var y = Math.round(-Vifi.Utils.Logger.logHeight * 0.5 * (1 - Math.cos(Math.PI * duration / Vifi.Utils.Logger.animDuration)));
                div.style.bottom = "" + y + "px";
                requestAnimationFrame(slideDown);
            }
        },
        enable: function() {
            this.enabled = true;
        },
        disable: function() {
            this.enabled = false;
        }
    };
    return self;
})();



///////////////////////////////////////////////////////////////////////////////
// return available requestAnimationFrame(), otherwise, fallback to setTimeOut
function getRequestAnimationFrameFunction() {
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.webkitRequestAnimationFrame;
    if (requestAnimationFrame)
        return function(callback) {
            return requestAnimationFrame(callback);
        };
    else
        return function(callback) {
            return setTimeout(callback, 16);
        };
}
window.$log = Vifi.Utils.Logger.log;
window.$err = Vifi.Utils.Logger.error;