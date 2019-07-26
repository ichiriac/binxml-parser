const Reader = require('../reader');
const Fragment = require('../fragment');

class TemplateDefinition {
  constructor(fragment) {
    // version number
    fragment.assertUInt(1, 1);
    // template identifier
    this.id = fragment.readUInt(4);
    // start of data
    this.dataOffset = fragment.readUInt(4);
    // next data offset (ignored)
    fragment.move(4);
    // template unique ID
    this.guid = fragment.readBuffer(16);
    // template size
    this.size = fragment.readUInt(4);
    // template contents
    this.node = fragment.readBuffer(this.size);
    // check the EOF
    if (this.node[this.node.length - 1] !== 0x00) {
      throw new Error('Bad EOF token on TemplateDefinition');
    }
    // @fixme : not implemented yet
    //this.node = new Fragment(this.node, fragment._chunk);
  }
  render(data) {
    this.node.substitutes = data;
    return this.node.toString();
  }
  toString() {
    this.node.substitutes = [];
    return this.node.toString();
  }
}

module.exports = TemplateDefinition;