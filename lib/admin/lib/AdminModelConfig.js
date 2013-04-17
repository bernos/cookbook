var oop = require('../../oop')
  , _ = require('underscore');

/**
 * AdminModelConfig class
 */
module.exports = exports = oop.Class({
  constructor : function(model, options) {
    var self = this, options = options || {};

    this.model          = model;
    this.excludedFields = this.initExcludedFields(model, options.excludedFields || []);
    this.listFields     = this.initListViewFields(model, options.listFields || {});
    this.fields         = this.initEditViewFields(model, options.fields || {});    
  },

  /**
   * Returns the name of the model this config is concerned with. Must be
   * implemented by inheritting classes
   *
   * @return {String}
   */
  modelName : function() {
    throw "AdminModelConfig.modelName is not implemented";
  },

  /**
   * Returs an array containing the names of all fields in the model. Must
   * be implemented by inheritting classes
   *
   * @return {Array}
   */
  allFieldNames : function() {
    throw "AdminModelConfig.allFieldNames is not implemented";
  },

  /**
   * Initialises excluded fields. Excluded fields will not be displayed on
   * the edit screen
   *
   * @param {Model} model
   * @param {Array} customExcludedFields
   * @return Array
   */
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
    var defaults = this.defaultListViewFields(model)
      , custom = {}
      , self = this;

    _.each(customFields, function(options, key) {
      custom[key] = self.createField(key, model, options)
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
    var defaults = this.defaultEditViewFields(model)
      , custom = {}
      , self = this;

    _.each(customFields, function(options, key) {
      custom[key] = self.createField(key, model, options);
    });

    return this.mergeFieldConfigs(defaults, custom);
  },

  /**
   * Get the default excluded fields
   *
   * @return {Array}
   */
  defaultExcludedFields : function(model) {
    return [];
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
    var self = this;

    var defaultFieldConfig = this.getDefaultFieldConfig("string");

    defaultFieldConfig.label = this.modelName();

    defaultFieldConfig.value = function(item) {
      if (item.title) {
        return item.title;
      }

      if (item.name) {
        return item.name;
      }

      return item.toString();
    };

    return {
      _default : self.createField("_default", model, defaultFieldConfig)
    };


    return {
      _default : self.createField("_default", model, {
        type : this.getDefaultFieldConfig("String"),
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
    var fields = {}, self = this;

    _.each(this.allFieldNames(), function(name) {
      if (self.excludedFields.indexOf(name) == -1) {
        fields[name] = self.createField(name, model);
      }
    });

    return fields;
  },

  createField : function(name, model, options) {
    var ctor, defaults;

    if(name == '_default') {
      defaults = options || {};
    } else {
      defaults = this.mergeFieldConfigs(this.getDefaultFieldConfig(this.getModelFieldDataType(name, model)), options || {});
    }

    ctor = defaults.type;

    return new ctor(name, null /*TODO: remove this arg*/, model, defaults);
  },

  getDefaultFieldConfig: function(dataType) {
    throw "AdminModelConfig.getDefaultFieldConfig is abstract and must be overriden";
  },

  getModelFieldDataType: function(name, model) {
    throw "AdminModelConfig.getModelFieldDataType is abstract and must be overriden";
  },

  /**
   * Merge field configs from object b into object a
   *
   * @param {Object} a
   * @param {Object} b
   * @return {Object}
   */
  mergeFieldConfigs : function(a, b) {
    _.each(b, function(field, name) {
      a[name] = field;
    });

    return a;
  }
});