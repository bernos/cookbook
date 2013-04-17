var AdminModelConfig = require('./AdminModelConfig')
  , fields = require('./fields');

module.exports = exports = AdminModelConfig.extend({
  
  modelName: function() {
    return this.model.modelName;
  },

  allFieldNames: function() {
    var fieldNames = [];

    this.model.schema.eachPath(function(name) {
      fieldNames.push(name);
    });

    return fieldNames;
  },

  defaultExcludedFields : function(model) {
    return ["_id", "__v"];
  },

  getModelFieldDataType: function(name, model) {
    var schemaType = model.schema.path(name);

    if (!schemaType) {
      throw "Could not determine type of unknown field '" + name + "'.";
    }

    var type = schemaType.options.type;

    if (type.name != null) {
      return type.name;
    }

    return type.constructor.name;
  },

  getDefaultFieldConfig: function(dataType) {
    switch(dataType.toLowerCase()) {
      case "string" :
        return {
          type: fields.TextField
        };

      case "number" :
        return {
          type:  fields.NumberField
        };

      case "date" :
        return {
          type: fields.DateField
        }

      case "objectid" :
        return {
          type: fields.HiddenField
        }

      default :
        return {
          type: fields.BaseField
        };
    }    
  }
});