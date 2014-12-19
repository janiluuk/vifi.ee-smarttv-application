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
        this.listenTo(Vifi.Event, 'film:show', this.showFilm, this);
        this.listenTo(Vifi.Event, 'trailer:show', this.playTrailer, this);
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
        this.trailerView.playTrailer();
    },
   
    showFilm: function(id) {
        var film = app.collection.get(id);
        if (undefined == film) {
            var film = app.browsercollection.get(id);
        }
        /* Clean up a bit */

        if (undefined != goog.dom.getElement("movie-actions")) {
            var page = tv.ui.getComponentByElement(goog.dom.getElement("movie-actions"));
            if (undefined !== page) {
                page.removeChildren();
            }
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
            }, 300, function() {
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
   //     $log("Showing film" + this.id);
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
        if (!app.browser.collection.state.get('genres')) {
            this.reset();
        } else {
            this.url = this.baseUrl + app.browser.collection.state.get('genres');
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
        var size = Vifi.Platforms.platform.matrix().split("x");

        this.$el.html('');
        this.models.each(function(model) {
            fragment.appendChild(this.addChildView(model));
            var img = $("<div>").css("background", "url('http://gonzales.vifi.ee/files/images/image.php?w="+size[0]+"&h="+size[1]+"&src="+model.get("film").backdrop_url+"')").attr("id", "film-" + model.get("film").id).addClass("featured_film_background");
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
    _keyMap: {
        'onPlay': "resume",
        'onPause': "pause",
        'onStop': "stop",
        'onReturn' : "close",
        'onMute' : "mute",
        'onFF' : "forward",
        'onRew' : "rewind"

    },
    initialize: function() {
        this.loadPlayer();

        Vifi.Event.on("trailer:init", this.play, this);
        this.template = _.template($("#trailerTemplate").html());
        _.bindAll(this, "render", "_bindKeys", "_unbindKeys", "touchVideoNavigationTimeout", "close", "onPlayerReady", "loadPlayer","_mapKeys", "showNavigation", "pause","resume","mute", "stop", "onPlayerStateChange");

    },

    _bindKeys: function() {
        Vifi.KeyHandler.bind("all", this.touchVideoNavigationTimeout,this);
        
        if (typeof(pluginAPI) != "undefined") { 
        setTimeout(function() {

            Vifi.Platforms.platform.enableMute();
        },500);
        
        }
        _.each(this._keyMap, function(key,item) {
            Vifi.KeyHandler.unbind("keyhandler:"+item);
            Vifi.KeyHandler.bind("keyhandler:"+item, eval("this."+key), this);
        }.bind(this));

    },
    _unbindKeys: function() { 
        Vifi.KeyHandler.unbind("all", this.touchVideoNavigationTimeout);
        if (typeof(pluginAPI) != "undefined") Vifi.Platforms.platform.disableMute();

        _.each(this._keyMap, function(key,item) { 
            Vifi.KeyHandler.unbind("keyhandler:"+item, eval("this."+key));
        
        }.bind(this));
        Vifi.Navigation.setReturnButton();
    },
    _mapKeys: function() { 
        app.pagemanager.redraw("#moviePage", true);
        app.pagemanager.setFocusById("trailer-options-selection");

    },
    playFilm: function(event) {
        this.close();
        event.preventDefault();
        app.player.trigger("player:load", this.model.get("id"));
        event.stopPropagation();
    },
    fadeOut: function() {
        this.$el.fadeOut();
        return this;
    },
    fadeIn: function() {
        this.$el.fadeIn();
        return this;
    },
    playTrailer: function() {
        this.setElement("#trailer");
        if (this.model.get("film").youtube_id) {
            $("#movie_details").hide();
            this.render().fadeIn();
            this._bindKeys();
            this.initPlayer();
            this.showNavigation();
            
        }
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
                playerVars: {
                    'autoplay': 1,
                    'controls': 0
                },
                height: $(window).height(),
                width: $(window).width(),
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
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        return true;

    },
    onPlayerReady: function(event) {
        event.target.playVideo();
    },

    onPlayerStateChange: function(event) {

        if (event.data == YT.PlayerState.ENDED) {
            this.close();
        }
    },
    stop: function() {
        if (this.player) { 
          this.player.stopVideo();
          this.done = true;
          this.close();
        }
    },
    pause: function() {
        this.player.pauseVideo();
    },
    forward: function(amt) {
        amt = amt || 10;
        var time = this.player.getCurrentTime()+amt;
        this.player.seekTo(time);
    },
    rewind: function(amt) {
        amt = amt || 10;
        var time = Math.max(this.player.getCurrentTime()-amt,0);
        this.player.seekTo(time);

    },
    
    mute: function(e) {
        if (e) e.preventDefault();

        if (!this.player) return false;
        var currentMute = this.player.isMuted();
        $log("Current mute: "+currentMute);

        if (currentMute !== true) { 
            $log("Muting audio");

            this.player.mute(); 

        } else {
            $log("UnMuting audio");

        	this.player.unMute();
        }
    },
    resume: function() {
        this.player.playVideo();
    },
    close: function() {
        this.fadeOut();
        $("#movie_details").show();

        this.player.destroy();
        this.$el.empty();
        this.clearAllTimeouts();
        this._unbindKeys();
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
        }.bind(this), 2000);
        return false;
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this._mapKeys();

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