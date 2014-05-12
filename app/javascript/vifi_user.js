Vifi.User.Profile = Vifi.Utils.ApiModel.extend({
    path: 'profile',
    params: "",
    defaults: {
        "id": '',
        "user_id": '',
        "lastname": '',
        "firstname": '',
        "notificationText": '',
        "email": 'Visitor',
        "city": '',
        "balance": "",
        "tickets": [],
        "purchase_history": [],
        "favorites": '',
        "messages": 0,
        "subscription": "0",
        "active_sessions": []
    },
    initialize: function() {
        this.on("change", this.updateParams);
        Vifi.Event.on("user:logout", this.signout, this);
        this.on("user:logout", function() {
            Vifi.Event.trigger("user:logout");
        });

    },
    signout: function() {
        this.set("id", "");
        this.set("notificationText", "");
        this.set("user_id", "");
        this.set("balance", 0);
        this.set("sessionId", "");
        this.set("email", "Visitor");
    },

    purchase: function(item) {
        $log("Purchasing item");

        return true;
    }
});
Vifi.User.Session = Backbone.Model.extend({
    model: false,
    url: '',
    path: '',
    url: function() {
        return Vifi.Settings.api_url + 'session/' + this.path + '?jsoncallback=?';
    },
    defaults: function() {
        return {
            user_id: '',
            hash: '',
            step1text: 'Goto www.vifi.ee page, register or login to your account from top of the page. You can login with facebook or register a new user',
            step2text: 'Enter "CODE" to the field asking pairing code',
            activationCode: '',
            logged_in: false,
            enabled: false
        }
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
    initialize: function() {
        var code = this.get("step2text").replace("CODE", this.get("activationCode"));
        this.set("step2text", code);
        this.on('poll:enable', this.enable, this);
        this.on('poll:disable', this.disable, this);


        Vifi.Event.on('user:login', this.onUserAuthenticate, this);
        Vifi.Event.on('user:logout', this.onUserSignout, this);
        this.on('change:sessionId', this.setCookie, this);
        _.bindAll(this, 'send', 'authorize', 'fetch', "setCookie");
        if (!this.isLoggedIn()) {
            this.enable();
        }
        this.render();
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
    onUserSignout: function() {
        this.set('logged_in', false);
        this.disable();
        Vifi.Event.trigger("user:logout");

        return false;
    },
    fetch: function(opts) {
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
            $.cookie("vifi_session", cookie, {});
        }
        return this;
    },
    getCookie: function() {
        var sessionId = $.cookie("vifi_session");
        return sessionId;
    },
    authorize: function() {
        if (!this.isEnabled()) return false;
        var sessionId = this.get("sessionId");
        var hash = this.get("hash");
        var user_id = this.get("user_id");
        if (!this.isLoggedIn() && sessionId !== "" && hash !== "" && user_id != "") {
            var profile = this.get("profile");
            var params = this.getParams();
            profile.set("user_id", user_id);
            profile.set("session", this);
            profile.fetch(params);
            if (profile.get("email") != "Visitor") {
                this.set("profile", profile);
                $log("Logging in with user " + profile.get("email"));
                Vifi.Event.trigger("user:login");
            }
        }
        return false;
    },
    send: function() {
        if (!this.isLoggedIn() && this.isEnabled()) {
            this.fetch();
            setTimeout(function() {

                this.send();
            }.bind(this), 5000);
        } else {
            $log("Disabling polling, logged in or disabled")
            this.disable();
        }
    },
    isEnabled: function() {
        return this.get("enabled");
    },
    isLoggedIn: function() {
        var logged = this.get("logged_in");
        if (logged == true) return true;
        return false;
    },
    onUserAuthenticate: function() {
        this.set("logged_in", true);
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
        "click #reloadButton": "showAlertScreen"
    },
    el: $("#" + Vifi.Settings.accountpageId),
    initialize: function() {
        this.model.on('user:logout', this.toggleSignedIn, this);
        this.model.on('change:email', this.renderEmail, this);
        this.model.on('change:balance', this.renderBalance, this);
        this.model.on('change:email', this.toggleSignedIn, this);
        this.listenTo(this.model, "change", this.renderBalance, this);
        this.template = _.template($("#accountTemplate").html());
        this.render();

    },
    renderBalance: function() {
        var text = "";
        var balance = this.model.get('balance');
        if (this.model.get("email") == "Visitor") text = "Please pair your account with this device";
        else text = "Balance on account: " + this.model.get('balance') + "€";
        $('#account_status', this.$el).html(text);
        return this;
    },
    renderEmail: function() {
        $('#account_username', this.$el).html(this.model.get('email'));
        return this;
    },
    showPairScreen: function() {
        var email = this.model.get("email");
        if (email == "Visitor") Vifi.Event.trigger("activation:show");
        else this.model.trigger("user:logout");
    },
    showAlertScreen: function() {
        Vifi.Event.trigger("alert:show");
    },
    toggleSignedIn: function() {
        var email = this.model.get("email");
        if (email != "" && email != "Visitor") {
            this.$("#pair").html("Sign out").addClass("signout").removeClass("signin");
        } else {
            this.$("#pair").html("Pair device").addClass("signin").removeClass("signout");
        }
        this.renderEmail();
        this.renderBalance();
        Vifi.PageManager.redraw("#accountPage", true);

    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        Vifi.PageManager.redraw("#accountPage", true);

        return this;
    }
});
Vifi.User.ToolbarView = Backbone.View.extend({
    el: $("#" + Vifi.Settings.toolbarId),
    model: Vifi.User.Profile,
    events: {
        'click a': 'hide'
    },
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
    },
    show: function() {
        this.$el.slideDown("slow");
    },
    hide: function() {
        this.$el.slideUp("hide");
    }
});
Vifi.User.ActivationView = Backbone.View.extend({
    el: $("#" + Vifi.Settings.activationPageId),
    events: {
        'click a': 'hide'
    },
    tagName: 'div',
    initialize: function() {
        this.template = _.template($("#activationTemplate").html());
        Vifi.Event.on('activation:show', this.show, this);
        this.model.on('change:activationCode', this.renderCode, this);
        Vifi.Event.on('user:login', this.hide);

        this.render();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        Vifi.Event.trigger("page:ready", "#" + this.$el.attr("id"));
        Vifi.PageManager.redraw("#activationPage", true);

        return this;
    },
    renderCode: function() {
        $('#activation-code', this.$el).html(this.model.get('activationCode'));
        return this;
    },
    show: function() {
        $(".container:visible").addClass("hidden-container").fadeOut();
        this.$el.find("#hideActivation").addClass("tv-component");
        $(".hidden-container .tv-component").removeClass("tv-component").addClass("tv-component-hidden");
        this.$el.fadeIn().show();
        app.session.trigger("poll:enable");

        Vifi.Event.trigger("page:change", "activation");
        Vifi.Event.trigger("page:focus");
    },
    hide: function() {
        if (this.$el.hasClass("active")) {
            $(".hidden-container .tv-component-hidden").addClass("tv-component").removeClass("tv-component-hidden");
            $(".hidden-container").removeClass("hidden-container").fadeIn();
            this.$el.fadeOut().hide();
            Vifi.Event.trigger("page:back");
            Vifi.Event.trigger("page:focus");
        }
    }
});
Vifi.User.AlertView = Backbone.View.extend({
    el: $("#" + Vifi.Settings.alertPageId),
    events: {
        'click a': 'hide'
    },
    tagName: 'div',
    initialize: function() {
        this.template = _.template($("#alertTemplate").html());
        Vifi.Event.on('alert:show', this.show, this);
        this.model.on('change:alertText', this.renderText, this)
        this.render();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        Vifi.Event.trigger("page:ready", "#" + this.$el.attr("id"));
        return this;
    },
    renderText: function() {
        $('#alert-header', this.$el).html(this.model.get('alertHeader'));
        $('#alert-text', this.$el).html(this.model.get('alertText'));
        return this;
    },
    show: function() {
        $(".container:visible").addClass("hidden-container").fadeOut();
        this.$el.find("#hideAlert").addClass("tv-component");
        $(".hidden-container .tv-component").removeClass("tv-component").addClass("tv-component-hidden");
        this.$el.fadeIn().show();
        Vifi.Event.trigger("page:change", "alert", true);
        Vifi.Event.trigger("page:focus");

    },
    hide: function() {
        if (this.$el.hasClass("active")) {
            $(".hidden-container .tv-component-hidden").addClass("tv-component").removeClass("tv-component-hidden");
            $(".hidden-container").removeClass("hidden-container").fadeIn();
            this.$el.fadeOut().hide();
            Vifi.Event.trigger("page:back");
            Vifi.Event.trigger("page:focus");
        }
    }
});