/******************/
/* Film Models & Collections */
/******************************/
Vifi.Films.FilmModel = Backbone.Model.extend({});
Vifi.Films.FilmDetailView = Backbone.View.extend({
    tagName: 'div',
    el: $("#moviePage"),
    model: new Vifi.Films.FilmModel,
    events: {
        'click #button-watch': 'playFilm',
        'click #button-trailer': 'playTrailer',
    },
    initialize: function() {
        Vifi.Event.on('film:show', this.showFilm, this);
        Vifi.Event.on('trailer:show', this.playTrailer, this);
        _.bindAll(this, 'render');
    },
    playFilm: function(event) {
        event.preventDefault();
        app.player.trigger("player:load", this.model.get("id"));
        event.stopPropagation();
    },
    playTrailer: function(event) {
        event.preventDefault();
        if (this.trailerView) {
            this.trailerView.model.set(this.model.toJSON());
        } else {
            this.trailerView = new Vifi.Films.TrailerView({
                model: this.model
            });
        }
        this.trailerView.play();
    },
   
    showFilm: function(id) {
        var film = app.collection.get(id);
        if (undefined == film) {
            var film = app.browsercollection.get(id);
        }
        if (undefined !== film) {
            router.navigate('film/' + id);
            this.model = film;
            this.listenToOnce(this.model, "change", this.render);

            this.render().showPage();
        }
    },
    showPage: function() {
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
        var description = this.$("#movie_description").text();
        var maxAmount = Vifi.Platforms.platform.resolution.height > 720 ? 1100 : 900
        if (description.length > maxAmount) {
            this.$("#movie_description").html(description.substr(0, maxAmount) + "...");
        }
        if (!this.model.get("film").youtube_id) {
            this.$("#preview").attr("class", "");
            this.$("#button-trailer").addClass("no-trailer").html("Treilerit pole");
        }
        app.pagemanager.redraw("#moviePage", true);
        return this;
    }
});
Vifi.Films.FilmView = Backbone.View.extend({
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
        this.$el.html(ich.mustacheRawFilmTemplate(this.model.toJSON()));
        this.$el.addClass("tv-component tv-button movie film-result").attr("data-id", this.model.get("id"));
        return this;
    },
    onClickShowDetails: function(event) {
        event.preventDefault();
        $log("Showing film" + this.id);
        Vifi.Event.trigger("film:show", this.model.id);
        event.stopPropagation();
    },
   
});
Vifi.Films.FeaturedFilmView = Vifi.Films.FilmView.extend({
    events: {
        'showdetails': 'updateDetails',
        'click a': 'onClickShowDetails'
    },
    onClickShowDetails: function(event) {
        event.preventDefault();
        Vifi.Event.trigger("film:show", this.model.id);
    },
    updateDetails: function(ev, model) {
        $("#homePage .active-item").removeClass("active-item");
        ev.preventDefault();
        Vifi.Event.trigger("featured:focus", this.model);
        this.$el.addClass("active-item");
        $("#home-background div.visible").removeClass("visible");
        $("#home-background div#film-" + this.model.get("film").id).addClass("visible");
    },
    render: function() {
        this.$el.addClass("tv-component tv-button movie featured-movie");
        this.$el.html(ich.featuredFilmTemplate(this.model.toJSON()));
        return this;
    }
});
Vifi.Films.GenreCollection = Backbone.Collection.extend({
    url: '',
    baseUrl: '',
    initialize: function(models, options) {},
    update: function() {
        this.url = this.baseUrl + '&api_key=' + Vifi.Settings.api_key + '&jsoncallback=?';
        if (!app.browser.collection.state.get('genre')) {
            this.reset();
        } else {
            this.url = this.baseUrl + app.browser.collection.state.get('genre');
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
        if (!app.browser.collection.state.get('genre')) {
            this.reset();
        } else {
            this.url = this.baseUrl + app.browser.collection.state.get('genre');
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
        setTimeout(function() {
            Vifi.Engine.trigger("app:ready");
        }, 1500)
    },
    render: function() {
        this.renderFilmViews();
        Vifi.PageManager.redraw("#homePage", true);
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
        });
        return filmView.el;
    }
});

Vifi.Films.TrailerView = Backbone.View.extend({
    hideVideoNavigationTimeout: false,
    player: false,
    optionsEl: '#trailer-options',
    infoEl: '#player-info',
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
        this.loadPlayer();

        Vifi.Event.on("trailer:init", this.play, this);
        this.template = _.template($("#trailerTemplate").html());
        _.bindAll(this, "render", "touchVideoNavigationTimeout", "close", "onPlayerReady", "loadPlayer","mapKeys", "showNavigation", "stopVideo", "onPlayerStateChange");

    },
    fadeOut: function() {
        this.$el.fadeOut();
    },
    fadeIn: function() {
        this.$el.fadeIn();
    },
    play: function() {
        this.setElement("#trailer");
        var film = this.model.get("film");
        if (film.youtube_id) {
            this.fadeIn();
            this.render();
            this.initPlayer();
            this.showNavigation();
            Vifi.KeyHandler.bind("all", this.touchVideoNavigationTimeout, this);
            Vifi.Navigation.setReturnButton(this.close, this);
            
        }
    },

    mapKeys: function() { 
        app.pagemanager.redraw("#moviePage", true);

         var el = tv.ui.getComponentByElement(goog.dom.getElement("trailer-options-selection"));
                tv.ui.decorateChildren(el.getElement(), function(component) {
                    goog.events.listen(component, tv.ui.Component.EventType.KEY, function(event) {
                        var keyCode = event.keyCode;
                        event.preventDefault();
                        if (keyCode == 13 /*Enter*/ ) {
                            var item = event.target.element_;
                            $(item).trigger("click");
                        }
                        if (keyCode == 38 /*Up*/ || keyCode == 40) {
                            event.stopPropagation();
                        }
                    })
                }, el);
        el.tryFocus();

    },
    initPlayer: function() {
        var _this = this;
        if (typeof(YT) == "undefined") {
            setTimeout(function() {
                this.initPlayer();
            }.bind(this), 600);
            return false;
        }


        var film = this.model.get("film");
        if (film.youtube_id) {

            this.done = false;

            this.player = new YT.Player('ytplayer', {
                height: '100%',
                playerVars: {
                    'autoplay': 1,
                    'controls': 0
                },

                width: '100%',
                videoId: film.youtube_id,
                events: {
                    'onReady': _this.onPlayerReady,
                    'onStateChange': _this.onPlayerStateChange
                }
            });
        }
    },

    loadPlayer: function() {
        if (typeof(YT) != "undefined") return false;
        $("#youtubeplayer").remove();

        var tag = document.createElement('script');
        tag.id = "youtubeplayer";
        tag.src = "http://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        return true;

    },
    onPlayerReady: function(event) {
        event.target.playVideo();
    },

    onPlayerStateChange: function(event) {

        if (event.data == YT.PlayerState.PLAYING && this.done) {
            setTimeout(this.stopVideo, 6000);
        }
        if (event.data == YT.PlayerState.ENDED) {
            this.stopVideo();
        }
    },
    stopVideo: function() {
        this.player.stopVideo();
        this.done = true;
        this.close();
    },
    close: function() {
        this.fadeOut();
        this.player.destroy();
        this.$el.empty();
        this.clearAllTimeouts();

        Vifi.KeyHandler.unbind("all", this.touchVideoNavigationTimeout);
        Vifi.Event.trigger("page:focus");
    },
    showNavigation: function() {
        this.clearAllTimeouts();
        $(this.optionsEl).fadeIn();
        $(this.infoEl).fadeIn();
        this.touchVideoNavigationTimeout();
    },
    clearAllTimeouts: function() {
        clearTimeout(this.hideVideoNavigationTimeout);
    },
    touchVideoNavigationTimeout: function() {
        if (!$(this.optionsEl).is(":visible")) {
            $(this.optionsEl).fadeIn();
            $(this.infoEl).fadeIn();
        }

        clearTimeout(this.hideVideoNavigationTimeout);
        this.hideVideoNavigationTimeout = setTimeout(function() {
            $(this.optionsEl).fadeOut();
            $(this.infoEl).fadeOut();
        }.bind(this), 2000);
        return false;
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.mapKeys();

        return this;
    },
});
Vifi.Films.FeaturedFilmDetailView = Backbone.View.extend({
    tagName: 'div',
    el: $("#featured-description"),
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