Vifi.Payment = Backbone.Model.extend({
    film: false,
    session: false,
    productKey: '52e802db-553c-4ed2-95bc-44c10a38c199',

    initialize: function(options) {
        if (options && undefined != options.session) {
            this.setSession(options.session);
        }
        this.on('payment:initialize', this.initializePayment, this);

    },

    setSession: function(session) {
        this.session = session;
        return true;
    },

    paymentCallback: function(response) {

        if (undefined != response && response.success) {
            app.pagemanager.enableNavigation();

            var profile = app.session.get("profile");
            if (profile.purchase(app.payment.film) == true) {
                $log("Billing process successfully ended");
                app.player.trigger("player:load", app.payment.film.get("film").id);
                app.purchasePage.hide();
            }
            //replace this line with the code that should run upon successful billing 
        } else {
            $log(response);

        }
    },
    // Purchase with smartpay

    purchase: function(film) {

        this.film = film;
        var price = film.get("film").price;
        SmartpayGateway.init(this.productKey, app.payment.paymentCallback, "sessionId:" + app.session.get("sessionId"), 'EN', price, 'EUR');

        $("#smartpayContainer").css("top", $("#moviePage").offset().top);
        $log("Disabling navigation");
        setTimeout(function() {
            app.pagemanager.disableNavigation();
        }, 800);


    }
});
_.extend(Vifi.Payment, Backbone.Events);


Vifi.PurchaseView = Vifi.User.ActivationView.extend({
    el: $("#" + Vifi.Settings.purchasePageId),
    model: Vifi.Films.FilmModel,
    events: {
        'click a': 'purchase'
    },

    initialize: function() {
        this.template = _.template($("#purchaseTemplate").html());
        Vifi.Event.on('purchase:show', this.show, this);

    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        Vifi.Event.trigger("page:ready", "#" + this.$el.attr("id"));
        Vifi.PageManager.redraw("#purchasePage", true);

        return this;
    },
    show: function() {
        $(".container:visible").addClass("hidden-container").fadeOut();
        this.$el.find("#hideActivation").addClass("tv-component");
        $(".hidden-container .tv-component").removeClass("tv-component").addClass("tv-component-hidden");
        this.$el.fadeIn().show();

        Vifi.Event.trigger("page:change", "purchase");
    },
    hide: function() {
        if (this.$el.hasClass("active")) {
            $(".hidden-container .tv-component-hidden").addClass("tv-component").removeClass("tv-component-hidden");
            $(".hidden-container").removeClass("hidden-container").fadeIn();
            this.$el.fadeOut().hide();
            Vifi.Event.trigger("page:change", "movie");
        }
    },
    purchase: function() {

        this.hide();
        app.payment.purchase(this.model);

    }

});