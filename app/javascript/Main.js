var Main = {};

if (typeof Common != 'undefined') {
    var widgetAPI = new Common.API.Widget();
    var pluginAPI = new Common.API.Plugin();
    var tvKey = new Common.API.TVKeyValue();








    var WIDGET = new Common.API.Widget(); // For sendReadyEvent() var TVKEY = new Common.API.TVKeyValue();	// Remote controller key value object var PLUGIN = new Common.API.Plugin();	 // Plugin common module 
    Main.onLoad = function() {
        window.onshow = function() {
            WIDGET.sendReadyEvent();
        }


    }


    Main.enablekeys = function() {
        document.getElementById("anchor").focus();
    }
    Main.updateVideo = function(url, id) {

    }

    Main.keyDown = function() { // Key handler
        var keyCode = event.keyCode;
        alert("Main Key code : " + keyCode);

        switch (keyCode) {
            case tvKey.KEY_LEFT:
                alert('left');
                Player.playVideo();
                break;
            case tvKey.KEY_RIGHT:
                alert("right");
                Player.stopVideo();
                break;
            case tvKey.KEY_UP:
                alert("up");
                Player.forwardVideo();
                break;
            case tvKey.KEY_DOWN:
                alert("down");
                Player.backwardVideo();
                break;
            case tvKey.KEY_ENTER:
                alert("enter");
                break;
        }
    }
} else {

    // Web platform
    Main.onLoad = function() {}

}