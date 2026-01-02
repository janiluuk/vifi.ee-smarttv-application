/**
 * User Module
 * Handles user authentication, profile management, and session handling
 * 
 * @file vifi_user.js
 * @author Jani Luukkanen <janiluuk@gmail.com>
 * 
 * @namespace Vifi.User
 * @description
 * This module manages:
 * - User authentication and login
 * - User profile data and settings
 * - Session management
 * - User preferences and favorites
 * - Purchase history and tickets
 */

/**
 * User Profile Model
 * Represents user profile data and settings
 * @class Vifi.User.Profile
 * @extends Vifi.Utils.ApiModel
 */
Vifi.User.Profile = Vifi.Utils.ApiModel.extend({
    path: 'profile',
    params: "",
    defaults: {
        "id": '',
        "user_id": '',
        "lastname": '',
        "firstname": '',
        "notificationText": '',
        "email": 'Kasutaja',
        "city": '',
        "balance": "",
        "tickets": [],
        "paired_user": false,
        "purchase_history": [],
        "favorites": '',
        "messages": 0,
        "subscription": "0",
        "active_sessions": []
    },

    initialize: function() {
        this.on("change:tickets", this.updateUserCollection);

        Vifi.Event.on("user:logout", this.signout, this);
        this.on("user:logout", function() {
            Vifi.Event.trigger("user:logout");
        });
    },

    updateUserCollection: function() {
        var tickets = this.get("tickets");
        app.usercollection.reset(tickets);

        _.each(app.usercollection.models, function(model) {
            var id = model.get("id");
            var film = app.collection.get(id);
            var validto = model.get("validto");

            if (film && validto) {
                var date = Vifi.Engine.util.stringToDate(validto);
                var validtotext = Vifi.Engine.util.dateToHumanreadable(date);
                model.set("validtotext", validtotext);
                film.set("ticket", model.toJSON());
            }
        });

    },
    signout: function() {
        this.set("id", "");
        this.set("notificationText", "");
        this.set("user_id", "");
        this.set("balance", 0);
        this.set("paired_user", false);
        this.set("email", "Kasutaja");
        this.set("tickets", "");
        
    },


    purchase: function(movie) {
        this.fetch();

        return true;
    },
    hasMovie: function(movie) {
        var id = movie.get("film").id;
        var movies = app.usercollection.where({
            id: id
        });
        if (movies.length > 0) return true;
        return false;
    },
    isRegisteredUser: function() {

        if (this.get("user_id") != "" && this.get("paired_user") === true) {
            return true;
        }
        return false;
    },

});
Vifi.User.Session = Backbone.Model.extend({
    model: false,
    deviceInfo: {},
    url: '',
    path: '',
    url: function() {
        return Vifi.Settings.api_url + 'session/' + this.path + '?jsoncallback=?&deviceInfo='+JSON.stringify(this.deviceInfo);
    },
 
    defaults: function() {
        return {
            user_id: '',
            hash: '',
            sessionId: '',
            step1text: 'Mine www.vifi.ee lehele, registreeri või logi sisse oma kontoga. Võid kasutada oma facebook kontot või teha uue kasutaja',
            step2text: 'Sisesta "CODE" väljale kus küsitakse aktiveerimiskoodi',
            activationCode: '',
            logged_in: false,
            enabled: false
        }
    },
 
    initialize: function(options) {
        var code = this.get("step2text").replace("CODE", this.get("activationCode"));
        this.set("step2text", code);
        this.deviceInfo = options.deviceInfo || {};

        this.profile = new Vifi.User.Profile();
        this.set("profile", this.profile);

        Vifi.Event.on('poll:enable', this.enable, this);
        Vifi.Event.on('poll:disable', this.disable, this);
        Vifi.Event.on('activation:show', this.logout, this);
        Vifi.Event.on('user:login', this.onUserAuthenticate, this);
        Vifi.Event.once('guest:login', this.disable, this);

        Vifi.Event.on('user:logout', this.onUserSignout, this);
        this.on('change:sessionId', this.setCookie, this);
        this.on("change:activationCode", function() { this.set("step2text", 'Sisesta '+this.get("activationCode")+' väljale kus küsitakse aktiveerimiskoodi');}.bind(this));

        _.bindAll(this, 'send', 'logout', 'authorize', 'fetch', "setCookie", "onUserSignout");
        if (!this.isLoggedIn()) {
            this.enable();
        }
        this.render();
    },
    getParams: function() {
        var options = {}
        var params = {
            dataType: 'jsonp',
            data: {
                api_key: Vifi.Settings.api_key,
                authId: this.get("hash"),
                sessionId: this.get("sessionId")
            }
        };
        options.data = JSON.parse(JSON.stringify(params.data));
        options.dataType = params.dataType;
        return options;
    },
    enable: function() {

        if (!this.isLoggedIn() && !this.isEnabled()) {

            this.set("enabled", true);
            this.send();
        }
    },
    disable: function() {
        this.set("enabled", false);
    },
    logout: function() { 
        var options = this.getParams();
        $.getJSON(this.url()+"&unpair=1", options.data).done(function(data) {

            if (data.activationCode) {
                
                this.path = "";
                this.set("activationCode",data.activationCode);
                this.set("logged_in", false);
                this.set("sessionId", "");
                this.set("hash", "");


            }
        }.bind(this));

    },
    onUserSignout: function() {
        this.set('logged_in', false);
        this.logout();
        this.forgetSmartpay();
        this.disable();
        return false;
    },
    onUserAuthenticate: function() {
        this.set("logged_in", true);
        this.disable();
    },
    fetch: function() {
        if (!this.isEnabled()) return;

        if (!this.isLoggedIn()) this.path = this.get("activationCode");
        else this.path = '';

        var options = this.getParams();
        $.getJSON(this.url(), options.data).done(function(data) {

            if (this.isLoggedIn() === false) {

                if (undefined !== data.cookie) {
                    this.set("status", "pending");
                    this.set("sessionId", data.cookie);
                    this.set("user_id", data.user_id);
                    this.set("hash", data.activationKey);
                    this.authorize();
                }
            } else {
                this.disable();
            }
        }.bind(this), "jsonp");
    },
    setCookie: function(cookie) {
        if (cookie != "" && cookie) {
            $.cookie("vifi_tvsession", cookie, {});
        }
        return this;
    },
    clearCookie: function() { 
        $.cookie("vifi_tvsession", "", {});
      
    },
    forgetSmartpay: function() {
    	SmartpayGateway.resetPinCode();
    },
    getCookie: function() {
        var sessionId = $.cookie("vifi_tvsession");
        return sessionId;
    },
    authorize: function() {
        if (!this.isEnabled()) return false;
        var sessionId = this.get("sessionId");
        var hash = this.get("hash");
        var user_id = this.get("user_id");
        if (!this.isLoggedIn() && sessionId !== "" && hash !== "" && user_id != "" && hash != null) {
            var profile = this.get("profile");
            profile.set("user_id", user_id);
            profile.set("session", this);
            profile.fetch();
            if (profile.get("user_id") != "") {
                this.set("profile", profile);
                if (profile.get("paired_user") != false) {  
                    $log("Logging in with user " + profile.get("email"));
                    Vifi.Event.trigger("user:login");
                } else {
                    Vifi.Event.trigger("guest:login");
                }

            }
        }
        return false;
    },
    updateProfile: function() {
        if (!this.isLoggedIn()) return false;
        var profile = this.get("profile");
        profile.fetch();
        this.trigger();
    },

    send: function() {
        if (!this.isLoggedIn() && this.isEnabled()) {
            this.fetch();
            setTimeout(function() {
                this.send();
            }.bind(this), 3000);
        } else {
            $log("Disabling polling, logged in or disabled");

            this.disable();
        }
    },
    isEnabled: function() {
        return this.get("enabled");
    },
    isLoggedIn: function() {

        if (this.isRegisteredUser() && this.get("logged_in") === true) { 
            return true;
        } 
        return false;
    },
    isRegisteredUser: function() {
        var profile = this.get("profile");

        if (profile.get("user_id") != "" && profile.get("email") != "Kasutaja" ) {
            return true;
        }
        return false;
    },

    render: function() {
        return this;
    }
});



Vifi.User.ProfileView = Backbone.View.extend({
    tagName: 'div',
    defaults: {},
    events: {
        "click #pairButton": "showPairScreen",
        "click #reloadButton": 'showAlertScreen'
    },
    el: $("#" + Vifi.Settings.accountpageId),
    initialize: function() {
        this.model.on('user:logout', this.toggleSignedIn, this);
        this.model.on('change:balance', this.renderBalance, this);
        this.model.on('change:email', this.toggleSignedIn, this);
        this.listenTo(this.model, "change", this.renderBalance, this);
        
        this.template = _.template($("#accountTemplate").html());
        this.render();
        
    },
    renderBalance: function() {
        var text = "";
        var balance = this.model.get('balance');
        if (balance == "" || balance < 1) balance = "0";
        if (!this.model.isRegisteredUser()) text = "Ühenda oma kontoga";
        else text = "Konto seis: " + balance + "€";
        $('#account_status', this.$el).html(text);

        return this;
    },
    renderEmail: function() {
        if (this.model.isRegisteredUser())
            $('#account_username', this.$el).html(this.model.get('email'));
        else
            $('#account_username', this.$el).html("Kasutaja");
        
        return this;
    },
    showPairScreen: function() {

        if (!this.model.isRegisteredUser()) Vifi.Event.trigger("activation:show");
        else this.model.trigger("user:logout");
    },
    showAlertScreen: function() {
    	Vifi.Event.trigger("alert:show");
    },
    showPaymentScreen: function() {

        app.payment.trigger("payment:creditpurchase");

    },
    toggleSignedIn: function() {

        if (this.model.isRegisteredUser()) {
            this.$("#pair").html("Logi välja").addClass("signout").removeClass("signin");
        } else {
            this.$("#pair").html("Logi sisse").addClass("signin").removeClass("signout");
        }
        this.renderEmail();
        this.renderBalance();

    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        Vifi.PageManager.redraw("#accountPage", true);

        return this;
    }
});
Vifi.User.ToolbarView = Backbone.View.extend({
    el: $("#" + Vifi.Settings.toolbarId),

    tagName: 'div',
    initialize: function() {
        this.template = _.template($("#toolbarTemplate").html());
        this.notificationTemplate = _.template($("#notificationTemplate").html());
        this.listenTo(this.model, 'change:email', this.slideRender);
        this.render();

    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        var notification = this.model.get("notificationText");
        if (notification != "") {
            var notificationHtml = this.notificationTemplate(this.model.toJSON());
            this.$("#account-notification").html(notificationHtml);
        }
        return this;
    },
    slideRender: function() {
        this.$("#username-text").fadeOut("slow");
        this.render();
        this.$("#username-text").fadeIn("slow");
    }
});
Vifi.User.ActivationView = Vifi.Views.DialogView.extend({
    el: $("#" + Vifi.Settings.activationPageId),
    events: {
        'click a': 'hide'
    },
    tagName: 'div',
    initialize: function() {
        this.template = _.template($("#activationTemplate").html());
        Vifi.Event.on('activation:show', this.show, this);
        this.model.on('change:activationCode', this.renderCode, this);
        _.bindAll(this, 'hide');
        Vifi.Event.on('user:login', this.hide, this);
        this.render();
    },
    renderCode: function() {
        $('#activation-code', this.$el).html(this.model.get('activationCode'));
        return this;
    },
    onShow: function() {
        Vifi.Event.trigger("poll:enable");
    },
});

Vifi.User.AlertView = Vifi.Views.DialogView.extend({
    el: $("#" + Vifi.Settings.alertPageId),
    events: {
        'click a': 'hide'
    },
    tagName: 'div',
    initialize: function() {
        this.template = _.template($("#alertTemplate").html());
        Vifi.Event.on('alert:show', this.show, this);
        this.model.on('change:alertText', this.renderText, this);
        this.render();
    },
    renderText: function() {
        $('#alert-header', this.$el).html(this.model.get('alertHeader'));
        $('#alert-text', this.$el).html(this.model.get('alertText'));
        return this;
    },
    onShow: function() {
        Vifi.Event.trigger("page:change", "alert", true);

    },
    onHide: function() {
    	
    	Vifi.Event.trigger("page:change", "account");
    }
});


Vifi.Films.UserCollection = Backbone.Collection.extend({
    model: Vifi.Films.FilmModel,
    initialize: function(models, options) {

    },
    parse: function(response) {
        return response.objects;
    }
});