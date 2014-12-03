Vifi.Event = _.extend({}, Backbone.Events);
Vifi.PageView = Backbone.View.extend({});
Vifi.PageManager = {
    moviePage: $("#" + Vifi.Settings.moviepageId),
    browserPage: $("#" + Vifi.Settings.browserpageId),
    homePage: $("#" + Vifi.Settings.homePageId),
    playerPage: $("#" + Vifi.Settings.playerPageId),
    accountPage: $("#" + Vifi.Settings.accountpageId),
    activationPage: $("#" + Vifi.Settings.activationPageId),
    exitPage: $("#" + Vifi.Settings.exitPageId),

    alertPage: $("#" + Vifi.Settings.activationPageId),
    purchasePage: $("#" + Vifi.Settings.purchasePageId),
    name: "Pagemanager",
    decorateHandler: false,
    appElement: false,
    appComponent: false,
    focusedElement: false,
    needsredraw: false,
    drawing: false,
    activeItem: false,
    lastActivePage: false,
    activePage: this.homePage,
    init: function() {
        Vifi.Event.on("page:beforepagechange", this.onBeforePageChange, this);
        Vifi.Event.on("page:onpagechange", this.onPageChange, this);
        Vifi.Event.on("page:afterpagechange", this.onAfterPageChange, this);
        Vifi.Event.on('page:ready', this.redraw, this);
        Vifi.Event.on('page:up', this.moveUp, this);
        Vifi.Event.on('page:down', this.moveDown, this);
        Vifi.Event.on('page:focus', this.focusFirst, this);
        Vifi.Event.on('page:change', this.switchToPage, this);
        Vifi.Event.on('page:back', this.switchToPrevious, this);

        this.decorateHandler = new tv.ui.DecorateHandler;
        _.bindAll(this, 'redraw', 'enableNavigation', 'disableNavigation', 'focusFirst', 'setFocus', 'setFocusByClass', 'switchToPage', 'setHandlers');
        this.setHandlers();

        tv.ui.decorate(document.body);
        if (!this.appComponent) {
            this.appElement = goog.dom.getElement("application");
            this.appComponent = tv.ui.getComponentByElement(this.appElement);
        }

    },

    enableNavigation: function() {
        $(".tv-component-disabled").removeClass("tv-component-disabled");
        this.redraw("#application", true);
        this.decorateElement("film-results", this.handleMovieEvent);

        Vifi.KeyHandler.enable();

    },
    disableNavigation: function() {
        Vifi.KeyHandler.disable();
        $(".tv-component").addClass("tv-component-disabled");
        tv.ui.decorate(goog.dom.getElement("application"));
    },

    moveUp: function() {
        var active = this.getActivePage().prevAll("div:visible:first");
        if (active != "" && active.length > 0) {
            var name = $(active).attr("id").replace("Page", "");
            Vifi.Event.trigger("page:change", name);
        }
    },
    moveDown: function() {
        var active = this.getActivePage().nextAll("div:visible:first");
        if (undefined != active && active != "" && active.length > 0) {
            var name = $(active).attr("id").replace("Page", "");
            Vifi.Event.trigger("page:change", name);
        }
    },
    // Bring given page to the screen after making preparations accordingly.
    // Looking at this makes ma already feel like sitting in italian restaurant.
    setActivePage: function(page) {
        //$("#statusDiv")
        //html("Page: " + $(page).attr("id"));
        this.activePage = page;

        $("body").scrollTo(page, 250);
        this.getActivePage().addClass("active");

        Vifi.Navigation.setReturnButton();

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
            return true;
        } else {
            if (this.setFocusByClass("tv-component-focused") === true) {
                return true;
            } else return this.setFocusByClass("tv-component");
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

    /*
     * Navigate to a page
     * params:
     * page - pagename to navigate to
     * redraw - set to true to decorate the target page again
     * fullredraw - set to true to decorate whole app again
     * cb - callback to run after to
     */
    switchToPage: function(page, redraw, fullredraw, cb) {
        if (page != "") var pageid = '#' + page + "Page";
        else return false;
        if (this.changing) return false;
        var el = "#application";
        if (this.needsredraw) redraw = true;
        this.callback = function() {
            $log("doing callback");
            this.redraw(pageid, redraw, fullredraw);
            if (cb) cb();
        }.bind(this);
        this.changing = true;
        Vifi.Event.trigger("page:beforepagechange", pageid);
        router.trigger("page:change", page);
    },
    switchToPrevious: function(cb) {
        if (this.lastActivePage) {
            var pageName = this.lastActivePage.replace("Page", "").replace("#", "");

            this.switchToPage(pageName, true, false);
        }
    },
    onBeforePageChange: function(page) {
        if (!Vifi.Navigation.enabled) return false;
        this.getActivePage().removeClass("active");
        this.lastActivePage = this.activePage;
        Vifi.Event.trigger("page:onpagechange", page);
    },
    onPageChange: function(page) {
        this.setActivePage(page);

        Vifi.Event.trigger("page:afterpagechange", page);
    },
    onAfterPageChange: function(page) {
        if (this.callback) {
            this.callback();
        }

        this.callback = false;
        this.changing = false;
    },
    redraw: function(el, redraw, fullredraw) {

        if (!this.drawing) {
            this.drawing = true;
            var str = "";
            if (undefined != el && undefined != el.selector) {
                var str = el.selector.substr(1);
            } else {
                if (undefined != el) str = el;
            }
            var page = "#application";
            if (str != "" && !fullredraw) page = str;
            var pageName = page.substr(1);

            if (fullredraw) {
                //$log("Full redraw for " + page);
                tv.ui.decorate(document.body);
                var element = goog.dom.getElement(pageName);
                var appElement = tv.ui.getComponentByElement(element);
                if (undefined != appElement) appElement.removeChildren();
                tv.ui.decorateChildren(appElement, this.decorateHandler.getHandler(), this.appComponent);
                //                tv.ui.decorate(element);
            }
            if (redraw) {
                // $log("Redrawing " + page);
                tv.ui.decorateChildren(goog.dom.getElement(pageName), this.decorateHandler.getHandler(), this.appComponent);
            }

            this.focusFirst();
            this.drawing = false;

        }
        return this;
    },
    decorateElement: function(el, handler) {
        var el = tv.ui.getComponentByElement(goog.dom.getElement(el));
        if (undefined == el || !el ||  !handler)
            return false;
        tv.ui.decorateChildren(el.getElement(), function(component) {
            goog.events.listen(component, tv.ui.Component.EventType.KEY, handler);
        }.bind(this), el);
        el.tryFocus();

    },

    // Setup initial handlers for the keyboard navigation
    setHandlers: function() {
        var _this = this;
        Vifi.PageManager.decorateHandler.addClassHandler('nav-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, _this.onNavButtonEvent, false, _this)
        });
        // Film view buttons
        Vifi.PageManager.decorateHandler.addClassHandler('movie-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, _this.onMovieButtonEvent, false, _this)
        });
        // Film view buttons
        Vifi.PageManager.decorateHandler.addClassHandler('action-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, _this.onActionEvent, false, _this)

        });
        // Film view buttons
        Vifi.PageManager.decorateHandler.addClassHandler('account-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, _this.onAccountEvent, false, _this)
        });
        // Toggle on / off buttons
        Vifi.PageManager.decorateHandler.addClassHandler('tv-toggle-button', function(component) {
            component.getEventHandler().listen(component, tv.ui.Button.EventType.ACTION, _this.handleToggleEvent, false, _this);

        });
        // Keyboard
        Vifi.PageManager.decorateHandler.addClassHandler('key', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, _this.handleKeyboardEvent);
        });
        // Clear
        Vifi.PageManager.decorateHandler.addClassHandler('cleartext', function(component) {
            component.getEventHandler().listen(component, tv.ui.Component.EventType.KEY, _this.handleClearEvent);
        });
        // Search bar actions

        Vifi.PageManager.decorateHandler.addIdHandler("search-options-bar", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, _this.handleBrowserOptionKeys, false, _this);
        });
        Vifi.PageManager.decorateHandler.addIdHandler("searchbar", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, _this.handleBrowserKeys, false, _this);
        });
        // Home page

        Vifi.PageManager.decorateHandler.addClassHandler("featured-movie", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.FOCUS, _this.handleFeaturedFocus, false, _this);
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, _this.handleFeaturedKey, false, _this);
        });
        // Block arrow keys

        Vifi.PageManager.decorateHandler.addClassHandler("no-left", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, _this.handleBorderKeyLeft, false, _this);
        });
        Vifi.PageManager.decorateHandler.addClassHandler("no-right", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, _this.handleBorderKeyRight, false, _this);
        });
        Vifi.PageManager.decorateHandler.addClassHandler("no-up", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, _this.handleBorderKeyUp, false, _this);
        });
        Vifi.PageManager.decorateHandler.addClassHandler("no-down", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, _this.handleBorderKeyDown, false, _this);
        });

        // Clear search 

        Vifi.PageManager.decorateHandler.addIdHandler("clear-search-options", function(button) {
            button.getEventHandler().listen(button, tv.ui.Component.EventType.KEY, _this.onClearSearchEvent, false, _this);
        });
    },
    // Handle pushing account-buttons
    onAccountEvent: function(event) {
        var keyCode = event.keyCode;
        if (keyCode == 40 /*Down*/ ) {
            Vifi.Event.trigger("page:change", "home");
            event.stopPropagation();
        }
    },
    // Handle nav-button
    
    onNavButtonEvent: function(event) {
        var keyCode = event.keyCode;
        event.preventDefault();
        if (keyCode == 13 /*Enter*/ ) {

            var item = event.target.element_;
            $(item).trigger("click");
            event.stopPropagation();
        }
    },
    // Handle blocking right arrow
    handleBorderKeyRight: function(event) {
        event.preventDefault();
        var keyCode = event.keyCode;
        if (keyCode == 39 /*Right*/ ) {
            event.stopPropagation();
        }
    },
    // Handle blocking left arrow
    handleBorderKeyLeft: function(event) {
        event.preventDefault();
        var keyCode = event.keyCode;
        if (keyCode == 37 /*Left*/ ) {
            event.stopPropagation();
        }
    },
    // Handle blocking up arrow
    handleBorderKeyUp: function(event) {
        event.preventDefault();
        var keyCode = event.keyCode;
        if (keyCode == 38 /*Up*/ ) {
            event.stopPropagation();
        }
    },
    // Handle blocking down arrow
    handleBorderKeyDown: function(event) {
        event.preventDefault();
        var keyCode = event.keyCode;
        if (keyCode == 40 /*Down*/ ) {
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
        if (event.type == tv.ui.Button.EventType.ACTION || keyCode == 13 /*Enter*/ ) {
            var item = event.target.element_;
            var link = item.firstChild;
            $(link).trigger("click");
            event.stopPropagation();
        }
        event.preventDefault();

    },
    onClearSearchEvent: function(event) {
        var keyCode = event.keyCode;

        if (event.type == tv.ui.Button.EventType.ACTION || keyCode == 13 /*Enter*/ ) {
            $("#browserPage input[type=text]").val("");
            $("#browserPage .first").click();
        }
        event.preventDefault();
    },
    /** Handle buttons on the onscreen keyboard  */
    handleKeyboardEvent: function(event) {
        var keyCode = event.keyCode;
        if (event.type == tv.ui.Button.EventType.ACTION || keyCode == 13 /*Enter*/ ) {
            var q = $("#q").val();
            var text = event.target.element_.outerText;
            if (text == "space") text = " ";
            $("#q").val(q + text);
            app.browser.onSearchFieldChange(event);
        }
    },
    /** Handle clearing the search */
    handleClearEvent: function(event) {
        var keyCode = event.keyCode;
        if (keyCode == 13 /*Enter*/ ) {
            $("#q").val("");
            app.browser.onSearchFieldChange(event);
        }
    },
    /** Handle browser topbar buttons */
    handleBrowserKeys: function(event) {
        var keyCode = event.keyCode;
        event.preventDefault();
        if (keyCode == 38 /*Up*/ ) {
            if ($("#moviePage:visible").size() > 0) Vifi.Event.trigger("page:change", "movie");
            else Vifi.Event.trigger("page:change", "home");
            event.stopPropagation();
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
                var selectedEl = el.getElement().getElementsByClassName("tv-container-selected-child")[0];

                this.decorateElement("film-results", this.handleMovieEvent);
                if (selectedEl) tv.ui.getComponentByElement(selectedEl).tryFocus();
            }

            event.stopPropagation();
        }
        if (keyCode == 38 /*Up*/ ) {
            this.setFocus(goog.dom.getElement("searchbar"));
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
        var field = element.parent().attr("data-field");
        var val = element.attr("data-value");
        var type = element.attr("data-type");
        var category = element.attr("data-category");
        if (undefined != category) Vifi.Event.trigger("button:" + category, val, this);
        var cnt = 0;
        element.parent().find(".tv-toggle-button").each(function() {
            if ($(this).hasClass("tv-toggle-button-on")) {
                cnt += 1;
            }
            $(this).addClass("reset-toggle");

        });
        if (val == "reset" || cnt == 0) var reset = true;


        if (undefined != type && type == "radio" || reset) {
            var resetbuttons = goog.dom.getElementsByClass("reset-toggle");

            $(resetbuttons).each(function() {
                var btn = tv.ui.getComponentByElement(this);
                var value = $(this).attr("data-value");
                if (!reset) btn.setOn(value == val);
                else btn.setOn(value == "reset");
            });

        }
        $(".reset-toggle").removeClass("reset-toggle");

        if (val != undefined && field != undefined) {
            $("#id_" + field + " option").each(function() {
                if (reset) {
                    $(this).attr("selected", this.value != "" ? false : "selected");
                } else if (this.value == val) {
                    $(this).attr("selected", button.isOn());
                }
            });
        }

        app.browser.onSearchFieldChange(event);
    },
    /* Handle focusing on the frontpage */
    handleFeaturedFocus: function(event) {
        var item = event.target.element_;
        var link = item.firstChild;
        $(link).trigger("showdetails");
    },
    /* Handle clicking on film at homepage */
    handleFeaturedKey: function(event) {
        var keyCode = event.keyCode;
        event.preventDefault();
        var item = event.target.element_;
        if (keyCode == 13 /*Enter*/ ) {
            var link = item.firstChild;
            $(link).trigger("click");
        }
        if (keyCode == 40 /*Down*/ ) {
            var page = "browser";
            if ($("#moviePage:visible").length > 0) {
                page = "movie";
            } else {
                this.setFocus("filter-toolbar");
            }
            Vifi.Event.trigger("page:change", page);
            event.stopPropagation();
        }
        if (keyCode == 38 /*Up*/ ) {
            Vifi.Event.trigger("page:change", "account");
            event.stopPropagation();
        }
        return false;
    },
    /* Handle clicking on film at browser */
    handleMovieEvent: function(event) {

        if (event.type == tv.ui.Button.EventType.ACTION || event.keyCode == 13 /*Enter*/ ) {
            var item = event.target.element_;
            var link = item.firstChild;

            $(link).trigger("click");

            $(item).parent().find(".active-item").removeClass("active-item");

            $(item).addClass("active-item");
            event.stopPropagation();
        }
        if (event.keyCode == 38 /*Up*/ ) {
            var item = event.target.element_;

            var el = tv.ui.getComponentByElement(goog.dom.getElement("search-options-bar"));
            el.tryFocus(true);
            $(item).parent().find(".active-item").removeClass("active-item");
            $(item).addClass("active-item");

            event.stopPropagation();
        }
        if (event.keyCode == 39 /*Right */ ) {
            app.browser.trigger("browser:pagination", event.target);

        }
        if (event.keyCode == 40 /*Down*/ ) {
            event.stopPropagation();
        }
        return false;
    }
}
_.extend(Vifi.PageManager, Backbone.Events);
Vifi.Engine.addModule("PageManager", Vifi.PageManager);

/* Views */

Vifi.Views.DialogView = Backbone.View.extend({
    defaults: {
        name: 'activation'
    },
    tagName: 'div',

    onShow: function(param) {},

    onHide: function() {
        Vifi.Event.trigger("page:back");
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        Vifi.Event.trigger("page:ready", "#" + this.$el.attr("id"));
        Vifi.PageManager.redraw("#" + this.$el.attr("id"), true);

        return this;
    },
    show: function(param) {
        $(".container:visible[not='.active']").addClass("hidden-container").fadeOut();
        $(".hidden-container .tv-component").removeClass("tv-component").addClass("tv-component-hidden");
        var pos = $(".container.active").position();
        this.$el.css("top", pos.top);
        this.$el.fadeIn().show();
        Vifi.Event.trigger("page:change", this.$el.attr("id").replace("Page", ""));
        this.onShow(param);
    },
    hide: function() {

        if (this.$el.hasClass("active")) {
            $(".hidden-container .tv-component-hidden").addClass("tv-component").removeClass("tv-component-hidden");
            $(".hidden-container").removeClass("hidden-container").fadeIn();
            this.$el.fadeOut().hide();
            console.log(this.$el);

            this.onHide();
        }
    }

});


Vifi.ExitView = Vifi.Views.DialogView.extend({
    el: $("#" + Vifi.Settings.exitPageId),
    fullexit: false,
    events: {
        'click #exit': 'exit',
        'click #closeExit': 'hide'
    },

    initialize: function() {
        this.template = _.template($("#exitTemplate").html());
        this.render();
        Vifi.Event.on('exit', this.show, this);

    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        Vifi.Event.trigger("page:ready", "#" + this.$el.attr("id"));
        return this;
    },
    onShow: function(fullexit) {
        this.exit = fullexit;
        Vifi.PageManager.redraw("#exitPage", true);

        Vifi.Navigation.setReturnButton(this.hide, this);

    },
    onHide: function() {
        Vifi.Event.trigger("page:back");
        Vifi.PageManager.redraw("#purchasePage", true);

    },
    exit: function() {
        Vifi.Platforms.platform.exit(this.fullexit);
        return false;
    }

});

Vifi.Utils.ApiModel = Backbone.Model.extend({
    defaults: {
        "id": '',
        'session': false
    },
    path: "",
    params: false,
    url: function() {
        return Vifi.Settings.api_url + this.path + '?' + this.params;
    },
    // override backbone synch to force a jsonp call
    sync: function(method, model, options) {
        // Default JSON-request options.
        this.params = "api_key=" + Vifi.Settings.api_key;
        var session = this.get("session");
        if (session) {
            this.params += "&sessionId=" + session.get("sessionId");
            if (session.get("hash") != null && session.get("hash") != "") this.params += "&authId=" + session.get("hash");
        }
        var params = _.extend({
            type: 'GET',
            dataType: 'jsonp',
            url: model.url(),
            jsonp: "jsoncallback", // the api requires the jsonp callback name to be this exact name
            processData: true
        }, options);
        // Make the request.
        return $.ajax(params);
    },
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

Vifi.Views.BaseAppView = Backbone.View.extend({
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