function extend(obj) {
    for (var i = 0, max = arguments.length; i < max; i++) {
        var source = arguments[i];
        for (var prop in source) {
            obj[prop] = source[prop];
        }
    }
    
    return obj;
};

var Klass = function() {
    var methods, parent, klass;
    
    if (typeof arguments[0] === 'function') {
        parent = arguments[0];
        methods = arguments[1];
    } else {
        methods = arguments[0];
    }
    
    if (methods.hasOwnProperty('constructor')) {
        klass = methods.constructor;   
    } else {
        klass = function() {
            if(parent) {
                return parent.apply(this, arguments);
            }
        }
    }
    
    if (parent) {
        var Surrogate = function() {
            this.constructor = klass;
        };
        
        Surrogate.prototype = parent.prototype;
        
        klass.prototype = new Surrogate;
    }
    
    extend(klass.prototype, methods);
    
    klass.prototype.constructor = klass;
    
    klass.extend = function(o) {
        return Klass(this, o)
    }
    
    return klass;    
}

exports.Class = Klass;