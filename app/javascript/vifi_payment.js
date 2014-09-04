
Vifi.Payment = Backbone.Model.extend({
    film: false,
    session: false,
    productKey: '52e802db-553c-4ed2-95bc-44c10a38c199',

    initialize: function(options) {
        if (options && undefined != options.session) {
            this.setSession(options.session);
        }
        this.on('payment:creditpurchase', this.creditPurchase, this);

    },

    setSession: function(session) {
        this.session = session;
        return true;
    },

    paymentCallback: function(response) {

        if (undefined != response && response.success) {

            var profile = app.session.get("profile");
            if (profile.purchase(app.payment.film) == true) {
                $log("Billing process successfully ended");

                setTimeout(function() {  
                    app.purchasePage.hide();
                    app.player.trigger("player:load", app.payment.film.get("film").id);

                },1500);

            }
            //replace this line with the code that should run upon successful billing 
        } else {
            $log(response);

        }
        app.purchasePage.hide();

        app.pagemanager.enableNavigation();

    },

    exitPurchase: function() {

        app.pagemanager.enableNavigation();
        app.purchasePage.hide();
        Vifi.Event.trigger("page:change", "movie");


    },

    // Purchase with smartpay

    generatePurchaseInfo: function(film) {
        var film_id = film.get("film").id;
        var user_id = app.session.get("user_id");

        if (!film_id || film_id < 1) {
            throw ("Invalid film given for purchase");
        }
        if (!user_id || user_id < 1) {
            throw ("Invalid or missing user for purchase");
            return false;
        }

        var info = {
            'auth_id': app.session.get("hash"),
            'user_id': user_id,
            'film_id': film_id
        }
        return JSON.stringify(info);

    },
    purchase: function(film) {

        this.film = film;
        try {
            info = this.generatePurchaseInfo(film);
        } catch (e) {
            $log("Error while making purchase: " + e);
            return false;

        }

        var price = film.get("film").price;

        SmartpayGateway.init(this.productKey, app.payment.paymentCallback, info, 'EN', price, 'EUR');
        Vifi.Navigation.setReturnButton(this.exitPurchase, this);

        $("#smartpayContainer").css({
            "top": $("#moviePage").offset().top,
            "z-index": 999
        });
        $log("Disabling navigation");
        setTimeout(function() {
            app.pagemanager.disableNavigation();
        }, 800);


    },
    // Purchase with smartpay

    creditPurchase: function() {

        var price = "6.99";
        SmartpayGateway.init(this.productKey, app.payment.paymentCallback, "sessionId:" + app.session.get("sessionId"), 'EN', price, 'EUR');

        $("#smartpayContainer").css("top", $("#accountPage").offset().top);
        $log("Disabling navigation");
        setTimeout(function() {
            app.pagemanager.disableNavigation();
        }, 800);


    }

});
_.extend(Vifi.Payment, Backbone.Events);


Vifi.PurchaseView = Vifi.Views.DialogView.extend({
    el: $("#" + Vifi.Settings.purchasePageId),
    model: Vifi.Films.FilmModel,
    state: "enabled",
    events: {
        'click #purchase': 'purchase',
        'click #closePurchase': 'hide'

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
    onHide: function() {
        Vifi.Event.trigger("page:change", "movie");
        this.state = "enabled";
    },
    purchase: function() {
        if (this.state == "enabled")
        app.payment.purchase(this.model);
        this.state = "disabled";
    }

});