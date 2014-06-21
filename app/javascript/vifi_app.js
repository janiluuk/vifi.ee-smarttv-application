/******************************************************************
	DATA LOADING PIECES
*******************************************************************/
// Our little framework here has some  data loading tools so we can get everything loaded correctly
// prior to displaying.  Check out js/Common/enginelite/enginelite.data.js,

// We need to load 2 feeds in sequential order. We have a simple data loading tool which will
// allow us to do this. With it we pass an array of feeds. It will sequentially load each feed,
// passing the parsed feed from the each feed into the subsequent feed. So its a daisy chain
// of data.  In this case we want to first load our list of valid playlist ids. Then pass that
// list into a second call.

// The Array of feeds (order is important)
var feeds = [];


// Create a new data object.
var data = new Vifi.Engine.DataLoader.Data();
//data.url = "http://stubby.adifferentengine.com/b.json";
data.url = Vifi.Settings.api_url;
data.dataType = "jsonp";
data.params = _.extend({
    "command": "find_playlists_for_player_id",
    "player_id": TVAppConfig.BrightcoveConfig.playerID,
    "token": Vifi.Settings.,
}, TVAppConfig.BrightcoveConfig.playerParams);

data.parser = function(data) {
    if (!data) {
        $error("<<< No Playlists for player id: " + TVAppConfig.BrightcoveConfig.playerID + " >>>");
        return;
    }
    data.playlists = [];
    _.each(data.items, function(playlist) {
        data.playlists.push(playlist.id);
    })
    return data;
}

// I'm just returning very nice data so I don't have to worry about it.
// this parsed data will go into our second data item.

// Add to our list of feeds.
feeds.push(data);

var data = new Vifi.DataLoader.Data();
data.url = Vifi.Settings.api_url;
data.dataType = "jsonp";

data.params = _.extend({
    "command": "find_playlists_by_ids",
    "token": TVAppConfig.BrightcoveConfig.customerToken
}, TVAppConfig.BrightcoveConfig.playlistParams);

// There is a default getParams function which we are overriding. We need to use
// the results of the last data call (which gets stored in this.startdata) in creating our
// parameters.
data.getParams = function() {
    // this.startdata will be the data returned by the first AJAX call;
    var _this = this;
    this.params = _.extend({
        "playlist_ids": _this.startdata.playlists.join(",")
    }, this.params);
    return this.params;
}

data.parser = function(data) {
    if (!data) {
        $error("<<< No Video Contents >>>");
        return;
    }
    var cleanData = [];
    _.each(data.items, function(item) {
        category = {
            categoryName: item.name,
            id: item.id,
            thumbnail: item.thumbnailURL,
            videos: [],
            playlist: new TVEngine.Playlist(),
        }
        _.each(item.videos, function(video) {
            var vid = {
                id: video.id,
                name: video.name,
                description: video.shortDescription,
                longDescription: video.longDescription,
                thumbnail: video.thumbnailURL,
                full: video.videoStillURL,
                tags: video.tags,
            }

            var renditions = [];

            _.each(video.renditions, function(rendition) {
                if (rendition.videoCodec.toUpperCase() == "H264" && rendition.videoContainer.toUpperCase() == "MP4") {
                    renditions.push({
                        bitrate: Math.floor(rendition.encodingRate / 1024),
                        url: rendition.url
                    });
                }
            });

            if (renditions.length > 0) {
                category.videos.push(vid);
                category.playlist.addItem(renditions);
            }
        })
        if (!category.thumb && category.videos.length > 0) {
            category.thumb = category.videos[0].thumbnail
        }
        if (category.videos.length > 0) cleanData.push(category);
    });
    //	$log(cleanData)
    return cleanData;
};
feeds.push(data);

Vifi.DataLoader.addWaterfall("vifi:usertitles", feeds);

/******************************************************************
	UI Configuration
*******************************************************************/

/*
 *  Set up our Backbone Models and Views
 *  see http://documentcloud.github.com/backbone
 *  for more info. There is a hard dependency in this framework on backbone for
 *  its event system so it makes sense to use the rest.
 *  We really aren't using a lot of Backbone's  magic here. We mostly use it for rendering
 */

window.Video = Backbone.Model.extend({});


/******************************************************************
	The "Application" handling state, etc.
	
	This is the real meat of the interactions here. 
*******************************************************************/
Vifi.Engine.bind("tvengine:appready", function() {
    $log(" Enabling Navigation ");
    $("#wrapper").fadeIn();
    TVEngine.Navigation.start();

    // Get the data we discussed earlier out of the datastore.
    var userlists = Vifi.DataStore.get("vifi:usertitles");


    var videocategories = [];

    // Handle each category
    _.each(playlists, function(playlist) {
        var cat = new VideoCategory(playlist.videos, {
            name: playlist.categoryName,
            thumb: playlist.thumb
        });
        var view = new VideoCategoryView({
            collection: cat,
            tagName: "div",
            className: "videoCategory",
            target: $("#playlists")
        })
        view.render();
        $("#playlistsNav").append($("<li> " + playlist.categoryName + "</li>"));
    })



    // Bind to our menu's onSelect handler. Normally you'd put this code in the menu
    // But we're trying to keep everything in one piece right here.
    Vifi.Navigation.bindToMenu("brightcove:mainmenu", 'onselect', handleMenuSelection);

}, Vifi.Engine);


var currentViewState = "menu" // Can Be menu, details or video
var setReturnButton = function(state) {
    // Can Be menu, details or video
    Vifi.KeyHandler.unbind("keyhandler:onReturn");
    switch (state) {
        case "menu":
            Vifi.KeyHandler.bind("keyhandler:onReturn", returnToMenu);
            $(".backButton:first").text("Exit");
            break;
        case "video":
            Vifi.KeyHandler.bind("keyhandler:onReturn", showNavigation);
            $(".backButton:first").text("Back");
            break;
        case "details":
            Vifi.KeyHandler.bind("keyhandler:onReturn", closeDetails);
            $(".backButton:first").text("Back");
            break;
    }
}