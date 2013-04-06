var _ = require('underscore');

exports.ListViewModel = function(items, adminModelConfig) {
  this.modelName = adminModelConfig.modelName();
  this.items = items;  
  this.fields =  adminModelConfig.listFields;
}

exports.ListViewModel.prototype.editUrlFor = function(item) {
  return this.modelName + "/" + item.id;
}

exports.EditViewModel = function(item, adminModelConfig) {
  this.modelName = adminModelConfig.modelName();
  this.item = item;
  this.fields = adminModelConfig.fields;
}