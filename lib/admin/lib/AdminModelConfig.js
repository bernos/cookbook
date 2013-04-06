var AdminFieldConfig = require('./AdminFieldConfig')
  , oop = require('../../oop')
  , _ = require('underscore');

/**
 * AdminModelConfig class
 */
module.exports = exports = oop.Class({
  constructor : function(model, options) {
    var self = this
      , options = options || {};

    this.name  = model.modelName;
    this.model = model;
    this.excludedFields = this.initExcludedFields(model, options.excludedFields || []);
    this.listFields = this.initListViewFields(model, options.listFields || {});
    this.fields = this.initEditViewFields(model, options.fields || {});    
  },

  initExcludedFields : function(model, customExcludedFields) {
    var defaults = this.defaultExcludedFields(model);

    for (var i = 0, m = customExcludedFields.length; i < m; i++) {
      if (defaults.indexOf(customExcludedFields[i]) == -1) {
        defaults.push(customExcludedFields[i]);
      }
    }

    return defaults; 
  },

  /**
   * Initializes field configurations for the list view. We basically just
   * merge any custom field configurations from our options.listFields
   * into our default listFields configuration
   *
   * @param {Model} model
   * @param {Object} listFields
   */
  initListViewFields : function(model, customFields) {
    var defaults = this.defaultListViewFields(model);
    var custom = {};

    _.each(customFields, function(options, key) {
      custom[key] = new AdminFieldConfig(key, model, options)
    });

    // If there are any custom list view fields, then we will remove the default
    // field from the standard configuration
    if (!_.isEmpty(custom)) {
      delete defaults._default;
    }

    return this.mergeFieldConfigs(defaults, custom);
  },

  /**
   * Initializes field configurations for the model editor view.
   *
   * @param {Model} model
   * @param {Object} customFields
   * @return {Object}
   */
  initEditViewFields : function(model, customFields) {
    var defaults = this.defaultEditViewFields(model);
    var custom = {};

    _.each(customFields, function(options, key) {
      custom[key] = new AdminFieldConfig(key, model, options)
    });

    return this.mergeFieldConfigs(defaults, custom);
  },

  defaultExcludedFields : function(model) {
    return ["_id", "__v"];
  },

  /**
   * Set up default field configs for the list view. This
   * implementation is designed to work with Mongoose Model instances, but
   * can be overridden to work with other libraries.
   *
   * @param {Model} model
   * @return {Array} An array of field configuration objects
   */
  defaultListViewFields : function(model) {
    return {
      _default : new AdminFieldConfig("_default", model, {
        type : "string",
        label : model.modelName,
        value : function(item) {
          if (item.title) {
            return item.title;
          }

          if (item.name) {
            return item.name;
          }

          return item.toString();
        }
      })
    };
  },

  /**
   * Set up default field configs for the edit view. This
   * implementation is designed to work with Mongoose Model instances, but
   * can be overridden to work with other libraries.
   *
   * @param {Model} model
   * @return {Array} An array of field configuration objects
   */
  defaultEditViewFields : function(model) {
    var fields = {};
    var self = this;

    console.log("excluded: ", self.excludedFields)

    model.schema.eachPath(function(name, schemaType) {
      if (self.excludedFields.indexOf(name) == -1) {
        fields[name] = new AdminFieldConfig(name, model);
      }
    });

    return fields;
  },

  /**
   * Gets the names of all fields to be displayed on the list view
   * 
   * @return {Array<String>}
   */
  getListViewFieldNames : function() {
    return _.map(this.listFields, function(value, key) {
      return key;
    });
  },

  /**
   * Gets the names of all fields to be displayed on the edit view
   *
   * @return {Array<String>}
   */
  getEditViewFieldNames : function() {
    var names = [];
    var self = this;

    _.each(this.fields, function(value, key) {
      if (_.indexOf(self.excludedFields, key) == -1) {
        names.push(key);
      }
    }); 

    return names;
  },

  mergeFieldConfigs : function(a, b) {
    _.each(b, function(field, name) {
      a[name] = field;
    });

    return a;
  }
});