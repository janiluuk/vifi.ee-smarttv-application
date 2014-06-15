var Main = {};
window.widgetAPI = false;

if (typeof Common != 'undefined') {


    // Initialize the Samsung widget API.
    window.widgetAPI = new Common.API.Widget();
    // Called on body.onload
    window.launch = function() {
        window.onshow = window.onShow = function() {
            var pluginAPI = new Common.API.Plugin();
            // Enable default volume keys behavior.
            // Needed to display the volume overlay.
            var navPlugin = document.getElementById('pluginObjectNNavi');
            navPlugin.SetBannerState(1);
            // Tell the API we don't handle the volume keys and default behavior should be used.
            pluginAPI.unregistKey(window.VK_VOL_UP);
            pluginAPI.unregistKey(window.VK_VOL_DOWN);
            pluginAPI.unregistKey(window.VK_MUTE);
        };
        // Tell the API to display the app.
        window.widgetAPI.sendReadyEvent();
    };
} else {
    window.launch = function() {}
}