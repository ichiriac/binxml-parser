const Reader = require('../reader');
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
  }
  render(data) {
    throw new Error('Not implemented');
  }
}

module.exports = TemplateDefinition;