Vifi.Payment = Backbone.Model.extend({

    session: false,

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
            $log("Billing process successfully ended");
            //replace this line with the code that should run upon successful billing 
        } else {
            $log(response);

        }
    },

    initializePayment: function() {

        SmartpayGateway.init('﻿52e802db-553c-4ed2-95bc-44c10a38c199', app.payment.paymentCallback, "Userid:janiluuk@gmail.com");
    }
});
_.extend(Vifi.Payment, Backbone.Events);