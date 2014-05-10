var Main = {};

if (typeof Common != 'undefined') {

    var WIDGET = new Common.API.Widget(); // For sendReadyEvent() var TVKEY = new Common.API.TVKeyValue();	// Remote controller key value object var PLUGIN = new Common.API.Plugin();	 // Plugin common module 
    Main.onLoad = function() {
        window.onshow = function() {
            WIDGET.sendReadyEvent();
        }


    }
    Main.enablekeys = function() {
        document.getElementById("anchor").focus();
    }

} else {

    // Web platform
    Main.onLoad = function() {}

}