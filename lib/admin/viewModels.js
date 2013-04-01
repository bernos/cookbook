var _ = require('underscore');

exports.ListViewModel = function(items, adminModelConfig) {
  this.adminModelConfig = adminModelConfig;
  this.items = items;  
  this.fields = adminModelConfig.getListViewFieldNames();
}

exports.ListViewModel.prototype.labelFor = function(field) {
  return this.adminModelConfig.listFields[field].label(null);
}

exports.ListViewModel.prototype.valueFor = function(field, item) {
  return this.adminModelConfig.listFields[field].value(item);
}

exports.ListViewModel.prototype.editUrlFor = function(item) {
  return this.adminModelConfig.model.modelName + "/" + item.id;
}

exports.EditViewModel = function(item, adminModelConfig) {
  this.adminModelConfig = adminModelConfig;
  this.item = item;
  this.fields = adminModelConfig.getEditViewFieldNames();
}

exports.EditViewModel.prototype.labelFor = function(field, item) {

}

exports.EditViewModel.prototype.editorFor = function(field, item) {
  return this.adminModelConfig.fields[field].editor(item);
}
