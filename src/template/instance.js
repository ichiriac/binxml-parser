const TemplateDefinition = require('./definition');
const TemplateData = require('./data');

class TemplateInstance {
  constructor(fragment) {
    // validate that's a template instance
    this.offset = fragment._position;
    this.definition = new TemplateDefinition(fragment);
    if (this.definition.size <= 2) {
      fragment.offset(this.offset + 9);
    } else {
      fragment.offset(this.offset + this.definition.size + 33);
    }
    this.data = new TemplateData(fragment);
  }
  toString() {
    return this.definition.render(this.data);
  }
}

module.exports = TemplateInstance;