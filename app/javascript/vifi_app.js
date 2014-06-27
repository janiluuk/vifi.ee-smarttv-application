
$(function() {

    var AppView = Vifi.Films.BaseAppView.extend({
        initialize: function(options) {
            this.options = options || {};
            this.pagemanager = this.options.pagemanager;
            this.genres = this.options.genres;
            this.queue = this.options.queue;
            this.usercollection = this.options.usercollection;
            this.browser = this.options.browser;
            this.payment = this.options.payment;
            this.purchasePage = this.options.purchasePage;
            this.account = this.options.account;
            this.session = this.options.session;
            this.logger = this.options.logger;
            this.player = new Vifi.Player.Player({
                session: this.session
            });
   


        }

    });


    //Create a router to make our search linkable
    var Router = Backbone.Router.extend({
        routes: {
            '': 'clearSearch', //
            'search/:searchState': 'search',
            'film/:id': 'showFilm' //
        },
        search: function(searchStateHash) {
            //Unescape is required for firefox only to fix unescaped spaces
            //https://github.com/documentcloud/backbone/pull/1156
            app.browser.setSearchStateFromHash(unescape(searchStateHash));
            app.browser.collection.update();
            Vifi.Event.trigger("page:change", "browser");
        },
        showFilm: function(id) {

            Vifi.Event.trigger('film:show', id);
        },

        clearSearch: function() {
            app.browser.clearSearch();
        }

    });


    /***************************
         WHAT HAPPENS ON PAGE LOAD?
         ==========================

        *   The page is loaded from the server with films and initial_search_json 
            which may or may not match the current hash.

        *   When the films are loaded from the server they are static DOM nodes 
            without associated backbone views and events.  We need to run app.render 
            in order to attach the backbone events and views with the DOM.

        *   If no hash, go ahead and configure state with initial_search_json.
            The initial_search_json.search should reflect what we show the user when there is no hash
               representing the default state for this URL at Vifi. 
            URLs can be different for genre, channels etc.  We'd use this initial state if the user changed the address by deleting the hash, or clicking the back button on their browser to a url where there was no search hash.

        *   Without Javascript page shows what is specified by initial_search_json.search.
        
        *   If there is a hash, configure the state from the hash and 
            update the films in the collection (rendering new DOM).

        *   The AppView is now bound to DOM events. 

        *   Then intialize backbone's history which magically activates the Router's search 
            or clearSearch method, depending on route match.

        *   The Router sets the search state from the hash, if available, 
            or it clears the state back to the defaults in initial_search_json.search 
            which is stored in FilmCollection.initial_search. This functionality is 
            activated in AppView.clearSearch.


        WHAT HAPPENS ON SEARCH WIDGET CHANGE?
        =====================================

        *   The AppView on initialization is bound to DOM events.

        *   When the DOM changes, we change app.browser.collection.state.

        *   app.browser.collection is bound to state changes.

        *   When state changes, app.collection is updated to match the state and loaded.

        *   UI is updated upon server response since the app.render method is bound to the collection reset event via "all".

        ***************************/

    function initApp(initial_search_json) {




        var models = initial_search_json.results;
        var pagination = initial_search_json.pagination;
        var activationCode = initial_search_json.activationCode;
        var user_is_authenticated = initial_search_json.user_is_authenticated;
        var search = initial_search_json.search;

        // check for hash and set state accordingly
        if (window.location.hash.indexOf('#search') != -1) {
            // start with empty state because Router will configure it later.
            var state = new Vifi.Utils.State();
            //var hash = window.location.hash.replace('#search/', '');
            //state.setFromHash(hash);
        } else {
            // set the state to avoid an additional call to the server as we have
            // data to bootstrap the app. 
            //            var state = new Vifi.Utils.State();

            var state = new Vifi.Utils.State(initial_search_json.search);
        }


        // Create Film Collection with state from hash (or not) 
        // and search which is the initial state values 
        // for the search when there is no hash at this URL.
        var collection = new Vifi.Films.FilmCollection(
            models, {
                state: state,
                pagination: pagination,
                search: initial_search_json.search
            });

        // Create collection of featured films and add them to the frontpage

        var genres = new Vifi.Films.GenreCollection(initial_search_json.genres);
        var queue = new Vifi.Films.QueueCollection(initial_search_json.queue);
        var usercollection = new Vifi.Films.UserCollection(initial_search_json.queue);

        var profile = new Vifi.User.Profile();

        var session = new Vifi.User.Session({
            profile: profile,
            activationCode: activationCode,

        });
        Vifi.Platforms.init();

        Vifi.Engine.start(Vifi.Settings);

        var accountPage = new Vifi.User.ProfileView({
            model: profile
        });
        var activationPage = new Vifi.User.ActivationView({
            model: session
        });
        var alertPage = new Vifi.User.AlertView({
            model: session
        });

        var payment = new Vifi.Payment({
            session: session
        });

        var toolbar = new Vifi.User.ToolbarView({
            model: profile
        });
        var featuredview = new Vifi.Films.FeaturedFilmDetailView();
        var homePage = new Vifi.Films.FeaturedFilmCollectionView(collection.featured());
        var browserPage = new Vifi.Pages.Browser({
                model: genres,
                collection: collection,
                featured: collection.featured(),
                genres:genres
        });
        // Bind keys

        Vifi.KeyHandler.bind("keyhandler:onRed", function() {
            if (!Vifi.Utils.Logger.visible) {
                Vifi.Utils.Logger.show();
            } else
                Vifi.Utils.Logger.hide();
        });

        window.app = new AppView({
            el: $('#application'),
            profile: profile,
            detailview: new Vifi.Films.FilmDetailView(),
            session: session,
            payment: payment,
            homePage: homePage,
            toolbar: toolbar,
            logger: Vifi.Utils.Logger,
            browser: browserPage,
            purchasePage: new Vifi.PurchaseView(),
            pagemanager: Vifi.PageManager,
            user_is_authenticated: user_is_authenticated,
            queue: queue,
            usercollection: usercollection,
        });





        // make the app globally available.
        window.app = app;

        //Create an instance of our router
        window.router = new Router();

        //This will search routes from the router and serve them
        window.history = Backbone.history.start();

        Vifi.Navigation.start();

        // if there's no hash, let's render the results
        // ( if there's a hash , the router will take care of this when it sets state from hash)
        if (window.location.hash.indexOf('#search') == -1 && window.location.hash.indexOf('#film') == -1) {

            Vifi.Event.trigger("page:change", "home");


        } else if (window.location.hash.indexOf('#search') == 0) {

            Vifi.Event.trigger("page:change", "browser");

        } else {

            Vifi.Event.trigger("film:show", window.location.hash.substr(6));
        }




    }

    $(window).load(function() {
        if (initial_search_json == "") {
            $.getJSON(Vifi.Settings.api_url + "?api_key=" + Vifi.Settings.api_key + "&jsoncallback=?",
                initApp, "jsonp");
        } else {

            initApp(initial_search_json);
        }

    });
});
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