$(function() {

    var AppView = Vifi.Films.BaseAppView.extend({

        initialize: function(options) {
            this.options = options || {};
            this.pagemanager = this.options.pagemanager;
            this.page = this.options.page;
            this.genres = this.options.genres;
            this.queue = this.options.queue;
            this.api = this.options.api;
            this.account = this.options.account;
            this.session = this.options.session;
            this.logger = this.options.logger;
            this.player = new Vifi.Player.Player({
                session: this.session
            });
            this.options.subgenres.bind('all', this.setSubGenreDropDown, this);
            this.options.genres.bind('all', this.setGenreDropDown, this);
            this.collection.bind('sync', this.renderResults, this);
            this.collection.state.bind('change', this.onChangeCollectionState, this);
            this.collection.state.bind('change:genre', this.onChangeGenre, this);
            this.collection.state.bind('change:duration', this.onChangeDuration, this);
            this.collection.state.bind('change:year', this.onChangeYear, this);
            this.collection.state.bind('change:search', this.onChangeText, this);

            this.session.enable();

        },
        initializeUI: function() {
            //app and router now exist in the scope
            this.options.subgenres.update();
            this.setGenreDropDown();



            var view = this;

            // Add featured list to the front page
            // 
            var featuredCollection = this.collection.featured();

            var featuredview = new Vifi.Films.FeaturedFilmCollectionView(featuredCollection);
            // make sure that the original checkboxes are checked if necessary.
            // TODO: seems like this is not quite right... be nicer if django would handle this
            // with the form upload.

            if (this.collection.state.get('family') == 1) {
                this.$('#id_intended_audience_1').attr('checked', true);
            }
            if (this.collection.state.get('teen') == 1) {
                this.$('#id_intended_audience_2').attr('checked', true);
            }
            if (this.collection.state.get('plus17') == 1) {
                this.$('#id_intended_audience_3').attr('checked', true);
            }

            /* Set the values for the slider */
            var end_time = this.collection.state.get('end_time')
            var start_time = this.collection.state.get('start_time')
            // this.$('#id_end_time').val(end_time);
            // this.$('#id_start_time').val(start_time);
            this.$('#noUi-slider-mins .lower-mins').text(start_time);
            this.$('#noUi-slider-mins .upper-mins').text(end_time);

            $("#application").waitForImages(function() {


                $("#loadingPage").fadeOut();
                $(this).css("opacity", 1).fadeIn("slow");
            });
            Vifi.Event.trigger("app:ready");

        },
        events: {
            'submit #search-form': 'handleSearchFormSubmit',
            'change #search-form select': 'onSearchFieldChange',
            'change #search-form input[type="text"]': 'onSearchFieldChange',
            'change #search-form input[type="hidden"]': 'onSearchFieldChange',
            'change #div_id_intended_audience input[type="checkbox"]': 'onAudienceCheckboxFieldChange',
            'change #div_id_hide_coming_soon input[type="checkbox"]': 'onHideComingSoonChange',
            'change #div_id_hide_web_series input[type="checkbox"]': 'onHideWebSeriesChange',
            'click .next_page': 'onClickNextPage',
            'click .previous_page': 'onClickPreviousPage',
            'click .page-number-link': 'onClickPage',
            'click .sort-options a': 'onClickSort',
            'click #toggle-grid': 'onClickToggleGrid',
            'click #toggle-list': 'onClickToggleList'

        },

        onClickToggleGrid: function(event) {
            this.collection.state.set('list_style', 'grid');
        },

        onHideComingSoonChange: function(event) {
            var value = event.target.checked ? 1 : 0;
            this.collection.state.set({
                'hide_coming_soon': value
            });
        },

        onClickToggleList: function(event) {
            this.collection.state.set('list_style', 'list');
        },

        onHideWebSeriesChange: function(event) {
            var value = event.target.checked ? 1 : 0;
            this.collection.state.set({
                'hide_web_series': value
            });
        },
        setGenreDropDown: function(action, subgenres_obj) {

            $('#div_id_genre select').empty();

            if (this.options.genres.length > 0) {


                if (this.options.genres.length > 1) {
                    $('#div_id_genre select').append(new Option('All Genres', ''));
                }
                _.each(this.options.genres.models, function(genre, key, list) {
                    $('#div_id_genre select').append(new Option(genre.attributes.name, genre.id));
                });
                $('#div_id_genre').show();
                this.$('#id_genre option[value="' + this.collection.state.get('genre') + '"]').attr('selected', 'selected');
            } else {

                $('#div_id_genre').show();
            }

        },
        setSubGenreDropDown: function(action, subgenres_obj) {
            $('#div_id_subgenre select').empty();

            if (this.options.page_type != 'channel') {
                if (this.options.subgenres.length > 0) {
                    if (this.options.subgenres.length > 1) {
                        $('#div_id_subgenre select').append(new Option('Any Sub-Genre', ''));
                    }
                    _.each(this.options.subgenres.models, function(subgenre, key, list) {
                        $('#div_id_subgenre select').append(new Option(subgenre.attributes.name, subgenre.id));
                    });
                    $('#div_id_subgenre').show();
                    this.$('#id_subgenre option[value="' + state.get('subgenre') + '"]').attr('selected', 'selected');
                } else {
                    $('#div_id_subgenre select').append(new Option('No Sub Genres', ''));
                    $('#div_id_subgenre').show();
                }
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
        onChangeSubGenre: function(model, subgenre) {
            //This is a state change event, not a dom event
            if (this.options.redirect_on_genre_change && subgenre != this.collection.initial_search.subgenre) {
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
        onClickSort: function(event) {
            event.preventDefault();

            var node = event.target;
            var id = node.id;
            while (!id) {
                node = node.parentNode;
                id = node.id;
            }

            var new_order_by = id.replace('order_by_', '');

            var current_order_by = this.collection.state.get('order_by');
            if (current_order_by && (current_order_by.indexOf(new_order_by) != -1) && current_order_by.substring(0, 1) != '-') {
                new_order_by = '-' + new_order_by;
            }

            var reverseOrderSortButtons = ['starrating', 'release_date', 'view_count'];

            _.each(reverseOrderSortButtons, function(sort_button_title) {
                if (current_order_by && new_order_by == sort_button_title && (current_order_by.indexOf(sort_button_title) == -1)) {
                    new_order_by = "-" + sort_button_title;
                }
            });

            this.collection.state.set({
                'order_by': new_order_by,
                'page': 1
            });
        },
        onClickPage: function(event) {
            event.preventDefault();
            var page = event.target.innerHTML;
            if (page == '...') return;
            this.collection.state.set({
                'page': page
            });
        },
        onClickNextPage: function(event) {

            if (this.collection.pagination.has_next) {
                var page = this.collection.pagination.next_page_number;
                this.collection.state.set({
                    'page': page
                });
            }
        },
        onClickPreviousPage: function(event) {
            event.preventDefault();
            if (this.collection.pagination.has_previous) {
                var page = this.collection.pagination.previous_page_number;
                this.collection.state.set({
                    'page': page
                });
            }
        },
        onSearchFieldChange: function(event) {


            var name = "q";
            var value = $("#q").val();
            var search_array = {
                genre: [],
                duration: [],
                period: []
            }
            var search_dict = {}

            search_dict[name] = value;
            search_dict['page'] = 1;

            $("#search-form select :selected").each(function() {
                var fieldid = $(this).parent().attr("id");
                var fieldname = fieldid.replace("id_", "");
                var val = $(this).val();


                search_dict[fieldname] = search_dict[fieldname] == undefined ? val : search_dict[fieldname] += ";" + val;

            });
            this.collection.state.set(search_dict);
        },
        onAudienceCheckboxFieldChange: function(event) {
            var id = event.target.id;
            var value = event.target.checked ? 1 : 0;
            var search_dict = {};

            switch (id) {
                case 'id_intended_audience_1':
                    search_dict['family'] = value
                    break;

                case 'id_intended_audience_2':
                    search_dict['teen'] = value
                    break;

                case 'id_intended_audience_3':
                    search_dict['plus17'] = value
                    break;
            }
            search_dict['page'] = 1;
            this.collection.state.set(search_dict);
        },

        renderResults: function(e) {
            if (this.rendering) return false;
            this.rendering = true;
            this.$('#loading').show();
            $("#search-results > div.movie").addClass("loading");

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
                    user_is_authenticated: appView.options.user_is_authenticated,
                    queue: appView.options.queue
                });

                fragment.appendChild(filmView.el);

            });

            appView.$("#search-results").html(fragment);

            if (this.collection.pagination != undefined) {
                // changing the "showing xx - yy of zzzz films"
                this.$('#pagination_start_index').html(this.collection.pagination.page_start_index);
                this.$('#pagination_end_index').html(this.collection.pagination.page_end_index);
                var pagination_count = 'many';
                if (this.collection.pagination.count < 500) {
                    pagination_count = this.collection.pagination.count;
                }
                this.$('#pagination_count').html(pagination_count);

                if (this.collection.pagination.has_previous) {
                    $('.previous_page').addClass('active');
                } else {
                    $('.previous_page').removeClass('active');
                }

                if (this.collection.pagination.has_next) {
                    $('.next_page').addClass('active');
                } else {
                    $('.next_page').removeClass('active');
                }
            }
            $("#search-results div.lazy").lazyload({
                threshold: 12000,
                effect: 'fadeIn'
            });



            this.updateUIToState();
            this.$('#loading').hide();
            this.rendering = false;
        },
        updateUIToState: function() {
            var state = this.collection.state;
            // set intended audience checkboxes


            if (this.collection.state.get('list_style') == 'grid') {
                $('#movie-grid').addClass("grid-view").removeClass("list-view");
                $('.toggle-g').addClass("active");
                $('.toggle-l').removeClass("active");
            } else {
                $('#movie-grid').addClass("list-view").removeClass("grid-view");
                $('.toggle-l').addClass("active");
                $('.toggle-g').removeClass("ˇve");
            }


            if (this.collection.state.get('family') == 1) {
                this.$('#id_intended_audience_1').attr('checked', true);
            } else {
                this.$('#id_intended_audience_1').attr('checked', false);
            }

            if (this.collection.state.get('teen') == 1) {
                this.$('#id_intended_audience_2').attr('checked', true);
            } else {
                this.$('#id_intended_audience_2').attr('checked', false);
            }

            if (this.collection.state.get('plus17') == 1) {
                this.$('#id_intended_audience_3').attr('checked', true);
            } else {
                this.$('#id_intended_audience_3').attr('checked', false);
            }

            if (this.collection.state.get('hide_web_series') == 1) {
                this.$('#id_hide_web_series').attr('checked', true);
            } else {
                this.$('#id_hide_web_series').attr('checked', false);
            }

            if (this.collection.state.get('hide_coming_soon') == 1) {
                this.$('#id_hide_coming_soon').attr('checked', true);
            } else {
                this.$('#id_hide_coming_soon').attr('checked', false);
            }

            // selects
            this.$('#id_genre option[value="' + state.get('genre') + '"]').attr('selected', 'selected');
            this.$('#id_subgenre option[value="' + state.get('subgenre') + '"]').attr('selected', 'selected');
            this.$('#id_period option[value="' + state.get('period') + '"]').attr('selected', 'selected');
            this.$('#id_duration option[value="' + state.get('duration') + '"]').attr('selected', 'selected');


            // year
            this.$('#id_period').val(state.get('period'));

            // sorting buttons
            this.$('.sort-options a.active').removeClass('active').removeClass('sort-dir-asc').removeClass('sort-dir-desc');
            if (state.get('order_by') == undefined) var sort_button = '#order_by_id';
            else {

                var sort_button = '#order_by_' + state.get('order_by').replace('-', '');
                if (state.get('order_by').indexOf('-') == 0) {
                    var sort_dir_class = 'sort-dir-desc';
                } else {
                    var sort_dir_class = 'sort-dir-asc';
                }
            }
            this.$(sort_button).addClass('active').addClass(sort_dir_class);

            /* Set the values for the slider */


            var end_time = this.collection.state.get('end_time');
            var start_time = this.collection.state.get('start_time');


            this.$('#id_end_time').val(end_time);
            this.$('#id_start_time').val(start_time);
            this.$('#noUi-slider-mins .lower-mins').text(start_time);
            this.$('#noUi-slider-mins .upper-mins').text(end_time);

            // main search text box
            var query = this.collection.state.get('q');
            $('#q').val(query);


        },
        onChangeCollectionState: function(state) {

            var changed_keys = _.keys(state.changedAttributes());
            var genre_is_changed = _.contains(changed_keys, 'genre');
            var subgenre_is_changed = _.contains(changed_keys, 'subgenre');

            if (this.options.redirect_on_genre_change && (genre_is_changed || subgenre_is_changed)) {
                return this.redirectToBaseURL();

            } else if (genre_is_changed) {
                this.options.subgenres.update();
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
            this.collection.state.set(app.collection.initial_search);
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
            app.setSearchStateFromHash(unescape(searchStateHash));
            app.collection.update();

        },
        showFilm: function(id) {

            Vifi.Event.trigger('film:show', id);


        },

        clearSearch: function() {
            app.clearSearch();
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

        *   When the DOM changes, we change app.collection.state.

        *   app.collection is bound to state changes.

        *   When state changes, app.collection is updated to match the state and loaded.

        *   UI is updated upon server response since the app.render method is bound to the collection reset event via "all".

        ***************************/

    function initApp(initial_search_json) {




        var models = initial_search_json.results;
        var pagination = initial_search_json.pagination;
        var activationCode = initial_search_json.activationCode;
        var user_is_authenticated = initial_search_json.user_is_authenticated;
        var search = initial_search_json.search;
        var genredata = initial_search_json.genres;
        var api = new Vifi.Utils.Api();



        // check for hash and set state accordingly
        if (window.location.hash.indexOf('#search') != -1) {
            // start with empty state because Router will configure it later.
            var state = new Vifi.Utils.State();
            //var hash = window.location.hash.replace('#search/', '');
            //state.setFromHash(hash);
        } else {
            // set the state to avoid an additional call to the server as we have
            // data to bootstrap the app. 
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

        var subgenres = new Vifi.Films.SubGenreCollection();
        var genres = new Vifi.Films.GenreCollection(genredata);
        var queue = new Vifi.Films.QueueCollection(initial_search_json.queue);
        var page = new Vifi.Browser.Page;
        var pagemanager = Vifi.PageManager;

        var profile = new Vifi.User.Profile();

        var session = new Vifi.User.Session({
            profile: profile,
            activationCode: activationCode,

        });




        var accountPage = new Vifi.User.ProfileView({
            model: profile
        });
        var activationPage = new Vifi.User.ActivationView({
            model: session
        });
        var alertPage = new Vifi.User.AlertView({
            model: session
        });
        var toolbar = new Vifi.User.ToolbarView({
            model: profile
        });

        Vifi.Platforms.init();

        var logger = Vifi.Utils.Logger;
        window.app = new AppView({
            el: $('#application'),
            collection: collection,
            featured: collection.featured(),
            page: page,
            profile: profile,
            session: session,
            toolbar: toolbar,
            logger: logger,
            pagemanager: pagemanager,
            genres: genres,
            subgenres: subgenres,
            user_is_authenticated: user_is_authenticated,
            queue: queue,
            api: api,
            redirect_on_genre_change: initial_search_json.redirect_on_genre_change,
            redirect_on_duration_change: initial_search_json.redirect_on_duration_change,
            redirect_on_period_change: initial_search_json.redirect_on_period_change,
            page_type: initial_search_json.page_type
        });



        Vifi.Engine.start(Vifi.Settings);


        // make the app globally available.
        window.app = app;

        //Create an instance of our router
        window.router = new Router();

        //This will search routes from the router and serve them
        window.history = Backbone.history.start();

        app.initializeUI();
        // if there's no hash, let's render the results
        // ( if there's a hash , the router will take care of this when it sets state from hash)
        if (window.location.hash.indexOf('#search') == -1) {
            app.renderResults();
        }


    }

    $(window).load(function() {
        if (initial_search_json == "")  {
            $.getJSON("http://backend.vifi.ee/api/?api_key=12345&jsoncallback=?",
                initApp, "jsonp");
        } else {

            initApp(initial_search_json);
        }
    });
});