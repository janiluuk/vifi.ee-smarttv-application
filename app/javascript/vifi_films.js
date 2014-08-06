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
        var trailerView = new Vifi.Films.TrailerView({
            model: this.model
        });
        trailerView.play();
        $("#trailer").html(trailerView.el);
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
        console.log(this.model);
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
        var model = this.model;
        Vifi.Event.trigger("film:show", model.id);
        event.stopPropagation();
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
        $("#homePage .active-item").removeClass("active-item");
        ev.preventDefault();
        var model = this;
        Vifi.Event.trigger("featured:focus", this.model);
        this.$el.addClass("active-item");
        $("#home-background div.visible").removeClass("visible");
        $("#home-background div#film-" + this.model.get("film").id).addClass("visible");
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
        $("#homePage").waitForImages(function() {
            Vifi.Engine.trigger("app:ready");
        });
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
            Vifi.Navigation.setReturnButton(this.close, this);
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