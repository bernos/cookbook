var _ = require('underscore')
  , oop = require('../../../oop');

module.exports = exports = oop.Class({
  constructor : function(name, type, model, options) {
    var self = this, options = options || {};

    this.model = model;
    this.name  = name;
    this.type  = type;
    this._options = this._defaultOptions();

    var o = this.mergeOptions(this.defaultOptions(), options || {});

    _.each(o, function(value, key) {
      self._options[key] = value;
    });
  },

  _defaultOptions : function() {
    return {
      label: function(item) {
        return this.name;
      },
      value: function(item) {
        return item[this.name];
      },
      editor: function(item) {
        return this.name + " :: " + this.type + " :: " + this.value(item);
      }
    };
  },

  defaultOptions : function() {
    return {};
  },

  mergeOptions : function(a, b) {
    var self = this;

    if ((typeof b).toLowerCase() == "string") {
      a.label = b;
    } else {
      _.each(b, function(value, key) {
        a[key] = value;
      });
    }

    return a;
  },

  value : function(item) {
    if ((typeof this._options.value).toLowerCase() == "function") {
      return this._options.value.apply(this, [item]);
    }
    return this._options.value;
  },

  label : function(item) {
    if ((typeof this._options.label).toLowerCase() == "function") {
      return this._options.label.apply(this, [item]);
    }
    return this._options.label;
  },

  editor : function(item) {
    return this._options.editor.apply(this, [item]);
  },

  formatter : function(item) {
    return this._options.formatter.apply(this, [item]);
  },

  html: {
    label : function(forId, text) {
      return '<label for="' + forId + '-editor">' + text  + '</label>';
    },
    input : function(id, type, value) {
      return '<input type="' + type + '" name="' + id + '" id="' + id + '-editor" value="' + value + '"></input>'
    }
  }
});