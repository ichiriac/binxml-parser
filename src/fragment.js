const Reader = require('./reader');
const Name = require('./name');
let TemplateInstance = null;
let Element = null;

class Fragment extends Reader {
  /**
   * Initialize a template reader
   * @param {*} buffer 
   * @param {*} chunk 
   */
  constructor(buffer, chunk /** from evtx-parser */) {
    super(buffer);
    // the full chunk used for extracting names
    this._chunk = chunk;
    // names dictionnary
    this.names = {};
    // fragment header
    this.assertUInt(0x0f, 1);
    // fragment maj ver
    this.assertUInt(0x01, 1);
    // fragment min ver
    this.assertUInt(0x01, 1);
    // flags
    this.assertUInt(0x00, 1);  
    let mode = this.readUInt(1);
    if (mode == 0x0C) {
      // start parsing the template node
      if (!TemplateInstance)  {
        TemplateInstance = require('./template/instance');
      }
      this.node = new TemplateInstance(this);
    } else if (mode == 0x01 || mode == 0x41)  {
      if (!Element)  {
        Element = require('./element');
      }
      this.node = new Element(this);
    } else {
      throw new Error('Bad token type : ' + mode);
    }
  }
  /**
   * Resolves a name from an offset
   * @param {*} offset 
   */
  getName(offset) {
    if (!this.names.hasOwnProperty(offset)) {
      this.names[offset] = new Name(offset, this);
    }
    return this.names[offset];
  }
}

module.exports = Fragment;