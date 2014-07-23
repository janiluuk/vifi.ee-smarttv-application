Vifi.Films.FilmCollection = Backbone.Collection.extend({
    model: Vifi.Films.FilmModel,
    initial_search: true,
    url: '',
    baseUrl: Vifi.Settings.api_url + 'search/',
    initialize: function(models, options) {
        this.state = options.state;
        this.initial_search = options.search;

        // Whenever the state is changed, 
        // update the collection records
        // to match the state
        this.state.bind('change', this.update, this);

        if (options.pagination) {
            this.pagination = options.pagination;
        }
    },
    update: function() {
        //'&callback=?' is for jsonp cross domain  // deleted for now.
        // TODO: add back in the callback=?  but then we'll need to generate it in django.
        this.url = this.baseUrl + this.state.getQueryString() + '&api_key=' + Vifi.Settings.api_key + '&jsoncallback=?';
        this.fetch();


    },
    featured: function() {
        var items = this.filter(function(data) {
            return data.get("film").featured == 1
        });
        return new Vifi.Films.FeaturedFilmCollection(items);
    },

    parse: function(response) {
        this.pagination = response.pagination
        return response.results;
    }
});



Vifi.Films.FilmCollectionView = Backbone.View.extend({
    page: 1,
    totalPages: 1,
    paginationTemplate: '                                                          \
        <div class="pagination">                                                        \
            <div class="collection-page-info"></div>                                    \
            <div class="page-arrows">                                                   \
                <a class="previous_page"><img src="/media/img2/pagi-left.png" /></a>    \
                <a class="next_page"><img src="/media/img2/pagi-right.png" /></a>       \
            </div>                                                                      \
        </div>',
    initialize: function(options) {

        this.options = options;
        this.render();
    },
    render: function() {

        var view = this;
        if (this.options.carousel) {
            this.$el.addClass('film-collection-carousel');
            this.$el.append(this.paginationTemplate);
            this.$('.previous_page').click(function() {
                view.previousPage()
            });
            this.$('.next_page').click(function() {
                view.nextPage()
            });
        }


        this.$el.append('<div class="clip"></div>');
        this.$filmCollectionHolder = this.$('.clip');
        this.renderFilmViews();
        return this;
    },
    getTotalPages: function() {
        return Math.ceil(this.collection.length / this.options.carouselShowFilms) || 1;
    },
    renderFilmViews: function() {

        if (this.options.carousel) {

            if (this.page > this.getTotalPages()) this.page = this.getTotalPages();
            var start = (this.page - 1) * this.options.carouselShowFilms;
            var stop = this.page * this.options.carouselShowFilms;
            if (stop > this.collection.length) stop = this.collection.length;

            if (this.page < this.getTotalPages()) {
                this.$('.next_page').addClass('active');
            } else {
                this.$('.next_page').removeClass('active');
            }

            if (this.page > 1) {
                this.$('.previous_page').addClass('active');
            } else {
                this.$('.previous_page').removeClass('active');
            }

            if (this.getTotalPages() > 1) {
                if ((1 + start) == stop) {
                    var showString = '#' + stop;
                } else {
                    var showString = (1 + start) + ' to ' + stop;
                }
                this.$('.collection-page-info').html('Showing ' + showString + ' of ' + this.collection.length + ' Films');
                this.$('.page-arrows').show();
            } else {
                this.$('.collection-page-info').html('');
                this.$('.page-arrows').hide();
            }

        } else {
            var start = 0;
            var stop = 300;
        }
        var count = 0;



        this.$filmCollectionHolder.html('');

        this.collection.each(function(model) {

            if ((count >= start && count < stop)) {
                this.addChildView(model);

            }

            count++;
        }, this);




    },
    addChildView: function(model) {
        var filmView = new Vifi.Films.FilmView({
            model: model,
            user_is_authenticated: true,
            queue: this.options.queue
        });
        this.$filmCollectionHolder.append(filmView.el);
    },
    previousPage: function() {
        if (this.page > 1) {
            this.page--;
            this.renderFilmViews();
        }
    },
    nextPage: function() {
        if (this.page < this.getTotalPages()) {
            this.page++;
            this.renderFilmViews();
        }
    },
    addAndShowFirstPage: function() {
        this.page = 1;
        this.renderFilmViews();

    },
    addAndShowLastPage: function() {
        if (this.page < this.getTotalPages()) {
            this.page = this.getTotalPages();
        }
        this.renderFilmViews();
    }
});

Vifi.Films.QueueModel = Backbone.Model.extend({
    /* For the moment sync is handled externally 
              although it could be moved to tasty pie and handled here*/
    sync: function() {
        return false;
    },
});

Vifi.Films.QueueCollection = Backbone.Collection.extend({
    model: Vifi.Films.QueueModel,
    url: '/api/tv/queue/?format=json',
    initialize: function(models, options) {

    },
    parse: function(response) {
        return response.objects;
    }
});

$(document).ready(function() {

    /* If there is no window.app already defined then we make a basic one here 
       This javascript file should be included at the end of the page to 
       make sure this is the last onload function that gets registered with jQuery
    */

    var user_queue_collection;
    var MAX_CARDS_PER_ROW = 10;

    var updateQueueNotice = function() {

        $(".myMovies").find("span").html(window.app.options.queue.length);
    }

    /*
    $.get('http://backend.vifi.ee/api/session', function(data) {

        
        data = $.parseJSON(data);


        if (!window.app) {

            var queue_collection = new Vifi.Films.QueueCollection(data.queue_id_list);
            var app = new Vifi.Films.BaseAppView({
                queue: queue_collection
            });
            window.app = app;
        }

        // Since the film collections are able to filter on the application state, we create a fake state here to satisfy that need. 
        var state = new Vifi.Utils.State();
        user_queue_collection = new Vifi.Films.FilmCollection(data.queue_detailed_list, {
            state: state
        });

        //Trick to make sure the films are added to the left of the queue
        user_queue_collection.comparator = function(model) {
            if (model.get("timeAdded")) {
                return (-1 * model.get("timeAdded"));
            } else {
                return 0;
            }
        };

        var user_queue_view = new Vifi.Films.FilmCollectionView({
            el: '#queue-container',
            queue: {},
            collection: user_queue_collection,
            carousel: true,
            carouselShowFilms: MAX_CARDS_PER_ROW
        });

        window.app.bind('filmRemovedFromQueue', function(model) {
            user_queue_collection.each(function(cModel) {
                if (cModel.get('film').id == model.get('film').id) {
                    setTimeout(function() {
                        user_queue_collection.remove(cModel);

                        if ($("#cp").hasClass("queueOpen")) {
                            var tile = 0;
                            setInterval(function() {
                                $("#cp .cards figure:eq(" + tile + ")").toggleClass("visible");
                                tile++;
                            }, 100);
                        }


                    }, 500);
                }
            });
        });



        window.app.bind('filmAddedToQueue', function(model) {
            setTimeout(function() {
                model.set('timeAdded', new Date().getTime());
                user_queue_collection.add(model);

                if ($("#cp").hasClass("queueOpen")) {
                    var tile = 0;
                    setInterval(function() {
                        $("#cp .cards figure:eq(" + tile + ")").toggleClass("visible");
                        tile++;
                    }, 100);
                }


            }, 500);
        });

        //this makes sense here if you think of it as "this context"
        user_queue_collection.bind('all', updateQueueNotice, this);


        $(document).ajaxSend(function(event, xhr, settings) {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            function sameOrigin(url) {
                // url could be relative or scheme relative or absolute
                var host = document.location.host; // host + port
                var protocol = document.location.protocol;
                var sr_origin = '//' + host;
                var origin = protocol + sr_origin;
                // Allow absolute or scheme relative URLs to same origin
                return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                    (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                // or any other URL that isn't scheme relative or absolute i.e relative.
                !(/^(\/\/|http:|https:)..test(url));
            }

            function safeMethod(method) {
                return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
            }
            if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        });

        updateQueueNotice();
    });
    */
});