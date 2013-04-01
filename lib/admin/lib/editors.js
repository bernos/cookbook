

exports.basicTextField = function(item, field) {
  var buf = ['<div>'];
console.log("field = ", field)
  buf.push('<label for="' + field.name + '-editor">' + field.label(item)  + '</label>');
  buf.push('<input type="text" name="" id="' + field.name + '-editor" value="' + field.value(item) + '"></input>');
  buf.push('</div>');

  return buf.join("\n");
}

exports.hiddenField = function(item, field) {
  var buf = [];
  buf.push('<input type="text" name="" id="' + field.name + '-editor" value="' + field.value(item) + '"></input>');

  return buf.join("\n");
}

exports.dateField = function(item, field) {
  var buf = ['<div>'];
  buf.push('<label for="' + field.name + '-editor">' + field.label(item)  + '</label>');
  buf.push('<input type="text" name="" id="' + field.name + '-editor" value="' + field.formatter(item) + '"></input>');
  buf.push('</div>');

  return buf.join("\n");
}

exports.checkboxField = function(item, field) {

}