const Attributes = require('./attributes');
class Element {
  constructor(fragment, type) {

    // Dependency identifier
    this.depId = fragment.readInt(2);
    
    // The size of the data.
    // This includes the size of the element name, attribute list, 
    // close element tag, content and end element tag, except for 
    // the first 7 bytes of the element start.
    let dataSize = fragment.readUInt(4);

    // Element name offset
    // The offset is relative from the start of the chunk
    let nameOffset = fragment.readUInt(4);
    this.name = fragment.getName(nameOffset);

    // reading attributes
    if (type == 0x41) {
      let attrSize = fragment.readUInt(4);
      if (attrSize == 0) {
        fragment.move(2);
      } else {
        this.attributes = new Attributes(fragment, attrSize);
      }
    }

    // reading close token
    let close = fragment.readUInt(1);
    this.childs = [];
    if (close == 0x02) {
      // read children
      this.readNode();
      this.assertInt(0x04, 1);
    } else if (close != 0x03) {    
      // ignore until not implemented
      // throw new Error('Expecting close tag [0x02, 0x03] at offset ' + fragment._position + ' - but found ' + close);
    }
  }
  /**
   * Converts to a string
   */
  toString() {
    let str = '<' + this.name;
    if (this.attributes && this.attributes.size() > 0) {
      str += this.attributes.toString();
    }
    if (this.childs.length > 0) {
      str += '>';
      this.childs.forEach(function(child) {
        str += child.toString();
      });
      return  str + '</' + this.name + '>';
    } else {
      return str + ' />';
    }
  }
}

module.exports = Element;