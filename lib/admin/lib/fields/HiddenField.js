var AdminFieldConfig = require('./BaseField');

module.exports = exports = AdminFieldConfig.extend({
  defaultOptions: function() {
    return {
      editor: function(item) {
        return this.html.input(this.name, "text", this.value(item));
      }
    }
  }
});