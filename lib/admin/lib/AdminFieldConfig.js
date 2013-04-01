var _ = require('underscore'),
editors =require('./editors');

var AdminFieldConfig = function(name, model, options) {
  options = options || {};

  this.model = model;
  this.name  = name;
  this.type  = options.type == null ? this.getFieldType(model, name) : options.type;
  this._options = this.mergeOptions(this.defaultOptions(), options || {});
}

AdminFieldConfig.prototype.defaultOptions = function() {
  var self = this;

  var options = {
    label: function(item) {
      return self.name;
    },
    value: function(item) {
      return item[self.name];
    },
    editor: function(item, field) {
      return field.name + " :: " + field.type + " :: " + field.value(item);
    }
  };

  switch(this.type) {
    case "String" :
      options.value = function(item) {
        return item[self.name] == null ? "" : item[self.name];
      };
      options.editor = editors.basicTextField;
      break;

    case "Number" :
      options.value = function(item) {
        return item[self.name] == null ? 0 : item[self.name];
      };
      options.editor = editors.basicTextField;
      break;

    case "Date" :
      options.formatter = function(item, field) {
        var d = field.value(item);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      };
      options.editor = editors.dateField;
      break;
  }

  return options;
}


/**
 * Returns the type of a given field. This implementation is designed to work
 * with Mongoose Schema and Model objects but can be overriden to work with
 * other libraries as well
 *
 * @param {String} fieldName
 * @return {String} The name of the type
 */
AdminFieldConfig.prototype.getFieldType = function(model, fieldName) {
  var schemaType = model.schema.path(fieldName);

  if (!schemaType) {
    throw "Could not determine type of unknown field '" + fieldName + "'.";
  }

  var type = schemaType.options.type;

  if (type.name != null) {
    return type.name;
  }

  return type.constructor.name;
}

AdminFieldConfig.prototype.mergeOptions = function(a, b) {
  var self = this;

  if ((typeof b).toLowerCase() == "string") {
    a.label = b;
  } else {
    _.each(b, function(value, key) {
      a[key] = value;
    });
  }

  return a;
}

AdminFieldConfig.prototype.value = function(item) {
  if ((typeof this._options.value).toLowerCase() == "function") {
    return this._options.value(item);
  }
  return this._options.value;
}

AdminFieldConfig.prototype.label = function(item) {
  if ((typeof this._options.label).toLowerCase() == "function") {
    return this._options.label(item);
  }
  return this._options.label;
}

AdminFieldConfig.prototype.editor = function(item) {
  return this._options.editor(item, this);
}

AdminFieldConfig.prototype.formatter = function(item) {
  return this._options.formatter(item, this);
}

module.exports = exports = AdminFieldConfig;