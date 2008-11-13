/**
 * @author admin
 */

;(function() {

var Motto = window.Motto = window.$mo = {};
Motto.apply = function(o, c, defaults){
    if(defaults){
        Motto.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for (var p in c) {
            o[p] = c[p];
        }
    }
    return o;
};

_motto = {
    signal: null,

    /**
     * Signal
     */
    connect: function() {
        this._init_signal();
        return this.signal.connect(arguments);
    },
    fire: function() {
        this._init_signal();
        return this.signal.fire(arguments);
    },
    callback: function() {
        this._init_signal();
        return this.signal.callback(arguments);
    },
    _init_signal: function() {
        if (Motto.util.is_undefined(this.signal)) {
            this.signal = new Motto.Signal();
        }
    },

    /**
     * class
     */
    extend: function(){
        var io = function(obj){
            for (var m in obj) {
                this[m] = obj[m];
            }
        }
        var oc = Object.prototype.constructor;
        
        return function(o, p){
            properties = o.prototype;
            if (typeof p == 'object') {
                p = o;
                o = properties.constructor != oc ? properties.constructor : function(){
                    p.apply(this, arguments);
                }
            }
            var op;
            var pp = p.prototype;
            var fn = function(){};
            fn.prototype = pp;
            op = o.prototype = new fn();
            op.constructor   = o;
            o.superclass     = pp;
            if (pp.constructor == oc) {
                pp.constructor = p;
            }
            o.override = function(m){
                Motto.override(o, m);
            };
            o.extend = function(m){
                Motto.extend(o, m);
            };
            op.override = io;
            Motto.override(o, properties);
            return o;
        }
    }(),
    
    override: function(o, properties){
        if (properties) {
            var p = o.prototype;
            for (var m in properties) {
                p[m] = properties[m];
            }
        }
    },

    namespace: function(ns)
    {
        var nsParts = ns.split(".");
        var root = window;
        
        for(var i=0; i<nsParts.length; i++) {
            if(typeof root[nsParts[i]] == "undefined")
            root[nsParts[i]] = new Object();
            
            root = root[nsParts[i]];
        }
    }
}
Motto.apply(Motto, _motto);


/**
 * Motto.Signal
 */
Motto.Signal = function(){
    
}
Motto.Signal.prototype = {
    signals: {},
    connect: function() {
        arguments = (arguments.length == 1) ? arguments[0] : arguments;
        var event_name = arguments[0];
        var callback   = arguments[1] || function(){};
        var scope      = arguments[2] || null;
        var args       = arguments[3] || [];
        
        //Motto.log(event_name);
        this.signals[event_name] = this.signals[event_name] || []
        var signal = {scope:scope, fn:callback, args:args};
        this.signals[event_name].push(signal);
    },
    fire: function(event_name) {
        arguments = (arguments.length == 1) ? arguments[0] : arguments;
        var event_name = arguments[0];
        //Motto.log(event_name);
        var args = new Array();
        for (var i=0; i<=arguments.length; i++) {
            if (i > 0) {
                args.push(arguments[i]);
            }
        }
        if (typeof this.signals[event_name] != 'undefined') {
            var signals = this.signals[event_name];
            var len = this.signals[event_name].length;
            for (var i = 0; i < len; i++) {
                var signal = this.signals[event_name][i];
                var fn = signal.fn || function(){}
                var scope = signal.scope || null;
                //var args  = signal.args  || [];
                if (scope) {
                    fn.apply(scope, args);
                } else {
                    fn.apply(window, args);
                }
            }
        }
    },
    callback: function() {
        var _arguments = (arguments.length == 1) ? arguments[0] : arguments;
        var signal = this;
        var f = function(e) {
            $mo.signal.fire(_arguments);
        }
        return f;
    },
    func_store: []
}


/**
 * Motto Utility
 */
Motto.util = {
    is_undefined: function(o) {
        var r = (typeof o == 'undefined' || o == null);
        return r;
    }
};

/**
 * Motto.Page
 */
Motto.Page = function() {
    this._initialize();
    this.set_signals();
};
Motto.Page.prototype = {
    _initialize: function() {
        this.initialize();
    },

    // interfaces
    set_signals: function() {
    },
    initialize: function(){
    }
}



})();

/**
 * Extension
 */

Motto.scope  = function(target, func){
    return function() {
        func.apply(target,arguments);
    }
};
Motto.decode = function(r) {
    var r = (r != '') ? eval('(' + r + ')') : '';
    return r;
}

Motto.url_for = function(url, params, parameters) {
    params = params || {};
    for (k in params) {
        var v = params[k];
        var k = '{:' + k + '}';
        url = url.replace(k, v);
    };
    url = url_for(url);

    parameters = parameters || {};
    var p = '';
    for (l in parameters) {
        var v = parameters[l];
        p += ((p == '') ? '?' : '&') + l + '=' + v;
    }
    url += p;
    return url;
};

    Motto.redirect = function(url, params, parameters) {
        var url = Motto.url_for(url, params, parameters);
        location.href = url;
    };

Motto.log = function(src) {
    try {
        console.log(src);
    } catch (e) {
        // do nothing
    }
}

// Ext override
    Ext.BLANK_IMAGE_URL = url_for('images/s.gif');


