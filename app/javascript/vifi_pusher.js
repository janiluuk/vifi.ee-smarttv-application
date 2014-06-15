// Enable pusher logging - don't include this in production
Pusher.log = function(message) {
    if (window.console && window.console.log) {
        window.console.log(message);
    }
};

var pusher = new Pusher('06d77d7aeda73293be8f', {
    authEndpoint: '/auth/'
});


var channel = pusher.subscribe('private-channel');


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
// channel.bind('client-event',
//     function(data) {
//         var sessionId = app.session.get("activationCode");
//         if (data.code != sessionId)
//             Vifi.Event.trigger(data.key, data.val);
//     }
// );