/**
 * Search and Browse Module
 * Handles movie search and browsing functionality
 * 
 * @file vifi_search.js
 * @author Jani Luukkanen <janiluuk@gmail.com>
 * 
 * @namespace Vifi.Pages.Browser
 * @description
 * This module manages:
 * - Movie search functionality
 * - Genre filtering and browsing
 * - Search form handling
 * - Search results display
 */

/**
 * Browser Page View
 * Main view for browsing and searching movies
 * @class Vifi.Pages.Browser
 * @extends Vifi.PageView
 */
Vifi.Pages.Browser = Vifi.PageView.extend({
    el: $("#browserPage"),
    model: new Vifi.Films.GenreCollection(),
    events: {
        'submit #search-form': 'handleSearchFormSubmit',
        'change #search-form select': 'onSearchFieldChange',
        'change #search-form input[type="text"]': 'onSearchFieldChange',
        'change #search-form input[type="hidden"]': 'onSearchFieldChange',
    },
    onMovieEvent: function(ev) {
        return false;
    },
    initialize: function(options) {
        this.options = options || {};
        this.collection = options.collection;
        this.context = {
            "genres": this.options.genres.toJSON()
        };
        this.options.genres.bind('all', this.setGenreDropDown, this);
        this.collection.bind('sync', this.renderResults, this);
        this.collection.state.bind('change', this.onChangeCollectionState, this);
        this.collection.state.bind('change:genres', this.onChangeGenre, this);
        this.collection.state.bind('change:durations', this.onChangeDuration, this);
        this.collection.state.bind('change:periods', this.onChangeYear, this);
        this.collection.state.bind('change:search', this.onChangeText, this);
        this.on("browser:pagination", this.onBrowserPaginationEvent, this);
        this.render();
        this.setGenreDropDown();
        this.renderResults();
    },
    render: function() {
        this.$el.html(ich.browserPageTemplate(this.context));
        
        /* Fix the rightmost category item  */ 
        this.$("#genres-tab div:last").addClass("no-right");

        Vifi.PageManager.redraw("#browserPage", true);
        return this;
    },

    setGenreDropDown: function(action) {
        $('#div_id_genres select').empty();
        if (this.options.genres.length > 0) {
            if (this.options.genres.length > 1) {
                $('#div_id_genres select').append(new Option('All Genres', ''));
            }
            _.each(this.options.genres.models, function(genre, key, list) {
                $('#div_id_genres select').append(new Option(genre.attributes.name, genre.id));
            });
            this.$('#id_genres option[value="' + this.collection.state.get('genres') + '"]').attr('selected', 'selected');
        }
    },
    redirectToBaseURL: function() {
        window.location = 'http://' + window.location.host + '/#search/' + this.collection.state.getHash();
    },
    onChangeDuration: function(model, duration) {
        //This is a state change event, not a dom event
        if (this.options.redirect_on_duration_change && duration != this.collection.initial_search.duration) {
            this.redirectToBaseURL();
        }
    },
    onChangePeriod: function(model, period) {
        //This is a state change event, not a dom event
        if (this.options.redirect_on_period_change && period != this.collection.initial_search.period) {
            this.redirectToBaseURL();
        }
    },
    onChangeGenre: function(model, genre) {
        // this function is a model state change, not the dom event: change
        // because of this we don't need the "event" arg.

        if (this.options.redirect_on_genre_change && genre != this.collection.initial_search.genre) {
            this.redirectToBaseURL();
        }
    },
    handleSearchFormSubmit: function(event) {
        event.preventDefault();
    },
    loadBrowserImages: function() {
        $("#search-results div.lazy").lazyload({
            threshold: 6000,
            effect: 'fadeIn',
            effectspeed: 600
        });
    },
    
    // Handle preloading imags on browser
    onBrowserPaginationEvent: function(e) {
        var images = $("#search-results div.lazy.loading:in-viewport");
        if (images.length > 0) app.browser.loadBrowserImages();
    },
    onSearchFieldChange: function(event) {
    
        var name = "q";
        var value = $("#q").val();
        var search_array = {
            genres: undefined,
            durations: undefined,
            periods: undefined
        };
        var search_dict = _.extend({}, search_array);
        search_dict[name] = value;
        $("#search-form select :selected").each(function() {
            var fieldid = $(this).parent().attr("id");
            var fieldname = fieldid.replace("id_", "");
            var val = $(this).val();

            search_dict[fieldname] = search_dict[fieldname] == undefined ? val : search_dict[fieldname] += ";" + val;
        });

        this.collection.state.set(search_dict);
    },
    renderResults: function(e) {
        if (this.rendering) return false;
        this.rendering = true;
        //$("#search-results > div.movie").addClass("loading");
        var appView = this;
        var filmresults = tv.ui.getComponentByElement(goog.dom.getElement("film-results"));
        if (undefined !== filmresults) {
            filmresults.removeChildren();
        }
        $("#search-results").empty();
        var fragment = document.createDocumentFragment();
        this.collection.each(function(model) {
            var filmView = new Vifi.Films.FilmView({
                model: model,
            });
            fragment.appendChild(filmView.el);
        });
        appView.$("#search-results").append(fragment);
        this.loadBrowserImages();
        this.updateUIToState();
        this.rendering = false;
    },
    updateUIToState: function() {
        var state = this.collection.state;
        var $this = this;
        // main search text box
        var query = state.get('q');
        $('#q').val(query);

        var options = ['genres', 'periods', 'durations'];
        $.each(options, function(idx, option) {
            var val = decodeURIComponent(state.get(option));
            if (val != "") {
                var parts = val.split(';');

                if (parts.length > 0 && parts != "undefined") {
                    $.each(parts, function(idx, item) {
                        $this.$('#id_' + option + ' option[value="' + item + '"]').attr('selected', 'selected');

                        $("#search-options-bar div[data-field='" + option + "'] div[data-value=" + item + "]").addClass("tv-toggle-button-on");

                    });
                    $("#search-options-bar div[data-field='" + option + "'] div[data-value=reset]").removeClass("tv-toggle-button-on");
                }
            }
        });


    },
    onChangeCollectionState: function(state) {
        var changed_keys = _.keys(state.changedAttributes());


        var genre_is_changed = _.contains(changed_keys, 'genres');
        if (this.options.redirect_on_genre_change && (genre_is_changed)) {
            return this.redirectToBaseURL();
        }
        //Update the url of the browser using the router navigate method
        router.navigate('search/' + this.collection.state.getHash());
    },
    //Set the search state from the url
    setSearchStateFromHash: function(searchStateHash) {
        //setFromHash will trigger a change event, which then
        //loads the records and reloads the table
        this.collection.state.setFromHash(searchStateHash);
    },
    clearSearch: function() {
        this.collection.state.set(this.collection.initial_search);
    }
});