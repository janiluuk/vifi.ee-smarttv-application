
/* Enable pusher logging - don't include this in production
Pusher.log = function(message) {
    if (window.console && window.console.log) {
        window.console.log(message);
    }
};
*/

var pusher = new Pusher('4c4fbbdf6a43d69d8a95', {
    authEndpoint: 'http://backend.vifi.ee/auth/',
    authTransport: 'jsonp' 
});


var channel = pusher.subscribe('private-channel');
channel.bind('pusher:subscription_error', function(data) {});
channel.bind('client-event',
     function(data) {
	         var sessionId = app.session.get("activationCode");
//         if (data.code != sessionId)
             Vifi.Event.trigger(data);
             
     }
);
channel.bind('client-mediaplayer-event',
     function(data) {
         var sessionId = app.session.get("activationCode");
//         if (data.code != sessionId)
             Vifi.MediaPlayer.trigger("mediaplayer:"+data);
     }
);
//     
//     
// Vifi.Event.on('all', function(data, data2) {
//     if (data == "page:change" || data == "film:show" || ) {
//         var sessionId = app.session.get("activationCode");

//         var triggered = channel.trigger('client-event', {
//             key: data,
//             val: data2,
//             code: sessionId
//         });
//     }
// });
