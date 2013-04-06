var AdminModelConfig = require('./AdminModelConfig');

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
});