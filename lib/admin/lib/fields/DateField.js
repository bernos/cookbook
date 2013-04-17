var AdminFieldConfig = require('./BaseField');

module.exports = exports = AdminFieldConfig.extend({
  defaultOptions: function() {
    return {
      value: function(item) {
        return item[this.name] === null ? "" : item[this.name];
      },
      formatter: function(item) {
        var d = this.value(item);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      },

      editor: function(item) {
        return [
          '<div>',
          this.html.label(this.name, this.label(item)),
          this.html.input(this.name, "text", this.formatter(item)),
          '</div>'
        ].join("\n");
      }
    };
  }
});