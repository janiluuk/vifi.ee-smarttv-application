Vifi.Payment = Backbone.Events.extend({


    paymentCallback: function(response) {
        if (undefined != response && response.success) {
            $log("Billing process successfully ended");
            //replace this line with the code that should run upon successful billing 
        } else {
            $log(response);

        }
    },

    initializePayment: function() {

        SmartpayGateway.init('﻿52e802db-553c-4ed2-95bc-44c10a38c199', paymentCallback, "Userid:janiluuk@gmail.com");
    }
});