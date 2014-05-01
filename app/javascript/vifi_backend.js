//Create a global Vifi object that can be used accross pages


Vifi.Event = _.extend({}, Backbone.Events);


Vifi.PageManager = {
    moviePage: $("#" + Vifi.Settings.moviepageId),
    browserPage: $("#" + Vifi.Settings.browserpageId),
    homePage: $("#" + Vifi.Settings.homePageId),
    playerPage: $("#" + Vifi.Settings.playerPageId),
    accountPage: $("#" + Vifi.Settings.accountpageId),
    activationPage: $("#" + Vifi.Settings.activationPageId),
    alertPage: $("#" + Vifi.Settings.activationPageId),

    decorateHandler: false,
    appElement: false,
    appComponent: false,
    focusedElement: false,
    needsredraw: true,
    drawing: false,

    lastActivePage: false,
    activePage: this.homePage,

    initialize: function() {

        Vifi.Event.on("page:beforepagechange", this.onBeforePageChange, this);
        Vifi.Event.on("page:onpagechange", this.onPageChange, this);
        Vifi.Event.on("page:afterpagechange", this.onAfterPageChange, this);
        Vifi.Event.on('page:ready', this.redraw, this);
        Vifi.Event.on('page:focus', this.focusFirst, this);
        Vifi.Event.on('page:change', this.switchToPage, this);
        Vifi.Event.on('page:back', this.switchToPrevious, this);

        this.decorateHandler = new tv.ui.DecorateHandler;

        var el = "application";

        if (!this.appComponent) {
            this.appElement = goog.dom.getElement(el);
            tv.ui.decorate(document.body);
            this.appComponent = tv.ui.getComponentByElement(this.appElement);
        }
        tv.ui.postponeRender(function() {

        });




    },
    getPage: function(name) {
        if (name == "alert") return $(this.alertPage);
        if (name == "activation") return $(this.activationPage);
        if (name == "movie") return $(this.moviePage);
        if (name == "browser") return $(this.browserPage);
        if (name == "home") return $(this.homePage);
        if (name == "player") return $(this.playerPage);
        if (name == "account" || "accountPage") return $(this.accountPage);
        return false;
    },

    // Bring given page to the screen after making preparations accordingly.
    // Looking at this makes ma already feel like sitting in italian restaurant.
    setActivePage: function(page) {
        this.activePage = page;
        this.getActivePage().addClass("active");
        $("#statusDiv").html("Page: " + $(page).attr("id"));

        return true;
    },
    // Returns currently active page 
    getActivePage: function() {
        if (this.activePage !== false) {
            return $(this.activePage);
        }
        return false;
    },


    focusFirst: function(ev) {


        if (this.setFocusByClass("active-item") === true) {
            this.getActivePage().find(".active-item").removeClass("active-item");

        } else {

            if (this.setFocusByClass("tv-component-focused") === true) {

            } else
                return this.setFocusByClass("tv-component");
        }

        return false;
    },

    setFocusById: function(id) {
        var element = goog.dom.getElement(id);

        if (undefined !== element) {
            return this.setFocus(element);
        }
        return false;
    },
    setFocusByClass: function(el) {
        var page = goog.dom.getElement(this.getActivePage().attr("id"));


        if (undefined !== page) var focusElement = page.getElementsByClassName(el)[0];
        if (undefined !== focusElement) {
            return this.setFocus(focusElement);
        }

        return false;
    },
    setFocus: function(element) {
        // Following three lines find component that we want to put focus on.
        var el = tv.ui.getComponentByElement(element);
        if (undefined !== el) {

            el.tryFocus(true);

            this.focusedElement = el;
            return true;
        }

        return false;
    },

    switchToPage: function(page, cb) {
        if (page != "") var pageid = '#' + page + "Page";
        else return false;
        if (this.changing) return false;

        this.callback = cb;

        this.changing = true;

        Vifi.Event.trigger("page:beforepagechange", pageid);
    },
    switchToPrevious: function() {
        if (this.lastActivePage) {
            var pageName = this.lastActivePage.replace("Page", "").replace("#", "");
            this.switchToPage(pageName);
        }

    },

    onBeforePageChange: function(page) {
        $(".container.active .tv-component-focused").removeClass("tv-component-focused");

        $(".container.active").removeClass("active");

        this.lastActivePage = this.activePage;

        Vifi.Event.trigger("page:onpagechange", page);
    },
    onPageChange: function(page) {
        this.setActivePage(page);
        Vifi.Event.trigger("page:afterpagechange", page);
    },



    onAfterPageChange: function(page) {


        Vifi.Event.trigger("page:ready", page);


        $("body").scrollTo(page, 230, {
            onAfter: function() {



            }
        });
        if (this.callback) this.callback();

        this.changing = false;
    },
    redraw: function(focus) {

        if (!this.drawing) {
            this.drawing = true;
            var str = "";
            if (undefined != focus && undefined != focus.selector) {
                var str = focus.selector.substr(1);
            } else {
                if (undefined != focus) str = focus;
            }
            var el = "application";
            if (str != "") el = str;
            else str = el;

            if (this.needsredraw && this.appComponent) {
                this.appComponent.removeChildren();
                if (this.appElement) tv.ui.decorateChildren(this.appElement, this.decorateHandler.getHandler(), this.appComponent);

            }

            this.focusFirst();
            this.drawing = false;
        }
        return this;

    }



}




Vifi.Browser.Page = Backbone.View.extend({
    viewType: 'grid',
    tagName: 'div',
    defaults: {},
    application: false,
    pageManager: false,
    // Currently active page in the app
    historyManager: false,
    historyHandlers: [],
    // Selected item in browser
    debug: true,
    initialize: function() {
        this.pageManager = Vifi.PageManager;
        this.filmDetailPage = new Vifi.Films.FilmDetailView();
        this.featuredFilmDetails = new Vifi.Films.FeaturedFilmDetailView();
        Vifi.Event.on('*', function(event) {
            console.log(event);
        });
        Vifi.Event.on('app:ready', this.render, this);
        Vifi.Event.on("browser:pagination", this.onBrowserPaginationEvent, this);
        this.pageManager.initialize();
        this.setHandlers();
    },



    render: function() {

        Vifi.Event.trigger("page:change", "home");
        $log("Application ready")
        $("#application").css("opacity", 1.0);


        return this;
    },

    loadBrowserImages: function() {
        $("#browserPage div.lazy").lazyload({
            threshold: 12000,
            effect: 'fadeIn',
            effectspeed: 1200
        });
    },
    // Handle preloading imags on browser
    onBrowserPaginationEvent: function(e) {
        var item = e.element_;
        var idx = $(item).index();


        idx++;
        var threshold = app.collection.pagination.current_page * app.collection.pagination.num_pages;

        if (app.collection.pagination.current_page < 1 || idx > threshold) {
            app.collection.pagination.current_page++;
            this.loadBrowserImages();


        } else if (idx < (threshold - app.collection.pagination.num_pages)) {
            app.collection.pagination.current_page--;
        }

    },


    // Handle pushing account-buttons
    onAccountEvent: function(event) {
        var keyCode = event.keyCode;
        if (keyCode == 40 /*Down*/ ) {
            Vifi.Event.trigger("page:change", "home");
            event.stopPropagation();
        }
    },
    // Handle pushing movie-button
    handleBorderKeyRight: function(event) {
        event.preventDefault();
        var keyCode = event.keyCode;
        if (keyCode == 39 /*Right*/ ) {
            event.stopPropagation();
        }
    },
    // Handle pushing movie-button
    handleBorderKeyLeft: function(event) {
        event.preventDefault();
        var keyCode = event.keyCode;
        if (keyCode == 37 /*Left*/ ) {
            event.stopPropagation();
        }
    },
    // Handle pushing movie-button
    handleBorderKeyUp: function(event) {
        event.preventDefault();
        var keyCode = event.keyCode;
        if (keyCode == 38 /*Up*/ ) {
            event.stopPropagation();
        }
    },
    // Handle pushing movie-button
    onMovieButtonEvent: function(event) {
        event.preventDefault();
        var keyCode = event.keyCode;
        if (keyCode == 40 /*Down*/ ) {
            Vifi.Event.trigger("page:change", "browser");
            event.stopPropagation();
        }

        if (keyCode == 38 /*Up*/ ) {
            Vifi.Event.trigger("page:change", "home");
            event.stopPropagation();
        }
    },
    // Handle pushing action-buttons
    onActionEvent: function(event) {

        var keyCode = event.keyCode;
        if (keyCode == 13 /*Enter*/ ) {
            var item = event.target.element_;
            var link = item.firstChild;
            $(link).trigger("click");
        }
        event.preventDefault();
    },

    onClearSearchEvent: function(event) {

        if (event.keyCode == 13 /*Enter*/ ) {
            $("#browserPage input[type=text]").val("");
            $("#browserPage .first").click();
        }
        event.preventDefault();

    },


    // Setup initial handlers for the keyboard navigation
    setHandlers: function() {


        var browser = this;
        // Film view buttons
        Vifi.PageManager.decorateHandler.addClassHandler('movie-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, browser.onMovieButtonEvent, false, browser)
        });
        // Film view buttons
        Vifi.PageManager.decorateHandler.addClassHandler('action-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, browser.onActionEvent, false, browser)
        });
        // Film view buttons
        Vifi.PageManager.decorateHandler.addClassHandler('account-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, browser.onAccountEvent, false, browser)
        });
        // Toggle o
        Vifi.PageManager.decorateHandler.addClassHandler('tv-toggle-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Button.EventType.ACTION, browser.handleToggleEvent, false, browser);
        });
        // Keyboard
        Vifi.PageManager.decorateHandler.addClassHandler('key', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, browser.handleKeyboardEvent);
        });
        // Clear
        Vifi.PageManager.decorateHandler.addClassHandler('cleartext', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, browser.handleClearEvent);
        });

        // List item in the movie
        Vifi.PageManager.decorateHandler.addClassHandler('film-result', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, browser.handleMovieEvent, false, browser);
        });
        Vifi.PageManager.decorateHandler.addIdHandler("search-options-bar", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, browser.handleBrowserOptionKeys, false, browser);
        });
        Vifi.PageManager.decorateHandler.addIdHandler("searchbar", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, browser.handleBrowserKeys, false, browser);
        });
        Vifi.PageManager.decorateHandler.addClassHandler("featured-movie", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.FOCUS, browser.handleFeaturedFocus, false, browser);
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, browser.handleFeaturedKey, false, browser);
        });
        Vifi.PageManager.decorateHandler.addClassHandler("no-left", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, browser.handleBorderKeyLeft, false, browser);
        });
        Vifi.PageManager.decorateHandler.addClassHandler("no-right", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, browser.handleBorderKeyRight, false, browser);
        });
        Vifi.PageManager.decorateHandler.addClassHandler("no-up", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, browser.handleBorderKeyUp, false, browser);
        });
        Vifi.PageManager.decorateHandler.addIdHandler("clear-search-options", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, browser.onClearSearchEvent, false, browser);
        });
    },

    onDecorateCloseButton: function(component) {
        var browser = this;

        goog.events.listen(component, tv.ui.Component.EventType.KEY, function(event) {
            var keyCode = event.keyCode;
            event.preventDefault();
            if (keyCode == 13 /*Enter*/ ) {
                var item = event.target.element_;
                var link = item.firstChild;
                $(link).trigger("click");
            }


            event.stopPropagation();
        });

    },

    onDecorateFilmResult: function(component) {
        var browser = this;

        goog.events.listen(component, tv.ui.Component.EventType.KEY, function(event) {
            var keyCode = event.keyCode;
            event.preventDefault();
            if (keyCode == 13 /*Enter*/ ) {
                var item = event.target.element_;
                var link = item.firstChild;
                $(link).trigger("click");
                event.stopPropagation();
            }
            if (keyCode == 39 /*Right */ ) {
                Vifi.Event.trigger("browser:pagination", component.getElement());

            }
            if (keyCode == 38 /*Up*/ ) {
                var el = tv.ui.getComponentByElement(goog.dom.getElement("search-options-bar"));
                el.tryFocus(true);
                event.stopPropagation();
            }
            if (keyCode == 40 /*Down*/ ) {
                event.stopPropagation();
            }


        });

    },
    /** Handle buttons on the onscreen keyboard  */
    handleKeyboardEvent: function(event) {
        var keyCode = event.keyCode;
        if (keyCode == 13 /*Enter*/ ) {
            var q = $("#q").val();
            var text = event.target.element_.outerText;
            if (text == "space") text = " ";
            $("#q").val(q + text);
            app.onSearchFieldChange(event);
        }
    },
    /** Handle clearing the search */
    handleClearEvent: function(event) {
        var keyCode = event.keyCode;
        if (keyCode == 13 /*Enter*/ ) {
            $("#q").val("");
            app.onSearchFieldChange(event);
        }
    },
    /** Handle browser topbar buttons */
    handleBrowserKeys: function(event) {
        var keyCode = event.keyCode;
        event.preventDefault();
        if (keyCode == 38 /*Up*/ ) {
            if ($("#moviePage:visible").size() > 0) Vifi.Event.trigger("page:change", "movie");
            else Vifi.Event.trigger("page:change", "home");
        }
        if (keyCode == 40 /*Down*/ ) {
            var el = tv.ui.getComponentByElement(goog.dom.getElement("search-options-bar"));
            el.tryFocus(true);
            event.stopPropagation();

        }
    },
    /** Handle browser optionbar buttons */
    handleBrowserOptionKeys: function(event) {
        var keyCode = event.keyCode;
        event.preventDefault();
        if (keyCode == 40 /*Down*/ ) {
            var el = tv.ui.getComponentByElement(goog.dom.getElement("film-results"));
            if (undefined !== el) {
                var jee = el.getElement().getElementsByClassName("tv-container-selected-child")[0];

                if (jee) tv.ui.getComponentByElement(jee).tryFocus();

                else {
                    el.removeChildren();
                    tv.ui.decorateChildren(el.getElement(), this.onDecorateFilmResult, el);
                    el.tryFocus();
                }
            }
            event.stopPropagation();
        }
        if (keyCode == 38 /*Up*/ ) {

            this.pageManager.setFocus(goog.dom.getElement("searchbar"));
            event.stopPropagation();

        }
        return false;
    },
    /* Handle togglebutton */
    handleToggleEvent: function(event) {
        var button = event.target;
        button.setOn(button.isOn());
        var el = button.element_;
        var element = $(el);
        var coll = element.parent().attr("data-field");
        var val = element.attr("data-value");
        var type = element.attr("data-type");
        var selected = false;

        if (undefined != type && type == "radio") {

            var butvalue = element.attr("data-value");
            element.parent().find(".tv-toggle-button").each(function() {
                $(this).addClass("reset-toggle");
            });
            var resetbuttons = goog.dom.getElementsByClass("reset-toggle");
            $(resetbuttons).each(function() {
                var btn = tv.ui.getComponentByElement(this);
                var value = $(this).attr("data-value");
                if (value == butvalue) btn.setOn(true);
                else btn.setOn(false);
            });


        }
        // Reset selections if user pushed reset button
        if (val == "reset" || type == "radio") {
            var reset = true;
            element.parent().find(".tv-toggle-button").each(function() {
                $(this).addClass("reset-toggle");
            });
            var resetbuttons = goog.dom.getElementsByClass("reset-toggle");
            $(resetbuttons).each(function() {
                var btn = tv.ui.getComponentByElement(this);
                var attribute = $(this).attr("data-value");
                if (attribute == "reset" || attribute == val) btn.setOn(true);
                else btn.setOn(false);
            });
        } else {
            //    Mute Reset choices exist
            element.parent().find(".tv-toggle-button:first").addClass("reset-toggle");
            var resetbutton = goog.dom.getElementByClass("reset-toggle");
            var tvbutton = tv.ui.getComponentByElement(resetbutton);
            if (tvbutton != false && tvbutton != "undefined") {
                tvbutton.setOn(false);
                $("#id_" + coll + " option:first").attr("selected", false);
            }
        }
        $(".reset-toggle").removeClass("reset-toggle");
        if (button.isOn() == true) selected = true;
        if (val != undefined && coll != undefined) {
            $("#id_" + coll + " option").each(function() {
                if (reset) {
                    if (this.value > 0) $(this).attr("selected", false);
                    else $(this).attr("selected", "selected")
                }
                if (this.value == val) {
                    $(this).attr("selected", selected);
                }
            });
        }
        app.onSearchFieldChange(event);
    },
    /* Handle focusing on browser */
    handleMovieFocus: function(event) {
        var item = event.target.element_;
        Vifi.Event.trigger("browser:pagination", item);
    },
    /* Handle focusing on the frontpage */
    handleFeaturedFocus: function(event) {
        var item = event.target.element_;
        $(".featured-movie.active-item").removeClass("active-item");
        $(item).addClass("active-item");
        var link = item.firstChild;
        $(link).trigger("showdetails");
    },
    /* Handle clicking on film at homepage */
    handleFeaturedKey: function(event) {
        event.preventDefault();
        var keyCode = event.keyCode;

        if (keyCode == 40 /*Down*/ ) {
            var page = "browser";
            if ($("#moviePage:visible").length > 0) {
                page = "movie";
            } else {
                this.pageManager.setFocus("filter-toolbar");
            }
            Vifi.Event.trigger("page:change", page);
        }
        if (keyCode == 38 /*Up*/ ) {
            Vifi.Event.trigger("page:change", "account");
        }
        if (keyCode == 13 /*Enter*/ ) {
            var item = event.target.element_;
            var link = item.firstChild;
            $(link).trigger("click");
        }

        return false;
    },
    /* Handle clicking on film at browser */
    handleMovieEvent: function(event) {
        var keyCode = event.keyCode;
        if (keyCode == 13 /*Enter*/ ) {
            var item = event.target.element_;
            var link = item.firstChild;
            $(link).trigger("click");

        }
        if (keyCode == 38 /*Up*/ ) {
            var el = tv.ui.getComponentByElement(goog.dom.getElement("search-options-bar"));
            el.tryFocus(true);
            event.stopPropagation();
        }
        if (keyCode == 39 /*Right */ ) {


            var item = event.target;
            Vifi.Event.trigger("browser:pagination", item);
        }

        if (keyCode == 40 /*Down*/ ) {
            event.stopPropagation();
        }

        return false;
    },
});
Vifi.Utils.Api = Backbone.Model.extend({
    defaults: {},
    baseUrl: Vifi.Settings.api_url,
    params: "api_key=" + Vifi.Settings.api_key + "&jsoncallback=?",
    send: function(key, data, callback) {
        this.url = key;
        var params = this.params + $(data).serialize();
        $.getJSON(this.baseUrl + key, params, function(data) {
            if (null !== callback) {
                callback(data);
            }
        }, "jsonp");
    },
    onFinishGet: function(event) {}
});
//A utility model to track state using the hash and also generate a url
Vifi.Utils.State = Backbone.Model.extend({
    defaults: {},
    getQueryString: function(addParams) {
        var hashables = [];
        var dict = this.toJSON();
        for (key in dict) {
            if ((!_.indexOf(_.keys(this.defaults), key) || (this.defaults[key] != dict[key])) && dict[key] != undefined) {
                hashables.push(key + '=' + escape(dict[key]));
            }
        }
        if (addParams) {
            for (key in addParams) {
                hashables.push(key + '=' + addParams[key])
            }
        }
        return '?' + hashables.join('&');
    },
    //A hash to use in the url to create a bookmark or link
    //Makes somehting like prop1:value1|prop2:value2
    getHash: function() {
        return this.getQueryString().substring(1).replace(/&/g, '|').replace(/=/g, ':');
    },
    //Take a hash from the url and set the model attributes
    //Parses from the formate of prop1:value1|prop2:value2
    setFromHash: function(hash) {
        var hashables = hash.split('|');
        var dict = _.clone(this.defaults);
        _.each(hashables, function(hashable) {
            var parts = hashable.split(':');
            var prop = parts[0];
            var value = parts[1];
            dict[prop] = value;
        });
        this.set(dict);
    }
});

/******************/
/* Film Models & Collections */
/******************************/




Vifi.Films.FilmModel = Backbone.Model.extend({});
Vifi.Films.FilmDetailView = Backbone.View.extend({
    tagName: 'div',
    el: $("#moviePage"),
    model: new Vifi.Films.FilmModel(),
    events: {
        'click #button-watch': 'playFilm',
        'click #button-trailer': 'playTrailer',
    },
    initialize: function() {
        Vifi.Event.on('film:show', this.showFilm, this);
        Vifi.Event.on('trailer:show', this.playTrailer, this);
    },
    playFilm: function(event) {
        event.preventDefault();

        app.player.trigger("player:load", this.model.get("id"));
        event.stopPropagation();
    },

    playTrailer: function(event) {
        event.preventDefault();


        var trailerView = new Vifi.Films.TrailerView({
            model: this.model
        });
        trailerView.play();

        $("#trailer").html(trailerView.el);
        app.pagemanager.redraw();

        var el = tv.ui.getComponentByElement(goog.dom.getElement("trailer-options-selection"));
        tv.ui.decorateChildren(el.getElement(), function(component) {
            goog.events.listen(component, tv.ui.Component.EventType.KEY, function(event) {
                var keyCode = event.keyCode;
                event.preventDefault();
                if (keyCode == 13 /*Enter*/ ) {
                    var item = event.target.element_;
                    console.log(item);

                    $(item).trigger("click");

                }
                if (keyCode == 38 /*Up*/ || keyCode == 40) {
                    event.stopPropagation();
                }

            })
        }, el);
        el.tryFocus();

    },
    showFilm: function(id) {
        var film = app.collection.get(id);

        if (undefined == film) {
            var film = app.options.featured.get(id);
        }
        if (undefined !== film) {
            router.navigate('film/' + id);
            this.model = film;
            this.render().showPage();
        }
    },
    showPage: function() {
        var height = $("#browserPage")
        if (this.$el.is(":hidden") === true && $("#browserPage").hasClass("active")) {
            var height = $(window).height() + "px";

            $("#moviePage").css({
                "margin-top": "-" + height,
                "height": "0px",
                "min-height": "0px"
            }).animate({
                "margin-top": "",
                "min-height": height,
                "height": height,
                "opacity": "1",
                "display": "block"
            }, 500, function() {
                $("#moviePage").removeAttr("style");

                Vifi.Event.trigger("page:change", "movie");
            }).show();

        } else {
            $("#moviePage").show();
            Vifi.Event.trigger("page:change", "movie");

        }


    },
    render: function() {
        this.$el.html(ich.filmDetailsTemplate(this.model.toJSON()));
        if (!this.model.get("film").youtube_id) {
            this.$("#preview").attr("class", "");
            this.$("#button-trailer").addClass("no-trailer").html("Treilerit pole")
        }
        return this;
    }
});
Vifi.Films.FilmView = Backbone.View.extend({
    viewType: 'grid',
    tagName: 'div',
    tagClass: 'tv-component tv-button nav-item',
    events: {
        'click a': 'onClickShowDetails',
    },
    //There are additional events bound in the homepage template and search page template. Because of conflicting versions of jQuery
    initialize: function() {
        this.render();
    },
    render: function() {
        var model = this.model;
        this.$el.html(ich.mustacheRawFilmTemplate(model.toJSON()));
        this.$el.addClass("tv-component tv-button movie film-result").attr("data-id", model.get("id"));
        return this;
    },
    onClickShowDetails: function(event) {
        event.preventDefault();
        var view = this;
        var model = this.model;
        Vifi.Event.trigger("film:show", model.id);
        this.$el.addClass("active-item");
    },
    onClickRemoveQueue: function(event) {
        event.preventDefault();
        var view = this;
        $.post('/queue/remove/' + this.model.get('film').id + '?format=json', function(data) {
            view.onQueueUpdated('removed', data);
        });
        app.triggerFilmRemovedFromQueue(this.model);
    },
    onDetailsUpdated: function(actionType, data) {
        if (actionType == 'added') {} else {
            this.$('.remove-queue').hide();
            this.$('.add-queue').show();
            var model = this.options.queue.get(data.id);
            this.options.queue.remove(model);
        }
    },
    onClickMsgQueue: function(event) {
        $.msg({
            content: 'You must have an account to add films to your queue.<br /><a href="/subscription/">Sign Up</a> or <a href="/accounts/login/">Log In</a>.<br /><span class="click-msg"></span>',
            fadeIn: 300,
            fadeOut: 200,
            timeOut: 7000
        });
    },
    resetSizes: function() {
        this.$('.film-card').css('height', '100%');
        this.$('.film-card').css('width', '100%');
    },
    switchToGridView: function() {
        this.viewType = 'grid';
        this.resetSizes();
        this.hideAddedInfo();
    },
    switchToListView: function() {
        this.viewType = 'list';
        this.resetSizes();
        this.showAddedInfo();
    },
    showAddedInfo: function() {
        this.$('.added-info').show();
        if (this.options.user_is_authenticated) {
            this.$('.msg-queue').hide();
            if (this.options.queue.where({
                'film_id': this.model.get('film').id
            }).length) {
                this.$('.remove-queue').show();
                this.$('.add-queue').hide();
            } else {
                this.$('.add-queue').show();
                this.$('.remove-queue').hide();
            }
        } else {
            this.$('.msg-queue').show();
            this.$('.remove-queue').hide();
            this.$('.add-queue').hide();
        }
        // this.$('.title').html(this.model.get('film').title);
    }
});
Vifi.Films.FeaturedFilmView = Vifi.Films.FilmView.extend({
    events: {
        'showdetails': 'updateDetails',
        'click a': 'onClickShowDetails'
    },
    onClickShowDetails: function(event) {
        event.preventDefault();
        var view = this;
        var model = this.model;

        Vifi.Event.trigger("film:show", model.id);
    },
    updateDetails: function(ev, model) {
        ev.preventDefault();
        var model = this;
        Vifi.Event.trigger("featured:focus", this.model);
        $("#home-background div.visible").removeClass("visible")
        $("#home-background div#film-" + this.model.get("film").id).addClass("visible");
        ev.stopPropagation();
    },
    render: function() {
        var model = this.model;
        this.$el.addClass("tv-component tv-button movie featured-movie");
        this.$el.html(ich.featuredFilmTemplate(model.toJSON()));
        return this;
    }
});
Vifi.Films.GenreCollection = Backbone.Collection.extend({
    url: '',
    baseUrl: '',
    initialize: function(models, options) {},
    update: function() {
        this.url = this.baseUrl + '&api_key=' + Vifi.Settings.api_key + '&jsoncallback=?';
        if (!app.collection.state.get('genre')) {
            this.reset();
        } else {
            this.url = this.baseUrl + app.collection.state.get('genre');
            this.fetch();
        }
    },
    parse: function(response) {
        return response.objects;
    }
});
Vifi.Films.SubGenreCollection = Backbone.Collection.extend({
    baseUrl: '#',
    initialize: function(models, options) {},
    update: function() {
        if (!app.collection.state.get('genre')) {
            this.reset();
        } else {
            this.url = this.baseUrl + app.collection.state.get('genre');
            this.fetch();
        }
    },
});
Vifi.Films.FeaturedFilmCollection = Backbone.Collection.extend({
    model: Vifi.Films.FilmModel,
    url: '',
    initialize: function(models, options) {},
    update: function() {},
});
Vifi.Films.FeaturedFilmCollectionView = Backbone.View.extend({
    el: $("#featured"),
    bg: [],
    models: null,
    initialize: function(models) {
        this.models = models;
        this.render();
    },
    render: function() {
        this.renderFilmViews();
        return this;
    },
    renderFilmViews: function() {
        var fragment = document.createDocumentFragment();
        var bgfragment = document.createDocumentFragment();
        var bg = this.bg;
        this.$el.html('');
        this.models.each(function(model) {
            fragment.appendChild(this.addChildView(model));
            var img = $("<div>").css("background", "url('" + model.get("film").backdrop_url + "')").attr("id", "film-" + model.get("film").id).addClass("featured_film_background");
            bg.push(img[0]);
        }, this);


        $.each(bg, function() {
            bgfragment.appendChild(this);
        });

        $("#home-background").html(bgfragment);
        this.$el.append(fragment);

    },
    addChildView: function(model) {

        var filmView = new Vifi.Films.FeaturedFilmView({
            model: model,
            queue: app.queue
        });

        return filmView.el;
    }
});


Vifi.Films.TrailerView = Backbone.View.extend({
    tagName: 'div',
    events: {
        'click #closeTrailer': 'close',
        'click #watchFilm': 'playFilm'


    },

    playFilm: function(event) {
        this.close();

        event.preventDefault();
        app.player.trigger("player:load", this.model.get("id"));
        event.stopPropagation();
    },

    initialize: function() {
        Vifi.Event.on("trailer:init", this.play, this);
        this.template = _.template($("#trailerTemplate").html());
        _.bindAll(this, "render");
    },
    fadeOut: function() {
        this.$el.fadeOut();
    },
    fadeIn: function() {
        this.$el.fadeIn();
    },
    play: function() {
        var film = this.model.get("film");

        if (film.youtube_id) {
            this.render();
        }
    },

    close: function() {

        this.fadeOut();
        this.$el.empty();
        Vifi.Event.trigger("page:focus");
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
});
Vifi.Films.FeaturedFilmDetailView = Backbone.View.extend({
    tagName: 'div',
    el: $("#featured-description"),
    model: new Vifi.Films.FilmModel(),
    events: {},

    bgimages: [],
    initialize: function() {
        Vifi.Event.on("featured:focus", this.setBackground, this);


        this.template = _.template($("#featuredFilmDetailsTemplate").html());
    },
    setBackground: function(model) {
        this.model = model;
        this.render();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
});
Vifi.Films.BaseAppView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};
        this.queue = this.options.queue;
    },
    blockedFilmView: false,
    //A reference to our currently popped out film 
    blockFilm: function(filmView) {
        this.blockedFilmView = filmView;
        this.pageBlock.fadeIn();
    },
    unblock: function() {
        if (this.blockedFilmView) {
            this.blockedFilmView.hidePopOut();
        }
        this.blockedFilmView = false;
        this.pageBlock.fadeOut();
    },
    triggerFilmDetailsLoaded: function(model) {
        this.trigger('filmDetailsLoaded', model);
    },
    triggerFilmRemovedFromQueue: function(model) {
        this.trigger('filmRemovedFromQueue', model);
    },
    triggerFeaturedFilmsLoaded: function(model) {

        this.trigger('featuredFilmsLoaded', model);
    }
});