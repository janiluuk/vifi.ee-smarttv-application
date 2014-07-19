var COMPILED = !0,
    goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(a) {
    if (!COMPILED) {
        if (goog.getObjectByName(a) && !goog.implicitNamespaces_[a]) throw Error('Namespace "' + a + '" already declared.');
        for (var b = a; b = b.substring(0, b.lastIndexOf("."));) goog.implicitNamespaces_[b] = !0
    }
    goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
    if (COMPILED && !goog.DEBUG) throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
};
if (!COMPILED) goog.implicitNamespaces_ = {};
goog.exportPath_ = function(a, b, c) {
    a = a.split(".");
    c = c || goog.global;
    !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
    for (var d; a.length && (d = a.shift());)!a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
};
goog.getObjectByName = function(a, b) {
    for (var c = a.split("."), d = b || goog.global, e; e = c.shift();)
        if (goog.isDefAndNotNull(d[e])) d = d[e];
        else return null;
    return d
};
goog.globalize = function(a, b) {
    var c = b || goog.global,
        d;
    for (d in a) c[d] = a[d]
};
goog.addDependency = function(a, b, c) {
    if (!COMPILED) {
        for (var d, a = a.replace(/\\/g, "/"), e = goog.dependencies_, f = 0; d = b[f]; f++) e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0;
        for (d = 0; b = c[d]; d++) a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
};
goog.require = function(a) {
    if (!COMPILED && !goog.getObjectByName(a)) {
        var b = goog.getPathFromDeps_(a);
        if (b) goog.included_[b] = !0, goog.writeScripts_();
        else throw a = "goog.require could not find: " + a, goog.global.console && goog.global.console.error(a), Error(a);
    }
};
goog.basePath = "";
goog.nullFunction = function() {};
goog.identityFunction = function(a) {
    return a
};
goog.abstractMethod = function() {
    throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
    a.getInstance = function() {
        return a.instance_ || (a.instance_ = new a)
    }
};
if (!COMPILED) goog.included_ = {}, goog.dependencies_ = {
    pathToNames: {},
    nameToPath: {},
    requires: {},
    visited: {},
    written: {}
}, goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return typeof a != "undefined" && "write" in a
}, goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH;
    else if (goog.inHtmlDocument_())
        for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1; b >= 0; --b) {
            var c = a[b].src,
                d = c.lastIndexOf("?"),
                d = d == -1 ? c.length : d;
            if (c.substr(d -
                7, 7) == "base.js") {
                goog.basePath = c.substr(0, d - 7);
                break
            }
        }
}, goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
    return goog.inHtmlDocument_() ? (goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>'), !0) : !1
}, goog.writeScripts_ = function() {
    function a(e) {
        if (!(e in d.written)) {
            if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires))
                for (var g in d.requires[e])
                    if (g in
                        d.nameToPath) a(d.nameToPath[g]);
                    else
            if (!goog.getObjectByName(g)) throw Error("Undefined nameToPath for " + g);
            e in c || (c[e] = !0, b.push(e))
        }
    }
    var b = [],
        c = {},
        d = goog.dependencies_,
        e;
    for (e in goog.included_) d.written[e] || a(e);
    for (e = 0; e < b.length; e++)
        if (b[e]) goog.importScript_(goog.basePath + b[e]);
        else throw Error("Undefined script input");
}, goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath +
    "deps.js");
goog.typeOf = function(a) {
    var b = typeof a;
    if (b == "object")
        if (a) {
            if (a instanceof Array) return "array";
            else if (a instanceof Object) return b;
            var c = Object.prototype.toString.call(a);
            if (c == "[object Window]") return "object";
            if (c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) return "array";
            if (c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) return "function"
        } else return "null";
    else
    if (b ==
        "function" && typeof a.call == "undefined") return "object";
    return b
};
goog.propertyIsEnumerableCustom_ = function(a, b) {
    if (b in a)
        for (var c in a)
            if (c == b && Object.prototype.hasOwnProperty.call(a, b)) return !0;
    return !1
};
goog.propertyIsEnumerable_ = function(a, b) {
    return a instanceof Object ? Object.prototype.propertyIsEnumerable.call(a, b) : goog.propertyIsEnumerableCustom_(a, b)
};
goog.isDef = function(a) {
    return a !== void 0
};
goog.isNull = function(a) {
    return a === null
};
goog.isDefAndNotNull = function(a) {
    return a != null
};
goog.isArray = function(a) {
    return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
    var b = goog.typeOf(a);
    return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
    return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
    return typeof a == "string"
};
goog.isBoolean = function(a) {
    return typeof a == "boolean"
};
goog.isNumber = function(a) {
    return typeof a == "number"
};
goog.isFunction = function(a) {
    return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
    a = goog.typeOf(a);
    return a == "object" || a == "array" || a == "function"
};
goog.getUid = function(a) {
    return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
    "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
    try {
        delete a[goog.UID_PROPERTY_]
    } catch (b) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
    var b = goog.typeOf(a);
    if (b == "object" || b == "array") {
        if (a.clone) return a.clone();
        var b = b == "array" ? [] : {},
            c;
        for (c in a) b[c] = goog.cloneObject(a[c]);
        return b
    }
    return a
};
goog.bindNative_ = function(a) {
    return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b) {
    var c = b || goog.global;
    if (arguments.length > 2) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
            var b = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(b, d);
            return a.apply(c, b)
        }
    } else return function() {
        return a.apply(c, arguments)
    }
};
goog.bind = function() {
    goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
    return goog.bind.apply(null, arguments)
};
goog.partial = function(a) {
    var b = Array.prototype.slice.call(arguments, 1);
    return function() {
        var c = Array.prototype.slice.call(arguments);
        c.unshift.apply(c, b);
        return a.apply(this, c)
    }
};
goog.mixin = function(a, b) {
    for (var c in b) a[c] = b[c]
};
goog.now = Date.now || function() {
    return +new Date
};
goog.globalEval = function(a) {
    if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
    else if (goog.global.eval) {
        if (goog.evalWorksForGlobals_ == null) goog.global.eval("var _et_ = 1;"), typeof goog.global._et_ != "undefined" ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1;
        if (goog.evalWorksForGlobals_) goog.global.eval(a);
        else {
            var b = goog.global.document,
                c = b.createElement("script");
            c.type = "text/javascript";
            c.defer = !1;
            c.appendChild(b.createTextNode(a));
            b.body.appendChild(c);
            b.body.removeChild(c)
        }
    } else throw Error("goog.globalEval not available");
};
goog.getCssName = function(a, b) {
    var c = function(a) {
            return goog.cssNameMapping_[a] || a
        },
        d;
    d = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? c : function(a) {
        for (var a = a.split("-"), b = [], d = 0; d < a.length; d++) b.push(c(a[d]));
        return b.join("-")
    } : function(a) {
        return a
    };
    return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
    goog.cssNameMapping_ = a;
    goog.cssNameMappingStyle_ = b
};
goog.getMsg = function(a, b) {
    var c = b || {},
        d;
    for (d in c) var e = ("" + c[d]).replace(/\$/g, "$$$$"),
        a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e);
    return a
};
goog.exportSymbol = function(a, b, c) {
    goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
    a[b] = c
};
goog.inherits = function(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a
};
goog.base = function(a, b) {
    var c = arguments.callee.caller;
    if (c.superClass_) return c.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
    for (var d = Array.prototype.slice.call(arguments, 2), e = !1, f = a.constructor; f; f = f.superClass_ && f.superClass_.constructor)
        if (f.prototype[b] === c) e = !0;
        else
    if (e) return f.prototype[b].apply(a, d);
    if (a[b] === c) return a.constructor.prototype[b].apply(a, d);
    else throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
    a.call(goog.global)
};
goog.debug = {};
goog.debug.Error = function(a) {
    this.stack = Error().stack || "";
    if (a) this.message = String(a)
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.string = {};
goog.string.Unicode = {
    NBSP: "\u00a0"
};
goog.string.startsWith = function(a, b) {
    return a.lastIndexOf(b, 0) == 0
};
goog.string.endsWith = function(a, b) {
    var c = a.length - b.length;
    return c >= 0 && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
    return goog.string.caseInsensitiveCompare(b, a.substr(0, b.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
    return goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length)) == 0
};
goog.string.subs = function(a) {
    for (var b = 1; b < arguments.length; b++) var c = String(arguments[b]).replace(/\$/g, "$$$$"),
        a = a.replace(/\%s/, c);
    return a
};
goog.string.collapseWhitespace = function(a) {
    return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
    return /^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
    return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
    return !/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
    return !/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
    return !/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
    return !/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
    return a == " "
};
goog.string.isUnicodeChar = function(a) {
    return a.length == 1 && a >= " " && a <= "~" || a >= "\u0080" && a <= "\ufffd"
};
goog.string.stripNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
    return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
    return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.trim = function(a) {
    return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
    return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
    return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
    var c = String(a).toLowerCase(),
        d = String(b).toLowerCase();
    return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
    if (a == b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0; f < e; f++) {
        var g = c[f],
            h = d[f];
        if (g != h) {
            c = parseInt(g, 10);
            if (!isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d)) return c - d;
            return g < h ? -1 : 1
        }
    }
    if (c.length != d.length) return c.length - d.length;
    return a < b ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(a) {
    a = String(a);
    if (!goog.string.encodeUriRegExp_.test(a)) return encodeURIComponent(a);
    return a
};
goog.string.urlDecode = function(a) {
    return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
    return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
    if (b) return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;");
    else {
        if (!goog.string.allRe_.test(a)) return a;
        a.indexOf("&") != -1 && (a = a.replace(goog.string.amperRe_, "&amp;"));
        a.indexOf("<") != -1 && (a = a.replace(goog.string.ltRe_, "&lt;"));
        a.indexOf(">") != -1 && (a = a.replace(goog.string.gtRe_, "&gt;"));
        a.indexOf('"') != -1 && (a = a.replace(goog.string.quotRe_, "&quot;"));
        return a
    }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
    if (goog.string.contains(a, "&")) return "document" in goog.global && !goog.string.contains(a, "<") ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a);
    return a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
    var b = goog.global.document.createElement("div");
    b.innerHTML = "<pre>x" + a + "</pre>";
    if (b.firstChild[goog.string.NORMALIZE_FN_]) b.firstChild[goog.string.NORMALIZE_FN_]();
    a = b.firstChild.firstChild.nodeValue.slice(1);
    b.innerHTML = "";
    return goog.string.canonicalizeNewlines(a)
};
goog.string.unescapePureXmlEntities_ = function(a) {
    return a.replace(/&([^;]+);/g, function(a, c) {
        switch (c) {
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            case "quot":
                return '"';
            default:
                if (c.charAt(0) == "#") {
                    var d = Number("0" + c.substr(1));
                    if (!isNaN(d)) return String.fromCharCode(d)
                }
                return a
        }
    })
};
goog.string.NORMALIZE_FN_ = "normalize";
goog.string.whitespaceEscape = function(a, b) {
    return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
    for (var c = b.length, d = 0; d < c; d++) {
        var e = c == 1 ? b : b.charAt(d);
        if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1)
    }
    return a
};
goog.string.truncate = function(a, b, c) {
    c && (a = goog.string.unescapeEntities(a));
    a.length > b && (a = a.substring(0, b - 3) + "...");
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
    c && (a = goog.string.unescapeEntities(a));
    if (d) {
        d > b && (d = b);
        var e = a.length - d,
            a = a.substring(0, b - d) + "..." + a.substring(e)
    } else a.length > b && (d = Math.floor(b / 2), e = a.length - d, d += b % 2, a = a.substring(0, d) + "..." + a.substring(e));
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.specialEscapeChars_ = {
    "\0": "\\0",
    "\u0008": "\\b",
    "\u000c": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\u000b": "\\x0B",
    '"': '\\"',
    "\\": "\\\\"
};
goog.string.jsEscapeCache_ = {
    "'": "\\'"
};
goog.string.quote = function(a) {
    a = String(a);
    if (a.quote) return a.quote();
    else {
        for (var b = ['"'], c = 0; c < a.length; c++) {
            var d = a.charAt(c),
                e = d.charCodeAt(0);
            b[c + 1] = goog.string.specialEscapeChars_[d] || (e > 31 && e < 127 ? d : goog.string.escapeChar(d))
        }
        b.push('"');
        return b.join("")
    }
};
goog.string.escapeString = function(a) {
    for (var b = [], c = 0; c < a.length; c++) b[c] = goog.string.escapeChar(a.charAt(c));
    return b.join("")
};
goog.string.escapeChar = function(a) {
    if (a in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[a];
    if (a in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
    var b = a,
        c = a.charCodeAt(0);
    if (c > 31 && c < 127) b = a;
    else {
        if (c < 256) {
            if (b = "\\x", c < 16 || c > 256) b += "0"
        } else b = "\\u", c < 4096 && (b += "0");
        b += c.toString(16).toUpperCase()
    }
    return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
    for (var b = {}, c = 0; c < a.length; c++) b[a.charAt(c)] = !0;
    return b
};
goog.string.contains = function(a, b) {
    return a.indexOf(b) != -1
};
goog.string.removeAt = function(a, b, c) {
    var d = a;
    b >= 0 && b < a.length && c > 0 && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
    return d
};
goog.string.remove = function(a, b) {
    var c = RegExp(goog.string.regExpEscape(b), "");
    return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
    var c = RegExp(goog.string.regExpEscape(b), "g");
    return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
    return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
    return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
    a = goog.isDef(c) ? a.toFixed(c) : String(a);
    c = a.indexOf(".");
    if (c == -1) c = a.length;
    return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
    return a == null ? "" : String(a)
};
goog.string.buildString = function() {
    return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
    return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
    for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0; c == 0 && g < f; g++) {
        var h = d[g] || "",
            i = e[g] || "",
            j = RegExp("(\\d*)(\\D*)", "g"),
            k = RegExp("(\\d*)(\\D*)", "g");
        do {
            var m = j.exec(h) || ["", "", ""],
                l = k.exec(i) || ["", "", ""];
            if (m[0].length == 0 && l[0].length == 0) break;
            var c = m[1].length == 0 ? 0 : parseInt(m[1], 10),
                n = l[1].length == 0 ? 0 : parseInt(l[1], 10),
                c = goog.string.compareElements_(c, n) || goog.string.compareElements_(m[2].length ==
                    0, l[2].length == 0) || goog.string.compareElements_(m[2], l[2])
        } while (c == 0)
    }
    return c
};
goog.string.compareElements_ = function(a, b) {
    if (a < b) return -1;
    else if (a > b) return 1;
    return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
    for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
    return b
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
    return "goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
    var b = Number(a);
    if (b == 0 && goog.string.isEmpty(a)) return NaN;
    return b
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(a) {
    return goog.string.toCamelCaseCache_[a] || (goog.string.toCamelCaseCache_[a] = String(a).replace(/\-([a-z])/g, function(a, c) {
        return c.toUpperCase()
    }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(a) {
    return goog.string.toSelectorCaseCache_[a] || (goog.string.toSelectorCaseCache_[a] = String(a).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
    b.unshift(a);
    goog.debug.Error.call(this, goog.string.subs.apply(null, b));
    b.shift();
    this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
    var e = "Assertion failed";
    if (c) {
        e += ": " + c;
        var f = d
    } else a && (e += ": " + a, f = b);
    throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.fail = function(a) {
    if (goog.asserts.ENABLE_ASSERTS) throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
};
goog.asserts.assertNumber = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertString = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertFunction = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertObject = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertArray = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertBoolean = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertInstanceof = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3))
};
goog.array = {};
goog.array.ArrayLike = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function(a) {
    return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
    goog.asserts.assert(a.length != null);
    return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
    c = c == null ? 0 : c < 0 ? Math.max(0, a.length + c) : c;
    if (goog.isString(a)) {
        if (!goog.isString(b) || b.length != 1) return -1;
        return a.indexOf(b, c)
    }
    for (; c < a.length; c++)
        if (c in a && a[c] === b) return c;
    return -1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
    goog.asserts.assert(a.length != null);
    return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, c == null ? a.length - 1 : c)
} : function(a, b, c) {
    c = c == null ? a.length - 1 : c;
    c < 0 && (c = Math.max(0, a.length + c));
    if (goog.isString(a)) {
        if (!goog.isString(b) || b.length != 1) return -1;
        return a.lastIndexOf(b, c)
    }
    for (; c >= 0; c--)
        if (c in a && a[c] === b) return c;
    return -1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
    goog.asserts.assert(a.length != null);
    goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
};
goog.array.forEachRight = function(a, b, c) {
    var d = a.length,
        e = goog.isString(a) ? a.split("") : a;
    for (d -= 1; d >= 0; --d) d in e && b.call(c, e[d], d, a)
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
    goog.asserts.assert(a.length != null);
    return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0; h < d; h++)
        if (h in g) {
            var i = g[h];
            b.call(c, i, h, a) && (e[f++] = i)
        }
    return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
    goog.asserts.assert(a.length != null);
    return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0; g < d; g++) g in f && (e[g] = b.call(c, f[g], g, a));
    return e
};
goog.array.reduce = function(a, b, c, d) {
    if (a.reduce) return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c);
    var e = c;
    goog.array.forEach(a, function(c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.reduceRight = function(a, b, c, d) {
    if (a.reduceRight) return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c);
    var e = c;
    goog.array.forEachRight(a, function(c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
    goog.asserts.assert(a.length != null);
    return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
        if (f in e && b.call(c, e[f], f, a)) return !0;
    return !1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
    goog.asserts.assert(a.length != null);
    return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
        if (f in e && !b.call(c, e[f], f, a)) return !1;
    return !0
};
goog.array.find = function(a, b, c) {
    b = goog.array.findIndex(a, b, c);
    return b < 0 ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
        if (f in e && b.call(c, e[f], f, a)) return f;
    return -1
};
goog.array.findRight = function(a, b, c) {
    b = goog.array.findIndexRight(a, b, c);
    return b < 0 ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
    var d = a.length,
        e = goog.isString(a) ? a.split("") : a;
    for (d -= 1; d >= 0; d--)
        if (d in e && b.call(c, e[d], d, a)) return d;
    return -1
};
goog.array.contains = function(a, b) {
    return goog.array.indexOf(a, b) >= 0
};
goog.array.isEmpty = function(a) {
    return a.length == 0
};
goog.array.clear = function(a) {
    if (!goog.isArray(a))
        for (var b = a.length - 1; b >= 0; b--) delete a[b];
    a.length = 0
};
goog.array.insert = function(a, b) {
    goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
    goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
    goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
    var d;
    arguments.length == 2 || (d = goog.array.indexOf(a, c)) < 0 ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
    var c = goog.array.indexOf(a, b),
        d;
    (d = c >= 0) && goog.array.removeAt(a, c);
    return d
};
goog.array.removeAt = function(a, b) {
    goog.asserts.assert(a.length != null);
    return goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length == 1
};
goog.array.removeIf = function(a, b, c) {
    b = goog.array.findIndex(a, b, c);
    if (b >= 0) return goog.array.removeAt(a, b), !0;
    return !1
};
goog.array.concat = function() {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(a) {
    if (goog.isArray(a)) return goog.array.concat(a);
    else {
        for (var b = [], c = 0, d = a.length; c < d; c++) b[c] = a[c];
        return b
    }
};
goog.array.toArray = function(a) {
    if (goog.isArray(a)) return goog.array.concat(a);
    return goog.array.clone(a)
};
goog.array.extend = function(a) {
    for (var b = 1; b < arguments.length; b++) {
        var c = arguments[b],
            d;
        if (goog.isArray(c) || (d = goog.isArrayLike(c)) && c.hasOwnProperty("callee")) a.push.apply(a, c);
        else if (d)
            for (var e = a.length, f = c.length, g = 0; g < f; g++) a[e + g] = c[g];
        else a.push(c)
    }
};
goog.array.splice = function(a) {
    goog.asserts.assert(a.length != null);
    return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
    goog.asserts.assert(a.length != null);
    return arguments.length <= 2 ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
    for (var c = b || a, d = {}, e = 0, f = 0; f < a.length;) {
        var g = a[f++],
            h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
        Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
    }
    c.length = e
};
goog.array.binarySearch = function(a, b, c) {
    return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
    return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
    for (var f = 0, g = a.length, h; f < g;) {
        var i = f + g >> 1,
            j;
        j = c ? b.call(e, a[i], i, a) : b(d, a[i]);
        j > 0 ? f = i + 1 : (g = i, h = !j)
    }
    return h ? f : ~f
};
goog.array.sort = function(a, b) {
    goog.asserts.assert(a.length != null);
    goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
    for (var c = 0; c < a.length; c++) a[c] = {
        index: c,
        value: a[c]
    };
    var d = b || goog.array.defaultCompare;
    goog.array.sort(a, function(a, b) {
        return d(a.value, b.value) || a.index - b.index
    });
    for (c = 0; c < a.length; c++) a[c] = a[c].value
};
goog.array.sortObjectsByKey = function(a, b, c) {
    var d = c || goog.array.defaultCompare;
    goog.array.sort(a, function(a, c) {
        return d(a[b], c[b])
    })
};
goog.array.isSorted = function(a, b, c) {
    for (var b = b || goog.array.defaultCompare, d = 1; d < a.length; d++) {
        var e = b(a[d - 1], a[d]);
        if (e > 0 || e == 0 && c) return !1
    }
    return !0
};
goog.array.equals = function(a, b, c) {
    if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) return !1;
    for (var d = a.length, c = c || goog.array.defaultCompareEquality, e = 0; e < d; e++)
        if (!c(a[e], b[e])) return !1;
    return !0
};
goog.array.compare = function(a, b, c) {
    return goog.array.equals(a, b, c)
};
goog.array.defaultCompare = function(a, b) {
    return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
    return a === b
};
goog.array.binaryInsert = function(a, b, c) {
    c = goog.array.binarySearch(a, b, c);
    if (c < 0) return goog.array.insertAt(a, b, -(c + 1)), !0;
    return !1
};
goog.array.binaryRemove = function(a, b, c) {
    b = goog.array.binarySearch(a, b, c);
    return b >= 0 ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
    for (var c = {}, d = 0; d < a.length; d++) {
        var e = a[d],
            f = b(e, d, a);
        goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
    }
    return c
};
goog.array.repeat = function(a, b) {
    for (var c = [], d = 0; d < b; d++) c[d] = a;
    return c
};
goog.array.flatten = function() {
    for (var a = [], b = 0; b < arguments.length; b++) {
        var c = arguments[b];
        goog.isArray(c) ? a.push.apply(a, goog.array.flatten.apply(null, c)) : a.push(c)
    }
    return a
};
goog.array.rotate = function(a, b) {
    goog.asserts.assert(a.length != null);
    a.length && (b %= a.length, b > 0 ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : b < 0 && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
    return a
};
goog.array.zip = function() {
    if (!arguments.length) return [];
    for (var a = [], b = 0;; b++) {
        for (var c = [], d = 0; d < arguments.length; d++) {
            var e = arguments[d];
            if (b >= e.length) return a;
            c.push(e[b])
        }
        a.push(c)
    }
};
goog.array.shuffle = function(a, b) {
    for (var c = b || Math.random, d = a.length - 1; d > 0; d--) {
        var e = Math.floor(c() * (d + 1)),
            f = a[d];
        a[d] = a[e];
        a[e] = f
    }
};
var tv = {
    ui: {}
};
tv.ui.DecorateHandler = function(a) {
    this.context_ = a || null;
    this.idToHandlerMap_ = {};
    this.classToHandlerMap_ = {}
};
tv.ui.DecorateHandler.prototype.addIdHandler = function(a, b) {
    this.idToHandlerMap_[a] = b
};
tv.ui.DecorateHandler.prototype.addClassHandler = function(a, b) {
    this.classToHandlerMap_[a] = b
};
tv.ui.DecorateHandler.prototype.getHandler = function() {
    return goog.bind(this.onDecorate_, this)
};
tv.ui.DecorateHandler.prototype.onDecorate_ = function(a) {
    var b = this.idToHandlerMap_[a.getElement().id];
    b && b.call(this.context_, a);
    goog.array.forEach(goog.dom.classes.get(a.getElement()), function(b) {
        (b = this.classToHandlerMap_[b]) && b.call(this.context_, a)
    }, this)
};
goog.dom = {};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
    a.className = b
};
goog.dom.classes.get = function(a) {
    return (a = a.className) && typeof a.split == "function" ? a.split(/\s+/) : []
};
goog.dom.classes.add = function(a) {
    var b = goog.dom.classes.get(a),
        c = goog.array.slice(arguments, 1),
        c = goog.dom.classes.add_(b, c);
    a.className = b.join(" ");
    return c
};
goog.dom.classes.remove = function(a) {
    var b = goog.dom.classes.get(a),
        c = goog.array.slice(arguments, 1),
        c = goog.dom.classes.remove_(b, c);
    a.className = b.join(" ");
    return c
};
goog.dom.classes.add_ = function(a, b) {
    for (var c = 0, d = 0; d < b.length; d++) goog.array.contains(a, b[d]) || (a.push(b[d]), c++);
    return c == b.length
};
goog.dom.classes.remove_ = function(a, b) {
    for (var c = 0, d = 0; d < a.length; d++) goog.array.contains(b, a[d]) && (goog.array.splice(a, d--, 1), c++);
    return c == b.length
};
goog.dom.classes.swap = function(a, b, c) {
    for (var d = goog.dom.classes.get(a), e = !1, f = 0; f < d.length; f++) d[f] == b && (goog.array.splice(d, f--, 1), e = !0);
    if (e) d.push(c), a.className = d.join(" ");
    return e
};
goog.dom.classes.addRemove = function(a, b, c) {
    var d = goog.dom.classes.get(a);
    goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && goog.dom.classes.remove_(d, b);
    goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
    a.className = d.join(" ")
};
goog.dom.classes.has = function(a, b) {
    return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
    c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
    var c = !goog.dom.classes.has(a, b);
    goog.dom.classes.enable(a, b, c);
    return c
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
    for (var d in a) b.call(c, a[d], d, a)
};
goog.object.filter = function(a, b, c) {
    var d = {},
        e;
    for (e in a) b.call(c, a[e], e, a) && (d[e] = a[e]);
    return d
};
goog.object.map = function(a, b, c) {
    var d = {},
        e;
    for (e in a) d[e] = b.call(c, a[e], e, a);
    return d
};
goog.object.some = function(a, b, c) {
    for (var d in a)
        if (b.call(c, a[d], d, a)) return !0;
    return !1
};
goog.object.every = function(a, b, c) {
    for (var d in a)
        if (!b.call(c, a[d], d, a)) return !1;
    return !0
};
goog.object.getCount = function(a) {
    var b = 0,
        c;
    for (c in a) b++;
    return b
};
goog.object.getAnyKey = function(a) {
    for (var b in a) return b
};
goog.object.getAnyValue = function(a) {
    for (var b in a) return a[b]
};
goog.object.contains = function(a, b) {
    return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = a[d];
    return b
};
goog.object.getKeys = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = d;
    return b
};
goog.object.getValueByKeys = function(a, b) {
    for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1; c < d.length; c++)
        if (a = a[d[c]], !goog.isDef(a)) break;
    return a
};
goog.object.containsKey = function(a, b) {
    return b in a
};
goog.object.containsValue = function(a, b) {
    for (var c in a)
        if (a[c] == b) return !0;
    return !1
};
goog.object.findKey = function(a, b, c) {
    for (var d in a)
        if (b.call(c, a[d], d, a)) return d
};
goog.object.findValue = function(a, b, c) {
    return (b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
    for (var b in a) return !1;
    return !0
};
goog.object.clear = function(a) {
    for (var b in a) delete a[b]
};
goog.object.remove = function(a, b) {
    var c;
    (c = b in a) && delete a[b];
    return c
};
goog.object.add = function(a, b, c) {
    if (b in a) throw Error('The object already contains the key "' + b + '"');
    goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
    if (b in a) return a[b];
    return c
};
goog.object.set = function(a, b, c) {
    a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
    return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
    var b = {},
        c;
    for (c in a) b[c] = a[c];
    return b
};
goog.object.unsafeClone = function(a) {
    var b = goog.typeOf(a);
    if (b == "object" || b == "array") {
        if (a.clone) return a.clone();
        var b = b == "array" ? [] : {},
            c;
        for (c in a) b[c] = goog.object.unsafeClone(a[c]);
        return b
    }
    return a
};
goog.object.transpose = function(a) {
    var b = {},
        c;
    for (c in a) b[a[c]] = c;
    return b
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(a) {
    for (var b, c, d = 1; d < arguments.length; d++) {
        c = arguments[d];
        for (b in c) a[b] = c[b];
        for (var e = 0; e < goog.object.PROTOTYPE_FIELDS_.length; e++) b = goog.object.PROTOTYPE_FIELDS_[e], Object.prototype.hasOwnProperty.call(c, b) && (a[b] = c[b])
    }
};
goog.object.create = function() {
    var a = arguments.length;
    if (a == 1 && goog.isArray(arguments[0])) return goog.object.create.apply(null, arguments[0]);
    if (a % 2) throw Error("Uneven number of arguments");
    for (var b = {}, c = 0; c < a; c += 2) b[arguments[c]] = arguments[c + 1];
    return b
};
goog.object.createSet = function() {
    var a = arguments.length;
    if (a == 1 && goog.isArray(arguments[0])) return goog.object.createSet.apply(null, arguments[0]);
    for (var b = {}, c = 0; c < a; c++) b[arguments[c]] = !0;
    return b
};
goog.dom.TagName = {
    A: "A",
    ABBR: "ABBR",
    ACRONYM: "ACRONYM",
    ADDRESS: "ADDRESS",
    APPLET: "APPLET",
    AREA: "AREA",
    B: "B",
    BASE: "BASE",
    BASEFONT: "BASEFONT",
    BDO: "BDO",
    BIG: "BIG",
    BLOCKQUOTE: "BLOCKQUOTE",
    BODY: "BODY",
    BR: "BR",
    BUTTON: "BUTTON",
    CANVAS: "CANVAS",
    CAPTION: "CAPTION",
    CENTER: "CENTER",
    CITE: "CITE",
    CODE: "CODE",
    COL: "COL",
    COLGROUP: "COLGROUP",
    DD: "DD",
    DEL: "DEL",
    DFN: "DFN",
    DIR: "DIR",
    DIV: "DIV",
    DL: "DL",
    DT: "DT",
    EM: "EM",
    FIELDSET: "FIELDSET",
    FONT: "FONT",
    FORM: "FORM",
    FRAME: "FRAME",
    FRAMESET: "FRAMESET",
    H1: "H1",
    H2: "H2",
    H3: "H3",
    H4: "H4",
    H5: "H5",
    H6: "H6",
    HEAD: "HEAD",
    HR: "HR",
    HTML: "HTML",
    I: "I",
    IFRAME: "IFRAME",
    IMG: "IMG",
    INPUT: "INPUT",
    INS: "INS",
    ISINDEX: "ISINDEX",
    KBD: "KBD",
    LABEL: "LABEL",
    LEGEND: "LEGEND",
    LI: "LI",
    LINK: "LINK",
    MAP: "MAP",
    MENU: "MENU",
    META: "META",
    NOFRAMES: "NOFRAMES",
    NOSCRIPT: "NOSCRIPT",
    OBJECT: "OBJECT",
    OL: "OL",
    OPTGROUP: "OPTGROUP",
    OPTION: "OPTION",
    P: "P",
    PARAM: "PARAM",
    PRE: "PRE",
    Q: "Q",
    S: "S",
    SAMP: "SAMP",
    SCRIPT: "SCRIPT",
    SELECT: "SELECT",
    SMALL: "SMALL",
    SPAN: "SPAN",
    STRIKE: "STRIKE",
    STRONG: "STRONG",
    STYLE: "STYLE",
    SUB: "SUB",
    SUP: "SUP",
    TABLE: "TABLE",
    TBODY: "TBODY",
    TD: "TD",
    TEXTAREA: "TEXTAREA",
    TFOOT: "TFOOT",
    TH: "TH",
    THEAD: "THEAD",
    TITLE: "TITLE",
    TR: "TR",
    TT: "TT",
    U: "U",
    UL: "UL",
    VAR: "VAR"
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
    return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
    return goog.global.navigator
};
goog.userAgent.init_ = function() {
    goog.userAgent.detectedOpera_ = !1;
    goog.userAgent.detectedIe_ = !1;
    goog.userAgent.detectedWebkit_ = !1;
    goog.userAgent.detectedMobile_ = !1;
    goog.userAgent.detectedGecko_ = !1;
    var a;
    if (!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
        var b = goog.userAgent.getNavigator();
        goog.userAgent.detectedOpera_ = a.indexOf("Opera") == 0;
        goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && a.indexOf("MSIE") != -1;
        goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ &&
            a.indexOf("WebKit") != -1;
        goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && a.indexOf("Mobile") != -1;
        goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && b.product == "Gecko"
    }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
    var a = goog.userAgent.getNavigator();
    return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
    goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
    goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
    goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
    goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
    var a = "",
        b;
    goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = typeof a == "function" ? a() : a) : (goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/), b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
    if (goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a))) return String(b);
    return a
};
goog.userAgent.getDocumentMode_ = function() {
    var a = goog.global.document;
    return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
    return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(a) {
    return goog.userAgent.isVersionCache_[a] || (goog.userAgent.isVersionCache_[a] = goog.string.compareVersions(goog.userAgent.VERSION, a) >= 0)
};
goog.math = {};
goog.math.Size = function(a, b) {
    this.width = a;
    this.height = b
};
goog.math.Size.equals = function(a, b) {
    if (a == b) return !0;
    if (!a || !b) return !1;
    return a.width == b.width && a.height == b.height
};
goog.math.Size.prototype.clone = function() {
    return new goog.math.Size(this.width, this.height)
};
if (goog.DEBUG) goog.math.Size.prototype.toString = function() {
    return "(" + this.width + " x " + this.height + ")"
};
goog.math.Size.prototype.getLongest = function() {
    return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
    return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
    return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
    return (this.width + this.height) * 2
};
goog.math.Size.prototype.aspectRatio = function() {
    return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
    return !this.area()
};
goog.math.Size.prototype.ceil = function() {
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this
};
goog.math.Size.prototype.fitsInside = function(a) {
    return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this
};
goog.math.Size.prototype.round = function() {
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this
};
goog.math.Size.prototype.scale = function(a) {
    this.width *= a;
    this.height *= a;
    return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
    return this.scale(this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height)
};
goog.dom.BrowserFeature = {
    CAN_ADD_NAME_OR_TYPE_ATTRIBUTES: !goog.userAgent.IE || goog.userAgent.isVersion("9"),
    CAN_USE_CHILDREN_ATTRIBUTE: !goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isVersion("9") || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"),
    CAN_USE_INNER_TEXT: goog.userAgent.IE && !goog.userAgent.isVersion("9"),
    INNER_HTML_NEEDS_SCOPED_ELEMENT: goog.userAgent.IE
};
goog.math.Coordinate = function(a, b) {
    this.x = goog.isDef(a) ? a : 0;
    this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
    return new goog.math.Coordinate(this.x, this.y)
};
if (goog.DEBUG) goog.math.Coordinate.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")"
};
goog.math.Coordinate.equals = function(a, b) {
    if (a == b) return !0;
    if (!a || !b) return !1;
    return a.x == b.x && a.y == b.y
};
goog.math.Coordinate.distance = function(a, b) {
    var c = a.x - b.x,
        d = a.y - b.y;
    return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
    var c = a.x - b.x,
        d = a.y - b.y;
    return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
    return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
    return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    CDATA_SECTION: 4,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    PROCESSING_INSTRUCTION: 7,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    NOTATION: 12
};
goog.dom.getDomHelper = function(a) {
    return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
    return document
};
goog.dom.getElement = function(a) {
    return goog.isString(a) ? document.getElementById(a) : a
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
    return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
    var c = b || document;
    if (goog.dom.canUseQuerySelector_(c)) return c.querySelectorAll("." + a);
    else if (c.getElementsByClassName) return c.getElementsByClassName(a);
    return goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
    var c = b || document,
        d = null;
    return (d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByClass(a, b)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
    return a.querySelectorAll && a.querySelector && (!goog.userAgent.WEBKIT || goog.dom.isCss1CompatMode_(document) || goog.userAgent.isVersion("528"))
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
    a = d || a;
    b = b && b != "*" ? b.toUpperCase() : "";
    if (goog.dom.canUseQuerySelector_(a) && (b || c)) return a.querySelectorAll(b + (c ? "." + c : ""));
    if (c && a.getElementsByClassName)
        if (a = a.getElementsByClassName(c), b) {
            for (var d = {}, e = 0, f = 0, g; g = a[f]; f++) b == g.nodeName && (d[e++] = g);
            d.length = e;
            return d
        } else return a;
    a = a.getElementsByTagName(b || "*");
    if (c) {
        d = {};
        for (f = e = 0; g = a[f]; f++) b = g.className, typeof b.split == "function" && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g);
        d.length =
            e;
        return d
    } else return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
    goog.object.forEach(b, function(b, d) {
        d == "style" ? a.style.cssText = b : d == "class" ? a.className = b : d == "for" ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : a[d] = b
    })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    colspan: "colSpan",
    rowspan: "rowSpan",
    valign: "vAlign",
    height: "height",
    width: "width",
    usemap: "useMap",
    frameborder: "frameBorder",
    maxlength: "maxLength",
    type: "type"
};
goog.dom.getViewportSize = function(a) {
    return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
    var b = a.document;
    if (goog.userAgent.WEBKIT && !goog.userAgent.isVersion("500") && !goog.userAgent.MOBILE) {
        typeof a.innerHeight == "undefined" && (a = window);
        var b = a.innerHeight,
            c = a.document.documentElement.scrollHeight;
        a == a.top && c < b && (b -= 15);
        return new goog.math.Size(a.innerWidth, b)
    }
    a = goog.dom.isCss1CompatMode_(b) ? b.documentElement : b.body;
    return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
    return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
    var b = a.document,
        c = 0;
    if (b) {
        var a = goog.dom.getViewportSize_(a).height,
            c = b.body,
            d = b.documentElement;
        if (goog.dom.isCss1CompatMode_(b) && d.scrollHeight) c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight;
        else {
            var b = d.scrollHeight,
                e = d.offsetHeight;
            if (d.clientHeight != e) b = c.scrollHeight, e = c.offsetHeight;
            c = b > a ? b > e ? b : e : b < e ? b : e
        }
    }
    return c
};
goog.dom.getPageScroll = function(a) {
    return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
    return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
    var b = goog.dom.getDocumentScrollElement_(a),
        a = goog.dom.getWindow_(a);
    return new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
    return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
    return !goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
    return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
    return a.parentWindow || a.defaultView
};
goog.dom.createDom = function() {
    return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
    var c = b[0],
        d = b[1];
    if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
        c = ["<", c];
        d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
        if (d.type) {
            c.push(' type="', goog.string.htmlEscape(d.type), '"');
            var e = {};
            goog.object.extend(e, d);
            d = e;
            delete d.type
        }
        c.push(">");
        c = c.join("")
    }
    c = a.createElement(c);
    if (d) goog.isString(d) ? c.className = d : goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d);
    b.length >
        2 && goog.dom.append_(a, c, b, 2);
    return c
};
goog.dom.append_ = function(a, b, c, d) {
    function e(c) {
        c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
    }
    for (; d < c.length; d++) {
        var f = c[d];
        goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.clone(f) : f, e) : e(f)
    }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
    return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
    return document.createTextNode(a)
};
goog.dom.createTable = function(a, b, c) {
    return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
    for (var e = ["<tr>"], f = 0; f < c; f++) e.push(d ? "<td>&nbsp;</td>" : "<td></td>");
    e.push("</tr>");
    e = e.join("");
    c = ["<table>"];
    for (f = 0; f < b; f++) c.push(e);
    c.push("</table>");
    a = a.createElement(goog.dom.TagName.DIV);
    a.innerHTML = c.join("");
    return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
    return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
    var c = a.createElement("div");
    goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "<br>" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
    if (c.childNodes.length == 1) return c.removeChild(c.firstChild);
    else {
        for (var d = a.createDocumentFragment(); c.firstChild;) d.appendChild(c.firstChild);
        return d
    }
};
goog.dom.getCompatMode = function() {
    return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
    return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
    if (goog.dom.COMPAT_MODE_KNOWN_) return goog.dom.ASSUME_STANDARDS_MODE;
    return a.compatMode == "CSS1Compat"
};
goog.dom.canHaveChildren = function(a) {
    if (a.nodeType != goog.dom.NodeType.ELEMENT) return !1;
    switch (a.tagName) {
        case goog.dom.TagName.APPLET:
        case goog.dom.TagName.AREA:
        case goog.dom.TagName.BASE:
        case goog.dom.TagName.BR:
        case goog.dom.TagName.COL:
        case goog.dom.TagName.FRAME:
        case goog.dom.TagName.HR:
        case goog.dom.TagName.IMG:
        case goog.dom.TagName.INPUT:
        case goog.dom.TagName.IFRAME:
        case goog.dom.TagName.ISINDEX:
        case goog.dom.TagName.LINK:
        case goog.dom.TagName.NOFRAMES:
        case goog.dom.TagName.NOSCRIPT:
        case goog.dom.TagName.META:
        case goog.dom.TagName.OBJECT:
        case goog.dom.TagName.PARAM:
        case goog.dom.TagName.SCRIPT:
        case goog.dom.TagName.STYLE:
            return !1
    }
    return !0
};
goog.dom.appendChild = function(a, b) {
    a.appendChild(b)
};
goog.dom.append = function(a) {
    goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
    for (var b; b = a.firstChild;) a.removeChild(b)
};
goog.dom.insertSiblingBefore = function(a, b) {
    b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
    b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.removeNode = function(a) {
    return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
    var c = b.parentNode;
    c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
    var b, c = a.parentNode;
    if (c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT)
        if (a.removeNode) return a.removeNode(!1);
        else {
            for (; b = a.firstChild;) c.insertBefore(b, a);
            return goog.dom.removeNode(a)
        }
};
goog.dom.getChildren = function(a) {
    if (goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && a.children != void 0) return a.children;
    return goog.array.filter(a.childNodes, function(a) {
        return a.nodeType == goog.dom.NodeType.ELEMENT
    })
};
goog.dom.getFirstElementChild = function(a) {
    if (a.firstElementChild != void 0) return a.firstElementChild;
    return goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
    if (a.lastElementChild != void 0) return a.lastElementChild;
    return goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
    if (a.nextElementSibling != void 0) return a.nextElementSibling;
    return goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
    if (a.previousElementSibling != void 0) return a.previousElementSibling;
    return goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
    for (; a && a.nodeType != goog.dom.NodeType.ELEMENT;) a = b ? a.nextSibling : a.previousSibling;
    return a
};
goog.dom.getNextNode = function(a) {
    if (!a) return null;
    if (a.firstChild) return a.firstChild;
    for (; a && !a.nextSibling;) a = a.parentNode;
    return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
    if (!a) return null;
    if (!a.previousSibling) return a.parentNode;
    for (a = a.previousSibling; a && a.lastChild;) a = a.lastChild;
    return a
};
goog.dom.isNodeLike = function(a) {
    return goog.isObject(a) && a.nodeType > 0
};
goog.dom.isWindow = function(a) {
    return goog.isObject(a) && a.window == a
};
goog.dom.contains = function(a, b) {
    if (a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) return a == b || a.contains(b);
    if (typeof a.compareDocumentPosition != "undefined") return a == b || Boolean(a.compareDocumentPosition(b) & 16);
    for (; b && a != b;) b = b.parentNode;
    return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
    if (a == b) return 0;
    if (a.compareDocumentPosition) return a.compareDocumentPosition(b) & 2 ? 1 : -1;
    if ("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
        var c = a.nodeType == goog.dom.NodeType.ELEMENT,
            d = b.nodeType == goog.dom.NodeType.ELEMENT;
        if (c && d) return a.sourceIndex - b.sourceIndex;
        else {
            var e = a.parentNode,
                f = b.parentNode;
            if (e == f) return goog.dom.compareSiblingOrder_(a, b);
            if (!c && goog.dom.contains(e, b)) return -1 * goog.dom.compareParentsDescendantNodeIe_(a, b);
            if (!d &&
                goog.dom.contains(f, a)) return goog.dom.compareParentsDescendantNodeIe_(b, a);
            return (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
        }
    }
    d = goog.dom.getOwnerDocument(a);
    c = d.createRange();
    c.selectNode(a);
    c.collapse(!0);
    d = d.createRange();
    d.selectNode(b);
    d.collapse(!0);
    return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
    var c = a.parentNode;
    if (c == b) return -1;
    for (var d = b; d.parentNode != c;) d = d.parentNode;
    return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
    for (var c = b; c = c.previousSibling;)
        if (c == a) return -1;
    return 1
};
goog.dom.findCommonAncestor = function() {
    var a, b = arguments.length;
    if (b) {
        if (b == 1) return arguments[0]
    } else return null;
    var c = [],
        d = Infinity;
    for (a = 0; a < b; a++) {
        for (var e = [], f = arguments[a]; f;) e.unshift(f), f = f.parentNode;
        c.push(e);
        d = Math.min(d, e.length)
    }
    e = null;
    for (a = 0; a < d; a++) {
        for (var f = c[0][a], g = 1; g < b; g++)
            if (f != c[g][a]) return e;
        e = f
    }
    return e
};
goog.dom.getOwnerDocument = function(a) {
    return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
    return goog.userAgent.WEBKIT ? a.document || a.contentWindow.document : a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
    return a.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
    if ("textContent" in a) a.textContent = b;
    else if (a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        for (; a.lastChild != a.firstChild;) a.removeChild(a.lastChild);
        a.firstChild.data = b
    } else {
        goog.dom.removeChildren(a);
        var c = goog.dom.getOwnerDocument(a);
        a.appendChild(c.createTextNode(b))
    }
};
goog.dom.getOuterHtml = function(a) {
    if ("outerHTML" in a) return a.outerHTML;
    else {
        var b = goog.dom.getOwnerDocument(a).createElement("div");
        b.appendChild(a.cloneNode(!0));
        return b.innerHTML
    }
};
goog.dom.findNode = function(a, b) {
    var c = [];
    return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
    var c = [];
    goog.dom.findNodes_(a, b, c, !1);
    return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
    if (a != null)
        for (var e = 0, f; f = a.childNodes[e]; e++) {
            if (b(f) && (c.push(f), d)) return !0;
            if (goog.dom.findNodes_(f, b, c, d)) return !0
        }
    return !1
};
goog.dom.TAGS_TO_IGNORE_ = {
    SCRIPT: 1,
    STYLE: 1,
    HEAD: 1,
    IFRAME: 1,
    OBJECT: 1
};
goog.dom.PREDEFINED_TAG_VALUES_ = {
    IMG: " ",
    BR: "\n"
};
goog.dom.isFocusableTabIndex = function(a) {
    var b = a.getAttributeNode("tabindex");
    if (b && b.specified) return a = a.tabIndex, goog.isNumber(a) && a >= 0;
    return !1
};
goog.dom.setFocusableTabIndex = function(a, b) {
    b ? a.tabIndex = 0 : a.removeAttribute("tabIndex")
};
goog.dom.getTextContent = function(a) {
    if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) a = goog.string.canonicalizeNewlines(a.innerText);
    else {
        var b = [];
        goog.dom.getTextContent_(a, b, !0);
        a = b.join("")
    }
    a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
    a = a.replace(/\u200B/g, "");
    goog.userAgent.IE || (a = a.replace(/ +/g, " "));
    a != " " && (a = a.replace(/^\s*/, ""));
    return a
};
goog.dom.getRawTextContent = function(a) {
    var b = [];
    goog.dom.getTextContent_(a, b, !1);
    return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
    if (!(a.nodeName in goog.dom.TAGS_TO_IGNORE_))
        if (a.nodeType == goog.dom.NodeType.TEXT) c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue);
        else
    if (a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName]);
    else
        for (a = a.firstChild; a;) goog.dom.getTextContent_(a, b, c), a = a.nextSibling
};
goog.dom.getNodeTextLength = function(a) {
    return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
    for (var c = b || goog.dom.getOwnerDocument(a).body, d = []; a && a != c;) {
        for (var e = a; e = e.previousSibling;) d.unshift(goog.dom.getTextContent(e));
        a = a.parentNode
    }
    return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
    for (var a = [a], d = 0, e; a.length > 0 && d < b;)
        if (e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_))
            if (e.nodeType == goog.dom.NodeType.TEXT) {
                var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
                d += f.length
            } else
    if (e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length;
    else
        for (f = e.childNodes.length - 1; f >= 0; f--) a.push(e.childNodes[f]); if (goog.isObject(c)) c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e;
    return e
};
goog.dom.isNodeList = function(a) {
    if (a && typeof a.length == "number")
        if (goog.isObject(a)) return typeof a.item == "function" || typeof a.item == "string";
        else
    if (goog.isFunction(a)) return typeof a.item == "function";
    return !1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
    var d = b ? b.toUpperCase() : null;
    return goog.dom.getAncestor(a, function(a) {
        return (!d || a.nodeName == d) && (!c || goog.dom.classes.has(a, c))
    }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
    return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
    if (!c) a = a.parentNode;
    for (var c = d == null, e = 0; a && (c || e <= d);) {
        if (b(a)) return a;
        a = a.parentNode;
        e++
    }
    return null
};
goog.dom.DomHelper = function(a) {
    this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
    this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
    return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
    return goog.isString(a) ? this.document_.getElementById(a) : a
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
    return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
    return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
    return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
    return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
    return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function() {
    return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
    return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
    return this.document_.createTextNode(a)
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
    return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
    return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
    return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
    return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
    return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
    return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
    return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
tv.ui.decoratorRegistry_ = {};
tv.ui.registerDecorator = function(a, b) {
    goog.array.forEach(goog.isArray(b) ? b : [b], function(b) {
        tv.ui.decoratorRegistry_[b] = a
    })
};
tv.ui.findDecorator = function(a) {
    for (var b = 0; b < a.length; b++) {
        var c = tv.ui.decoratorRegistry_[a[b]];
        if (c) return c
    }
    return null
};
tv.ui.decorate = function(a, b, c) {
    var d, e = tv.ui.findDecorator(goog.dom.classes.get(a));
    e && (d = new e, d.decorate(a), c && c.addChild(d));
    tv.ui.decorateChildren(a, b, d || c);
    d && b && b(d)
};
tv.ui.decorateChildren = function(a, b, c) {
    for (a = a.firstChild; a; a = a.nextSibling) a.nodeType == goog.dom.NodeType.ELEMENT && tv.ui.decorate(a, b, c)
};
tv.ui.postponeRenderCount_ = 0;
tv.ui.postponeRender = function(a, b) {
    if (tv.ui.postponeRenderCount_++ == 0) tv.ui.componentsScheduledRender_ = [];
    a.call(b);
    --tv.ui.postponeRenderCount_ == 0 && (goog.array.forEach(tv.ui.componentsScheduledRender_, function(a) {
        a.render()
    }), delete tv.ui.componentsScheduledRender_)
};
tv.ui.scheduleRender = function(a) {
    tv.ui.postponeRenderCount_ == 0 ? a.render() : tv.ui.componentsScheduledRender_.push(a)
};
tv.ui.lastUniqueComponentId_ = 0;
tv.ui.idToComponentMap_ = {};
tv.ui.registerComponent = function(a) {
    var b = ++tv.ui.lastUniqueComponentId_;
    a.getElement().componentId = b;
    tv.ui.idToComponentMap_[b] = a
};
tv.ui.unregisterComponent = function(a) {
    delete tv.ui.idToComponentMap_[a.getElement().componentId]
};
tv.ui.getComponentByElement = function(a) {
    return tv.ui.idToComponentMap_[a.componentId]
};
goog.userAgent.product = {};
goog.userAgent.product.ASSUME_FIREFOX = !1;
goog.userAgent.product.ASSUME_CAMINO = !1;
goog.userAgent.product.ASSUME_IPHONE = !1;
goog.userAgent.product.ASSUME_IPAD = !1;
goog.userAgent.product.ASSUME_ANDROID = !1;
goog.userAgent.product.ASSUME_CHROME = !1;
goog.userAgent.product.ASSUME_SAFARI = !1;
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_CAMINO || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.init_ = function() {
    goog.userAgent.product.detectedFirefox_ = !1;
    goog.userAgent.product.detectedCamino_ = !1;
    goog.userAgent.product.detectedIphone_ = !1;
    goog.userAgent.product.detectedIpad_ = !1;
    goog.userAgent.product.detectedAndroid_ = !1;
    goog.userAgent.product.detectedChrome_ = !1;
    goog.userAgent.product.detectedSafari_ = !1;
    var a = goog.userAgent.getUserAgentString();
    if (a)
        if (a.indexOf("Firefox") != -1) goog.userAgent.product.detectedFirefox_ = !0;
        else
    if (a.indexOf("Camino") != -1) goog.userAgent.product.detectedCamino_ = !0;
    else if (a.indexOf("iPhone") != -1 || a.indexOf("iPod") != -1) goog.userAgent.product.detectedIphone_ = !0;
    else if (a.indexOf("iPad") != -1) goog.userAgent.product.detectedIpad_ = !0;
    else if (a.indexOf("Android") != -1) goog.userAgent.product.detectedAndroid_ = !0;
    else if (a.indexOf("Chrome") != -1) goog.userAgent.product.detectedChrome_ = !0;
    else if (a.indexOf("Safari") != -1) goog.userAgent.product.detectedSafari_ = !0
};
goog.userAgent.product.PRODUCT_KNOWN_ || goog.userAgent.product.init_();
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.userAgent.product.detectedFirefox_;
goog.userAgent.product.CAMINO = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CAMINO : goog.userAgent.product.detectedCamino_;
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.detectedIphone_;
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.userAgent.product.detectedIpad_;
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.userAgent.product.detectedAndroid_;
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.userAgent.product.detectedChrome_;
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.detectedSafari_;
goog.math.Box = function(a, b, c, d) {
    this.top = a;
    this.right = b;
    this.bottom = c;
    this.left = d
};
goog.math.Box.boundingBox = function() {
    for (var a = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), b = 1; b < arguments.length; b++) {
        var c = arguments[b];
        a.top = Math.min(a.top, c.y);
        a.right = Math.max(a.right, c.x);
        a.bottom = Math.max(a.bottom, c.y);
        a.left = Math.min(a.left, c.x)
    }
    return a
};
goog.math.Box.prototype.clone = function() {
    return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
if (goog.DEBUG) goog.math.Box.prototype.toString = function() {
    return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
};
goog.math.Box.prototype.contains = function(a) {
    return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
    goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += b, this.bottom += c, this.left -= d);
    return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
    this.left = Math.min(this.left, a.left);
    this.top = Math.min(this.top, a.top);
    this.right = Math.max(this.right, a.right);
    this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
    if (a == b) return !0;
    if (!a || !b) return !1;
    return a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left
};
goog.math.Box.contains = function(a, b) {
    if (!a || !b) return !1;
    if (b instanceof goog.math.Box) return b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom;
    return b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom
};
goog.math.Box.distance = function(a, b) {
    if (b.x >= a.left && b.x <= a.right) {
        if (b.y >= a.top && b.y <= a.bottom) return 0;
        return b.y < a.top ? a.top - b.y : b.y - a.bottom
    }
    if (b.y >= a.top && b.y <= a.bottom) return b.x < a.left ? a.left - b.x : b.x - a.right;
    return goog.math.Coordinate.distance(b, new goog.math.Coordinate(b.x < a.left ? a.left : a.right, b.y < a.top ? a.top : a.bottom))
};
goog.math.Box.intersects = function(a, b) {
    return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Rect = function(a, b, c, d) {
    this.left = a;
    this.top = b;
    this.width = c;
    this.height = d
};
goog.math.Rect.prototype.clone = function() {
    return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
    return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
    return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
if (goog.DEBUG) goog.math.Rect.prototype.toString = function() {
    return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
};
goog.math.Rect.equals = function(a, b) {
    if (a == b) return !0;
    if (!a || !b) return !1;
    return a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height
};
goog.math.Rect.prototype.intersection = function(a) {
    var b = Math.max(this.left, a.left),
        c = Math.min(this.left + this.width, a.left + a.width);
    if (b <= c) {
        var d = Math.max(this.top, a.top),
            a = Math.min(this.top + this.height, a.top + a.height);
        if (d <= a) return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0
    }
    return !1
};
goog.math.Rect.intersection = function(a, b) {
    var c = Math.max(a.left, b.left),
        d = Math.min(a.left + a.width, b.left + b.width);
    if (c <= d) {
        var e = Math.max(a.top, b.top),
            f = Math.min(a.top + a.height, b.top + b.height);
        if (e <= f) return new goog.math.Rect(c, e, d - c, f - e)
    }
    return null
};
goog.math.Rect.intersects = function(a, b) {
    return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
    return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, b) {
    var c = goog.math.Rect.intersection(a, b);
    if (!c || !c.height || !c.width) return [a.clone()];
    var c = [],
        d = a.top,
        e = a.height,
        f = a.left + a.width,
        g = a.top + a.height,
        h = b.left + b.width,
        i = b.top + b.height;
    if (b.top > a.top) c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), d = b.top, e -= b.top - a.top;
    i < g && (c.push(new goog.math.Rect(a.left, i, a.width, g - i)), e = i - d);
    b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
    h < f && c.push(new goog.math.Rect(h, d, f - h, e));
    return c
};
goog.math.Rect.prototype.difference = function(a) {
    return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
    var b = Math.max(this.left + this.width, a.left + a.width),
        c = Math.max(this.top + this.height, a.top + a.height);
    this.left = Math.min(this.left, a.left);
    this.top = Math.min(this.top, a.top);
    this.width = b - this.left;
    this.height = c - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
    if (!a || !b) return null;
    var c = a.clone();
    c.boundingRect(b);
    return c
};
goog.math.Rect.prototype.contains = function(a) {
    return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.getSize = function() {
    return new goog.math.Size(this.width, this.height)
};
goog.style = {};
goog.style.setStyle = function(a, b, c) {
    goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
    a.style[goog.string.toCamelCase(c)] = b
};
goog.style.getStyle = function(a, b) {
    return a.style[goog.string.toCamelCase(b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
    var c = goog.dom.getOwnerDocument(a);
    if (c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null))) return c[b] || c.getPropertyValue(b);
    return ""
};
goog.style.getCascadedStyle = function(a, b) {
    return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
    return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style[b]
};
goog.style.getComputedPosition = function(a) {
    return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
    return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
    return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
    return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
    return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
    return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
    return goog.style.getStyle_(a, "cursor")
};
goog.style.setPosition = function(a, b, c) {
    var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersion("1.9");
    b instanceof goog.math.Coordinate ? (d = b.x, b = b.y) : (d = b, b = c);
    a.style.left = goog.style.getPixelStyleValue_(d, e);
    a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
    return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
    a = a ? a.nodeType == goog.dom.NodeType.DOCUMENT ? a : goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
    if (goog.userAgent.IE && !goog.userAgent.isVersion(9) && !goog.dom.getDomHelper(a).isCss1CompatMode()) return a.body;
    return a.documentElement
};
goog.style.getBoundingClientRect_ = function(a) {
    var b = a.getBoundingClientRect();
    if (goog.userAgent.IE) a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop;
    return b
};
goog.style.getOffsetParent = function(a) {
    if (goog.userAgent.IE) return a.offsetParent;
    for (var b = goog.dom.getOwnerDocument(a), c = goog.style.getStyle_(a, "position"), d = c == "fixed" || c == "absolute", a = a.parentNode; a && a != b; a = a.parentNode)
        if (c = goog.style.getStyle_(a, "position"), d = d && c == "static" && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || c == "fixed" || c == "absolute")) return a;
    return null
};
goog.style.getVisibleRectForElement = function(a) {
    for (var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocumentScrollElement(), f; a = goog.style.getOffsetParent(a);)
        if ((!goog.userAgent.IE || a.clientWidth != 0) && (!goog.userAgent.WEBKIT || a.clientHeight != 0 || a != d) && (a.scrollWidth != a.clientWidth || a.scrollHeight != a.clientHeight) && goog.style.getStyle_(a, "overflow") != "visible") {
            var g = goog.style.getPageOffset(a),
                h = goog.style.getClientLeftTop(a);
            g.x += h.x;
            g.y +=
                h.y;
            b.top = Math.max(b.top, g.y);
            b.right = Math.min(b.right, g.x + a.clientWidth);
            b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
            b.left = Math.max(b.left, g.x);
            f = f || a != e
        }
    d = e.scrollLeft;
    e = e.scrollTop;
    goog.userAgent.WEBKIT ? (b.left += d, b.top += e) : (b.left = Math.max(b.left, d), b.top = Math.max(b.top, e));
    if (!f || goog.userAgent.WEBKIT) b.right += d, b.bottom += e;
    c = c.getViewportSize();
    b.right = Math.min(b.right, d + c.width);
    b.bottom = Math.min(b.bottom, e + c.height);
    return b.top >= 0 && b.left >= 0 && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.scrollIntoContainerView = function(a, b, c) {
    var d = goog.style.getPageOffset(a),
        e = goog.style.getPageOffset(b),
        f = goog.style.getBorderBox(b),
        g = d.x - e.x - f.left,
        d = d.y - e.y - f.top,
        e = b.clientWidth - a.offsetWidth,
        a = b.clientHeight - a.offsetHeight;
    c ? (b.scrollLeft += g - e / 2, b.scrollTop += d - a / 2) : (b.scrollLeft += Math.min(g, Math.max(g - e, 0)), b.scrollTop += Math.min(d, Math.max(d - a, 0)))
};
goog.style.getClientLeftTop = function(a) {
    if (goog.userAgent.GECKO && !goog.userAgent.isVersion("1.9")) {
        var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
        if (goog.style.isRightToLeft(a)) {
            var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth"));
            b += c
        }
        return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
    }
    return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
    var b, c = goog.dom.getOwnerDocument(a),
        d = goog.style.getStyle_(a, "position"),
        e = goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && d == "absolute" && (b = c.getBoxObjectFor(a)) && (b.screenX < 0 || b.screenY < 0),
        f = new goog.math.Coordinate(0, 0),
        g = goog.style.getClientViewportElement(c);
    if (a == g) return f;
    if (a.getBoundingClientRect) b = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(c).getDocumentScroll(), f.x = b.left + a.x, f.y = b.top + a.y;
    else if (c.getBoxObjectFor && !e) b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY;
    else {
        b = a;
        do {
            f.x += b.offsetLeft;
            f.y += b.offsetTop;
            b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
            if (goog.userAgent.WEBKIT && goog.style.getComputedPosition(b) == "fixed") {
                f.x += c.body.scrollLeft;
                f.y += c.body.scrollTop;
                break
            }
            b = b.offsetParent
        } while (b && b != a);
        if (goog.userAgent.OPERA || goog.userAgent.WEBKIT && d == "absolute") f.y -= c.body.offsetTop;
        for (b = a;
            (b = goog.style.getOffsetParent(b)) && b != c.body && b != g;)
            if (f.x -= b.scrollLeft, !goog.userAgent.OPERA || b.tagName != "TR") f.y -= b.scrollTop
    }
    return f
};
goog.style.getPageOffsetLeft = function(a) {
    return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
    return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
    var c = new goog.math.Coordinate(0, 0),
        d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)),
        e = a;
    do {
        var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPosition(e);
        c.x += f.x;
        c.y += f.y
    } while (d && d != b && (e = d.frameElement) && (d = d.parent));
    return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
    if (b.getDocument() != c.getDocument()) {
        var d = b.getDocument().body,
            c = goog.style.getFramedPageOffset(d, c.getWindow()),
            c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
        goog.userAgent.IE && !b.isCss1CompatMode() && (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
        a.left += c.x;
        a.top += c.y
    }
};
goog.style.getRelativePosition = function(a, b) {
    var c = goog.style.getClientPosition(a),
        d = goog.style.getClientPosition(b);
    return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPosition = function(a) {
    var b = new goog.math.Coordinate;
    if (a.nodeType == goog.dom.NodeType.ELEMENT)
        if (a.getBoundingClientRect) a = goog.style.getBoundingClientRect_(a), b.x = a.left, b.y = a.top;
        else {
            var c = goog.dom.getDomHelper(a).getDocumentScroll(),
                a = goog.style.getPageOffset(a);
            b.x = a.x - c.x;
            b.y = a.y - c.y
        } else {
        var c = goog.isFunction(a.getBrowserEvent),
            d = a;
        a.targetTouches ? d = a.targetTouches[0] : c && a.getBrowserEvent().targetTouches && (d = a.getBrowserEvent().targetTouches[0]);
        b.x = d.clientX;
        b.y = d.clientY
    }
    return b
};
goog.style.setPageOffset = function(a, b, c) {
    var d = goog.style.getPageOffset(a);
    if (b instanceof goog.math.Coordinate) c = b.y, b = b.x;
    goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
    if (b instanceof goog.math.Size) c = b.height, b = b.width;
    else if (c == void 0) throw Error("missing height argument");
    goog.style.setWidth(a, b);
    goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
    typeof a == "number" && (a = (b ? Math.round(a) : a) + "px");
    return a
};
goog.style.setHeight = function(a, b) {
    a.style.height = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.setWidth = function(a, b) {
    a.style.width = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.getSize = function(a) {
    if (goog.style.getStyle_(a, "display") != "none") return new goog.math.Size(a.offsetWidth, a.offsetHeight);
    var b = a.style,
        c = b.display,
        d = b.visibility,
        e = b.position;
    b.visibility = "hidden";
    b.position = "absolute";
    b.display = "inline";
    var f = a.offsetWidth,
        a = a.offsetHeight;
    b.display = c;
    b.position = e;
    b.visibility = d;
    return new goog.math.Size(f, a)
};
goog.style.getBounds = function(a) {
    var b = goog.style.getPageOffset(a),
        a = goog.style.getSize(a);
    return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
    return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
    return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
    var b = a.style,
        a = "";
    "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
    return a == "" ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
    var c = a.style;
    if ("opacity" in c) c.opacity = b;
    else if ("MozOpacity" in c) c.MozOpacity = b;
    else if ("filter" in c) c.filter = b === "" ? "" : "alpha(opacity=" + b * 100 + ")"
};
goog.style.setTransparentBackgroundImage = function(a, b) {
    var c = a.style;
    goog.userAgent.IE && !goog.userAgent.isVersion("8") ? c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (c.backgroundImage = "url(" + b + ")", c.backgroundPosition = "top left", c.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
    a = a.style;
    "filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, b) {
    a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
    return a.style.display != "none"
};
goog.style.installStyles = function(a, b) {
    var c = goog.dom.getDomHelper(b),
        d = null;
    if (goog.userAgent.IE) d = c.getDocument().createStyleSheet(), goog.style.setStyles(d, a);
    else {
        var e = c.getElementsByTagNameAndClass("head")[0];
        e || (d = c.getElementsByTagNameAndClass("body")[0], e = c.createDom("head"), d.parentNode.insertBefore(e, d));
        d = c.createDom("style");
        goog.style.setStyles(d, a);
        c.appendChild(e, d)
    }
    return d
};
goog.style.uninstallStyles = function(a) {
    goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
    goog.userAgent.IE ? a.cssText = b : a[goog.userAgent.WEBKIT ? "innerText" : "innerHTML"] = b
};
goog.style.setPreWrap = function(a) {
    a = a.style;
    goog.userAgent.IE && !goog.userAgent.isVersion("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
    a = a.style;
    a.position = "relative";
    goog.userAgent.IE && !goog.userAgent.isVersion("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersion("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
    return "rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
    if (goog.style.unselectableStyle_) return a.style[goog.style.unselectableStyle_].toLowerCase() == "none";
    else if (goog.userAgent.IE || goog.userAgent.OPERA) return a.getAttribute("unselectable") == "on";
    return !1
};
goog.style.setUnselectable = function(a, b, c) {
    var c = !c ? a.getElementsByTagName("*") : null,
        d = goog.style.unselectableStyle_;
    if (d) {
        if (b = b ? "none" : "", a.style[d] = b, c)
            for (var a = 0, e; e = c[a]; a++) e.style[d] = b
    } else if (goog.userAgent.IE || goog.userAgent.OPERA)
        if (b = b ? "on" : "", a.setAttribute("unselectable", b), c)
            for (a = 0; e = c[a]; a++) e.setAttribute("unselectable", b)
};
goog.style.getBorderBoxSize = function(a) {
    return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
    var c = goog.dom.getOwnerDocument(a),
        d = goog.dom.getDomHelper(c).isCss1CompatMode();
    if (goog.userAgent.IE && (!d || !goog.userAgent.isVersion("8")))
        if (c = a.style, d) {
            var d = goog.style.getPaddingBox(a),
                e = goog.style.getBorderBox(a);
            c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
            c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
        } else c.pixelWidth = b.width, c.pixelHeight = b.height;
    else goog.style.setBoxSizingSize_(a, b, "border-box")
};
goog.style.getContentBoxSize = function(a) {
    var b = goog.dom.getOwnerDocument(a),
        c = goog.userAgent.IE && a.currentStyle;
    return c && goog.dom.getDomHelper(b).isCss1CompatMode() && c.width != "auto" && c.height != "auto" && !c.boxSizing ? (b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a)) : (c = goog.style.getBorderBoxSize(a), b = goog.style.getPaddingBox(a), a = goog.style.getBorderBox(a), new goog.math.Size(c.width - a.left - b.left -
        b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom))
};
goog.style.setContentBoxSize = function(a, b) {
    var c = goog.dom.getOwnerDocument(a),
        d = goog.dom.getDomHelper(c).isCss1CompatMode();
    if (goog.userAgent.IE && (!d || !goog.userAgent.isVersion("8")))
        if (c = a.style, d) c.pixelWidth = b.width, c.pixelHeight = b.height;
        else {
            var d = goog.style.getPaddingBox(a),
                e = goog.style.getBorderBox(a);
            c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
            c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
        } else goog.style.setBoxSizingSize_(a, b, "content-box")
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
    a = a.style;
    goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
    a.width = b.width + "px";
    a.height = b.height + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
    if (/^\d+px?$/.test(b)) return parseInt(b, 10);
    else {
        var e = a.style[c],
            f = a.runtimeStyle[c];
        a.runtimeStyle[c] = a.currentStyle[c];
        a.style[c] = b;
        b = a.style[d];
        a.style[c] = e;
        a.runtimeStyle[c] = f;
        return b
    }
};
goog.style.getIePixelDistance_ = function(a, b) {
    return goog.style.getIePixelValue_(a, goog.style.getCascadedStyle(a, b), "left", "pixelLeft")
};
goog.style.getBox_ = function(a, b) {
    if (goog.userAgent.IE) {
        var c = goog.style.getIePixelDistance_(a, b + "Left"),
            d = goog.style.getIePixelDistance_(a, b + "Right"),
            e = goog.style.getIePixelDistance_(a, b + "Top"),
            f = goog.style.getIePixelDistance_(a, b + "Bottom");
        return new goog.math.Box(e, d, f, c)
    } else return c = goog.style.getComputedStyle(a, b + "Left"), d = goog.style.getComputedStyle(a, b + "Right"), e = goog.style.getComputedStyle(a, b + "Top"), f = goog.style.getComputedStyle(a, b + "Bottom"), new goog.math.Box(parseFloat(e), parseFloat(d),
        parseFloat(f), parseFloat(c))
};
goog.style.getPaddingBox = function(a) {
    return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
    return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {
    thin: 2,
    medium: 4,
    thick: 6
};
goog.style.getIePixelBorder_ = function(a, b) {
    if (goog.style.getCascadedStyle(a, b + "Style") == "none") return 0;
    var c = goog.style.getCascadedStyle(a, b + "Width");
    if (c in goog.style.ieBorderWidthKeywords_) return goog.style.ieBorderWidthKeywords_[c];
    return goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
    if (goog.userAgent.IE) {
        var b = goog.style.getIePixelBorder_(a, "borderLeft"),
            c = goog.style.getIePixelBorder_(a, "borderRight"),
            d = goog.style.getIePixelBorder_(a, "borderTop"),
            a = goog.style.getIePixelBorder_(a, "borderBottom");
        return new goog.math.Box(d, c, a, b)
    } else return b = goog.style.getComputedStyle(a, "borderLeftWidth"), c = goog.style.getComputedStyle(a, "borderRightWidth"), d = goog.style.getComputedStyle(a, "borderTopWidth"), a = goog.style.getComputedStyle(a, "borderBottomWidth"),
        new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
};
goog.style.getFontFamily = function(a) {
    var b = goog.dom.getOwnerDocument(a),
        c = "";
    if (b.body.createTextRange) {
        b = b.body.createTextRange();
        b.moveToElementText(a);
        try {
            c = b.queryCommandValue("FontName")
        } catch (d) {
            c = ""
        }
    }
    c || (c = goog.style.getStyle_(a, "fontFamily"));
    a = c.split(",");
    a.length > 1 && (c = a[0]);
    return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
    return (a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {
    cm: 1,
    "in": 1,
    mm: 1,
    pc: 1,
    pt: 1
};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {
    em: 1,
    ex: 1
};
goog.style.getFontSize = function(a) {
    var b = goog.style.getStyle_(a, "fontSize"),
        c = goog.style.getLengthUnits(b);
    if (b && "px" == c) return parseInt(b, 10);
    if (goog.userAgent.IE)
        if (c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) return goog.style.getIePixelValue_(a, b, "left", "pixelLeft");
        else
    if (a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft");
    c = goog.dom.createDom("span", {
        style: "visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"
    });
    goog.dom.appendChild(a, c);
    b = c.offsetHeight;
    goog.dom.removeNode(c);
    return b
};
goog.style.parseStyleAttribute = function(a) {
    var b = {};
    goog.array.forEach(a.split(/\s*;\s*/), function(a) {
        a = a.split(/\s*:\s*/);
        a.length == 2 && (b[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
    });
    return b
};
goog.style.toStyleAttribute = function(a) {
    var b = [];
    goog.object.forEach(a, function(a, d) {
        b.push(goog.string.toSelectorCase(d), ":", a, ";")
    });
    return b.join("")
};
goog.style.setFloat = function(a, b) {
    a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
    return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function() {
    var a = goog.dom.createElement("div");
    a.style.cssText = "visibility:hidden;overflow:scroll;position:absolute;top:0;width:100px;height:100px";
    goog.dom.appendChild(goog.dom.getDocument().body, a);
    var b = a.offsetWidth - a.clientWidth;
    goog.dom.removeNode(a);
    return b
};
goog.debug.errorHandlerWeakDep = {
    protectEntryPoint: function(a) {
        return a
    }
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.register = function(a) {
    goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
    for (var a = goog.bind(a.wrap, a), b = 0; b < goog.debug.entryPointRegistry.refList_.length; b++) goog.debug.entryPointRegistry.refList_[b](a)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
    for (var a = goog.bind(a.unwrap, a), b = 0; b < goog.debug.entryPointRegistry.refList_.length; b++) goog.debug.entryPointRegistry.refList_[b](a)
};
goog.events = {};
goog.events.EventWrapper = function() {};
goog.events.EventWrapper.prototype.listen = function() {};
goog.events.EventWrapper.prototype.unlisten = function() {};
goog.events.EventType = {
    CLICK: "click",
    DBLCLICK: "dblclick",
    MOUSEDOWN: "mousedown",
    MOUSEUP: "mouseup",
    MOUSEOVER: "mouseover",
    MOUSEOUT: "mouseout",
    MOUSEMOVE: "mousemove",
    SELECTSTART: "selectstart",
    KEYPRESS: "keypress",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    BLUR: "blur",
    FOCUS: "focus",
    DEACTIVATE: "deactivate",
    FOCUSIN: goog.userAgent.IE ? "focusin" : "DOMFocusIn",
    FOCUSOUT: goog.userAgent.IE ? "focusout" : "DOMFocusOut",
    CHANGE: "change",
    SELECT: "select",
    SUBMIT: "submit",
    INPUT: "input",
    PROPERTYCHANGE: "propertychange",
    DRAGSTART: "dragstart",
    DRAGENTER: "dragenter",
    DRAGOVER: "dragover",
    DRAGLEAVE: "dragleave",
    DROP: "drop",
    TOUCHSTART: "touchstart",
    TOUCHMOVE: "touchmove",
    TOUCHEND: "touchend",
    TOUCHCANCEL: "touchcancel",
    CONTEXTMENU: "contextmenu",
    ERROR: "error",
    HELP: "help",
    LOAD: "load",
    LOSECAPTURE: "losecapture",
    READYSTATECHANGE: "readystatechange",
    RESIZE: "resize",
    SCROLL: "scroll",
    UNLOAD: "unload",
    HASHCHANGE: "hashchange",
    PAGEHIDE: "pagehide",
    PAGESHOW: "pageshow",
    POPSTATE: "popstate",
    COPY: "copy",
    PASTE: "paste",
    CUT: "cut",
    MESSAGE: "message",
    CONNECT: "connect"
};
goog.events.BrowserFeature = {
    HAS_W3C_BUTTON: !goog.userAgent.IE || goog.userAgent.isVersion("9"),
    SET_KEY_CODE_TO_PREVENT_DEFAULT: goog.userAgent.IE && !goog.userAgent.isVersion("8")
};
goog.disposable = {};
goog.disposable.IDisposable = function() {};
goog.Disposable = function() {
    goog.Disposable.ENABLE_MONITORING && (goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.ENABLE_MONITORING = !1;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
    var a = [],
        b;
    for (b in goog.Disposable.instances_) goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)]);
    return a
};
goog.Disposable.clearUndisposedObjects = function() {
    goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
    return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
    if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.ENABLE_MONITORING)) {
        var a = goog.getUid(this);
        if (!goog.Disposable.instances_.hasOwnProperty(a)) throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
        delete goog.Disposable.instances_[a]
    }
};
goog.Disposable.prototype.disposeInternal = function() {};
goog.dispose = function(a) {
    a && typeof a.dispose == "function" && a.dispose()
};
goog.events.Event = function(a, b) {
    goog.Disposable.call(this);
    this.type = a;
    this.currentTarget = this.target = b
};
goog.inherits(goog.events.Event, goog.Disposable);
goog.events.Event.prototype.disposeInternal = function() {
    delete this.type;
    delete this.target;
    delete this.currentTarget
};
goog.events.Event.prototype.propagationStopped_ = !1;
goog.events.Event.prototype.returnValue_ = !0;
goog.events.Event.prototype.stopPropagation = function() {
    this.propagationStopped_ = !0
};
goog.events.Event.prototype.preventDefault = function() {
    this.returnValue_ = !1
};
goog.events.Event.stopPropagation = function(a) {
    a.stopPropagation()
};
goog.events.Event.preventDefault = function(a) {
    a.preventDefault()
};
goog.reflect = {};
goog.reflect.object = function(a, b) {
    return b
};
goog.reflect.sinkValue = new Function("a", "return a");
goog.events.BrowserEvent = function(a, b) {
    a && this.init(a, b)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.relatedTarget = null;
goog.events.BrowserEvent.prototype.offsetX = 0;
goog.events.BrowserEvent.prototype.offsetY = 0;
goog.events.BrowserEvent.prototype.clientX = 0;
goog.events.BrowserEvent.prototype.clientY = 0;
goog.events.BrowserEvent.prototype.screenX = 0;
goog.events.BrowserEvent.prototype.screenY = 0;
goog.events.BrowserEvent.prototype.button = 0;
goog.events.BrowserEvent.prototype.keyCode = 0;
goog.events.BrowserEvent.prototype.charCode = 0;
goog.events.BrowserEvent.prototype.ctrlKey = !1;
goog.events.BrowserEvent.prototype.altKey = !1;
goog.events.BrowserEvent.prototype.shiftKey = !1;
goog.events.BrowserEvent.prototype.metaKey = !1;
goog.events.BrowserEvent.prototype.platformModifierKey = !1;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function(a, b) {
    var c = this.type = a.type;
    goog.events.Event.call(this, c);
    this.target = a.target || a.srcElement;
    this.currentTarget = b;
    var d = a.relatedTarget;
    if (d) {
        if (goog.userAgent.GECKO) try {
            goog.reflect.sinkValue(d.nodeName)
        } catch (e) {
            d = null
        }
    } else if (c == goog.events.EventType.MOUSEOVER) d = a.fromElement;
    else if (c == goog.events.EventType.MOUSEOUT) d = a.toElement;
    this.relatedTarget = d;
    this.offsetX = a.offsetX !== void 0 ? a.offsetX : a.layerX;
    this.offsetY = a.offsetY !== void 0 ? a.offsetY :
        a.layerY;
    this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX;
    this.clientY = a.clientY !== void 0 ? a.clientY : a.pageY;
    this.screenX = a.screenX || 0;
    this.screenY = a.screenY || 0;
    this.button = a.button;
    this.keyCode = a.keyCode || 0;
    this.charCode = a.charCode || (c == "keypress" ? a.keyCode : 0);
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
    this.state = a.state;
    this.event_ = a;
    delete this.returnValue_;
    delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
    return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : this.type == "click" ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
    return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
    goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
    this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
    goog.events.BrowserEvent.superClass_.preventDefault.call(this);
    var a = this.event_;
    if (a.preventDefault) a.preventDefault();
    else if (a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) try {
        if (a.ctrlKey || a.keyCode >= 112 && a.keyCode <= 123) a.keyCode = -1
    } catch (b) {}
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
    return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
    goog.events.BrowserEvent.superClass_.disposeInternal.call(this);
    this.relatedTarget = this.currentTarget = this.target = this.event_ = null
};
goog.events.Listener = function() {};
goog.events.Listener.counter_ = 0;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = !1;
goog.events.Listener.prototype.callOnce = !1;
goog.events.Listener.prototype.init = function(a, b, c, d, e, f) {
    if (goog.isFunction(a)) this.isFunctionListener_ = !0;
    else if (a && a.handleEvent && goog.isFunction(a.handleEvent)) this.isFunctionListener_ = !1;
    else throw Error("Invalid listener argument");
    this.listener = a;
    this.proxy = b;
    this.src = c;
    this.type = d;
    this.capture = !!e;
    this.handler = f;
    this.callOnce = !1;
    this.key = ++goog.events.Listener.counter_;
    this.removed = !1
};
goog.events.Listener.prototype.handleEvent = function(a) {
    if (this.isFunctionListener_) return this.listener.call(this.handler || this.src, a);
    return this.listener.handleEvent.call(this.listener, a)
};
goog.userAgent.jscript = {};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = !1;
goog.userAgent.jscript.init_ = function() {
    goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = "ScriptEngine" in goog.global && goog.global.ScriptEngine() == "JScript";
    goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global.ScriptEngineMajorVersion() + "." + goog.global.ScriptEngineMinorVersion() + "." + goog.global.ScriptEngineBuildVersion() : "0"
};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT || goog.userAgent.jscript.init_();
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? !1 : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(a) {
    return goog.string.compareVersions(goog.userAgent.jscript.VERSION, a) >= 0
};
goog.structs = {};
goog.structs.SimplePool = function(a, b) {
    goog.Disposable.call(this);
    this.maxCount_ = b;
    this.freeQueue_ = [];
    this.createInitial_(a)
};
goog.inherits(goog.structs.SimplePool, goog.Disposable);
goog.structs.SimplePool.prototype.createObjectFn_ = null;
goog.structs.SimplePool.prototype.disposeObjectFn_ = null;
goog.structs.SimplePool.prototype.setCreateObjectFn = function(a) {
    this.createObjectFn_ = a
};
goog.structs.SimplePool.prototype.setDisposeObjectFn = function(a) {
    this.disposeObjectFn_ = a
};
goog.structs.SimplePool.prototype.getObject = function() {
    if (this.freeQueue_.length) return this.freeQueue_.pop();
    return this.createObject()
};
goog.structs.SimplePool.prototype.releaseObject = function(a) {
    this.freeQueue_.length < this.maxCount_ ? this.freeQueue_.push(a) : this.disposeObject(a)
};
goog.structs.SimplePool.prototype.createInitial_ = function(a) {
    if (a > this.maxCount_) throw Error("[goog.structs.SimplePool] Initial cannot be greater than max");
    for (var b = 0; b < a; b++) this.freeQueue_.push(this.createObject())
};
goog.structs.SimplePool.prototype.createObject = function() {
    return this.createObjectFn_ ? this.createObjectFn_() : {}
};
goog.structs.SimplePool.prototype.disposeObject = function(a) {
    if (this.disposeObjectFn_) this.disposeObjectFn_(a);
    else if (goog.isObject(a))
        if (goog.isFunction(a.dispose)) a.dispose();
        else
            for (var b in a) delete a[b]
};
goog.structs.SimplePool.prototype.disposeInternal = function() {
    goog.structs.SimplePool.superClass_.disposeInternal.call(this);
    for (var a = this.freeQueue_; a.length;) this.disposeObject(a.pop());
    delete this.freeQueue_
};
goog.events.pools = {};
goog.events.ASSUME_GOOD_GC = !1;
(function() {
    function a() {
        return {
            count_: 0,
            remaining_: 0
        }
    }

    function b() {
        return []
    }

    function c() {
        var a = function(b) {
            return g.call(a.src, a.key, b)
        };
        return a
    }

    function d() {
        return new goog.events.Listener
    }

    function e() {
        return new goog.events.BrowserEvent
    }
    var f = !goog.events.ASSUME_GOOD_GC && goog.userAgent.jscript.HAS_JSCRIPT && !goog.userAgent.jscript.isVersion("5.7"),
        g;
    goog.events.pools.setProxyCallbackFunction = function(a) {
        g = a
    };
    if (f) {
        goog.events.pools.getObject = function() {
            return h.getObject()
        };
        goog.events.pools.releaseObject =
            function(a) {
                h.releaseObject(a)
        };
        goog.events.pools.getArray = function() {
            return i.getObject()
        };
        goog.events.pools.releaseArray = function(a) {
            i.releaseObject(a)
        };
        goog.events.pools.getProxy = function() {
            return j.getObject()
        };
        goog.events.pools.releaseProxy = function() {
            j.releaseObject(c())
        };
        goog.events.pools.getListener = function() {
            return k.getObject()
        };
        goog.events.pools.releaseListener = function(a) {
            k.releaseObject(a)
        };
        goog.events.pools.getEvent = function() {
            return m.getObject()
        };
        goog.events.pools.releaseEvent = function(a) {
            m.releaseObject(a)
        };
        var h = new goog.structs.SimplePool(0, 600);
        h.setCreateObjectFn(a);
        var i = new goog.structs.SimplePool(0, 600);
        i.setCreateObjectFn(b);
        var j = new goog.structs.SimplePool(0, 600);
        j.setCreateObjectFn(c);
        var k = new goog.structs.SimplePool(0, 600);
        k.setCreateObjectFn(d);
        var m = new goog.structs.SimplePool(0, 600);
        m.setCreateObjectFn(e)
    } else goog.events.pools.getObject = a, goog.events.pools.releaseObject = goog.nullFunction, goog.events.pools.getArray = b, goog.events.pools.releaseArray = goog.nullFunction, goog.events.pools.getProxy =
        c, goog.events.pools.releaseProxy = goog.nullFunction, goog.events.pools.getListener = d, goog.events.pools.releaseListener = goog.nullFunction, goog.events.pools.getEvent = e, goog.events.pools.releaseEvent = goog.nullFunction
})();
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function(a, b, c, d, e) {
    if (b)
        if (goog.isArray(b)) {
            for (var f = 0; f < b.length; f++) goog.events.listen(a, b[f], c, d, e);
            return null
        } else {
            var d = !!d,
                g = goog.events.listenerTree_;
            b in g || (g[b] = goog.events.pools.getObject());
            g = g[b];
            d in g || (g[d] = goog.events.pools.getObject(), g.count_++);
            var g = g[d],
                h = goog.getUid(a),
                i;
            g.remaining_++;
            if (g[h]) {
                i = g[h];
                for (f = 0; f < i.length; f++)
                    if (g = i[f], g.listener == c && g.handler == e) {
                        if (g.removed) break;
                        return i[f].key
                    }
            } else i = g[h] = goog.events.pools.getArray(), g.count_++;
            f = goog.events.pools.getProxy();
            f.src = a;
            g = goog.events.pools.getListener();
            g.init(c, f, a, b, d, e);
            c = g.key;
            f.key = c;
            i.push(g);
            goog.events.listeners_[c] = g;
            goog.events.sources_[h] || (goog.events.sources_[h] = goog.events.pools.getArray());
            goog.events.sources_[h].push(g);
            a.addEventListener ? (a == goog.global || !a.customEvent_) && a.addEventListener(b, f, d) : a.attachEvent(goog.events.getOnString_(b), f);
            return c
        } else throw Error("Invalid event type");
};
goog.events.listenOnce = function(a, b, c, d, e) {
    if (goog.isArray(b)) {
        for (var f = 0; f < b.length; f++) goog.events.listenOnce(a, b[f], c, d, e);
        return null
    }
    a = goog.events.listen(a, b, c, d, e);
    goog.events.listeners_[a].callOnce = !0;
    return a
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
    b.listen(a, c, d, e)
};
goog.events.unlisten = function(a, b, c, d, e) {
    if (goog.isArray(b)) {
        for (var f = 0; f < b.length; f++) goog.events.unlisten(a, b[f], c, d, e);
        return null
    }
    d = !!d;
    a = goog.events.getListeners_(a, b, d);
    if (!a) return !1;
    for (f = 0; f < a.length; f++)
        if (a[f].listener == c && a[f].capture == d && a[f].handler == e) return goog.events.unlistenByKey(a[f].key);
    return !1
};
goog.events.unlistenByKey = function(a) {
    if (!goog.events.listeners_[a]) return !1;
    var b = goog.events.listeners_[a];
    if (b.removed) return !1;
    var c = b.src,
        d = b.type,
        e = b.proxy,
        f = b.capture;
    c.removeEventListener ? (c == goog.global || !c.customEvent_) && c.removeEventListener(d, e, f) : c.detachEvent && c.detachEvent(goog.events.getOnString_(d), e);
    c = goog.getUid(c);
    e = goog.events.listenerTree_[d][f][c];
    if (goog.events.sources_[c]) {
        var g = goog.events.sources_[c];
        goog.array.remove(g, b);
        g.length == 0 && delete goog.events.sources_[c]
    }
    b.removed = !0;
    e.needsCleanup_ = !0;
    goog.events.cleanUp_(d, f, c, e);
    delete goog.events.listeners_[a];
    return !0
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
    b.unlisten(a, c, d, e)
};
goog.events.cleanUp_ = function(a, b, c, d) {
    if (!d.locked_ && d.needsCleanup_) {
        for (var e = 0, f = 0; e < d.length; e++)
            if (d[e].removed) {
                var g = d[e].proxy;
                g.src = null;
                goog.events.pools.releaseProxy(g);
                goog.events.pools.releaseListener(d[e])
            } else e != f && (d[f] = d[e]), f++;
        d.length = f;
        d.needsCleanup_ = !1;
        f == 0 && (goog.events.pools.releaseArray(d), delete goog.events.listenerTree_[a][b][c], goog.events.listenerTree_[a][b].count_--, goog.events.listenerTree_[a][b].count_ == 0 && (goog.events.pools.releaseObject(goog.events.listenerTree_[a][b]),
            delete goog.events.listenerTree_[a][b], goog.events.listenerTree_[a].count_--), goog.events.listenerTree_[a].count_ == 0 && (goog.events.pools.releaseObject(goog.events.listenerTree_[a]), delete goog.events.listenerTree_[a]))
    }
};
goog.events.removeAll = function(a, b, c) {
    var d = 0,
        e = b == null,
        f = c == null,
        c = !!c;
    if (a == null) goog.object.forEach(goog.events.sources_, function(a) {
        for (var g = a.length - 1; g >= 0; g--) {
            var h = a[g];
            if ((e || b == h.type) && (f || c == h.capture)) goog.events.unlistenByKey(h.key), d++
        }
    });
    else if (a = goog.getUid(a), goog.events.sources_[a])
        for (var a = goog.events.sources_[a], g = a.length - 1; g >= 0; g--) {
            var h = a[g];
            if ((e || b == h.type) && (f || c == h.capture)) goog.events.unlistenByKey(h.key), d++
        }
    return d
};
goog.events.getListeners = function(a, b, c) {
    return goog.events.getListeners_(a, b, c) || []
};
goog.events.getListeners_ = function(a, b, c) {
    var d = goog.events.listenerTree_;
    if (b in d && (d = d[b], c in d && (d = d[c], a = goog.getUid(a), d[a]))) return d[a];
    return null
};
goog.events.getListener = function(a, b, c, d, e) {
    d = !!d;
    if (a = goog.events.getListeners_(a, b, d))
        for (b = 0; b < a.length; b++)
            if (a[b].listener == c && a[b].capture == d && a[b].handler == e) return a[b];
    return null
};
goog.events.hasListener = function(a, b, c) {
    var a = goog.getUid(a),
        d = goog.events.sources_[a];
    if (d) {
        var e = goog.isDef(b),
            f = goog.isDef(c);
        return e && f ? (d = goog.events.listenerTree_[b], !!d && !!d[c] && a in d[c]) : !e && !f ? !0 : goog.array.some(d, function(a) {
            return e && a.type == b || f && a.capture == c
        })
    }
    return !1
};
goog.events.expose = function(a) {
    var b = [],
        c;
    for (c in a) a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c].id + ")") : b.push(c + " = " + a[c]);
    return b.join("\n")
};
goog.events.getOnString_ = function(a) {
    if (a in goog.events.onStringMap_) return goog.events.onStringMap_[a];
    return goog.events.onStringMap_[a] = goog.events.onString_ + a
};
goog.events.fireListeners = function(a, b, c, d) {
    var e = goog.events.listenerTree_;
    if (b in e && (e = e[b], c in e)) return goog.events.fireListeners_(e[c], a, b, c, d);
    return !0
};
goog.events.fireListeners_ = function(a, b, c, d, e) {
    var f = 1,
        b = goog.getUid(b);
    if (a[b]) {
        a.remaining_--;
        a = a[b];
        a.locked_ ? a.locked_++ : a.locked_ = 1;
        try {
            for (var g = a.length, h = 0; h < g; h++) {
                var i = a[h];
                i && !i.removed && (f &= goog.events.fireListener(i, e) !== !1)
            }
        } finally {
            a.locked_--, goog.events.cleanUp_(c, d, b, a)
        }
    }
    return Boolean(f)
};
goog.events.fireListener = function(a, b) {
    var c = a.handleEvent(b);
    a.callOnce && goog.events.unlistenByKey(a.key);
    return c
};
goog.events.getTotalListenerCount = function() {
    return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(a, b) {
    var c = b.type || b,
        d = goog.events.listenerTree_;
    if (!(c in d)) return !0;
    if (goog.isString(b)) b = new goog.events.Event(b, a);
    else if (b instanceof goog.events.Event) b.target = b.target || a;
    else {
        var e = b,
            b = new goog.events.Event(c, a);
        goog.object.extend(b, e)
    }
    var e = 1,
        f, d = d[c],
        c = !0 in d,
        g;
    if (c) {
        f = [];
        for (g = a; g; g = g.getParentEventTarget()) f.push(g);
        g = d[!0];
        g.remaining_ = g.count_;
        for (var h = f.length - 1; !b.propagationStopped_ && h >= 0 && g.remaining_; h--) b.currentTarget = f[h], e &= goog.events.fireListeners_(g,
            f[h], b.type, !0, b) && b.returnValue_ != !1
    }
    if (!1 in d)
        if (g = d[!1], g.remaining_ = g.count_, c)
            for (h = 0; !b.propagationStopped_ && h < f.length && g.remaining_; h++) b.currentTarget = f[h], e &= goog.events.fireListeners_(g, f[h], b.type, !1, b) && b.returnValue_ != !1;
        else
            for (d = a; !b.propagationStopped_ && d && g.remaining_; d = d.getParentEventTarget()) b.currentTarget = d, e &= goog.events.fireListeners_(g, d, b.type, !1, b) && b.returnValue_ != !1;
    return Boolean(e)
};
goog.events.protectBrowserEventEntryPoint = function(a) {
    goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_);
    goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(a, b) {
    if (!goog.events.listeners_[a]) return !0;
    var c = goog.events.listeners_[a],
        d = c.type,
        e = goog.events.listenerTree_;
    if (!(d in e)) return !0;
    var e = e[d],
        f, g;
    if (goog.events.synthesizeEventPropagation_()) {
        f = b || goog.getObjectByName("window.event");
        var h = !0 in e,
            i = !1 in e;
        if (h) {
            if (goog.events.isMarkedIeEvent_(f)) return !0;
            goog.events.markIeEvent_(f)
        }
        var j = goog.events.pools.getEvent();
        j.init(f, this);
        f = !0;
        try {
            if (h) {
                for (var k = goog.events.pools.getArray(), m = j.currentTarget; m; m =
                    m.parentNode) k.push(m);
                g = e[!0];
                g.remaining_ = g.count_;
                for (var l = k.length - 1; !j.propagationStopped_ && l >= 0 && g.remaining_; l--) j.currentTarget = k[l], f &= goog.events.fireListeners_(g, k[l], d, !0, j);
                if (i) {
                    g = e[!1];
                    g.remaining_ = g.count_;
                    for (l = 0; !j.propagationStopped_ && l < k.length && g.remaining_; l++) j.currentTarget = k[l], f &= goog.events.fireListeners_(g, k[l], d, !1, j)
                }
            } else f = goog.events.fireListener(c, j)
        } finally {
            if (k) k.length = 0, goog.events.pools.releaseArray(k);
            j.dispose();
            goog.events.pools.releaseEvent(j)
        }
        return f
    }
    d =
        new goog.events.BrowserEvent(b, this);
    try {
        f = goog.events.fireListener(c, d)
    } finally {
        d.dispose()
    }
    return f
};
goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_);
goog.events.markIeEvent_ = function(a) {
    var b = !1;
    if (a.keyCode == 0) try {
        a.keyCode = -1;
        return
    } catch (c) {
        b = !0
    }
    if (b || a.returnValue == void 0) a.returnValue = !0
};
goog.events.isMarkedIeEvent_ = function(a) {
    return a.keyCode < 0 || a.returnValue != void 0
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
    return a + "_" + goog.events.uniqueIdCounter_++
};
goog.events.synthesizeEventPropagation_ = function() {
    if (goog.events.requiresSyntheticEventPropagation_ === void 0) goog.events.requiresSyntheticEventPropagation_ = goog.userAgent.IE && !goog.global.addEventListener;
    return goog.events.requiresSyntheticEventPropagation_
};
goog.debug.entryPointRegistry.register(function(a) {
    goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_);
    goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_)
});
goog.events.EventHandler = function(a) {
    goog.Disposable.call(this);
    this.handler_ = a
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.KEY_POOL_INITIAL_COUNT = 0;
goog.events.EventHandler.KEY_POOL_MAX_COUNT = 100;
goog.events.EventHandler.keyPool_ = new goog.structs.SimplePool(goog.events.EventHandler.KEY_POOL_INITIAL_COUNT, goog.events.EventHandler.KEY_POOL_MAX_COUNT);
goog.events.EventHandler.keys_ = null;
goog.events.EventHandler.key_ = null;
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(a, b, c, d, e) {
    if (!goog.isArray(b)) goog.events.EventHandler.typeArray_[0] = b, b = goog.events.EventHandler.typeArray_;
    for (var f = 0; f < b.length; f++) this.recordListenerKey_(goog.events.listen(a, b[f], c || this, d || !1, e || this.handler_ || this));
    return this
};
goog.events.EventHandler.prototype.listenOnce = function(a, b, c, d, e) {
    if (goog.isArray(b))
        for (var f = 0; f < b.length; f++) this.listenOnce(a, b[f], c, d, e);
    else this.recordListenerKey_(goog.events.listenOnce(a, b, c || this, d || !1, e || this.handler_ || this));
    return this
};
goog.events.EventHandler.prototype.listenWithWrapper = function(a, b, c, d, e) {
    b.listen(a, c, d, e || this.handler_, this);
    return this
};
goog.events.EventHandler.prototype.recordListenerKey_ = function(a) {
    this.keys_ ? this.keys_[a] = !0 : this.key_ ? (this.keys_ = goog.events.EventHandler.keyPool_.getObject(), this.keys_[this.key_] = !0, this.key_ = null, this.keys_[a] = !0) : this.key_ = a
};
goog.events.EventHandler.prototype.unlisten = function(a, b, c, d, e) {
    if (this.key_ || this.keys_)
        if (goog.isArray(b))
            for (var f = 0; f < b.length; f++) this.unlisten(a, b[f], c, d, e);
        else
    if (a = goog.events.getListener(a, b, c || this, d || !1, e || this.handler_ || this))
        if (a = a.key, goog.events.unlistenByKey(a), this.keys_) goog.object.remove(this.keys_, a);
        else
    if (this.key_ == a) this.key_ = null;
    return this
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(a, b, c, d, e) {
    b.unlisten(a, c, d, e || this.handler_, this);
    return this
};
goog.events.EventHandler.prototype.removeAll = function() {
    if (this.keys_) {
        for (var a in this.keys_) goog.events.unlistenByKey(a), delete this.keys_[a];
        goog.events.EventHandler.keyPool_.releaseObject(this.keys_);
        this.keys_ = null
    } else this.key_ && goog.events.unlistenByKey(this.key_)
};
goog.events.EventHandler.prototype.disposeInternal = function() {
    goog.events.EventHandler.superClass_.disposeInternal.call(this);
    this.removeAll()
};
goog.events.EventHandler.prototype.handleEvent = function() {
    throw Error("EventHandler.handleEvent not implemented");
};
goog.events.KeyCodes = {
    MAC_ENTER: 3,
    BACKSPACE: 8,
    TAB: 9,
    NUM_CENTER: 12,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PRINT_SCREEN: 44,
    INSERT: 45,
    DELETE: 46,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    QUESTION_MARK: 63,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    META: 91,
    CONTEXT_MENU: 93,
    NUM_ZERO: 96,
    NUM_ONE: 97,
    NUM_TWO: 98,
    NUM_THREE: 99,
    NUM_FOUR: 100,
    NUM_FIVE: 101,
    NUM_SIX: 102,
    NUM_SEVEN: 103,
    NUM_EIGHT: 104,
    NUM_NINE: 105,
    NUM_MULTIPLY: 106,
    NUM_PLUS: 107,
    NUM_MINUS: 109,
    NUM_PERIOD: 110,
    NUM_DIVISION: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUMLOCK: 144,
    SEMICOLON: 186,
    DASH: 189,
    EQUALS: 187,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    APOSTROPHE: 192,
    SINGLE_QUOTE: 222,
    OPEN_SQUARE_BRACKET: 219,
    BACKSLASH: 220,
    CLOSE_SQUARE_BRACKET: 221,
    WIN_KEY: 224,
    MAC_FF_META: 224,
    WIN_IME: 229,
    PHANTOM: 255
};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(a) {
    if (a.altKey && !a.ctrlKey || a.metaKey || a.keyCode >= goog.events.KeyCodes.F1 && a.keyCode <= goog.events.KeyCodes.F12) return !1;
    switch (a.keyCode) {
        case goog.events.KeyCodes.ALT:
        case goog.events.KeyCodes.CAPS_LOCK:
        case goog.events.KeyCodes.CONTEXT_MENU:
        case goog.events.KeyCodes.CTRL:
        case goog.events.KeyCodes.DOWN:
        case goog.events.KeyCodes.END:
        case goog.events.KeyCodes.ESC:
        case goog.events.KeyCodes.HOME:
        case goog.events.KeyCodes.INSERT:
        case goog.events.KeyCodes.LEFT:
        case goog.events.KeyCodes.MAC_FF_META:
        case goog.events.KeyCodes.META:
        case goog.events.KeyCodes.NUMLOCK:
        case goog.events.KeyCodes.NUM_CENTER:
        case goog.events.KeyCodes.PAGE_DOWN:
        case goog.events.KeyCodes.PAGE_UP:
        case goog.events.KeyCodes.PAUSE:
        case goog.events.KeyCodes.PHANTOM:
        case goog.events.KeyCodes.PRINT_SCREEN:
        case goog.events.KeyCodes.RIGHT:
        case goog.events.KeyCodes.SHIFT:
        case goog.events.KeyCodes.UP:
        case goog.events.KeyCodes.WIN_KEY:
            return !1;
        default:
            return !0
    }
};
goog.events.KeyCodes.firesKeyPressEvent = function(a, b, c, d, e) {
    if (!goog.userAgent.IE && (!goog.userAgent.WEBKIT || !goog.userAgent.isVersion("525"))) return !0;
    if (goog.userAgent.MAC && e) return goog.events.KeyCodes.isCharacterKey(a);
    if (e && !d) return !1;
    if (!c && (b == goog.events.KeyCodes.CTRL || b == goog.events.KeyCodes.ALT)) return !1;
    if (goog.userAgent.IE && d && b == a) return !1;
    switch (a) {
        case goog.events.KeyCodes.ENTER:
            return !0;
        case goog.events.KeyCodes.ESC:
            return !goog.userAgent.WEBKIT
    }
    return goog.events.KeyCodes.isCharacterKey(a)
};
goog.events.KeyCodes.isCharacterKey = function(a) {
    if (a >= goog.events.KeyCodes.ZERO && a <= goog.events.KeyCodes.NINE) return !0;
    if (a >= goog.events.KeyCodes.NUM_ZERO && a <= goog.events.KeyCodes.NUM_MULTIPLY) return !0;
    if (a >= goog.events.KeyCodes.A && a <= goog.events.KeyCodes.Z) return !0;
    if (goog.userAgent.WEBKIT && a == 0) return !0;
    switch (a) {
        case goog.events.KeyCodes.SPACE:
        case goog.events.KeyCodes.QUESTION_MARK:
        case goog.events.KeyCodes.NUM_PLUS:
        case goog.events.KeyCodes.NUM_MINUS:
        case goog.events.KeyCodes.NUM_PERIOD:
        case goog.events.KeyCodes.NUM_DIVISION:
        case goog.events.KeyCodes.SEMICOLON:
        case goog.events.KeyCodes.DASH:
        case goog.events.KeyCodes.EQUALS:
        case goog.events.KeyCodes.COMMA:
        case goog.events.KeyCodes.PERIOD:
        case goog.events.KeyCodes.SLASH:
        case goog.events.KeyCodes.APOSTROPHE:
        case goog.events.KeyCodes.SINGLE_QUOTE:
        case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
        case goog.events.KeyCodes.BACKSLASH:
        case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
            return !0;
        default:
            return !1
    }
};
goog.events.EventTarget = function() {
    goog.Disposable.call(this)
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.EventTarget.prototype.customEvent_ = !0;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
    return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
    this.parentEventTarget_ = a
};
goog.events.EventTarget.prototype.addEventListener = function(a, b, c, d) {
    goog.events.listen(this, a, b, c, d)
};
goog.events.EventTarget.prototype.removeEventListener = function(a, b, c, d) {
    goog.events.unlisten(this, a, b, c, d)
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
    return goog.events.dispatchEvent(this, a)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
    goog.events.EventTarget.superClass_.disposeInternal.call(this);
    goog.events.removeAll(this);
    this.parentEventTarget_ = null
};
goog.events.KeyHandler = function(a, b) {
    goog.events.EventTarget.call(this);
    a && this.attach(a, b)
};
goog.inherits(goog.events.KeyHandler, goog.events.EventTarget);
goog.events.KeyHandler.prototype.element_ = null;
goog.events.KeyHandler.prototype.keyPressKey_ = null;
goog.events.KeyHandler.prototype.keyDownKey_ = null;
goog.events.KeyHandler.prototype.keyUpKey_ = null;
goog.events.KeyHandler.prototype.lastKey_ = -1;
goog.events.KeyHandler.prototype.keyCode_ = -1;
goog.events.KeyHandler.EventType = {
    KEY: "key"
};
goog.events.KeyHandler.safariKey_ = {
    '3': goog.events.KeyCodes.ENTER, // 13
    '12': goog.events.KeyCodes.NUMLOCK, // 144
    '63232': goog.events.KeyCodes.UP, // 38
    '29461': goog.events.KeyCodes.DOWN,
    '29460': goog.events.KeyCodes.UP,
    '29443': goog.events.KeyCodes.ENTER,
    '63233': goog.events.KeyCodes.DOWN, // 40
    '4': goog.events.KeyCodes.LEFT, // 37
    '5': goog.events.KeyCodes.RIGHT, // 39
    '63236': goog.events.KeyCodes.F1, // 112
    '63237': goog.events.KeyCodes.F2, // 113
    '63238': goog.events.KeyCodes.F3, // 114
    '63239': goog.events.KeyCodes.F4, // 115
    '63240': goog.events.KeyCodes.F5, // 116
    '63241': goog.events.KeyCodes.F6, // 117
    '63242': goog.events.KeyCodes.F7, // 118
    '63243': goog.events.KeyCodes.F8, // 119
    '63244': goog.events.KeyCodes.F9, // 120
    '63245': goog.events.KeyCodes.F10, // 121
    '63246': goog.events.KeyCodes.F11, // 122
    '63247': goog.events.KeyCodes.F12, // 123
    '63248': goog.events.KeyCodes.PRINT_SCREEN, // 44
    '63272': goog.events.KeyCodes.DELETE, // 46
    '63273': goog.events.KeyCodes.HOME, // 36
    '63275': goog.events.KeyCodes.END, // 35
    '63276': goog.events.KeyCodes.PAGE_UP, // 33
    '63277': goog.events.KeyCodes.PAGE_DOWN, // 34
    '63289': goog.events.KeyCodes.NUMLOCK, // 144
    '63302': goog.events.KeyCodes.INSERT // 45
};
goog.events.KeyHandler.keyIdentifier_ = {
    Up: goog.events.KeyCodes.UP,
    Down: goog.events.KeyCodes.DOWN,
    Left: goog.events.KeyCodes.LEFT,
    Right: goog.events.KeyCodes.RIGHT,
    Enter: goog.events.KeyCodes.ENTER,
    F1: goog.events.KeyCodes.F1,
    F2: goog.events.KeyCodes.F2,
    F3: goog.events.KeyCodes.F3,
    F4: goog.events.KeyCodes.F4,
    F5: goog.events.KeyCodes.F5,
    F6: goog.events.KeyCodes.F6,
    F7: goog.events.KeyCodes.F7,
    F8: goog.events.KeyCodes.F8,
    F9: goog.events.KeyCodes.F9,
    F10: goog.events.KeyCodes.F10,
    F11: goog.events.KeyCodes.F11,
    F12: goog.events.KeyCodes.F12,
    "U+007F": goog.events.KeyCodes.DELETE,
    Home: goog.events.KeyCodes.HOME,
    End: goog.events.KeyCodes.END,
    PageUp: goog.events.KeyCodes.PAGE_UP,
    PageDown: goog.events.KeyCodes.PAGE_DOWN,
    Insert: goog.events.KeyCodes.INSERT
};
goog.events.KeyHandler.mozKeyCodeToKeyCodeMap_ = {
    61: 187,
    59: 186,
    29443: 13
};
goog.events.KeyHandler.USES_KEYDOWN_ = goog.userAgent.IE || goog.userAgent.WEBKIT && goog.userAgent.isVersion("525");
goog.events.KeyHandler.prototype.handleKeyDown_ = function(a) {
    if (goog.userAgent.WEBKIT && (this.lastKey_ == goog.events.KeyCodes.CTRL && !a.ctrlKey || this.lastKey_ == goog.events.KeyCodes.ALT && !a.altKey)) this.keyCode_ = this.lastKey_ = -1;
    goog.events.KeyHandler.USES_KEYDOWN_ && !goog.events.KeyCodes.firesKeyPressEvent(a.keyCode, this.lastKey_, a.shiftKey, a.ctrlKey, a.altKey) ? this.handleEvent(a) : this.keyCode_ = goog.userAgent.GECKO && a.keyCode in goog.events.KeyHandler.mozKeyCodeToKeyCodeMap_ ? goog.events.KeyHandler.mozKeyCodeToKeyCodeMap_[a.keyCode] :
        a.keyCode
};
goog.events.KeyHandler.prototype.handleKeyup_ = function() {
    this.keyCode_ = this.lastKey_ = -1
};
goog.events.KeyHandler.prototype.handleEvent = function(a) {
    var b = a.getBrowserEvent(),
        c, d;
    if (goog.userAgent.IE && a.type == goog.events.EventType.KEYPRESS) c = this.keyCode_, d = c != goog.events.KeyCodes.ENTER && c != goog.events.KeyCodes.ESC ? b.keyCode : 0;
    else if (goog.userAgent.WEBKIT && a.type == goog.events.EventType.KEYPRESS) c = this.keyCode_, d = b.charCode >= 0 && b.charCode < 63232 && goog.events.KeyCodes.isCharacterKey(c) ? b.charCode : 0;
    else if (goog.userAgent.OPERA) c = this.keyCode_, d = goog.events.KeyCodes.isCharacterKey(c) ? b.keyCode :
        0;
    else if (c = b.keyCode || this.keyCode_, d = b.charCode || 0, goog.userAgent.MAC && d == goog.events.KeyCodes.QUESTION_MARK && !c) c = goog.events.KeyCodes.SLASH;
    var e = c,
        f = b.keyIdentifier;

    c ? (c >= 29232 || c < 6) && c in goog.events.KeyHandler.safariKey_ ? e = goog.events.KeyHandler.safariKey_[c] : c == 25 && a.shiftKey && (e = 9) : f && f in goog.events.KeyHandler.keyIdentifier_ && (e = goog.events.KeyHandler.keyIdentifier_[f]);
    a = e == this.lastKey_;
    this.lastKey_ = e;

    b = new goog.events.KeyEvent(e, d, a, b);
    try {
        this.dispatchEvent(b)
    } finally {
        b.dispose()
    }
};
goog.events.KeyHandler.prototype.getElement = function() {
    return this.element_
};
goog.events.KeyHandler.prototype.attach = function(a, b) {
    this.keyUpKey_ && this.detach();
    this.element_ = a;
    this.keyPressKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYPRESS, this, b);
    this.keyDownKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYDOWN, this.handleKeyDown_, b, this);
    this.keyUpKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYUP, this.handleKeyup_, b, this)
};
goog.events.KeyHandler.prototype.detach = function() {
    if (this.keyPressKey_) goog.events.unlistenByKey(this.keyPressKey_), goog.events.unlistenByKey(this.keyDownKey_), goog.events.unlistenByKey(this.keyUpKey_), this.keyUpKey_ = this.keyDownKey_ = this.keyPressKey_ = null;
    this.element_ = null;
    this.keyCode_ = this.lastKey_ = -1
};
goog.events.KeyHandler.prototype.disposeInternal = function() {
    goog.events.KeyHandler.superClass_.disposeInternal.call(this);
    this.detach()
};
goog.events.KeyEvent = function(a, b, c, d) {
    goog.events.BrowserEvent.call(this, d);
    this.type = goog.events.KeyHandler.EventType.KEY;
    this.keyCode = a;
    this.charCode = b;
    this.repeat = c
};
goog.inherits(goog.events.KeyEvent, goog.events.BrowserEvent);
tv.ui.Document = function(a) {
    this.eventHandler_ = new goog.events.EventHandler(this);
    this.eventHandler_.listen(new goog.events.KeyHandler(a), goog.events.KeyHandler.EventType.KEY, this.onKey)
};
tv.ui.Document.getInstance = function(a) {
    a = a || window.document;
    if (!a.tvUiDocument_) a.tvUiDocument_ = new tv.ui.Document(a);
    return a.tvUiDocument_
};
tv.ui.Document.prototype.onKey = function(a) {
    this.focusedComponent_ && this.focusedComponent_.dispatchKey_(a)
};
tv.ui.Document.prototype.getFocusedComponent = function() {
    return this.focusedComponent_
};
tv.ui.Document.prototype.setFocusedComponent = function(a, b) {
    var c = goog.isDef(this.componentPendingFocus_);
    this.componentPendingFocus_ = a;
    this.noScroll_ = b || !1;
    if (!c)
        for (;;) {
            a = this.componentPendingFocus_;
            if (this.focusedComponent_ == a) {
                delete this.componentPendingFocus_;
                break
            }
            var d = this.getAncestorsAndSelf_(this.focusedComponent_),
                c = this.getAncestorsAndSelf_(a),
                e = d.length - 1,
                f = c.length - 1;
            if (e > 0 && f > 0)
                for (; d[e] == c[f];) e--, f--;
            for (var g = 0; g <= e; g++) d[g].dispatchBlur_();
            this.focusedComponent_ = a;
            d = f;
            for (d + 1 ==
                c.length && d--; d >= 0; d--) c[d + 1].setSelectedChild(c[d], this.noScroll_);
            for (; f >= 0; f--) c[f].dispatchFocus_()
        }
};
tv.ui.Document.prototype.getAncestorsAndSelf_ = function(a) {
    for (var b = []; a; a = a.getParent()) b.push(a);
    return b
};
tv.ui.Component = function() {
    this.eventHandler_ = new goog.events.EventHandler(this)
};
goog.inherits(tv.ui.Component, goog.events.EventTarget);
tv.ui.Component.CLASS = "tv-component";
tv.ui.registerDecorator(tv.ui.Component, tv.ui.Component.CLASS);
tv.ui.Component.Class = {
    FOCUSED: "tv-component-focused",
    HIDDEN: "tv-component-hidden",
    DISABLED: "tv-component-disabled"
};
tv.ui.Component.EventType = {
    FOCUS: goog.events.getUniqueId("focus"),
    BLUR: goog.events.getUniqueId("blur"),
    KEY: goog.events.getUniqueId("key")
};
tv.ui.Component.prototype.disposeInternal = function() {
    tv.ui.unregisterComponent(this);
    this.eventHandler_.dispose();
    delete this.element_;
    tv.ui.Component.superClass_.disposeInternal.call(this)
};
tv.ui.Component.prototype.getParent = function() {
    return this.getParentEventTarget()
};
tv.ui.Component.prototype.setParent = function(a) {
    this.setParentEventTarget(a)
};
tv.ui.Component.prototype.getEventHandler = function() {
    return this.eventHandler_
};
tv.ui.Component.prototype.getElement = function() {
    return this.element_
};
tv.ui.Component.prototype.decorate = function(a) {
    goog.asserts.assert(!this.element_, "Component is already attached to DOM element.");
    this.element_ = a;
    goog.dom.classes.add(this.element_, this.getClass());
    tv.ui.registerComponent(this);
    this.setVisible(!goog.dom.classes.has(this.element_, tv.ui.Component.Class.HIDDEN));
    goog.isDef(window.ontouchstart) && (this.getEventHandler().listen(a, goog.events.EventType.TOUCHSTART, this.onTouchStart), this.getEventHandler().listen(a, goog.events.EventType.TOUCHMOVE, this.onTouchMove),
        this.getEventHandler().listen(a, goog.events.EventType.TOUCHEND, this.onTouchEnd));
    this.eventHandler_.listen(a, goog.events.EventType.MOUSEDOWN, this.onMouseDown);
    this.eventHandler_.listen(this, tv.ui.Component.EventType.FOCUS, this.onFocus);
    this.eventHandler_.listen(this, tv.ui.Component.EventType.BLUR, this.onBlur);
    this.eventHandler_.listen(this, tv.ui.Component.EventType.KEY, this.onKey)
};
tv.ui.Component.prototype.getClass = function() {
    return tv.ui.Component.CLASS
};
tv.ui.Component.prototype.getDocument = function() {
    return this.element_ ? tv.ui.Document.getInstance(this.element_.ownerDocument) : null
};
tv.ui.Component.prototype.isFocused = function() {
    return goog.dom.classes.has(this.element_, tv.ui.Component.Class.FOCUSED)
};
tv.ui.Component.prototype.dispatchFocus_ = function() {
    this.dispatchEvent(tv.ui.Component.EventType.FOCUS)
};
tv.ui.Component.prototype.onFocus = function(a) {
    goog.dom.classes.add(this.element_, tv.ui.Component.Class.FOCUSED);
    a.stopPropagation()
};
tv.ui.Component.prototype.dispatchBlur_ = function() {
    this.dispatchEvent(tv.ui.Component.EventType.BLUR)
};
tv.ui.Component.prototype.onBlur = function(a) {
    goog.dom.classes.remove(this.element_, tv.ui.Component.Class.FOCUSED);
    a.stopPropagation()
};
tv.ui.Component.prototype.dispatchKey_ = function(a) {
    a.type = tv.ui.Component.EventType.KEY;
    a.target = this;
    this.dispatchEvent(a)
};
tv.ui.Component.prototype.onKey = goog.nullFunction;
tv.ui.Component.prototype.onMouseDown = function(a) {
    for (var b = this; b; b = b.getParent())
        if (!b.isEnabled()) return;
    this.tryFocus() && a.stopPropagation()
};
tv.ui.Component.prototype.getSelectedDescendantOrSelf = function() {
    return this.isEnabled() && this.isVisible() ? this : null
};
tv.ui.Component.prototype.selectFirstDescendant = function() {
    return this.isEnabled() && this.isVisible()
};
tv.ui.Component.prototype.isSelectable = function() {
    return this.isEnabled() && this.isVisible()
};
tv.ui.Component.prototype.tryFocus = function(a) {
    var b = this.getSelectedDescendantOrSelf();
    if (!b) return !1;
    this.getDocument().setFocusedComponent(b, a);
    return !0
};
tv.ui.Component.prototype.isVisible = function() {
    return !goog.dom.classes.has(this.element_, tv.ui.Component.Class.HIDDEN)
};
tv.ui.Component.prototype.setVisible = function(a) {
    goog.dom.classes.enable(this.element_, tv.ui.Component.Class.HIDDEN, !a);
    (a = this.getParent()) && a.onChildVisibilityChange(this)
};
tv.ui.Component.prototype.isEnabled = function() {
    return !goog.dom.classes.has(this.element_, tv.ui.Component.Class.DISABLED)
};
tv.ui.Component.prototype.render = function() {
    this.renderScheduled_ = !1
};
tv.ui.Component.prototype.scheduleRender = function() {
    if (!this.renderScheduled_) this.renderScheduled_ = !0, tv.ui.scheduleRender(this)
};
tv.ui.Component.prototype.onTouchStart = function(a) {
    this.touchMoved_ = !1;
    a.preventDefault()
};
tv.ui.Component.prototype.onTouchMove = function(a) {
    this.touchMoved_ = !0;
    a.preventDefault()
};
tv.ui.Component.prototype.onTouchEnd = function(a) {
    !this.touchMoved_ && a.getBrowserEvent().touches.length == 0 && this.tryFocus(!0);
    a.preventDefault()
};
tv.ui.Component.prototype.wasTouchMoved = function() {
    return this.touchMoved_
};
tv.ui.Container = function() {
    tv.ui.Component.call(this);
    this.children_ = []
};
goog.inherits(tv.ui.Container, tv.ui.Component);
tv.ui.Container.CLASS = "tv-container";
tv.ui.Container.Class = {
    HORIZONTAL: "tv-container-horizontal",
    VERTICAL: "tv-container-vertical",
    STACK: "tv-container-stack",
    SELECTED_CHILD: "tv-container-selected-child",
    HIGHLIGHT: "tv-container-highlight",
    SHARED_HIGHLIGHT: "tv-container-shared-highlight",
    HIGHLIGHT_POSITIONED: "tv-container-highlight-positioned",
    HIGHLIGHT_FOCUSED: "tv-container-highlight-focused",
    START_SLIT: "tv-container-start-slit",
    START_SLIT_SHOWN: "tv-container-start-slit-shown",
    END_SLIT: "tv-container-end-slit",
    END_SLIT_SHOWN: "tv-container-end-slit-shown",
    START_SCROLL: "tv-container-start-scroll",
    MIDDLE_SCROLL: "tv-container-middle-scroll",
    MOCK_SCROLL: "tv-container-mock-scroll",
    TRANSIENT_SELECTION: "tv-container-transient-selection"
};
tv.ui.registerDecorator(tv.ui.Container, [tv.ui.Container.CLASS, tv.ui.Container.Class.HORIZONTAL, tv.ui.Container.Class.VERTICAL]);
tv.ui.Container.EventType = {
    SELECT_CHILD: goog.events.getUniqueId("select_child"),
    UPDATE_HIGHLIGHT: goog.events.getUniqueId("update_highlight")
};
tv.ui.Container.AVERAGE_VELOCITY_CALCULATION_INTERVAL = 50;
tv.ui.Container.DECELERATION_ANIMATION_INTERVAL = 20;
tv.ui.Container.prototype.disposeInternal = function() {
    this.removeChildren();
    delete this.scrollElement_;
    delete this.highlightElement_;
    delete this.startSlitElement_;
    delete this.endSlitElement_;
    delete this.mockScrollElement_;
    delete this.mockChildElement_;
    tv.ui.Container.superClass_.disposeInternal.call(this)
};
tv.ui.Container.prototype.decorate = function(a) {
    tv.ui.Container.superClass_.decorate.call(this, a);
    for (a = a.firstChild; a; a = a.nextSibling)
        if (a.nodeType == goog.dom.NodeType.ELEMENT) {
            var b = a;
            if (goog.dom.classes.has(b, tv.ui.Container.Class.HIGHLIGHT)) this.setHighlightElement(b);
            else if (goog.dom.classes.has(b, tv.ui.Container.Class.START_SLIT)) this.startSlitElement_ = b;
            else if (goog.dom.classes.has(b, tv.ui.Container.Class.END_SLIT)) this.endSlitElement_ = b;
            else if (goog.dom.classes.has(b, tv.ui.Container.Class.START_SCROLL)) this.scrollElement_ =
                b;
            else if (goog.dom.classes.has(b, tv.ui.Container.Class.MIDDLE_SCROLL)) this.scrollElement_ = b;
            else if (goog.dom.classes.has(b, tv.ui.Container.Class.MOCK_SCROLL)) this.mockScrollElement_ = b, this.mockChildElement_ = b.removeChild(b.firstChild)
        }
    if (this.scrollElement_ && goog.isDef(window.ontouchstart)) this.scrollTo_(0), this.decelerationTimer_ = new goog.Timer(tv.ui.Container.DECELERATION_ANIMATION_INTERVAL), this.getEventHandler().listen(this.decelerationTimer_, goog.Timer.TICK, function() {
        this.scrollTo_(this.scrollElementCoordinate_ +
            this.decelerationVelocity_);
        this.decelerationVelocity_ *= 0.95;
        Math.abs(this.decelerationVelocity_) < 0.05 && this.decelerationTimer_.stop()
    })
};
tv.ui.Container.prototype.getClass = function() {
    return tv.ui.Container.CLASS
};
tv.ui.Container.prototype.addChild = function(a) {
    this.children_.push(a);
    a.setParent(this);
    if (this.mockScrollElement_) {
        var b = this.mockChildElement_.cloneNode(!0);
        goog.style.showElement(b, a.isVisible());
        this.mockScrollElement_.appendChild(b)
    }!this.selectedChild_ && a.getSelectedDescendantOrSelf() || goog.dom.classes.has(a.getElement(), tv.ui.Container.Class.SELECTED_CHILD) ? this.setSelectedChild(a) : this.scheduleRender()
};
tv.ui.Container.prototype.removeChildren = function() {
    this.setSelectedChild(null);
    this.mockScrollElement_ && goog.dom.removeChildren(this.mockScrollElement_);
    goog.array.forEach(this.children_, function(a) {
        a.dispose()
    });
    this.children_ = [];
    this.scheduleRender()
};
tv.ui.Container.prototype.getChildren = function() {
    return this.children_
};
tv.ui.Container.prototype.isHorizontal = function() {
    return goog.dom.classes.has(this.getElement(), tv.ui.Container.Class.HORIZONTAL)
};
tv.ui.Container.prototype.isVertical = function() {
    return goog.dom.classes.has(this.getElement(), tv.ui.Container.Class.VERTICAL)
};
tv.ui.Container.prototype.isStack = function() {
    return goog.dom.classes.has(this.getElement(), tv.ui.Container.Class.STACK)
};
tv.ui.Container.prototype.getHighlightElement = function() {
    return this.highlightElement_
};
tv.ui.Container.prototype.setHighlightElement = function(a) {
    goog.asserts.assert(!this.isStack(), "Stack container doesn't support highlight.");
    this.highlightElement_ = a
};
tv.ui.Container.prototype.hasSharedHighlight_ = function() {
    goog.asserts.assert(this.highlightElement_, "Container doesn't have highlight.");
    return goog.dom.classes.has(this.highlightElement_, tv.ui.Container.Class.SHARED_HIGHLIGHT)
};
tv.ui.Container.prototype.isControllingHighlight_ = function() {
    return this.controllingSharedHighlight_ || !this.hasSharedHighlight_()
};
tv.ui.Container.prototype.isStartScroll_ = function() {
    goog.asserts.assert(this.scrollElement_, "Container doesn't have scroll.");
    return goog.dom.classes.has(this.scrollElement_, tv.ui.Container.Class.START_SCROLL)
};
tv.ui.Container.prototype.hasTransientSelection = function() {
    return goog.dom.classes.has(this.getElement(), tv.ui.Container.Class.TRANSIENT_SELECTION)
};
tv.ui.Container.prototype.onKey = function(a) {
    if (!this.isStack() && !a.ctrlKey && !a.altKey && !a.shiftKey && !a.metaKey) {
        var b, c = a.keyCode;
        c == this.getPreviousKey_() ? b = this.findPreviousSelectableChild(c) : c == this.getNextKey_() && (b = this.findNextSelectableChild(c));
        b && (this.setSelectedChild(b), this.tryFocus(), a.stopPropagation(), a.preventDefault())
    }
};
tv.ui.Container.prototype.getPreviousKey_ = function() {
    return this.isHorizontal() ? goog.events.KeyCodes.LEFT : this.isVertical() ? goog.events.KeyCodes.UP : 0
};
tv.ui.Container.prototype.getNextKey_ = function() {
    return this.isHorizontal() ? goog.events.KeyCodes.RIGHT : this.isVertical() ? goog.events.KeyCodes.DOWN : 0
};
tv.ui.Container.prototype.selectFirstDescendant = function() {
    return tv.ui.Container.superClass_.selectFirstDescendant.call(this) && goog.array.some(this.children_, function(a) {
        if (a.selectFirstDescendant()) return this.setSelectedChild(a), !0;
        return !1
    }, this)
};
tv.ui.Container.prototype.adjustSelectionFromKey = function(a) {
    if (!this.isSelectable()) return !1;
    var b, c;
    if (a === this.getNextKey_()) b = 0, c = this.children_.length;
    else if (a === this.getPreviousKey_()) b = this.children_.length - 1, c = -1;
    else return this.selectedChild_ && (this.selectedChild_.adjustSelectionFromKey && this.selectedChild_.adjustSelectionFromKey(a) || this.selectedChild_.isSelectable());
    for (var d = b < c ? 1 : -1; b != c; b += d) {
        var e = this.children_[b];
        if (e.adjustSelectionFromKey && e.adjustSelectionFromKey(a) || e.isSelectable()) return this.setSelectedChild(e), !0
    }
    return !1
};
tv.ui.Container.prototype.findPreviousSelectableChild = function(a) {
    return this.findSelectableChild_(-1, 0, a)
};
tv.ui.Container.prototype.findNextSelectableChild = function(a) {
    return this.findSelectableChild_(1, this.children_.length - 1, a)
};
tv.ui.Container.prototype.findSelectableChild_ = function(a, b, c) {
    if (!this.selectedChild_) return null;
    for (var d = goog.array.indexOf(this.children_, this.selectedChild_); d != b;) {
        d += a;
        var e = this.children_[d];
        if (e.getSelectedDescendantOrSelf(c)) return e
    }
    return null
};
tv.ui.Container.prototype.getSelectedDescendantOrSelf = function(a) {
    if (!tv.ui.Container.superClass_.getSelectedDescendantOrSelf.call(this, a)) return null;
    this.isFocused() || this.adjustSelectionFromKey(a);
    return this.selectedChild_ && this.selectedChild_.getSelectedDescendantOrSelf(a)
};
tv.ui.Container.prototype.getSelectedChild = function() {
    return this.selectedChild_
};
tv.ui.Container.prototype.setSelectedChild = function(a, b) {
    if (this.selectedChild_ != a) {
        this.selectedChild_ && goog.dom.classes.remove(this.selectedChild_.getElement(), tv.ui.Container.Class.SELECTED_CHILD);
        if (this.selectedChild_ = a) goog.dom.classes.add(this.selectedChild_.getElement(), tv.ui.Container.Class.SELECTED_CHILD), this.skipNextScroll_ = b || !1, this.scheduleRender();
        var c = this.getParent();
        c && c.onChildSelectabilityChange(this);
        this.dispatchEvent(tv.ui.Container.EventType.SELECT_CHILD)
    }
};
tv.ui.Container.prototype.render = function() {
    tv.ui.Container.superClass_.render.call(this);
    this.isStack() || (this.scroll_(), this.updateHighlight_())
};
tv.ui.Container.prototype.scroll_ = function() {
    if (this.scrollElement_)
        if (this.minScrollElementCoordinate_ = Math.min(0, this.getOffsetSize_(this.element_) - this.getScrollSize_(this.mockScrollElement_ || this.scrollElement_)), this.skipNextScroll_) this.skipNextScroll_ = !1;
        else
    if (this.selectedChild_) {
        var a = goog.array.indexOf(this.children_, this.selectedChild_),
            b = this.getChildElement_(a);
        if (this.isStartScroll_()) this.scrollTo_(-this.getOffsetCoordinate_(b));
        else {
            var c = this.getOffsetSize_(this.element_),
                d = c / 2,
                e = this.getScrollSize_(this.mockScrollElement_ || this.scrollElement_),
                f = this.getOffsetCoordinate_(b);
            e - f < d && (d = c - (e - f));
            var g = b,
                b = a != 0;
            for (a -= 1; a >= 0; a--)
                if (this.children_[a].isVisible()) {
                    var h = this.getChildElement_(a);
                    if (f - this.getOffsetCoordinate_(h) > d) break;
                    g = h;
                    b = a != 0
                }
            d = this.getOffsetCoordinate_(g);
            c = e - d > c;
            this.scrollTo_(-d);
            this.startSlitElement_ && goog.dom.classes.enable(this.startSlitElement_, tv.ui.Container.Class.START_SLIT_SHOWN, b);
            this.endSlitElement_ && goog.dom.classes.enable(this.endSlitElement_,
                tv.ui.Container.Class.END_SLIT_SHOWN, c)
        }
    } else this.scrollTo_(0), this.startSlitElement_ && goog.dom.classes.remove(this.startSlitElement_, tv.ui.Container.Class.START_SLIT_SHOWN), this.endSlitElement_ && goog.dom.classes.remove(this.endSlitElement_, tv.ui.Container.Class.END_SLIT_SHOWN)
};
tv.ui.Container.prototype.getChildElement_ = function(a) {
    return this.mockScrollElement_ ? this.mockScrollElement_.childNodes[a] : this.children_[a].getElement()
};
tv.ui.Container.prototype.scrollTo_ = function(a) {
    this.scrollElementCoordinate_ = Math.max(Math.min(0, a), this.minScrollElementCoordinate_ || -Number.MAX_VALUE);
    a = this.createCoordinate_(this.scrollElementCoordinate_);
    tv.ui.Container.setElementPosition_(this.scrollElement_, a);
    this.mockScrollElement_ && goog.style.setPosition(this.mockScrollElement_, a)
};
tv.ui.Container.setElementPosition_ = goog.userAgent.product.IPHONE || goog.userAgent.product.IPAD ? function(a, b) {
    a.style.webkitTransform = "translate3d(" + b.x + "px, " + b.y + "px, 0)"
} : function(a, b) {
    a.style.webkitTransform = "translate(" + b.x + "px, " + b.y + "px)"
};
tv.ui.Container.prototype.updateHighlight_ = function() {
    if (this.highlightElement_ && this.isControllingHighlight_()) {
        if (this.selectedChild_) {
            var a = this.getChildElement_(goog.array.indexOf(this.children_, this.selectedChild_));
            goog.style.setPosition(this.highlightElement_, goog.style.getRelativePosition(a, this.highlightElement_.parentNode));
            goog.dom.classes.add(this.highlightElement_, tv.ui.Container.Class.HIGHLIGHT_POSITIONED)
        } else goog.dom.classes.remove(this.highlightElement_, tv.ui.Container.Class.HIGHLIGHT_POSITIONED);
        this.dispatchEvent(tv.ui.Container.EventType.UPDATE_HIGHLIGHT)
    }
};
tv.ui.Container.prototype.getOffsetCoordinate_ = function(a) {
    return this.isHorizontal() ? a.offsetLeft : a.offsetTop
};
tv.ui.Container.prototype.getOffsetSize_ = function(a) {
    return this.isHorizontal() ? a.offsetWidth : a.offsetHeight
};
tv.ui.Container.prototype.getScrollSize_ = function(a) {
    return this.isHorizontal() ? a.scrollWidth : a.scrollHeight
};
tv.ui.Container.prototype.createCoordinate_ = function(a) {
    return new goog.math.Coordinate(this.isHorizontal() ? a : 0, this.isHorizontal() ? 0 : a)
};
tv.ui.Container.prototype.onChildVisibilityChange = function(a) {
    if (this.mockScrollElement_) {
        var b = goog.array.indexOf(this.children_, a);
        goog.style.showElement(this.mockScrollElement_.childNodes[b], a.isVisible())
    }
    this.onChildSelectabilityChange(a);
    this.scheduleRender()
};
tv.ui.Container.prototype.onChildSelectabilityChange = function(a) {
    !this.selectedChild_ && a.getSelectedDescendantOrSelf() ? this.setSelectedChild(a) : this.selectedChild_ == a && !a.getSelectedDescendantOrSelf() && this.setSelectedChild(this.findNextSelectableChild() || this.findPreviousSelectableChild())
};
tv.ui.Container.prototype.onFocus = function(a) {
    tv.ui.Container.superClass_.onFocus.call(this, a);
    if (this.highlightElement_ && (goog.dom.classes.add(this.highlightElement_, tv.ui.Container.Class.HIGHLIGHT_FOCUSED), this.hasSharedHighlight_())) this.controllingSharedHighlight_ = !0, this.scheduleRender()
};
tv.ui.Container.prototype.onBlur = function(a) {
    tv.ui.Container.superClass_.onBlur.call(this, a);
    if (this.highlightElement_) {
        goog.dom.classes.remove(this.highlightElement_, tv.ui.Container.Class.HIGHLIGHT_FOCUSED);
        if (this.hasSharedHighlight_()) this.controllingSharedHighlight_ = !1, goog.dom.classes.remove(this.highlightElement_, tv.ui.Container.Class.HIGHLIGHT_POSITIONED);
        this.dispatchEvent(tv.ui.Container.EventType.UPDATE_HIGHLIGHT)
    }
    this.hasTransientSelection() && this.selectFirstDescendant()
};
tv.ui.Container.prototype.onTouchStart = function(a) {
    tv.ui.Container.superClass_.onTouchStart.call(this, a);
    var b = a.getBrowserEvent().changedTouches;
    if (this.scrollElement_ && !(this.touchIdentifier_ || b.length != 1)) this.decelerationTimer_.stop(), this.touchIdentifier_ = b[0].identifier, this.touchMoves_ = [], this.addTouchMove_(this.getTouch_(a))
};
tv.ui.Container.prototype.onTouchMove = function(a) {
    tv.ui.Container.superClass_.onTouchMove.call(this, a);
    a = this.getTouch_(a);
    this.scrollElement_ && a && (this.scrollTo_(this.scrollElementCoordinate_ + this.getPageCoordinate_(a) - this.getLastTouchMove_().coordinate), this.addTouchMove_(a))
};
tv.ui.Container.prototype.onTouchEnd = function(a) {
    a.preventDefault();
    if (this.scrollElement_ && this.touchIdentifier_ && !this.getTouch_(a)) {
        if (this.touchMoves_.length >= 2) {
            for (var a = goog.now(), b = this.getLastTouchMove_().coordinate, c = 0, d = 0, e = this.touchMoves_.length - 1; e >= 0; e--) {
                var f = a - this.touchMoves_[e].time;
                if (f > tv.ui.Container.AVERAGE_VELOCITY_CALCULATION_INTERVAL) break;
                c = f;
                d = b - this.touchMoves_[e].coordinate
            }
            if (c > 0) this.decelerationVelocity_ = d / c * tv.ui.Container.DECELERATION_ANIMATION_INTERVAL, this.decelerationTimer_.start()
        }
        delete this.touchIdentifier_;
        delete this.touchMoves_
    }
};
tv.ui.Container.prototype.getTouch_ = function(a) {
    return goog.array.find(a.getBrowserEvent().touches, function(a) {
        return a.identifier == this.touchIdentifier_
    }, this)
};
tv.ui.Container.prototype.addTouchMove_ = function(a) {
    this.touchMoves_.push({
        time: goog.now(),
        coordinate: this.getPageCoordinate_(a)
    })
};
tv.ui.Container.prototype.getLastTouchMove_ = function() {
    return this.touchMoves_[this.touchMoves_.length - 1]
};
tv.ui.Container.prototype.getPageCoordinate_ = function(a) {
    return this.isHorizontal() ? a.pageX : a.pageY
};
tv.ui.Lightbox = function() {
    tv.ui.Container.call(this);
    this.backgroundElement_ = null
};
goog.inherits(tv.ui.Lightbox, tv.ui.Container);
tv.ui.Lightbox.CLASS = "tv-lightbox";
tv.ui.registerDecorator(tv.ui.Lightbox, tv.ui.Lightbox.CLASS);
tv.ui.Lightbox.EventType = {
    CLOSE: goog.events.getUniqueId("close")
};
tv.ui.Lightbox.prototype.onKey = function(a) {
    switch (a.keyCode) {
        case goog.events.KeyCodes.ESC:
            this.dispose();
            a.stopPropagation();
            break;
        case goog.events.KeyCodes.SPACE:
            var b = this.findNextSelectableChild();
            b && (b.tryFocus(), a.stopPropagation());
            break;
        case goog.events.KeyCodes.BACKSPACE:
            if (b = this.findPreviousSelectableChild()) b.tryFocus(), a.stopPropagation();
            break;
        default:
            tv.ui.Lightbox.superClass_.onKey.call(this, a)
    }
};
tv.ui.Lightbox.prototype.disposeInternal = function() {
    this.dispatchEvent(tv.ui.Lightbox.EventType.CLOSE);
    goog.dom.removeNode(this.getElement());
    goog.dom.removeNode(this.backgroundElement_);
    delete this.backgroundElement_;
    tv.ui.Lightbox.superClass_.disposeInternal.call(this)
};
tv.ui.Lightbox.show = function(a, b, c) {
    c = c || goog.dom.createDom("div", "tv-lightbox-background");
    document.body.appendChild(c);
    var d = goog.dom.createDom("div", "tv-container-start-scroll"),
        e = goog.dom.createDom("div", "tv-lightbox tv-container-horizontal", d);
    goog.array.forEach(a, function(a) {
        a = goog.dom.createDom("div", "tv-component", goog.dom.createDom("img", {
            src: a
        }));
        d.appendChild(a)
    });
    document.body.appendChild(e);
    var f, a = new tv.ui.DecorateHandler;
    a.addClassHandler("tv-lightbox", function(a) {
        f = a
    });
    tv.ui.decorate(e,
        a.getHandler());
    f.setSelectedChild(f.getChildren()[b]);
    var g = 0,
        h = 0;
    goog.array.forEach(f.getChildren(), function(a) {
        g = Math.max(g, a.getElement().clientHeight);
        h = Math.max(h, a.getElement().clientWidth)
    });
    goog.style.setPosition(e, document.body.clientWidth / 2 - h / 2, document.body.clientHeight / 2 - g / 2);
    f.backgroundElement_ = c;
    return f
};
tv.ui.Button = function() {
    tv.ui.Component.call(this)
};
goog.inherits(tv.ui.Button, tv.ui.Component);
tv.ui.Button.CLASS = "tv-button";
tv.ui.registerDecorator(tv.ui.Button, tv.ui.Button.CLASS);
tv.ui.Button.Class = {
    EAGER: "tv-button-eager"
};
tv.ui.Button.EventType = {
    ACTION: goog.events.getUniqueId("action")
};
tv.ui.Button.prototype.decorate = function(a) {
    tv.ui.Button.superClass_.decorate.call(this, a);
    this.getEventHandler().listen(a, goog.events.EventType.CLICK, this.onClick);
    this.getEventHandler().listen(this, tv.ui.Button.EventType.ACTION, this.onAction)
};
tv.ui.Button.prototype.getClass = function() {
    return tv.ui.Button.CLASS
};
tv.ui.Button.prototype.onMouseDown = function(a) {
    tv.ui.Button.superClass_.onMouseDown.call(this, a);
    this.isEager() && a.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && (this.dispatchAction(), a.stopPropagation())
};
tv.ui.Button.prototype.onTouchEnd = function(a) {
    tv.ui.Button.superClass_.onTouchEnd.call(this, a);
    !this.isEager() && !this.wasTouchMoved() && a.getBrowserEvent().touches.length == 0 && this.dispatchAction()
};
tv.ui.Button.prototype.isEager = function() {
    return goog.dom.classes.has(this.getElement(), tv.ui.Button.Class.EAGER)
};
tv.ui.Button.prototype.onClick = function(a) {
    !this.isEager() && a.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && (this.dispatchAction(), a.stopPropagation())
};
tv.ui.Button.prototype.onKey = function(a) {
    switch (a.keyCode) {
        case goog.events.KeyCodes.ENTER:
        case goog.events.KeyCodes.SPACE:
            this.dispatchAction(), a.stopPropagation()
    }
};
tv.ui.Button.prototype.dispatchAction = function() {
    this.dispatchEvent(tv.ui.Button.EventType.ACTION)
};
tv.ui.Button.prototype.onAction = goog.nullFunction;
tv.ui.Link = function() {
    tv.ui.Button.call(this)
};
goog.inherits(tv.ui.Link, tv.ui.Button);
tv.ui.Link.CLASS = "tv-link";
tv.ui.registerDecorator(tv.ui.Link, tv.ui.Link.CLASS);
tv.ui.Link.prototype.getClass = function() {
    return tv.ui.Link.CLASS
};
tv.ui.Link.prototype.onAction = function() {
    this.navigate(this.getElement().getAttribute("href"))
};
tv.ui.Link.prototype.navigate = function(a) {
    window.location = a
};
goog.functions = {};
goog.functions.constant = function(a) {
    return function() {
        return a
    }
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a) {
    return a
};
goog.functions.error = function(a) {
    return function() {
        throw Error(a);
    }
};
goog.functions.lock = function(a) {
    return function() {
        return a.call(this)
    }
};
goog.functions.withReturnValue = function(a, b) {
    return goog.functions.sequence(a, goog.functions.constant(b))
};
goog.functions.compose = function() {
    var a = arguments,
        b = a.length;
    return function() {
        var c;
        b && (c = a[b - 1].apply(this, arguments));
        for (var d = b - 2; d >= 0; d--) c = a[d].call(this, c);
        return c
    }
};
goog.functions.sequence = function() {
    var a = arguments,
        b = a.length;
    return function() {
        for (var c, d = 0; d < b; d++) c = a[d].apply(this, arguments);
        return c
    }
};
goog.functions.and = function() {
    var a = arguments,
        b = a.length;
    return function() {
        for (var c = 0; c < b; c++)
            if (!a[c].apply(this, arguments)) return !1;
        return !0
    }
};
goog.functions.or = function() {
    var a = arguments,
        b = a.length;
    return function() {
        for (var c = 0; c < b; c++)
            if (a[c].apply(this, arguments)) return !0;
        return !1
    }
};
goog.functions.create = function(a) {
    var b = function() {};
    b.prototype = a.prototype;
    b = new b;
    a.apply(b, Array.prototype.slice.call(arguments, 1));
    return b
};
tv.ui.Menu = function() {
    tv.ui.Container.call(this)
};
goog.inherits(tv.ui.Menu, tv.ui.Container);
tv.ui.Menu.CLASS = "tv-menu";
tv.ui.registerDecorator(tv.ui.Menu, tv.ui.Menu.CLASS);
tv.ui.Menu.Class = {
    HAS_OPENED_SUB_MENU: "tv-menu-has-opened-sub-menu"
};
tv.ui.Menu.prototype.getClass = function() {
    return tv.ui.Menu.CLASS
};
tv.ui.Menu.prototype.addChild = function(a) {
    tv.ui.Menu.superClass_.addChild.call(this, a);
    a instanceof tv.ui.SubMenu && this.getEventHandler().listen(a, tv.ui.Container.EventType.SELECT_CHILD, this.onSubMenuSelectChild_)
};
tv.ui.Menu.prototype.onSubMenuSelectChild_ = function(a) {
    var b = this.getSelectedChild();
    a.target == b && goog.dom.classes.enable(this.getElement(), tv.ui.Menu.Class.HAS_OPENED_SUB_MENU, b.getSelectedChild() instanceof tv.ui.Menu)
};
tv.ui.Menu.prototype.onKey = function(a) {
    this.hasOpenedSubMenu() || tv.ui.Menu.superClass_.onKey.call(this, a)
};
tv.ui.Menu.prototype.hasOpenedSubMenu = function() {
    return goog.dom.classes.has(this.getElement(), tv.ui.Menu.Class.HAS_OPENED_SUB_MENU)
};
tv.ui.Menu.prototype.adjustSelectionFromKey = function(a) {
    if (this.hasOpenedSubMenu()) return !1;
    tv.ui.Menu.superClass_.adjustSelectionFromKey.call(this, a)
};
goog.Timer = function(a, b) {
    goog.events.EventTarget.call(this);
    this.interval_ = a || 1;
    this.timerObject_ = b || goog.Timer.defaultTimerObject;
    this.boundTick_ = goog.bind(this.tick_, this);
    this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = !1;
goog.Timer.defaultTimerObject = goog.global.window;
goog.Timer.intervalScale = 0.8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
    return this.interval_
};
goog.Timer.prototype.setInterval = function(a) {
    this.interval_ = a;
    this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop()
};
goog.Timer.prototype.tick_ = function() {
    if (this.enabled) {
        var a = goog.now() - this.last_;
        if (a > 0 && a < this.interval_ * goog.Timer.intervalScale) this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - a);
        else if (this.dispatchTick(), this.enabled) this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()
    }
};
goog.Timer.prototype.dispatchTick = function() {
    this.dispatchEvent(goog.Timer.TICK)
};
goog.Timer.prototype.start = function() {
    this.enabled = !0;
    if (!this.timer_) this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()
};
goog.Timer.prototype.stop = function() {
    this.enabled = !1;
    if (this.timer_) this.timerObject_.clearTimeout(this.timer_), this.timer_ = null
};
goog.Timer.prototype.disposeInternal = function() {
    goog.Timer.superClass_.disposeInternal.call(this);
    this.stop();
    delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(a, b, c) {
    if (goog.isFunction(a)) c && (a = goog.bind(a, c));
    else if (a && typeof a.handleEvent == "function") a = goog.bind(a.handleEvent, a);
    else throw Error("Invalid listener argument");
    return b > goog.Timer.MAX_TIMEOUT_ ? -1 : goog.Timer.defaultTimerObject.setTimeout(a, b || 0)
};
goog.Timer.clear = function(a) {
    goog.Timer.defaultTimerObject.clearTimeout(a)
};
goog.events.InputHandler = function(a) {
    goog.events.EventTarget.call(this);
    this.element_ = a;
    this.inputEventEmulation_ = goog.userAgent.IE || goog.userAgent.WEBKIT && !goog.userAgent.isVersion("531") && a.tagName == "TEXTAREA";
    this.eventHandler_ = new goog.events.EventHandler;
    this.eventHandler_.listen(this.element_, this.inputEventEmulation_ ? ["keydown", "paste", "cut", "drop"] : "input", this)
};
goog.inherits(goog.events.InputHandler, goog.events.EventTarget);
goog.events.InputHandler.EventType = {
    INPUT: "input"
};
goog.events.InputHandler.prototype.timer_ = null;
goog.events.InputHandler.prototype.handleEvent = function(a) {
    if (this.inputEventEmulation_) {
        if (a.type != "keydown" || goog.events.KeyCodes.isTextModifyingKeyEvent(a)) {
            var b = a.type == "keydown" ? this.element_.value : null;
            goog.userAgent.IE && a.keyCode == goog.events.KeyCodes.WIN_IME && (b = null);
            var c = this.createInputEvent_(a);
            this.cancelTimerIfSet_();
            this.timer_ = goog.Timer.callOnce(function() {
                this.timer_ = null;
                this.element_.value != b && this.dispatchAndDisposeEvent_(c)
            }, 0, this)
        }
    } else(!goog.userAgent.OPERA || this.element_ ==
        goog.dom.getOwnerDocument(this.element_).activeElement) && this.dispatchAndDisposeEvent_(this.createInputEvent_(a))
};
goog.events.InputHandler.prototype.cancelTimerIfSet_ = function() {
    if (this.timer_ != null) goog.Timer.clear(this.timer_), this.timer_ = null
};
goog.events.InputHandler.prototype.createInputEvent_ = function(a) {
    a = new goog.events.BrowserEvent(a.getBrowserEvent());
    a.type = goog.events.InputHandler.EventType.INPUT;
    return a
};
goog.events.InputHandler.prototype.dispatchAndDisposeEvent_ = function(a) {
    try {
        this.dispatchEvent(a)
    } finally {
        a.dispose()
    }
};
goog.events.InputHandler.prototype.disposeInternal = function() {
    goog.events.InputHandler.superClass_.disposeInternal.call(this);
    this.eventHandler_.dispose();
    this.cancelTimerIfSet_();
    delete this.element_
};
goog.dom.selection = {};
goog.dom.selection.setStart = function(a, b) {
    if (goog.dom.selection.useSelectionProperties_(a)) a.selectionStart = b;
    else if (goog.userAgent.IE) {
        var c = goog.dom.selection.getRangeIe_(a),
            d = c[0];
        d.inRange(c[1]) && (b = goog.dom.selection.canonicalizePositionIe_(a, b), d.collapse(!0), d.move("character", b), d.select())
    }
};
goog.dom.selection.getStart = function(a) {
    return goog.dom.selection.getEndPoints_(a, !0)[0]
};
goog.dom.selection.getEndPointsTextareaIe_ = function(a, b, c) {
    for (var b = b.duplicate(), d = a.text, e = d, f = b.text, g = f, h = !1; !h;) a.compareEndPoints("StartToEnd", a) == 0 ? h = !0 : (a.moveEnd("character", -1), a.text == d ? e += "\r\n" : h = !0);
    if (c) return [e.length, -1];
    for (a = !1; !a;) b.compareEndPoints("StartToEnd", b) == 0 ? a = !0 : (b.moveEnd("character", -1), b.text == f ? g += "\r\n" : a = !0);
    return [e.length, e.length + g.length]
};
goog.dom.selection.getEndPoints = function(a) {
    return goog.dom.selection.getEndPoints_(a, !1)
};
goog.dom.selection.getEndPoints_ = function(a, b) {
    var c = 0,
        d = 0;
    if (goog.dom.selection.useSelectionProperties_(a)) c = a.selectionStart, d = b ? -1 : a.selectionEnd;
    else if (goog.userAgent.IE) {
        var e = goog.dom.selection.getRangeIe_(a),
            f = e[0],
            e = e[1];
        if (f.inRange(e)) {
            f.setEndPoint("EndToStart", e);
            if (a.type == "textarea") return goog.dom.selection.getEndPointsTextareaIe_(f, e, b);
            c = f.text.length;
            d = b ? -1 : f.text.length + e.text.length
        }
    }
    return [c, d]
};
goog.dom.selection.setEnd = function(a, b) {
    if (goog.dom.selection.useSelectionProperties_(a)) a.selectionEnd = b;
    else if (goog.userAgent.IE) {
        var c = goog.dom.selection.getRangeIe_(a),
            d = c[1];
        c[0].inRange(d) && (b = goog.dom.selection.canonicalizePositionIe_(a, b), c = goog.dom.selection.canonicalizePositionIe_(a, goog.dom.selection.getStart(a)), d.collapse(!0), d.moveEnd("character", b - c), d.select())
    }
};
goog.dom.selection.getEnd = function(a) {
    return goog.dom.selection.getEndPoints_(a, !1)[1]
};
goog.dom.selection.setCursorPosition = function(a, b) {
    if (goog.dom.selection.useSelectionProperties_(a)) a.selectionStart = b, a.selectionEnd = b;
    else if (goog.userAgent.IE) {
        var b = goog.dom.selection.canonicalizePositionIe_(a, b),
            c = a.createTextRange();
        c.collapse(!0);
        c.move("character", b);
        c.select()
    }
};
goog.dom.selection.setText = function(a, b) {
    if (goog.dom.selection.useSelectionProperties_(a)) {
        var c = a.value,
            d = a.selectionStart,
            e = c.substr(0, d),
            c = c.substr(a.selectionEnd);
        a.value = e + b + c;
        a.selectionStart = d;
        a.selectionEnd = d + b.length
    } else if (goog.userAgent.IE) {
        if (e = goog.dom.selection.getRangeIe_(a), d = e[1], e[0].inRange(d)) e = d.duplicate(), d.text = b, d.setEndPoint("StartToStart", e), d.select()
    } else throw Error("Cannot set the selection end");
};
goog.dom.selection.getText = function(a) {
    if (goog.dom.selection.useSelectionProperties_(a)) return a.value.substring(a.selectionStart, a.selectionEnd);
    if (goog.userAgent.IE) {
        var b = goog.dom.selection.getRangeIe_(a),
            c = b[1];
        if (b[0].inRange(c)) {
            if (a.type == "textarea") return goog.dom.selection.getSelectionRangeText_(c)
        } else return "";
        return c.text
    }
    throw Error("Cannot get the selection text");
};
goog.dom.selection.getSelectionRangeText_ = function(a) {
    for (var a = a.duplicate(), b = a.text, c = b, d = !1; !d;) a.compareEndPoints("StartToEnd", a) == 0 ? d = !0 : (a.moveEnd("character", -1), a.text == b ? c += "\r\n" : d = !0);
    return c
};
goog.dom.selection.getRangeIe_ = function(a) {
    var b = a.ownerDocument || a.document,
        c = b.selection.createRange();
    a.type == "textarea" ? (b = b.body.createTextRange(), b.moveToElementText(a)) : b = a.createTextRange();
    return [b, c]
};
goog.dom.selection.canonicalizePositionIe_ = function(a, b) {
    if (a.type == "textarea") var c = a.value.substring(0, b),
        b = goog.string.canonicalizeNewlines(c).length;
    return b
};
goog.dom.selection.useSelectionProperties_ = function(a) {
    try {
        return typeof a.selectionStart == "number"
    } catch (b) {
        return !1
    }
};
tv.ui.Input = function() {
    tv.ui.Component.call(this)
};
goog.inherits(tv.ui.Input, tv.ui.Component);
tv.ui.Input.CLASS = "tv-input";
tv.ui.registerDecorator(tv.ui.Input, tv.ui.Input.CLASS);
tv.ui.Input.Class = {
    HINT: "tv-input-hint",
    HINT_SHOWN: "tv-input-hint-shown"
};
tv.ui.Input.prototype.disposeInternal = function() {
    delete this.inputElement_;
    tv.ui.Input.superClass_.disposeInternal.call(this)
};
tv.ui.Input.prototype.decorate = function(a) {
    tv.ui.Input.superClass_.decorate.call(this, a);
    this.inputElement_ = a.tagName == "INPUT" ? a : goog.dom.getElementsByTagNameAndClass("input", null, a)[0];
    goog.asserts.assert(this.inputElement_, "No input element found.");
    this.hintElement_ = goog.dom.getElementByClass(tv.ui.Input.Class.HINT, a);
    this.updateHintVisibility_();
    this.getEventHandler().listen(this.inputElement_, goog.events.InputHandler.EventType.INPUT, this.onInput)
};
tv.ui.Input.prototype.getInputElement = function() {
    return this.inputElement_
};
tv.ui.Input.prototype.getClass = function() {
    return tv.ui.Input.CLASS
};
tv.ui.Input.prototype.onKey = function(a) {
    if (!a.ctrlKey && !a.altKey && !a.shiftKey && !a.metaKey) {
        var b = goog.dom.selection.getEndPoints(this.inputElement_),
            c = b[0] != b[1];
        switch (a.keyCode) {
            case goog.events.KeyCodes.LEFT:
                (b[0] != 0 || c) && a.stopPropagation();
                break;
            case goog.events.KeyCodes.RIGHT:
                (b[0] != this.inputElement_.value.length || c) && a.stopPropagation()
        }
    }
};
tv.ui.Input.prototype.onFocus = function(a) {
    tv.ui.Input.superClass_.onFocus.call(this, a);
    this.inputElement_.ownerDocument.activeElement != this.inputElement_ && goog.Timer.callOnce(function() {
        this.inputElement_.focus()
    }, 0, this)
};
tv.ui.Input.prototype.onBlur = function(a) {
    tv.ui.Input.superClass_.onBlur.call(this, a);
    this.inputElement_.blur()
};
tv.ui.Input.prototype.onInput = function() {
    this.updateHintVisibility_()
};
tv.ui.Input.prototype.updateHintVisibility_ = function() {
    this.hintElement_ && goog.dom.classes.enable(this.hintElement_, tv.ui.Input.Class.HINT_SHOWN, !this.inputElement_.value)
};
tv.ui.SubMenu = function() {
    tv.ui.Container.call(this)
};
goog.inherits(tv.ui.SubMenu, tv.ui.Container);
tv.ui.SubMenu.CLASS = "tv-sub-menu";
tv.ui.registerDecorator(tv.ui.SubMenu, tv.ui.SubMenu.CLASS);
tv.ui.SubMenu.Class = {
    BACK_BUTTON: "tv-sub-menu-back-button"
};
tv.ui.SubMenu.prototype.decorate = function(a) {
    tv.ui.SubMenu.superClass_.decorate.call(this, a);
    this.getEventHandler().listen(this, tv.ui.Button.EventType.ACTION, this.onAction)
};
tv.ui.SubMenu.prototype.getClass = function() {
    return tv.ui.SubMenu.CLASS
};
tv.ui.SubMenu.prototype.addChild = function(a) {
    tv.ui.SubMenu.superClass_.addChild.call(this, a);
    if (a instanceof tv.ui.Button) goog.asserts.assert(!this.button_, "Sub-menu should have exactly one button."), this.button_ = a;
    else if (a instanceof tv.ui.Menu) goog.asserts.assert(!this.menu_, "Sub-menu should have exactly one menu."), this.menu_ = a
};
tv.ui.SubMenu.prototype.onKey = function(a) {
    a.keyCode == goog.events.KeyCodes.ESC && !a.ctrlKey && !a.altKey && !a.shiftKey && !a.metaKey && this.getSelectedChild() != this.button_ && this.button_ && this.button_.tryFocus() ? a.stopPropagation() : tv.ui.SubMenu.superClass_.onKey.call(this, a)
};
tv.ui.SubMenu.prototype.onAction = function(a) {
    a.target == this.button_ ? this.menu_ && this.menu_.tryFocus() && a.stopPropagation() : goog.dom.classes.has(a.target.getElement(), tv.ui.SubMenu.Class.BACK_BUTTON) && this.button_ && this.button_.tryFocus() && a.stopPropagation()
};
tv.ui.Menu.prototype.adjustSelectionFromKey = function(a) {
    var b = this.getSelectedChild();
    if (!this.isSelectable() || !b) return !1;
    return b.adjustSelectionFromKey ? b.adjustSelectionFromKey(a) : b.isSelectable()
};
tv.ui.Grid = function() {
    tv.ui.Container.call(this)
};
goog.inherits(tv.ui.Grid, tv.ui.Container);
tv.ui.Grid.CLASS = "tv-grid";
tv.ui.registerDecorator(tv.ui.Grid, tv.ui.Grid.CLASS);
tv.ui.Grid.prototype.getClass = function() {
    return tv.ui.Grid.CLASS
};
tv.ui.Grid.prototype.addChild = function(a) {
    tv.ui.Grid.superClass_.addChild.call(this, a);
    goog.asserts.assert(goog.dom.classes.has(a.getElement(), tv.ui.Container.CLASS), "Children of tv.ui.Grid must be containers.");
    this.getEventHandler().listen(a, tv.ui.Container.EventType.SELECT_CHILD, this.onSelectChild_)
};
tv.ui.Grid.prototype.onSelectChild_ = function(a) {
    var b = a.target,
        c = goog.array.indexOf(b.getChildren(), b.getSelectedChild());
    goog.array.forEach(this.getChildren(), function(a) {
        if (a != b) {
            var e = Math.min(c, a.getChildren().length - 1);
            a.setSelectedChild(a.getChildren()[e])
        }
    })
};
tv.ui.TabContainer = function() {
    tv.ui.Container.call(this)
};
goog.inherits(tv.ui.TabContainer, tv.ui.Container);
tv.ui.TabContainer.CLASS = "tv-tab-container";
tv.ui.registerDecorator(tv.ui.TabContainer, tv.ui.TabContainer.CLASS);
tv.ui.TabContainer.Class = {
    BAR: "tv-tab-container-bar",
    CONTENT: "tv-tab-container-content",
    FOCUS_ATTRACTOR: "tv-tab-container-focus-attractor"
};
tv.ui.TabContainer.prototype.getBarContainer = function() {
    return this.barContainer_
};
tv.ui.TabContainer.prototype.getContentContainer = function() {
    return this.contentContainer_
};
tv.ui.TabContainer.prototype.hasFocusAttractor = function() {
    return this.contentContainer_ && goog.dom.classes.has(this.contentContainer_.getElement(), tv.ui.TabContainer.Class.FOCUS_ATTRACTOR)
};
tv.ui.TabContainer.prototype.getClass = function() {
    return tv.ui.TabContainer.CLASS
};
tv.ui.TabContainer.prototype.addChild = function(a) {
    tv.ui.TabContainer.superClass_.addChild.call(this, a);
    if (goog.dom.classes.has(a.getElement(), tv.ui.TabContainer.Class.BAR)) goog.asserts.assert(a instanceof tv.ui.Container, "Tab bar should be a container."), this.barContainer_ = a, this.getEventHandler().listen(this.barContainer_, tv.ui.Container.EventType.SELECT_CHILD, this.onBarSelectChild), this.getEventHandler().listen(this.barContainer_, tv.ui.Component.EventType.FOCUS, this.onBarFocus);
    else if (goog.dom.classes.has(a.getElement(),
        tv.ui.TabContainer.Class.CONTENT)) goog.asserts.assert(a instanceof tv.ui.Container, "Tab content should be a container."), this.contentContainer_ = a, this.getEventHandler().listen(this.contentContainer_, tv.ui.Container.EventType.SELECT_CHILD, this.onContentSelectChild)
};
tv.ui.TabContainer.prototype.findPreviousSelectableChild = function() {
    return this.hasFocusAttractor() ? null : tv.ui.TabContainer.superClass_.findPreviousSelectableChild.call(this)
};
tv.ui.TabContainer.prototype.findNextSelectableChild = function() {
    return this.hasFocusAttractor() ? null : tv.ui.TabContainer.superClass_.findNextSelectableChild.call(this)
};
tv.ui.TabContainer.prototype.onBarSelectChild = function() {
    this.contentContainer_ && this.synchronizeSelectedChildren_(this.barContainer_, this.contentContainer_)
};
tv.ui.TabContainer.prototype.onContentSelectChild = function() {
    this.barContainer_ && this.synchronizeSelectedChildren_(this.contentContainer_, this.barContainer_)
};
tv.ui.TabContainer.prototype.synchronizeSelectedChildren_ = function(a, b) {
    var c = goog.array.indexOf(a.getChildren(), a.getSelectedChild());
    b.setSelectedChild(b.getChildren()[c])
};
tv.ui.TabContainer.prototype.onBarFocus = function() {
    this.hasFocusAttractor() && this.contentContainer_.tryFocus()
};
tv.ui.ToggleButton = function() {
    tv.ui.Button.call(this)
};
goog.inherits(tv.ui.ToggleButton, tv.ui.Button);
tv.ui.ToggleButton.CLASS = "tv-toggle-button";
tv.ui.ToggleButton.Class = {
    ON: "tv-toggle-button-on"
};
tv.ui.registerDecorator(tv.ui.ToggleButton, tv.ui.ToggleButton.CLASS);
tv.ui.ToggleButton.prototype.isOn = function() {
    return goog.dom.classes.has(this.getElement(), tv.ui.ToggleButton.Class.ON)
};
tv.ui.ToggleButton.prototype.setOn = function(a) {
    goog.dom.classes.enable(this.getElement(), tv.ui.ToggleButton.Class.ON, a)
};
tv.ui.ToggleButton.prototype.getClass = function() {
    return tv.ui.ToggleButton.CLASS
};
tv.ui.ToggleButton.prototype.onAction = function() {
    this.setOn(!this.isOn())
};