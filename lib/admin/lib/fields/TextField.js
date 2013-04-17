var AdminFieldConfig = require('./BaseField');

module.exports = exports = AdminFieldConfig.extend({
  defaultOptions: function() {
    return {
      value: function(item) {
        return item[this.name] == null ? "" : item[this.name];
      },
      editor: function(item) {
        return [
          '<div>',
          this.html.label(this.name, this.label(item)),
          this.html.input(this.name, "text", this.value(item)),
          '</div>'
        ].join("\n");
      }
    }
  }
});