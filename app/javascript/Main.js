var Main = {};
window.widgetAPI = false;

if (typeof Common != 'undefined') {


    // Initialize the Samsung widget API.
    window.widgetAPI = new Common.API.Widget();
    window.pluginAPI = new Common.API.Plugin();

        
    pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
    pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.unregistKey(tvKey.KEY_MUTE);
    // Called on body.onload
    window.launch = function() {
        window.onshow = window.onShow = function() {
            var pluginAPI = new Common.API.Plugin();

        };
        // Tell the API to display the app.
        window.widgetAPI.sendReadyEvent();
    };
} else {
    window.launch = function() {}
}