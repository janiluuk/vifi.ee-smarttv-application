var SMARTPAY_APP_PATH = "https://www.smartpay.tv/Devices/Smart_TV/";

function smartpayImportJavascriptFile(c, a) {
    var b = document.createElement("script");
    b.type = "text/javascript";
    b.src = a;
    c = c || this;
    c.document.getElementsByTagName("head")[0].appendChild(b)
}

function smartpayImportCSSFile(c, a) {
    var b = document.createElement("link");
    b.rel = "stylesheet";
    b.type = "text/css";
    b.href = a;
    c = c || this;
    c.document.getElementsByTagName("head")[0].appendChild(b)
}

function smartpayGetUrlDomain() {
    var b = "";
    var d = SMARTPAY_APP_PATH.split("/");
    var c = d[0].substring(0, d[0].length - 1);
    var b = (d[2].indexOf(":") >= 0 ? d[2].substring(0, d[2].indexOf(":")) : d[2]);
    var a = (d[2].indexOf(":") >= 0 ? d[2].substring(d[2].indexOf(":") + 1) : null);
    b = c + "://" + b + (a || "");
    return b
}
smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "resources/languages/labels.js?curtime=" + (new Date()).getTime());
if (navigator.userAgent.indexOf("SmartHub") > 0) {
    smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "devices/SmartpayDevice.SAMSUNG.js?curtime=" + (new Date()).getTime())
} else {
    if (navigator.userAgent.indexOf("Maple") > 0) {
        smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "devices/SmartpayDevice.SAMSUNG2011.js?curtime=" + (new Date()).getTime())
    } else {
        if (navigator.userAgent.indexOf("NetCast") > 0) {
            smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "devices/SmartpayDevice.LG.js?curtime=" + (new Date()).getTime())
        } else {
            if (navigator.userAgent.indexOf("Opera") >= 0) {
                smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "devices/SmartpayDevice.OPERA.js?curtime=" + (new Date()).getTime())
            } else {
                if (navigator.userAgent.indexOf("iPhone") >= 0 || navigator.userAgent.indexOf("iPad") >= 0 || navigator.userAgent.indexOf("iPod") >= 0) {
                    smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "devices/SmartpayDevice.IOS.js?curtime=" + (new Date()).getTime())
                } else {
                    if (navigator.userAgent.indexOf("Android") >= 0) {
                        smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "devices/SmartpayDevice.ANDROID.js?curtime=" + (new Date()).getTime())
                    } else {
                        if (navigator.userAgent.indexOf("oxee") >= 0) {
                            smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "devices/SmartpayDevice.BOXEE.js?curtime=" + (new Date()).getTime())
                        } else {
                            if (navigator.userAgent.indexOf("SmartTvA") >= 0) {
                                smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "devices/SmartpayDevice.STVALL.js?curtime=" + (new Date()).getTime())
                            } else {
                                smartpayImportJavascriptFile(window, SMARTPAY_APP_PATH + "devices/SmartpayDevice.HTML5.js?curtime=" + (new Date()).getTime())
                            }
                        }
                    }
                }
            }
        }
    }
}
smartpayImportCSSFile(window, SMARTPAY_APP_PATH + "css/smartpay.css?curtime=" + (new Date()).getTime());
var SmartpayGateway = {
    API_BASE: smartpayGetUrlDomain() + "/api/",
    API_OPENTRANSACTION: "transaction/open",
    API_COMMIT: "transaction/commit",
    API_METHOD: "GET",
    VERSION: "26",
    init: function(c, f, h, d, g, j) {
        try {
            SmartpayUtils.trace("Init the SmartpayGateway");
            if (g && g == SmartpayDevice.getSerialNumber()) {
                SmartpayUtils.trace("Problematic 2013 issue!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                f = h;
                h = j;
                g = null;
                d = null;
                j = null;
                SmartpayGateway.VERSION = 100
            } else {
                if (typeof(f) != "function") {
                    SmartpayUtils.trace("Old UI version accessed the SmartpayGateway");
                    f = h;
                    h = j;
                    d = null;
                    g = null;
                    j = null;
                    SmartpayGateway.VERSION = 101
                }
            }
            SmartpayUtils.trace("SmartpayGateway.init before : productId: " + c + ", smartpayGwCallback: " + typeof(f) + ", productKey: " + h + ", language: " + d + ", price: " + g + ", currency: " + j);
            this._productId = c;
            this._productKey = h;
            this._pin = "";
            this._pinConfirm = "";
            this.language = d ? d.toLowerCase() : "en";
            this._price = g || null;
            this._currency = j || null;
            this._cbFunction = f;
            this._productInfo = null;
            this.imeEnabled = SmartpayDevice.imeEnabled ? true : false;
            SmartpayUtils.trace("SmartpayGateway.init after : productId: " + this._productId + ", smartpayGwCallback: " + typeof(this._cbFunction) + ", productKey: " + this._productKey + ", language: " + this.language + ", price: " + this._price + ", currency: " + this._currency);
            smartpayAttachLanguage();
            var a = document.getElementById("smartpayContainer");
            if (!a) {
                var b = document.createElement("div");
                b.setAttribute("id", "smartpayContainer");
                b.className = "smartpayContainer";
                b.style.left = (window.innerWidth - 308) / 2 + "px";
                b.style.top = (window.innerHeight - 428) / 2 + "px";
                this.container = document.body.appendChild(b)
            } else {
                this.container = a
            }
            SmartpayDevice.catchEventHandler();
            this.createDialogueWindow();
            this.getProductInfo()
        } catch (i) {
            SmartpayUtils.trace("Unable to create frame: " + i)
        }
    },
    advancedCustomPayment: function(b) {
        try {
            SmartpayUtils.trace("Init the SmartpayGateway");
            this._productId = b && b.productId ? b.productId : null;
            this._productKey = b && b.productKey ? b.productKey : null;
            this._pin = "";
            this._pinConfirm = "";
            this.language = b && b.language ? b.language.toLowerCase() : "en";
            this._price = b && b.price ? b.price : null;
            this._currency = b && b.currency ? b.currency : null;
            this._cbFunction = b && b.smartpayGwCallback ? b.smartpayGwCallback : null;
            this._productInfo = null;
            this.imeEnabled = SmartpayDevice.imeEnabled ? true : false;
            smartpayAttachLanguage();
            var a = document.getElementById("smartpayContainer");
            if (!a) {
                var c = document.createElement("div");
                c.setAttribute("id", "smartpayContainer");
                c.className = "smartpayContainer";
                c.style.left = (window.innerWidth - 308) / 2 + "px";
                c.style.top = (window.innerHeight - 428) / 2 + "px";
                this.container = document.body.appendChild(c)
            } else {
                this.container = a
            }
            SmartpayDevice.catchEventHandler();
            this.createDialogueWindow();
            this.getProductInfo()
        } catch (d) {
            SmartpayUtils.trace("Unable to create frame: " + d)
        }
    },
    showHeader: function(b) {
        var a = "";
        if (this._productInfo && b) {
            a += '<div class="smartpayHeader" style="background-image: url(' + this._productInfo.image + ')"></div>';
            a += '<div class="smartpayHeaderProductName">' + this._productInfo.productName + "</div>";
            a += '<div class="smartpayHeaderPaymentType">' + this.getPaymentType() + "</div>";
            a += '<div class="smartpayHeaderPaymentFrequency">' + this.getPaymentFrequency() + "</div>";
            a += '<div class="smartpayHeaderPrice">' + this._productInfo.currency + this._productInfo.price + "</div>";
            a += '<div class="smartpayHeaderLine"></div>'
        } else {
            if (!b) {
                a += '<div id="smartpayHeaderLogo" class="smartpayHeaderLogo"></div>'
            }
        }
        document.getElementById("smartpayHeader").innerHTML = a
    },
    getPaymentType: function() {
        switch (this._productInfo.paymentType) {
            case 10:
                return SMART_PAY_LABELS.PAYMENT.TYPE_RECURRING;
                break;
            case 20:
                return SMART_PAY_LABELS.PAYMENT.TYPE_SINGLE;
                break;
            case 30:
                return SMART_PAY_LABELS.PAYMENT.TYPE_UNKNOWN;
                break;
            default:
                return "";
                break
        }
    },
    getPaymentFrequency: function() {
        switch (this._productInfo.paymentFrequency) {
            case 20:
                return SMART_PAY_LABELS.PAYMENT.FREQUENCY_TOTAL;
                break;
            case 30:
                return SMART_PAY_LABELS.PAYMENT.FREQUENCY_DAILY;
                break;
            case 40:
                return SMART_PAY_LABELS.PAYMENT.FREQUENCY_WEEKLY;
                break;
            case 50:
                return SMART_PAY_LABELS.PAYMENT.FREQUENCY_MONTHLY;
                break;
            case 60:
                return SMART_PAY_LABELS.PAYMENT.FREQUENCY_YEARLY;
                break;
            case 70:
                return SMART_PAY_LABELS.PAYMENT.FREQUENCY_TOTAL;
                break;
            default:
                return "";
                break
        }
    },
    showPinSetup: function(a) {
        SmartpayUtils.trace("showPinSetup :: Showing the pin setup dialogue");
        this._activeState = "SETUP_PIN";
        var c = document.getElementById("smartpayPinSetupConfirmContainer");
        if (c) {
            c.style.visibility = "hidden"
        }
        var d = null,
            e = null;
        this._smartPaySelectedAction = "SKIP";
        this.showHeader();
        var b = "";
        if (!a) {
            b += '<div id="smartpayPinSetupTitle" class="smartpayPinSetupTitle">' + SMART_PAY_LABELS.PIN_SETUP.TITLE + "</div>"
        }
        b += '<div class="smartpayPinSetupContainer">';
        if (a) {
            b += '<div class="smartpayInfoPopupText">' + a + "</div>"
        } else {
            b += '<div class="smartpayInfoPopupText">' + SMART_PAY_LABELS.PIN_SETUP.TEXT + "</div>"
        }
        b += '<div id="smartpayPinSetup" class="smartpayPinSetup"></div>';
        if (SmartpayGateway.imeEnabled) {
            b += '<input type="password" id="setSetupPinInput" onkeydown="return SmartpayGatewayProvider.onKeyDownTerminator();" class="smartPayPinInput" />'
        }
        b += '<div id="smartpayPinSetupSkipButton" class="smartpayPinSetupSkipButton smartpayButton" onclick="SmartpayGatewayProvider.smartpaySkipPinButtonClick();">' + SMART_PAY_LABELS.PIN_SETUP.CANCEL_BUTTON + "</div>";
        b += "</div>";
        b += '<div id="smartpayNumPad" class="smartpayNumPad smartPayNumPadGradient"></div>';
        e = document.getElementById("smartpayPinSetupContainer");
        if (!e) {
            d = document.createElement("div");
            d.setAttribute("id", "smartpayPinSetupContainer");
            e = document.getElementById("smartpayDialogueContainer").appendChild(d)
        }
        e.innerHTML = b;
        e.style.visibility = "visible";
        this.setSetupPin("", true);
        SmartpayGatewayProvider.smartPaySelectSetupPin();
        if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.setTarget(this);
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    onSelectField: function(a) {
        if (a == "DELETE") {
            SmartPayNumPad.close();
            SmartpayGateway.onMoveLeft();
            SmartPayNumPad.show(SmartpayGateway.getNumPadTop())
        }
        if (a == "NEXT") {
            SmartPayNumPad.close();
            SmartpayGateway.onMoveDown()
        }
    },
    hidePinSetup: function() {
        var a = document.getElementById("smartpayPinSetupContainer");
        if (a) {
            a.style.visibility = "hidden"
        }
    },
    setSetupPin: function(b, e) {
        var f = document.getElementById("smartpayPinSetup");
        if (f) {
            var d = "";
            var a = false;
            for (var c = 0; c < 4; c++) {
                d += c < b.length ? '<div class="smartpayPinDigit" onclick="SmartpayGatewayProvider.smartPaySelectSetupPin();">*</div>' : '<div class="smartpayPinDigit' + (e && !a ? "Selected" : "") + '" onclick="SmartpayGatewayProvider.smartPaySelectSetupPin();"></div>';
                if (c == b.length) {
                    a = true
                }
            }
            f.innerHTML = d
        }
    },
    showPinSetupConfirm: function() {
        SmartpayUtils.trace("showPinSetup :: Showing the pin setup dialogue");
        this._activeState = "SETUP_PIN_CONFIRM";
        var a = document.getElementById("smartpayPinSetupContainer");
        if (a) {
            a.style.visibility = "hidden"
        }
        var c = null,
            d = null;
        this._smartPaySelectedAction = "SKIP";
        this.showHeader();
        var b = "";
        b += '<div id="smartpayPinSetupConfirmTitle" class="smartpayPinSetupTitle"></div>';
        b += '<div class="smartpayPinSetupContainer"><div class="smartpayInfoPopupText">' + SMART_PAY_LABELS.PIN_SETUP.TEXT_CONFIRM + "</div>";
        b += '<div id="smartpayPinConfirm" class="smartpayPinConfirm"></div>';
        if (SmartpayGateway.imeEnabled) {
            b += '<input type="password" id="setSetupPinConfirmInput" onkeydown="return SmartpayGatewayProvider.onKeyDownTerminator();" class="smartPayPinInput" />'
        }
        b += '<div id="smartpayPinSetupConfirmSkipButton" class="smartpayPinSetupSkipButton smartpayButton" onclick="SmartpayGatewayProvider.smartpaySkipPinButtonClick();">' + SMART_PAY_LABELS.PIN_SETUP.CANCEL_BUTTON + "</div>";
        b += "</div>";
        b += '<div id="smartpayNumPad" class="smartpayNumPad smartPayNumPadGradient"></div>';
        d = document.getElementById("smartpayPinSetupConfirmContainer");
        if (!d) {
            c = document.createElement("div");
            c.setAttribute("id", "smartpayPinSetupConfirmContainer");
            d = document.getElementById("smartpayDialogueContainer").appendChild(c)
        }
        d.innerHTML = b;
        d.style.visibility = "visible";
        this.setSetupPinConfirm("", true);
        SmartpayGatewayProvider.smartPaySelectConfirmPin();
        if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.setTarget(this);
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    setSetupPinConfirm: function(b, e) {
        var f = document.getElementById("smartpayPinConfirm");
        if (f) {
            var d = "";
            var a = false;
            for (var c = 0; c < 4; c++) {
                d += c < b.length ? '<div class="smartpayPinDigit" onclick="SmartpayGatewayProvider.smartPaySelectConfirmPin();">*</div>' : '<div class="smartpayPinDigit' + (e && !a ? "Selected" : "") + '" onclick="SmartpayGatewayProvider.smartPaySelectConfirmPin();"></div>';
                if (c == b.length) {
                    a = true
                }
            }
            f.innerHTML = d
        }
    },
    showPin: function(a) {
        SmartpayUtils.trace("showPin :: Showing the pin dialogue");
        this._activeState = "PIN";
        var c = null,
            d = null;
        this._smartPaySelectedAction = "SKIP";
        var b = "";
        b += '<div class="smartpayPinContainer">';
        if (a) {
            b += '<div class="smartpayInfoPopupText">' + a + "</div>"
        } else {
            b += '<div class="smartpayInfoPopupText">' + SMART_PAY_LABELS.PIN.TITLE + "</div>"
        }
        b += '<div id="smartpayPin" class="smartpayPin"></div>';
        if (SmartpayGateway.imeEnabled) {
            b += '<input type="password" id="setPinInput" onkeydown="return SmartpayGatewayProvider.onKeyDownTerminator();" class="smartPayPinInput" />'
        }
        b += '<div id="smartpayPinSkipButton" class="smartpayPinSkipButton smartpayButton" onclick="SmartpayGateway.resetPinCode();">' + SMART_PAY_LABELS.PIN.FORGOT_PIN_BTN + "</div>";
        b += "</div>";
        b += '<div id="smartpayNumPad" class="smartpayNumPad smartPayNumPadGradient"></div>';
        d = document.getElementById("smartpayPinContainer");
        if (!d) {
            c = document.createElement("div");
            c.setAttribute("id", "smartpayPinContainer");
            d = document.getElementById("smartpayDialogueContainer").appendChild(c)
        }
        d.innerHTML = b;
        d.style.visibility = "visible";
        this.setPin("", true);
        SmartpayGatewayProvider.smartPaySelectPin();
        if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.setTarget(this);
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    hidePin: function() {
        var a = document.getElementById("smartpayPinContainer");
        if (a) {
            a.style.visibility = "hidden"
        }
    },
    setPin: function(b, e) {
        var f = document.getElementById("smartpayPin");
        if (f) {
            var d = "";
            var a = false;
            for (var c = 0; c < 4; c++) {
                d += c < b.length ? '<div class="smartpayPinDigit" onclick="SmartpayGatewayProvider.smartPaySelectPin();">*</div>' : '<div class="smartpayPinDigit' + (e && !a ? "Selected" : "") + '" onclick="SmartpayGatewayProvider.smartPaySelectPin();"></div>';
                if (c == b.length) {
                    a = true
                }
            }
            f.innerHTML = d
        }
        if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.setTarget(this);
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    getNumPadTop: function() {
        return 190
    },
    showWaiting: function() {
        SmartpayUtils.trace("showWaiting :: Showing the waiting spinner");
        this._activeState = "WAITING";
        var b = null,
            c = null;
        c = document.getElementById("smartpayWaitingContainer");
        if (!c) {
            b = document.createElement("div");
            b.setAttribute("id", "smartpayWaitingContainer");
            c = document.getElementById("smartpayDialogueContainer").appendChild(b)
        }
        var a = "";
        a += '<div class="smartpayWaitingSpinner"></div>';
        a += '<div class="smartpayWaitingText">' + SMART_PAY_LABELS.GENERAL.CONNECTING + "</div>";
        c.innerHTML = a;
        c.style.visibility = "visible"
    },
    hideWaiting: function() {
        var a = document.getElementById("smartpayWaitingContainer");
        if (a) {
            a.style.visibility = "hidden"
        }
    },
    createDialogueWindow: function() {
        try {
            var b = null,
                g = null;
            var a = null,
                f = null;
            f = document.getElementById("smartpayDialogueContainer");
            if (!f) {
                a = document.createElement("div");
                a.setAttribute("id", "smartpayDialogueContainer");
                f = this.container.appendChild(a)
            }
            var c = "";
            c += '<img id="smartpayDialogueContainerImg" class="smartpayDialogueContainerImg" src="' + SMARTPAY_APP_PATH + "resources/images/SmartPay_BG.png?curtime=" + (new Date()).getTime() + '" width="308px" height="428px" />';
            c += '<div id="smartpayHeader" class="smartpayHeaderContainer"></div>';
            c += '<div id="smartpayFooter" class="smartpayFooter"><img src="' + SMARTPAY_APP_PATH + "resources/images/footer.png?curtime=" + (new Date()).getTime() + '" width="300px" height="78px" /></div>';
            f.innerHTML = c;
            f.className = "smartpayDialogueContainer";
            f.style.visibility = "visible"
        } catch (d) {
            SmartpayUtils.trace("Unable to create smartpayDialogueContainer: " + d)
        }
    },
    openTransaction: function() {
        var b = this._pin ? "&pinCode=" + this._pin : "";
        var c = this._price ? "&price=" + this._price : "";
        var a = this._currency ? "&currency=" + this._currency : "";
        SmartpayUtils.trace("openTransaction");
        this.showWaiting();
        try {
            this._state = "openTransaction";
            SmartpayUtils.trace("openTransaction :: API_METHOD " + this.API_METHOD + " URL " + this.API_BASE + this.API_OPENTRANSACTION + "?productId=" + this._productId + "&udid=" + this.getUniqueId() + "&customVar=" + this._productKey + b + c + a);
            SmartpayUtils.SmartpayXMLHttpRequest(this.API_METHOD, this.API_BASE + this.API_OPENTRANSACTION + "?productId=" + this._productId + "&udid=" + this.getUniqueId() + "&customVar=" + this._productKey + b + c + a, true, this, this.openTransactionCallback)
        } catch (d) {
            SmartpayUtils.trace("openTransaction failed: " + d)
        }
    },
    openTransactionCallback: function(a) {
        SmartpayUtils.trace("openTransactionCallback :: " + a ? SmartpayUtils.serialize(a) : "Response is empty");
        this._activeState = "";
        this.hideWaiting();
        var b = typeof(a) == "string" ? SmartpayJsonParser(a) : a;
        if (b && b.token) {
            if (b.noPinCode == 0) {
                this._hasPinCode = true;
                this.getCurrentProvider().confirmPaymentMethod(b.token, b.lastdigits, b.cctype)
            } else {
                this._hasPinCode = false;
                this.getCurrentProvider().token = b.token;
                this.getCurrentProvider().initCardRequest()
            } if (b.consumerUdid) {
                SmartpayDevice.setUniqueId(b.consumerUdid)
            }
        } else {
            SmartpayUtils.trace("openTransactionCallback :: " + b ? b.error : "unknown error");
            SmartpayGateway._pin = "";
            SmartpayGateway._pinConfirm = "";
            SmartpayGatewayProvider.showError(SmartpayGatewayProvider.getOpenErrorByErrorId(b ? b.error_id : -1))
        }
    },
    commitTransaction: function(a, b, c) {
        try {
            document.getElementById("ExternalSiteIframe").style.visibility = "hidden";
            if (this._state != "openTransaction") {
                SmartpayUtils.trace("Cannot commit transaction before opening one.");
                return
            }
            this._state = "commitTransaction";
            SmartpayUtils.trace("commitTransaction :: " + this.API_BASE + this.API_COMMIT + "?productId=" + this._productId + "&gatewayToken=" + this._token + "&gatewayTrxToken=" + b + "&gatewayTrxId=" + c);
            SmartpayUtils.SmartpayXMLHttpRequest("POST", this.API_BASE + this.API_COMMIT + "?productId=" + this._productId + "&gatewayToken=" + this._token + "&gatewayTrxToken=" + b + "&gatewayTrxId=" + c, true, this, this.commitTransactionCallback)
        } catch (d) {
            SmartpayUtils.trace("commitTransaction failed: " + d)
        }
    },
    commitTransactionCallback: function(a) {
        SmartpayUtils.trace("commitTransactionCallback :: " + a ? SmartpayUtils.serialize(a) : "Response is empty");
        var b = typeof(a) == "string" ? SmartpayJsonParser(a) : a;
        if (b && b.success) {
            var c = b.success;
            SmartpayUtils.trace("Got response for commitTransaction: " + c);
            if (this._hasPinCode) {
                this.callTheCallback({
                    success: 1
                })
            } else {
                this._activeState = "SETUP_PIN";
                this.showPinSetup()
            }
        } else {
            if (b.error) {
                SmartpayUtils.trace("commitTransactionCallback :: " + b.error);
                this.callTheCallback({
                    error: 1
                })
            }
        }
    },
    postCommitTransaction: function() {
        if (!this._hasPinCode) {
            this.showPinSetup()
        } else {
            this.callTheCallback({
                success: 1
            })
        }
    },
    callTheCallback: function(a) {
        try {
            SmartpayUtils.trace("callTheCallback :: Calling the callback function");
            SmartpayDevice.releaseEventHandler();
            this.container.innerHTML = "";
            if (this._cbFunction != null) {
                this._cbFunction(a)
            }
        } catch (b) {
            SmartpayUtils.trace("callTheCallback failed: " + b)
        }
    },
    getProductInfo: function() {
        var b = this._price ? "&price=" + this._price : "";
        var a = this._currency ? "&currency=" + this._currency : "";
        try {
            SmartpayUtils.trace("getProductInfo: Getting Product Info :: " + this.API_BASE + "product/info?productId=" + this._productId + b + a);
            this._productInfo = null;
            this.showWaiting();
            SmartpayUtils.SmartpayXMLHttpRequest(this.API_METHOD, this.API_BASE + "product/info?productId=" + this._productId + b + a, true, this, this.getProductInfoCallback)
        } catch (c) {
            SmartpayUtils.trace("getProductInfo failed: " + c)
        }
    },
    getProductInfoCallback: function(a) {
        try {
            this.hideWaiting();
            SmartpayUtils.trace("getProductInfoCallback: " + a ? SmartpayUtils.serialize(a) : "Response is empty");
            this._productInfo = SmartpayJsonParser(a);
            if (this._productInfo.error || this._productInfo.error_id || !this._productInfo.price || !this._productInfo.productName) {
                SmartpayGatewayProvider.showError(SmartpayGatewayProvider.getProductErrorByErrorId(this._productInfo ? this._productInfo.error_id : -1));
                SmartpayGateway.callTheCallback({
                    error: 1,
                    message: SMART_PAY_LABELS.CC.CONTACT_SUPPORT_ERROR,
                    title: SMART_PAY_LABELS.CC.CONTACT_SUPPORT_TITLE
                });
                return
            }
            this.showHeader(true);
            this.getPinCodeStatus()
        } catch (b) {
            SmartpayUtils.trace("getProductInfoCallback failed: " + b)
        }
    },
    getPinCodeStatus: function() {
        var b = this._price ? "&price=" + this._price : "";
        var a = this._currency ? "&currency=" + this._currency : "";
        try {
            SmartpayUtils.trace("getPinCodeStatus: Getting Pin Code :: " + this.API_BASE + "consumer/getPinCodeStatus?productId=" + this._productId + "&udid=" + this.getUniqueId() + b + a);
            this.showWaiting();
            SmartpayUtils.SmartpayXMLHttpRequest(this.API_METHOD, this.API_BASE + "consumer/getPinCodeStatus?productId=" + this._productId + "&udid=" + this.getUniqueId() + b + a, true, this, this.getPinCodeStatusCallback)
        } catch (c) {
            SmartpayUtils.trace("getPinCodeStatus failed: " + c)
        }
    },
    getPinCodeStatusCallback: function(a) {
        try {
            this.hideWaiting();
            SmartpayUtils.trace("getPinCodeStatusCallback: " + a ? SmartpayUtils.serialize(a) : "Response is empty");
            var b = SmartpayJsonParser(a);
            if (b && b.hasPinCode) {
                this._hasPinCode = true
            } else {
                this._hasPinCode = false
            } if (this._hasPinCode) {
                this.showPin()
            } else {
                this.openTransaction()
            }
        } catch (c) {
            SmartpayUtils.trace("getPinCodeStatusCallback failed: " + c)
        }
    },
    setPinCode: function(a) {
        try {
            SmartpayUtils.trace("setPinCodeStatus: Setting Pin Code => " + a);
            SmartpayUtils.trace("setPinCodeStatus: Setting Pin Code :: " + this.API_BASE + "consumer/setPinCode?udid=" + this.getUniqueId() + "&pinCode=" + a);
            SmartpayUtils.SmartpayXMLHttpRequest(this.API_METHOD, this.API_BASE + "consumer/setPinCode?udid=" + this.getUniqueId() + "&pinCode=" + a, true, this, this.setPinCodeStatusCallback)
        } catch (b) {
            SmartpayUtils.trace("setPinCodeStatus failed: " + b)
        }
    },
    setPinCodeStatusCallback: function(a) {
        try {
            SmartpayUtils.trace("setPinCodeStatusCallback: " + a ? SmartpayUtils.serialize(a) : "Response is empty")
        } catch (b) {
            SmartpayUtils.trace("setPinCodeStatusCallback failed: " + b)
        }
    },
    resetPinCode: function(a) {
        try {
            SmartpayUtils.trace("resetPinCode");
            SmartpayUtils.SmartpayXMLHttpRequest(this.API_METHOD, this.API_BASE + "consumer/resetPinCode?udid=" + this.getUniqueId(), true, this, this.resetPinCodeStatusCallback)
        } catch (b) {
            SmartpayUtils.trace("resetPinCode failed: " + b)
        }
    },
    resetPinCodeStatusCallback: function(a) {
        try {
            SmartpayUtils.trace("resetPinCodeStatusCallback: " + a ? SmartpayUtils.serialize(a) : "Response is empty");
            this._pin = "";
            this.openTransaction();
            this._activeState = "";
            this.hidePin();
            this.container.style.visibility = "visible"
        } catch (b) {
            SmartpayUtils.trace("resetPinCodeStatusCallback failed: " + b)
        }
    },
    getCurrentProvider: function() {
        return SmartpayGatewayProvider
    },
    callProductAfterPurchase: function() {
        SmartpayGateway._activeState = "";
        SmartpayGateway.hidePinSetup();
        SmartpayGateway.container.style.visibility = "visible";
        SmartpayGateway.callTheCallback({
            success: 1
        })
    },
    onSelect: function() {
        try {
            SmartpayUtils.trace(this._activeState);
            switch (this._activeState) {
                case "SETUP_PIN":
                case "SETUP_PIN_CONFIRM":
                case "PIN":
                    if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                        SmartPayNumPad.select()
                    } else {
                        if (SmartpayDevice.numpadEnabled && !SmartPayNumPad.isVisible) {
                            SmartPayNumPad.setTarget(this);
                            SmartPayNumPad.show(this.getNumPadTop())
                        }
                    }
                    break;
                case "SETUP_PIN_SKIP":
                case "SETUP_PIN_CONFIRM_SKIP":
                    SmartpayGatewayProvider.smartpaySkipPinButtonClick();
                    break;
                case "PIN_SKIP":
                    SmartpayUtils.trace("Resseting the pin");
                    this.resetPinCode();
                    break;
                default:
                    this.getCurrentProvider().onSelect();
                    break
            }
        } catch (a) {
            SmartpayUtils.trace("onSelect failed: " + a)
        }
    },
    onNumber: function(a) {
        try {
            switch (this._activeState) {
                case "SETUP_PIN":
                    if (this._pin.length < 4) {
                        this._pin += a;
                        this.setSetupPin(this._pin, true)
                    }
                    if (this._pin.length == 4) {
                        this.showPinSetupConfirm()
                    }
                    break;
                case "SETUP_PIN_CONFIRM":
                    if (this._pinConfirm.length < 4) {
                        this._pinConfirm += a;
                        this.setSetupPinConfirm(this._pinConfirm, true)
                    }
                    if (this._pinConfirm.length == 4) {
                        if (this._pin != this._pinConfirm) {
                            this._pinConfirm = "";
                            this._pin = "";
                            this.showPinSetup(SMART_PAY_LABELS.PIN_SETUP.ERROR_PIN)
                        } else {
                            SmartpayUtils.trace("Saving the pin");
                            document.getElementById("smartpayPinSetupConfirmTitle").innerHTML = SMART_PAY_LABELS.PIN_SETUP.PIN_CREATED;
                            this.setPinCode(this._pin);
                            if (SmartpayDevice.numpadEnabled) {
                                SmartPayNumPad.close()
                            }
                            setTimeout(this.callProductAfterPurchase, 2000)
                        }
                    }
                    break;
                case "PIN":
                    if (this._pin.length < 4) {
                        this._pin += a
                    }
                    if (this._pin.length == 4) {
                        if (SmartpayDevice.numpadEnabled) {
                            SmartPayNumPad.close()
                        }
                        this.openTransaction();
                        this.hidePin();
                        this.container.style.visibility = "visible"
                    } else {
                        this.setPin(this._pin, true)
                    }
                    break;
                default:
                    this.getCurrentProvider().onNumber(a);
                    break
            }
        } catch (b) {
            SmartpayUtils.trace("onNumber failed: " + b)
        }
    },
    onMoveLeft: function() {
        try {
            if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                SmartPayNumPad.moveLeft()
            } else {
                switch (this._activeState) {
                    case "PIN":
                        if (this._pin.length > 0) {
                            this._pin = this._pin.substring(0, this._pin.length - 1);
                            this.setPin(this._pin, true);
                            this._smartPaySelectedAction = "SKIP"
                        }
                        break;
                    case "SETUP_PIN":
                        if (this._pin.length > 0) {
                            this._pin = this._pin.substring(0, this._pin.length - 1)
                        }
                        this.setSetupPin(this._pin, true);
                        this._smartPaySelectedAction = "SKIP";
                        break;
                    case "SETUP_PIN_CONFIRM":
                        if (this._pinConfirm.length > 0) {
                            this._pinConfirm = this._pin.substring(0, this._pinConfirm.length - 1)
                        }
                        this.setSetupPinConfirm(this._pinConfirm, true);
                        this._smartPaySelectedAction = "SKIP";
                        break;
                    default:
                        this.getCurrentProvider().onMoveLeft();
                        break
                }
            }
        } catch (a) {
            SmartpayUtils.trace("onMoveLeft failed: " + a)
        }
    },
    onMoveRight: function() {
        try {
            switch (this._activeState) {
                case "SETUP_PIN":
                case "SETUP_PIN_CONFIRM":
                case "PIN":
                    if (SmartpayDevice.numpadEnabled) {
                        if (SmartPayNumPad.isVisible) {
                            SmartPayNumPad.moveRight()
                        } else {
                            SmartPayNumPad.setTarget(this);
                            SmartPayNumPad.show(this.getNumPadTop())
                        }
                    }
                    break;
                default:
                    this.getCurrentProvider().onMoveRight();
                    break
            }
        } catch (a) {
            SmartpayUtils.trace("onMoveRight failed: " + a)
        }
    },
    onMoveUp: function() {
        try {
            if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                SmartPayNumPad.moveUp()
            } else {
                switch (this._activeState) {
                    case "PIN_SKIP":
                        this.setPin(this._pin, true);
                        document.getElementById("smartpayPinSkipButton").className = "smartpayPinSkipButton smartpayButton";
                        this._activeState = "PIN";
                        if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
                            SmartPayNumPad.show(this.getNumPadTop())
                        }
                        break;
                    case "SETUP_PIN_SKIP":
                        this.setSetupPin(this._pin, true);
                        document.getElementById("smartpayPinSetupSkipButton").className = "smartpayPinSkipButton smartpayButton";
                        this._activeState = "SETUP_PIN";
                        if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
                            SmartPayNumPad.show(this.getNumPadTop())
                        }
                        break;
                    case "SETUP_PIN_CONFIRM_SKIP":
                        this.setSetupPinConfirm(this._pinConfirm, true);
                        document.getElementById("smartpayPinSetupConfirmSkipButton").className = "smartpayPinSkipButton smartpayButton";
                        this._activeState = "SETUP_PIN_CONFIRM";
                        if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
                            SmartPayNumPad.show(this.getNumPadTop())
                        }
                        break;
                    default:
                        this.getCurrentProvider().onMoveUp();
                        break
                }
            }
        } catch (a) {
            SmartpayUtils.trace("onMoveUp failed: " + a)
        }
    },
    onMoveDown: function() {
        try {
            if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                SmartPayNumPad.moveDown()
            } else {
                switch (this._activeState) {
                    case "PIN":
                        this.setPin(this._pin);
                        document.getElementById("smartpayPinSkipButton").className = "smartpayPinSkipButton smartpayButtonSelected";
                        this._activeState = "PIN_SKIP";
                        if (SmartpayDevice.numpadEnabled) {
                            SmartPayNumPad.close()
                        }
                        break;
                    case "SETUP_PIN":
                        this.setSetupPin(this._pin);
                        document.getElementById("smartpayPinSetupSkipButton").className = "smartpayPinSkipButton smartpayButtonSelected";
                        this._activeState = "SETUP_PIN_SKIP";
                        if (SmartpayDevice.numpadEnabled) {
                            SmartPayNumPad.close()
                        }
                        break;
                    case "SETUP_PIN_CONFIRM":
                        this.setSetupPinConfirm(this._pinConfirm);
                        document.getElementById("smartpayPinSetupConfirmSkipButton").className = "smartpayPinSkipButton smartpayButtonSelected";
                        this._activeState = "SETUP_PIN_CONFIRM_SKIP";
                        if (SmartpayDevice.numpadEnabled) {
                            SmartPayNumPad.close()
                        }
                        break;
                    default:
                        this.getCurrentProvider().onMoveDown();
                        break
                }
            }
        } catch (a) {
            SmartpayUtils.trace("onMoveDown failed: " + a)
        }
    },
    onBack: function() {
        try {
            if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                SmartpayUtils.trace("onBack: Closing the NumPad");
                SmartPayNumPad.isAutoActivated = false;
                SmartPayNumPad.close()
            } else {
                SmartpayUtils.trace("onBack Active State: " + this._activeState);
                SmartpayDevice.releaseEventHandler();
                SmartpayGateway.container.innerHTML = "";
                this.container.style.visibility = "hidden";
                switch (this._activeState) {
                    case "SETUP_PIN":
                    case "SETUP_PIN_SKIP":
                    case "SETUP_PIN_CONFIRM":
                    case "SETUP_PIN_CONFIRM_SKIP":
                        this._activeState = "";
                        this._pinConfirm = "";
                        this._pin = "";
                        this.hidePinSetup();
                        this.container.style.visibility = "visible";
                        this.callTheCallback({
                            success: 1
                        });
                        break;
                    default:
                        SmartpayGateway.getCurrentProvider().onBack();
                        break
                }
            }
        } catch (a) {
            SmartpayUtils.trace("onBack failed: " + a)
        }
    },
    getUniqueId: function() {
        return SmartpayDevice.getUniqueId()
    }
};
var SmartpayGatewayProvider = {
    _state: "",
    _isDataComplete: false,
    gatewayToken: "",
    _waitingForResponse: false,
    curCardImageClass: "",
    initCardRequest: function() {
        this._isDataComplete = false;
        var a = "";
        a += '<div id="smartpayPaymentCardTitle" class="smartpayPaymentCardTitle">' + SMART_PAY_LABELS.CC.TITLE + "</div>";
        a += '<div id="smartpayPaymentCardNumber" class="smartpayPaymentCardSelected" onclick="SmartpayGatewayProvider.smartpayPaymentCardNumberOnClick();"></div>';
        if (SmartpayGateway.imeEnabled) {
            a += '<input id="smartpayPaymentCardNumberInput" class="smartpayPaymentCardNumberInput" type="password" onkeydown="return SmartpayGatewayProvider.onKeyDownTerminator();"/>'
        }
        a += '<div id="smartpayPaymentCardExpTitle" class="smartpayPaymentCardExpTitle">' + SMART_PAY_LABELS.CC.EXP + "</div>";
        if (SmartpayGateway.imeEnabled) {
            a += '<input id="smartpayPaymentCardMonthInput" class="smartpayPaymentCardMonthInput" type="password" onkeydown="return SmartpayGatewayProvider.onKeyDownTerminator();"/>'
        }
        a += '<div id="smartpayPaymentCardMonth" class="smartpayPaymentCardMonth" onclick="SmartpayGatewayProvider.smartpayMonthOnClick();"></div>';
        a += '<div id="smartpayPaymentCardMonthShadow" class="smartpayPaymentCardMonthShadow" onclick="SmartpayGatewayProvider.smartpayMonthOnClick();">' + SMART_PAY_LABELS.CC.MM + "</div>";
        a += '<div id="smartpayPaymentCardExpSplitter" class="smartpayPaymentCardExpSplitter">/</div>';
        if (SmartpayGateway.imeEnabled) {
            a += '<input id="smartpayPaymentCardYearInput" class="smartpayPaymentCardYearInput" type="password" onkeydown="return SmartpayGatewayProvider.onKeyDownTerminator();"/>'
        }
        a += '<div id="smartpayPaymentCardYear" class="smartpayPaymentCardYear" onclick="SmartpayGatewayProvider.smartpayYearOnClick();"></div>';
        a += '<div id="smartpayPaymentCardYearShadow" class="smartpayPaymentCardYearShadow" onclick="SmartpayGatewayProvider.smartpayYearOnClick();">' + SMART_PAY_LABELS.CC.YY + "</div>";
        a += '<div id="smartpayPaymentCardCVVTitle" class="smartpayPaymentCardCVVTitle">' + SMART_PAY_LABELS.CC.CVV + "</div>";
        a += '<div id="smartpayPaymentCardCVVTitle2" class="smartpayPaymentCardCVVTitle2">' + SMART_PAY_LABELS.CC.CVV_DESC + "</div>";
        if (SmartpayGateway.imeEnabled) {
            a += '<input id="smartpayPaymentCardCVVInput" class="smartpayPaymentCardCVVInput" type="password" onkeydown="return SmartpayGatewayProvider.onKeyDownTerminator();"/>'
        }
        a += '<div id="smartpayPaymentCardCVV" class="smartpayPaymentCardCVV" onclick="SmartpayGatewayProvider.smartpayCVVOnClick();"></div>';
        a += '<div id="smartpayPaymentCardPayButton" class="smartpayPaymentCardPayButton smartpayButton" onclick="SmartpayGatewayProvider.smartpayPayButtonClick();">' + SMART_PAY_LABELS.CC.PAY_NOW_BUTTON + "</div>";
        a += '<div id="smartpayPaymentCardErrorText" class="smartpayPaymentCardErrorText"></div>';
        a += '<div id="smartpayPaymentCardImage" class="smartpayPaymentCardImage smartpayPaymentCardImageDefault"></div>';
        a += '<div id="smartpayNumPad" class="smartpayNumPad smartPayNumPadGradient"></div>';
        var b = null;
        var c = document.getElementById("smartpayPaymentCardContainer");
        if (!c) {
            b = document.createElement("div");
            b.setAttribute("id", "smartpayPaymentCardContainer");
            c = document.getElementById("smartpayDialogueContainer").appendChild(b)
        }
        c.innerHTML = a;
        c.style.visibility = "visible";
        this.selectCardNumber()
    },
    onKeyDownTerminator: function() {
        return false
    },
    smartpayPaymentCardNumberOnClick: function() {
        SmartpayGatewayProvider.selectCardNumber();
        if (SmartpayDevice.numpadAutoActivated && !SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.setTarget(SmartpayGatewayProvider);
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    smartpayMonthOnClick: function() {
        SmartpayGatewayProvider.selectMonth();
        if (SmartpayDevice.numpadAutoActivated && !SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.setTarget(SmartpayGatewayProvider);
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    smartpayYearOnClick: function() {
        SmartpayGatewayProvider.selectYear();
        if (SmartpayDevice.numpadAutoActivated && !SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.setTarget(SmartpayGatewayProvider);
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    smartpayCVVOnClick: function() {
        SmartpayGatewayProvider.selectCVV();
        if (SmartpayDevice.numpadAutoActivated && !SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.setTarget(SmartpayGatewayProvider);
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    smartpayPayButtonClick: function() {
        if (this._isDataComplete) {
            this.pay(this.token, document.getElementById("smartpayPaymentCardNumber").innerHTML.replace(/-/g, ""), document.getElementById("smartpayPaymentCardMonth").innerHTML, document.getElementById("smartpayPaymentCardYear").innerHTML, document.getElementById("smartpayPaymentCardCVV").innerHTML)
        }
    },
    smartPaySelectSetupPin: function() {
        if (SmartpayGateway.imeEnabled) {
            document.getElementById("setSetupPinInput").focus()
        }
    },
    smartPaySelectConfirmPin: function() {
        if (SmartpayGateway.imeEnabled) {
            document.getElementById("setSetupPinConfirmInput").focus()
        }
    },
    smartPaySelectPin: function() {
        if (SmartpayGateway.imeEnabled) {
            document.getElementById("setPinInput").focus()
        }
    },
    smartpayTransactionErrorBackButtonClick: function() {
        this.hideCardRequest();
        SmartpayGateway.getProductInfo()
    },
    smartpaySkipPinButtonClick: function() {
        SmartpayUtils.trace("Skipping saving the pin");
        SmartpayGateway._activeState = "";
        SmartpayGateway._pinConfirm = "";
        SmartpayGateway._pin = "";
        SmartpayGateway.hidePinSetup();
        SmartpayGateway.container.style.visibility = "visible";
        SmartpayGateway.callTheCallback({
            success: 1
        })
    },
    showCardRequest: function() {
        var a = document.getElementById("smartpayPaymentCardContainer");
        if (a) {
            a.style.visibility = "visible"
        } else {
            this.initCardRequest()
        }
    },
    hideCardRequest: function() {
        var a = document.getElementById("smartpayPaymentCardContainer");
        if (a) {
            a.style.visibility = "hidden"
        }
    },
    showError: function(a, d) {
        this._isDataComplete = false;
        var b = "";
        b += '<div id="smartpayPaymentCardErrorTitle" class="smartpayPaymentCardErrorTitle">' + (d || SMART_PAY_LABELS.CC.TRANSACTION_FAILED_TITLE) + "</div>";
        b += '<div id="smartpayPaymentCardErrorText" class="smartpayPaymentCardErrorText">' + a + "</div>";
        b += '<div id="smartpayPaymentMethodCancelButton" class="smartpayPaymentMethodCancelButton smartpayButtonSelected" onclick="SmartpayGatewayProvider.smartpayTransactionErrorBackButtonClick();">' + SMART_PAY_LABELS.CC.BACK_BUTTON + "</div>";
        var c = null;
        var e = document.getElementById("smartpayPaymentCardContainer");
        if (!e) {
            c = document.createElement("div");
            c.setAttribute("id", "smartpayPaymentCardContainer");
            e = document.getElementById("smartpayDialogueContainer").appendChild(c)
        }
        e.innerHTML = b;
        e.style.visibility = "visible";
        this._state = "error"
    },
    showPaymentMethodCofirmation: function(a, c) {
        var b = "";
        b += '<div id="smartpayPaymentCardTitle" class="smartpayPaymentCardTitle">' + SMART_PAY_LABELS.CONFIRM_PAY.TITLE + "</div>";
        b += '<div id="smartpayPaymentCardDetails" class="smartpayPaymentCardDetails ' + this.getCCImageClass(c) + '">XXXXXXXXX-' + a + "</div>";
        b += '<div id="smartpayPaymentMethodCofirmationButton" onclick="SmartpayGatewayProvider.pay(SmartpayGatewayProvider.gatewayToken);" class="smartpayPaymentMethodCofirmationButton smartpayButtonSelected">' + SMART_PAY_LABELS.CONFIRM_PAY.PAY_NOW_BUTTON + "</div>";
        b += '<div id="smartpayPaymentMethodCancelButton" onclick="SmartpayGateway.resetPinCode();" class="smartpayPaymentMethodCancelButton smartpayButton">' + SMART_PAY_LABELS.CONFIRM_PAY.CANCEL_BUTTON + "</div>";
        b += '<div id="smartpayPaymentCardErrorText" class="smartpayPaymentMethodErrorText"></div>';
        var d = null;
        var e = document.getElementById("smartpayPaymentCardContainer");
        if (!e) {
            d = document.createElement("div");
            d.setAttribute("id", "smartpayPaymentCardContainer");
            e = document.getElementById("smartpayDialogueContainer").appendChild(d)
        }
        e.innerHTML = b;
        e.style.visibility = "visible";
        this._state = "paymentCardConfirmation"
    },
    confirmPaymentMethod: function(a, b, c) {
        this.gatewayToken = a;
        this.showPaymentMethodCofirmation(b, c)
    },
    pay: function(b, f, a, c, d) {
        var e = "";
        if (!this._waitingForResponse) {
            this._waitingForResponse = true;
            this.hideCardRequest();
            SmartpayGateway.showWaiting();
            if (f && a && c && d) {
                e = "&ccNum=" + f + "&expMon=" + a + "&expYear=" + c + "&cvv=" + d
            }
            SmartpayUtils.trace("pay :: " + SmartpayGateway.API_BASE + "iframe/post?productId=" + SmartpayGateway._productId + "&gatewayToken=" + b + e);
            SmartpayUtils.SmartpayXMLHttpRequest("POST", SmartpayGateway.API_BASE + "iframe/post?productId=" + SmartpayGateway._productId + "&gatewayToken=" + b + e, true, this, this.payCallback)
        }
    },
    payCallback: function(a) {
        this._waitingForResponse = false;
        SmartpayGateway.hideWaiting();
        SmartpayUtils.trace("payCallback: " + a ? SmartpayUtils.serialize(a) : "Response is empty");
        if (document.getElementById("smartpayPaymentCardPayButton")) {
            document.getElementById("smartpayPaymentCardPayButton").className = "smartpayPaymentCardPayButton smartpayButton";
            document.getElementById("smartpayPaymentCardNumber").className = "smartpayPaymentCard";
            document.getElementById("smartpayPaymentCardMonth").className = "smartpayPaymentCardMonth";
            document.getElementById("smartpayPaymentCardYear").className = "smartpayPaymentCardYear"
        }
        this._isDataComplete = false;
        this._state = "";
        var b = typeof(a) == "string" ? SmartpayJsonParser(a) : a;
        if (b && b.success) {
            SmartpayUtils.trace("successfull payment");
            if (SmartpayGateway._hasPinCode || !SmartpayDevice.getUniqueId()) {
                SmartpayGateway.callTheCallback({
                    success: 1
                })
            } else {
                SmartpayGateway._activeState = "SETUP_PIN";
                SmartpayGateway.showPinSetup()
            }
        } else {
            if (b) {
                SmartpayUtils.trace("failed payment");
                SmartpayGateway._pin = "";
                SmartpayGateway._pinConfirm = "";
                SmartpayGatewayProvider.showError(SmartpayGatewayProvider.getPostErrorByErrorId(b.error_id))
            }
        }
    },
    callPayFailure: function() {
        SmartpayGateway.callTheCallback({
            error: 1
        })
    },
    getOpenErrorByErrorId: function(a) {
        switch (parseInt(a)) {
            case 10:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_10;
            case 20:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_20.replace("<id>", SmartpayGateway._productId);
            case 30:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_30;
            case 40:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_40;
            case 50:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_50;
            case 60:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_60;
            case 70:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_70;
            case 80:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_80;
            case 90:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_90;
            case 110:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_110;
            case 120:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_120;
            case 130:
                return SMART_PAY_LABELS.CC.ERROR_TOPEN_130.replace("<id>", SmartpayGateway._productId);
            default:
                return SMART_PAY_LABELS.CC.ERROR_UNKNOWN
        }
    },
    getPostErrorByErrorId: function(a) {
        switch (parseInt(a)) {
            case 10:
                return SMART_PAY_LABELS.CC.ERROR_POST_10;
            case 20:
                return SMART_PAY_LABELS.CC.ERROR_POST_20;
            case 30:
                return SMART_PAY_LABELS.CC.ERROR_POST_30.replace("<id>", SmartpayGateway._productId);
            case 40:
                return SMART_PAY_LABELS.CC.ERROR_POST_40;
            case 50:
                return SMART_PAY_LABELS.CC.ERROR_POST_50;
            case 60:
                return SMART_PAY_LABELS.CC.ERROR_POST_60;
            case 70:
                return SMART_PAY_LABELS.CC.ERROR_POST_70;
            case 80:
                return SMART_PAY_LABELS.CC.ERROR_POST_80;
            case 90:
                return SMART_PAY_LABELS.CC.ERROR_POST_90;
            case 110:
                return SMART_PAY_LABELS.CC.ERROR_POST_110;
            case 120:
                return SMART_PAY_LABELS.CC.ERROR_POST_120;
            case 130:
                return SMART_PAY_LABELS.CC.ERROR_POST_130.replace("<id>", SmartpayGateway._productId);
            default:
                return SMART_PAY_LABELS.CC.ERROR_UNKNOWN
        }
    },
    getProductErrorByErrorId: function(a) {
        switch (parseInt(a)) {
            case 10:
                return SMART_PAY_LABELS.CC.ERROR_PRODUCT_10.replace("<id>", SmartpayGateway._productId);
            case 20:
                return SMART_PAY_LABELS.CC.ERROR_PRODUCT_20;
            case 30:
                return SMART_PAY_LABELS.CC.ERROR_PRODUCT_30;
            default:
                return SMART_PAY_LABELS.CC.ERROR_UNKNOWN
        }
    },
    getCCImageClass: function(b) {
        var a = "";
        switch (b) {
            case "0":
                a = "smartpayPaymentCardImageVisa";
                break;
            case "1":
                a = "smartpayPaymentCardImageMasterCard";
                break;
            case "2":
                a = "smartpayPaymentCardImageAmEx";
                break;
            default:
                a = "smartpayPaymentCardImageDefault";
                break
        }
        return a
    },
    getCreditCardImageClass: function(b) {
        var a = "smartpayPaymentCardImageDefault";
        if (b.indexOf("1604") === 0 || b.indexOf("1011") === 0 || b.indexOf("1206") === 0 || b.indexOf("2007") === 0) {
            a = "smartpayPaymentCardDev"
        } else {
            if (/^5[1-5]/.test(b)) {
                a = "smartpayPaymentCardImageMasterCard"
            } else {
                if (/^4/.test(b)) {
                    a = "smartpayPaymentCardImageVisa"
                } else {
                    if (/^3[47]/.test(b)) {
                        a = "smartpayPaymentCardImageAmEx"
                    }
                }
            }
        }
        return a
    },
    showBackCard: function() {
        document.getElementById("smartpayPaymentCardImage").className = "smartpayPaymentCardImage smartpayPaymentCardImageDefaultBack"
    },
    hideBackCard: function() {
        var a = document.getElementById("smartpayPaymentCardNumber");
        document.getElementById("smartpayPaymentCardImage").className = "smartpayPaymentCardImage  " + this.getCreditCardImageClass(a.innerHTML.replace(/-/g, ""))
    },
    selectCardNumber: function() {
        document.getElementById("smartpayPaymentCardMonth").className = "smartpayPaymentCardMonth";
        document.getElementById("smartpayPaymentCardYear").className = "smartpayPaymentCardYear";
        document.getElementById("smartpayPaymentCardCVV").className = "smartpayPaymentCardCVV";
        document.getElementById("smartpayPaymentCardNumber").className = "smartpayPaymentCardSelected";
        this._state = "paymentCardNumber";
        this.hideBackCard();
        var a = document.getElementById("smartpayPaymentCardNumberInput");
        if (SmartpayGateway.imeEnabled) {
            a.focus()
        }
        if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    selectMonth: function() {
        var b = document.getElementById("smartpayPaymentCardNumber");
        if (b && b.innerHTML.replace(/-/g, "").length > 0) {
            document.getElementById("smartpayPaymentCardMonth").className = "smartpayPaymentCardMonthSelected";
            document.getElementById("smartpayPaymentCardYear").className = "smartpayPaymentCardYear";
            document.getElementById("smartpayPaymentCardCVV").className = "smartpayPaymentCardCVV";
            document.getElementById("smartpayPaymentCardNumber").className = "smartpayPaymentCard";
            this._state = "paymentCardMonth";
            this.hideBackCard();
            var a = document.getElementById("smartpayPaymentCardMonthInput");
            if (SmartpayGateway.imeEnabled) {
                a.focus()
            }
        } else {
            this.selectCardNumber()
        } if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    selectYear: function() {
        var b = document.getElementById("smartpayPaymentCardMonth");
        if (b && b.innerHTML.length > 0) {
            document.getElementById("smartpayPaymentCardMonth").className = "smartpayPaymentCardMonth";
            document.getElementById("smartpayPaymentCardYear").className = "smartpayPaymentCardYearSelected";
            document.getElementById("smartpayPaymentCardCVV").className = "smartpayPaymentCardCVV";
            document.getElementById("smartpayPaymentCardNumber").className = "smartpayPaymentCard";
            this._state = "paymentCardYear";
            this.hideBackCard();
            var a = document.getElementById("smartpayPaymentCardYearInput");
            if (SmartpayGateway.imeEnabled) {
                a.focus()
            }
        } else {
            this.selectMonth()
        } if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    selectCVV: function() {
        var b = document.getElementById("smartpayPaymentCardYear");
        if (b && b.innerHTML.length > 0) {
            document.getElementById("smartpayPaymentCardMonth").className = "smartpayPaymentCardMonth";
            document.getElementById("smartpayPaymentCardYear").className = "smartpayPaymentCardYear";
            document.getElementById("smartpayPaymentCardCVV").className = "smartpayPaymentCardCVVSelected";
            document.getElementById("smartpayPaymentCardNumber").className = "smartpayPaymentCard";
            document.getElementById("smartpayPaymentCardPayButton").className = "smartpayPaymentCardPayButton smartpayButton";
            this._state = "paymentCardCVV";
            this.showBackCard();
            var a = document.getElementById("smartpayPaymentCardCVVInput");
            if (SmartpayGateway.imeEnabled) {
                a.focus()
            }
        } else {
            this.selectYear()
        } if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isAutoActivated) {
            SmartPayNumPad.show(this.getNumPadTop())
        }
    },
    selectPayNow: function() {
        if (this.isPaymentCardDataComplete()) {
            document.getElementById("smartpayPaymentCardMonth").className = "smartpayPaymentCardMonth";
            document.getElementById("smartpayPaymentCardYear").className = "smartpayPaymentCardYear";
            document.getElementById("smartpayPaymentCardCVV").className = "smartpayPaymentCardCVV";
            document.getElementById("smartpayPaymentCardNumber").className = "smartpayPaymentCard";
            document.getElementById("smartpayPaymentCardPayButton").className = "smartpayPaymentCardPayButton smartpayButtonSelected";
            if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                SmartPayNumPad.close()
            }
            this._state = "paymentPayNow"
        } else {
            this.selectCVV()
        }
    },
    getNumPadTop: function() {
        var a;
        switch (this._state) {
            case "paymentCardNumber":
                a = 110;
                break;
            case "paymentCardMonth":
            case "paymentCardYear":
                a = 170;
                break;
            case "paymentCardCVV":
                a = 230;
                break;
            default:
                a = 230;
                break
        }
        return a
    },
    onSelectField: function(a) {
        if (a == "NEXT") {
            SmartPayNumPad.close();
            SmartpayGatewayProvider.onMoveDown();
            if (SmartpayGatewayProvider._state != "paymentPayNow") {
                SmartPayNumPad.show(SmartpayGatewayProvider.getNumPadTop())
            }
        } else {
            if (a == "DELETE") {
                SmartPayNumPad.close();
                SmartpayGatewayProvider.onMoveLeft();
                SmartPayNumPad.show(SmartpayGatewayProvider.getNumPadTop())
            }
        }
    },
    onSelect: function() {
        try {
            switch (this._state) {
                case "paymentCardConfirmation":
                    this.pay(this.gatewayToken);
                    break;
                case "paymentCardCancel":
                    SmartpayGateway.resetPinCode();
                    break;
                case "paymentCardNumber":
                case "paymentCardMonth":
                case "paymentCardYear":
                case "paymentCardCVV":
                    if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                        SmartPayNumPad.select()
                    } else {
                        if (SmartpayDevice.numpadEnabled && !SmartPayNumPad.isVisible) {
                            SmartPayNumPad.setTarget(this);
                            SmartPayNumPad.show(this.getNumPadTop())
                        }
                    }
                    break;
                case "paymentPayNow":
                    this.smartpayPayButtonClick();
                    break;
                case "error":
                    this.smartpayTransactionErrorBackButtonClick();
                    break
            }
        } catch (a) {
            SmartpayUtils.trace("onSelect failed: " + a)
        }
    },
    onNumber: function(j) {
        try {
            SmartpayUtils.trace("onNumber :: " + this._state);
            switch (this._state) {
                case "paymentCardNumber":
                    var f = document.getElementById("smartpayPaymentCardNumber");
                    if (f && f.innerHTML.replace(/-/g, "").length < 16) {
                        if ((f.innerHTML.replace(/-/g, "").length) % 4 === 0 && f.innerHTML.replace(/-/g, "").length > 0) {
                            f.innerHTML = f.innerHTML + "-"
                        }
                        f.innerHTML = f.innerHTML + j.toString()
                    }
                    if (f && f.innerHTML.replace(/-/g, "").length == 16) {
                        this.selectMonth();
                        if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                            SmartPayNumPad.show(this.getNumPadTop())
                        }
                    }
                    document.getElementById("smartpayPaymentCardImage").className = "smartpayPaymentCardImage  " + this.getCreditCardImageClass(f.innerHTML.replace(/-/g, ""));
                    break;
                case "paymentCardMonth":
                    var b = document.getElementById("smartpayPaymentCardMonth");
                    SmartpayUtils.trace(b.innerHTML.length);
                    if (b && b.innerHTML.length == 2) {
                        b.innerHTML = ""
                    }
                    if (b && b.innerHTML + j.toString() <= 12 && b.innerHTML + j.toString() != "00") {
                        b.innerHTML = b.innerHTML + j.toString();
                        if (b.innerHTML.length) {
                            SmartpayUtils.toggleVisibility("smartpayPaymentCardMonthShadow")
                        }
                    }
                    if (b && b.innerHTML > 1 || b.innerHTML.length == 2) {
                        if (b.innerHTML.length == 1) {
                            b.innerHTML = "0" + b.innerHTML
                        }
                        this.selectYear()
                    }
                    break;
                case "paymentCardYear":
                    var k = new Date();
                    var c = k.getFullYear() - 2000;
                    var d = k.getMonth() + 1;
                    var b = document.getElementById("smartpayPaymentCardMonth");
                    var i = document.getElementById("smartpayPaymentCardYear");
                    if (i && i.innerHTML.length == 2) {
                        i.innerHTML = ""
                    }
                    if (i && i.innerHTML + j.toString() <= 99 && i.innerHTML + j.toString() != "00") {
                        i.innerHTML = i.innerHTML + j.toString();
                        if (i.innerHTML.length) {
                            SmartpayUtils.toggleVisibility("smartpayPaymentCardYearShadow")
                        }
                    }
                    if (i && i.innerHTML.length == 2) {
                        this.selectCVV()
                    }
                    break;
                case "paymentCardCVV":
                    var i = document.getElementById("smartpayPaymentCardYear");
                    var g = document.getElementById("smartpayPaymentCardCVV");
                    if (g && g.innerHTML.length == 3) {
                        g.innerHTML = ""
                    }
                    if (g && g.innerHTML.length < 3) {
                        g.innerHTML = g.innerHTML + j.toString()
                    }
                    if (g && g.innerHTML.length == 3) {
                        if (SmartpayDevice.imeEnabled) {
                            var a = document.getElementById("smartpayPaymentCardCVVInput");
                            a.blur()
                        }
                        this.selectPayNow()
                    }
                    break
            }
            this.validatePaymentCardDataComplete()
        } catch (h) {
            SmartpayUtils.trace("onNumber failed: " + h)
        }
    },
    onMoveDown: function() {
        try {
            if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                SmartPayNumPad.moveDown()
            } else {
                SmartpayUtils.trace("onMoveDown :: " + this._state);
                switch (this._state) {
                    case "paymentCardNumber":
                        var a = document.getElementById("smartpayPaymentCardNumber");
                        this.selectMonth();
                        break;
                    case "paymentCardMonth":
                        var b = document.getElementById("smartpayPaymentCardMonth");
                        if (b && b.innerHTML > 0 || b.innerHTML.length == 2) {
                            if (b.innerHTML.length == 1) {
                                b.innerHTML = "0" + b.innerHTML
                            }
                            this.selectYear()
                        }
                        break;
                    case "paymentCardYear":
                        var d = document.getElementById("smartpayPaymentCardYear");
                        if (d && d.innerHTML > 0 || d.innerHTML.length == 2) {
                            if (d.innerHTML.length == 1) {
                                d.innerHTML = "0" + d.innerHTML
                            }
                            this.selectCVV()
                        }
                        break;
                    case "paymentCardConfirmation":
                        document.getElementById("smartpayPaymentMethodCofirmationButton").className = "smartpayPaymentMethodCofirmationButton smartpayButton";
                        document.getElementById("smartpayPaymentMethodCancelButton").className = "smartpayPaymentMethodCancelButton smartpayButtonSelected";
                        this._state = "paymentCardCancel";
                        break;
                    case "paymentCardCVV":
                        this.selectPayNow();
                        break
                }
            }
            this.validatePaymentCardDataComplete()
        } catch (c) {
            SmartpayUtils.trace("onMoveDown failed: " + c)
        }
    },
    onMoveUp: function() {
        try {
            if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                SmartPayNumPad.moveUp()
            } else {
                SmartpayUtils.trace("onMoveUp :: " + this._state);
                switch (this._state) {
                    case "paymentCardMonth":
                        this.selectCardNumber();
                        break;
                    case "paymentCardYear":
                        this.selectMonth();
                        break;
                    case "paymentCardCVV":
                        this.selectYear();
                        break;
                    case "paymentPayNow":
                        this.selectCVV();
                        break;
                    case "paymentCardCancel":
                        document.getElementById("smartpayPaymentMethodCofirmationButton").className = "smartpayPaymentMethodCofirmationButton smartpayButtonSelected";
                        document.getElementById("smartpayPaymentMethodCancelButton").className = "smartpayPaymentMethodCancelButton smartpayButton";
                        this._state = "paymentCardConfirmation";
                        break
                }
            }
            this.validatePaymentCardDataComplete()
        } catch (a) {
            SmartpayUtils.trace("onMoveUp failed: " + a)
        }
    },
    onMoveLeft: function() {
        try {
            if (SmartpayDevice.numpadEnabled && SmartPayNumPad.isVisible) {
                SmartPayNumPad.moveLeft()
            } else {
                SmartpayUtils.trace("onMoveLeft :: " + this._state);
                switch (this._state) {
                    case "paymentCardNumber":
                        var b = document.getElementById("smartpayPaymentCardNumber");
                        if (b && b.innerHTML.length > 0) {
                            b.innerHTML = SmartpayUtils.removeCharacter(b.innerHTML)
                        }
                        if (b.innerHTML.charAt(b.innerHTML.length - 1) == "-") {
                            b.innerHTML = SmartpayUtils.removeCharacter(b.innerHTML)
                        }
                        document.getElementById("smartpayPaymentCardImage").className = "smartpayPaymentCardImage  " + this.getCreditCardImageClass(b.innerHTML.replace(/-/g, ""));
                        break;
                    case "paymentCardMonth":
                        var c = document.getElementById("smartpayPaymentCardMonth");
                        if (c && c.innerHTML.length) {
                            c.innerHTML = SmartpayUtils.removeCharacter(c.innerHTML);
                            if (!c.innerHTML.length) {
                                SmartpayUtils.toggleVisibility("smartpayPaymentCardMonthShadow", true)
                            }
                        } else {
                            this.selectCardNumber()
                        }
                        break;
                    case "paymentCardYear":
                        var f = document.getElementById("smartpayPaymentCardYear");
                        if (f && f.innerHTML.length) {
                            f.innerHTML = SmartpayUtils.removeCharacter(f.innerHTML);
                            if (!f.innerHTML.length) {
                                SmartpayUtils.toggleVisibility("smartpayPaymentCardYearShadow", true)
                            }
                        } else {
                            this.selectMonth()
                        }
                        break;
                    case "paymentCardCVV":
                        var a = document.getElementById("smartpayPaymentCardCVV");
                        if (a && a.innerHTML.length) {
                            a.innerHTML = SmartpayUtils.removeCharacter(a.innerHTML)
                        } else {
                            this.selectYear()
                        }
                        break
                }
                this.validatePaymentCardDataComplete()
            }
        } catch (d) {
            SmartpayUtils.trace("onMoveLeft failed: " + d)
        }
    },
    onMoveRight: function() {
        try {
            if (SmartpayDevice.numpadEnabled) {
                switch (this._state) {
                    case "paymentCardNumber":
                    case "paymentCardMonth":
                    case "paymentCardYear":
                    case "paymentCardCVV":
                        if (SmartpayDevice.numpadEnabled) {
                            if (SmartPayNumPad.isVisible) {
                                SmartPayNumPad.moveRight()
                            } else {
                                SmartPayNumPad.setTarget(this);
                                SmartPayNumPad.show(this.getNumPadTop())
                            }
                        }
                        break
                }
            } else {
                SmartpayUtils.trace("onMoveRight :: " + this._state);
                switch (this._state) {
                    case "paymentCardNumber":
                        this.selectMonth();
                        break;
                    case "paymentCardMonth":
                        var a = document.getElementById("smartpayPaymentCardMonth");
                        if (a && a.innerHTML > 0 || a.innerHTML.length == 2) {
                            if (a.innerHTML.length == 1) {
                                a.innerHTML = "0" + a.innerHTML
                            }
                            this.selectYear()
                        }
                        break;
                    case "paymentCardYear":
                        var c = document.getElementById("smartpayPaymentCardYear");
                        if (c && c.innerHTML > 0 || c.innerHTML.length == 2) {
                            if (c.innerHTML.length == 1) {
                                c.innerHTML = "0" + c.innerHTML
                            }
                            this.selectCVV()
                        }
                        break
                }
            }
        } catch (b) {
            SmartpayUtils.trace("onMoveRight failed: " + b)
        }
    },
    onBack: function() {
        try {
            SmartpayUtils.trace("onBack");
            SmartpayGateway._activeState = "";
            SmartpayGateway._pinConfirm = "";
            SmartpayGateway._pin = "";
            SmartpayGateway.hidePinSetup();
            SmartpayGateway.container.style.visibility = "visible";
            SmartpayGateway.callTheCallback({
                back: 1
            })
        } catch (a) {
            SmartpayUtils.trace("onBack failed: " + a)
        }
    },
    validatePaymentCardDataComplete: function() {
        if (this.isPaymentCardDataComplete()) {
            document.getElementById("smartpayPaymentCardPayButton").className = "smartpayPaymentCardPayButton smartpayButtonSelected";
            this._isDataComplete = true
        } else {
            document.getElementById("smartpayPaymentCardPayButton").className = "smartpayPaymentCardPayButton smartpayButton";
            this._isDataComplete = false
        }
    },
    isPaymentCardDataComplete: function() {
        var c = new Date();
        var f = c.getFullYear() - 2000;
        var e = c.getMonth() + 1;
        var d = document.getElementById("smartpayPaymentCardMonth");
        var g = document.getElementById("smartpayPaymentCardYear");
        var b = document.getElementById("smartpayPaymentCardNumber");
        var a = document.getElementById("smartpayPaymentCardCVV");
        if (!b || !SmartpayUtils.luhnCheck(b.innerHTML)) {
            return false
        }
        if (!d || d.innerHTML < 1 || d.innerHTML > 12) {
            return false
        }
        if (g.innerHTML < f || (g.innerHTML == f && d.innerHTML < e)) {
            return false
        }
        if (a.innerHTML.length < 3) {
            return false
        }
        return true
    }
};
var SmartpayUtils = {
    SmartpayXMLHttpRequest: function(a, b, c, i, h, g) {
        var e = new XMLHttpRequest();
        var d = null;
        b += "&version=" + SmartpayGateway.VERSION;
        SmartpayUtils.trace("SmartpayXMLHttpRequest URL: " + b);
        var f = b.split("?");
        if (a === "POST") {
            e.open(a, f[0], c);
            e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            e.setRequestHeader("Content-length", (f[1] ? f[1].length : 0));
            e.setRequestHeader("Connection", "close")
        } else {
            e.open(a, b, c)
        } if (b.substr(b.lastIndexOf(".") + 1) == "xml") {
            e.setRequestHeader("Content-Type", "text/xml; charset=utf-8")
        }
        if (typeof(h) == "function") {
            e.onreadystatechange = function() {
                if (e.readyState == 4) {
                    if (typeof(h) == "function") {
                        if (e.status == 200 || e.status == 304 || e.status == 0) {
                            if (typeof(e.responseText) === "string" && (!g || !g.responseXML)) {
                                d = e.responseText
                            } else {
                                if (typeof(e.responseXML) === "object") {
                                    d = e.responseXML
                                }
                            }
                        } else {
                            d = {
                                error: "XML HTTP error",
                                message: "XML HTTP error " + e.status
                            }
                        }
                        h.call(i, d, g)
                    }
                    delete e.onreadystatechange;
                    e.onreadystatechange = null
                }
            }
        }
        e.send((a == "POST" ? (f[1] ? f[1] : "") : null))
    },
    isEmailValid: function(a) {
        var b = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return b.test(a)
    },
    serialize: function(c) {
        var a = "";
        var b;
        switch (this.typeOf(c)) {
            case "array":
                a = "[";
                for (b in c) {
                    if (a != "[") {
                        a += ", "
                    }
                    a += this.serialize(c[b])
                }
                a += "]";
                break;
            case "object":
                a = "{";
                for (b in c) {
                    if (a != "{") {
                        a += ", "
                    }
                    a += '"' + b + '":' + this.serialize(c[b])
                }
                a += "}";
                break;
            case "string":
                a = '"' + c + '"';
                break;
            case "function":
                a = "function";
                break;
            default:
                a = c;
                break
        }
        return a
    },
    typeOf: function(b) {
        var a = typeof(b);
        if (a == "object") {
            if (b !== null) {
                if (typeof(b.length) == "number" && !(b.propertyIsEnumerable("length")) && typeof(b.splice) == "function") {
                    a = "array"
                }
            } else {
                a = "null"
            }
        }
        return a
    },
    luhnCheck: function(a) {
        return true
    },
    toggleVisibility: function(a, b) {
        a = typeof(a) == "string" ? document.getElementById(a) : a;
        if (a) {
            if (b) {
                a.style.visibility = "visible"
            } else {
                a.style.visibility = "hidden"
            }
        }
    },
    removeCharacter: function(a) {
        if (a.length > 0) {
            a = a.substring(0, a.length - 1)
        }
        return a
    },
    checkImportantData: function(c, f, e, a) {
        var b = null,
            d = null;
        b = c;
        d = f;
        if (b && d) {
            if (e) {
                return true
            } else {
                if (a) {
                    return false
                }
            }
        }
        return d
    },
    trace: function(b) {
        try {} catch (a) {}
    },
    supportsEventHandling: function() {
        var a = false;
        if (navigator.userAgent.indexOf("SmartHub") > 0 || navigator.userAgent.indexOf("NetCast") > 0) {
            a = true
        } else {
            if (navigator.userAgent.indexOf("Maple") > 0) {
                a = false
            }
        }
        this.trace("SmartpayUtils.supportsEventHandling : " + a);
        return a
    }
};
var SmartPayNumPad = {
    isVisible: false,
    isAutoActivated: false,
    selectedX: 0,
    selectedY: 0,
    onSelect: function() {},
    target: null,
    buttons: [
        [{
            value: "7",
            type: "small",
            action: "7"
        }, {
            value: "8",
            type: "small",
            action: "8"
        }, {
            value: "9",
            type: "small",
            action: "9"
        }, {
            value: "<",
            type: "small",
            action: "DELETE"
        }],
        [{
            value: "4",
            type: "small",
            action: "4"
        }, {
            value: "5",
            type: "small",
            action: "5"
        }, {
            value: "6",
            type: "small",
            action: "6"
        }, {
            value: "NEXT",
            type: "high",
            action: "NEXT"
        }],
        [{
            value: "1",
            type: "small",
            action: "1"
        }, {
            value: "2",
            type: "small",
            action: "2"
        }, {
            value: "3",
            type: "small",
            action: "3"
        }, {
            value: "",
            type: "placeholder",
            action: "NEXT"
        }],
        [{
            value: "0",
            type: "wide",
            action: "0"
        }, {
            value: "",
            type: "placeholder",
            action: "0"
        }, {
            value: ".",
            type: "small",
            action: "DOT"
        }, {
            value: "",
            type: "placeholder",
            action: "NEXT"
        }]
    ],
    selectedButton: null,
    show: function(m) {
        this.selectedButton = this.buttons[this.selectedY][this.selectedX];
        var a = document.getElementById("smartpayNumPad");
        var c = "";
        if (a) {
            if (m) {
                a.style.top = m + "px"
            }
            var p = 52;
            var k = 5;
            var h = 4;
            var b = 7;
            for (var f = 0; f < this.buttons.length; f++) {
                var q = this.buttons[f];
                var n = p * f;
                for (var e = 0; e < q.length; e++) {
                    var g = q[e];
                    var d = this.selectedButton.action == g.action;
                    var l;
                    var o;
                    switch (g.type) {
                        case "small":
                        case "placeholder":
                            l = 47;
                            o = 47;
                            break;
                        case "high":
                            l = 47;
                            o = 151;
                            break;
                        case "wide":
                            l = 99;
                            o = 47;
                            break
                    }
                    c += '<div name="smartPayNumPadAction' + g.action + '" style="left:' + (b + e * (l + k)) + "px; top:" + (h + n + k) + "px; width: " + l + "px; height: " + o + "px;line-height: " + o + 'px;" class="' + (g.type == "placeholder" ? "" : "smartpayNumPadButton" + (d ? "Selected" : "")) + '" onmouseup="SmartPayNumPad.select()" onmouseover="SmartPayNumPad.onMouseMoveEvent(' + e + "," + f + ')">' + g.value + "</div>"
                }
            }
            c += '<div class="smartpayNumPadArrow"></div>';
            a.innerHTML = c;
            a.style.visibility = "visible";
            this.isVisible = true;
            this.isAutoActivated = true
        }
    },
    setTarget: function(a) {
        this.onSelect = a.onSelectField;
        this.target = a
    },
    onMouseMoveEvent: function(a, b) {
        SmartPayNumPad.selectedX = a;
        SmartPayNumPad.selectedY = b;
        SmartPayNumPad.show()
    },
    moveRight: function() {
        if (this.selectedX < this.buttons[this.selectedY].length - 1) {
            this.selectedX++;
            if (this.selectedY == 3 && this.selectedX == 1) {
                this.selectedX++
            }
            this.show()
        }
    },
    moveLeft: function() {
        if (this.selectedX > 0) {
            this.selectedX--;
            if (this.selectedX == 1 && this.selectedY == 3) {
                this.selectedX = 0
            }
            this.show()
        } else {
            this.close()
        }
    },
    moveUp: function() {
        if (this.selectedY > 0) {
            this.selectedY--;
            if (this.selectedX == 3) {
                this.selectedY = 0
            }
            this.show()
        }
    },
    moveDown: function() {
        if (this.selectedY < this.buttons.length - 1) {
            this.selectedY++;
            if (this.selectedX == 3) {
                this.selectedY = 3
            }
            this.show()
        }
    },
    select: function() {
        if (this.selectedButton.action >= 0 && this.selectedButton.action <= 9) {
            this.target.onNumber(this.selectedButton.action)
        }
        this.onSelect(this.selectedButton.action)
    },
    close: function() {
        var a = document.getElementById("smartpayNumPad");
        if (a) {
            a.innerHTML = "";
            a.style.visibility = "hidden";
            this.isVisible = false
        }
    }
};
window.SmartpayJsonParser = function() {
    var h = "(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)",
        d = '(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';
    d = '(?:"' + d + '*")';
    var g = new RegExp("(?:false|true|null|[\\{\\}\\[\\]]|" + h + "|" + d + ")", "g"),
        f = new RegExp("\\\\(?:([^u])|u(.{4}))", "g"),
        e = {
            '"': '"',
            "/": "/",
            "\\": "\\",
            b: "\u0008",
            f: "\u000c",
            n: "\n",
            r: "\r",
            t: "\t"
        };

    function c(k, i, l) {
        return i ? e[i] : String.fromCharCode(parseInt(l, 16))
    }
    var b = new String(""),
        a = Object.hasOwnProperty;
    return function(q, o) {
        q = q.match(g);
        var r, t = q[0],
            n = false;
        if ("{" === t) {
            r = {}
        } else {
            if ("[" === t) {
                r = []
            } else {
                r = [];
                n = true
            }
        }
        for (var v, s = [r], k = 1 - n, u = q.length; k < u; ++k) {
            t = q[k];
            var w;
            switch (t.charCodeAt(0)) {
                default: w = s[0];
                w[v || w.length] = +t;
                v = void 0;
                break;
                case 34:
                    t = t.substring(1, t.length - 1);
                    if (t.indexOf("\\") !== -1) {
                        t = t.replace(f, c)
                    }
                    w = s[0];
                    if (!v) {
                        if (w instanceof Array) {
                            v = w.length
                        } else {
                            v = t || b;
                            break
                        }
                    }
                    w[v] = t;
                    v = void 0;
                    break;
                case 91:
                    w = s[0];
                    s.unshift(w[v || w.length] = []);
                    v = void 0;
                    break;
                case 93:
                    s.shift();
                    break;
                case 102:
                    w = s[0];
                    w[v || w.length] = false;
                    v = void 0;
                    break;
                case 110:
                    w = s[0];
                    w[v || w.length] = null;
                    v = void 0;
                    break;
                case 116:
                    w = s[0];
                    w[v || w.length] = true;
                    v = void 0;
                    break;
                case 123:
                    w = s[0];
                    s.unshift(w[v || w.length] = {});
                    v = void 0;
                    break;
                case 125:
                    s.shift();
                    break
            }
        }
        if (n) {
            if (s.length !== 1) {
                throw new Error
            }
            r = r[0]
        } else {
            if (s.length) {
                throw new Error
            }
        } if (o) {
            var i = function(y, x) {
                var p = y[x];
                if (p && typeof p === "object") {
                    var j = null;
                    for (var l in p) {
                        if (a.call(p, l) && p !== y) {
                            var m = i(p, l);
                            if (m !== void 0) {
                                p[l] = m
                            } else {
                                j || (j = []);
                                j.push(l)
                            }
                        }
                    }
                    if (j) {
                        for (l = j.length; --l >= 0;) {
                            delete p[j[l]]
                        }
                    }
                }
                return o.call(y, x, p)
            };
            r = i({
                "": r
            }, "")
        }
        return r
    }
}();