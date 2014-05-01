 Vifi.User.Profile = Backbone.Model.extend({
     url: Vifi.Settings.api_url + "profile/?jsoncallback=?",
     params: "",

     events: {
         'change': 'shout'
     },

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
         Vifi.Event.on('user:logout', this.signout, this);


     },

     signout: function() {
         this.set("id", "");
         this.set("notificationText", "");
         this.set("user_id", "");
         this.set("balance", "");

         this.set("logged_in", false);
         this.set("sessionId", "");
         this.set("email", "Visitor");

     },
     updateParams: function() {

         if (this.params == "") {

             this.params = app.session.getParams();

         }
         if (this.params != "" && this.params.data.sessionId != undefined) {
             var sessionId = this.params.data.sessionId;
             var authId = this.params.data.authId;
             var apiKey = this.params.data.api_key;

             this.url = Vifi.Settings.api_url + "profile/?jsoncallback=?&sessionId=" + sessionId + "&authId=" + authId + "&api_key=" + apiKey;
         }

     },
     getParams: function() {

         return this.params;

     },
     refresh: function() {

         this.updateParams();
     }
 });

 Vifi.User.Session = Backbone.Model.extend({
     model: Vifi.User.Profile,

     url: '',
     baseUrl: Vifi.Settings.api_url + "session",

     defaults: function() {
         return {
             user_id: '',
             hash: '',
             step1text: 'Goto www.vifi.ee page, register or login to your account from top of the page. You can login with facebook or register a new user',
             step2text: 'Enter "CODE" to the field asking pairing code',
             activationCode: '',
             logged_in: false,
             enabled: true
         }
     },
     getParams: function() {

         var options = {}
         var params = {
             dataType: 'jsonp',
             data: {
                 api_key: Vifi.Settings.api_key,
                 authId: this.get("hash"),
                 sessionId: this.getCookie()
             }
         };

         options.data = JSON.parse(JSON.stringify(params.data));
         options.dataType = params.dataType;

         return options;

     },

     initialize: function() {
         this.set("logged_in", false);
         this.hash = "";
         var code = this.get("step2text").replace("CODE", this.get("activationCode"));
         this.set("step2text", code);

         Vifi.Event.on('session:enable', this.enable, this);
         Vifi.Event.on('session:disable', this.disable, this);

         Vifi.Event.on('user:login', this.onUserAuthenticate, this);

         Vifi.Event.on('change:sessionId', this.setCookie, this);
         this.on('change:hash', this.authorize, this);

         _.bindAll(this, 'send', 'authorize', 'isLoggedIn', 'fetch', "isEnabled", "setCookie");

         if (!this.isLoggedIn()) {


         }

         this.render();

     },

     enable: function() {
         this.set("enabled", true);

         if (!this.isLoggedIn()) {
             this.send();

         }


     },
     disable: function() {
         this.set("enabled", false);

     },
     fetch: function(opts) {

         if (!this.isLoggedIn()) this.url = this.baseUrl + '/' + this.get('activationCode');
         else this.url = this.baseUrl;
         this.url = this.url + "?jsoncallback=?";

         var that = this;
         var options = this.getParams();

         $.getJSON(this.url, options.data).done(function(data) {

             if (that.get("logged_in") == false) {
                 if (undefined !== data.cookie) {
                     that.status = "pending";
                     that.set("user_id", data.user_id);

                     that.setCookie(data.cookie);

                     if (data.activationKey != "") {
                         that.set("hash", data.activationKey);
                         that.status = "paired";
                         Vifi.Event.trigger("user:login");


                     }


                 } else {

                     that.set("enabled", false);

                 }


             }

         }, "jsonp");
     },


     getProfile: function() {

         var profile = this.get("profile");
         return profile;

     },
     setCookie: function(cookie) {

         var session = this.get("sessionId");
         if (session != "" && cookie == "") cookie = session;
         this.set("sessionId", cookie);
         if (cookie != "") { 
             $.cookie("vifi_session", cookie, {

             });
         }
         return this;
     },
     getCookie: function() {

         return this.get("sessionId");

     },

     authorize: function() {

         var cookie = this.getCookie();
         var hash = this.get("hash");
         var user_id = this.get("user_id");

         if (!this.isLoggedIn() && cookie !== "" && hash !== "" && user_id != "") {
             var profile = this.get("profile");

             var params = this.getParams();


             profile.set("user_id", user_id);
             profile.fetch(params);

             if (profile.get("email") != "Visitor") {
                 this.set("profile", profile);


                 Vifi.Event.trigger("user:login");
             }

         }
         return false;
     },

     send: function() {


         if (!this.isLoggedIn() && this.isEnabled()) {
             setTimeout(function() {
                 this.fetch();
                 this.send();

             }.bind(this), 5000)
         } else {

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
     onUserLogout: function() {

         this.set("logged_in", false);
         var profile = new Vifi.User.Profile();
         this.set("profile", profile);



     },

     render: function() {
         return this;
     }
 });


 Vifi.User.ProfileView = Backbone.View.extend({
     tagName: 'div',

     defaults: {

     },

     events: {
         "click #pairButton": "showPairScreen",
         "click #reloadButton": "showAlertScreen"

     },
     el: $("#" + Vifi.Settings.accountpageId),

     initialize: function() {
         Vifi.Event.on('user:login', this.onUserAuthenticate, this);
         Vifi.Event.on('user:logout', this.toggleSignedIn, this);

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
         if (email == "Visitor")
             Vifi.Event.trigger("activation:show");
         else Vifi.Event.trigger("user:logout");


     },
     showAlertScreen: function() {

         Vifi.Event.trigger("alert:show");

     },
     onUserAuthenticate: function() {

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

     },
     render: function() {

         this.$el.html(this.template(this.model.toJSON()));

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
         this.$("#username-text").fadeOut("slow", function() {
             this.render();
             this.$("#username-text").fadeIn("slow");

         }.bind(this));
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
     model: new Vifi.User.Session(),
     events: {
         'click a': 'hide'

     },
     tagName: 'div',
     initialize: function() {
         this.template = _.template($("#activationTemplate").html());
         Vifi.Event.on('activation:show', this.show, this);

         this.model.on('change:activationCode', this.renderCode, this)
         this.render();
     },
     render: function() {
         this.$el.html(this.template(this.model.toJSON()));
         Vifi.Event.trigger("page:ready", "#" + this.$el.attr("id"));
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
         Vifi.Event.on('user:login', this.hide, this);
         Vifi.Event.trigger("page:change", "activation");
         Vifi.Event.trigger("page:focus");
         Vifi.Event.trigger("session:enable");

     },
     hide: function() {
         if (this.$el.hasClass("active")) {
             $(".hidden-container .tv-component-hidden").addClass("tv-component").removeClass("tv-component-hidden");
             $(".hidden-container").removeClass("hidden-container").fadeIn();
             this.$el.fadeOut().hide();

             Vifi.Event.trigger("page:change", "account");
             Vifi.Event.trigger("page:focus");
             Vifi.Event.trigger("session:disable");
         }
     }
 });

 Vifi.User.AlertView = Backbone.View.extend({
     el: $("#" + Vifi.Settings.alertPageId),
     model: new Vifi.User.Session(),
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
         Vifi.Event.trigger("page:change", "alert");
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