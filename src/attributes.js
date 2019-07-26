/**
 * List of attributes
 */
class Attributes {
  constructor(fragment, size) {
    let maxSize = fragment._position + size;
    this.attributes = {};
    this.values = [];
    while(fragment._position < maxSize) {
      let type = fragment.readUInt(1);
      if (type == 0x06) break;
      let attr = new Attribute(fragment);
      this.values.push(attr);
      this.attributes[attr.name] = attr.value;
    }
  }
  size() {
    return this.values.length;
  }
}

/**
 * An attribute
 */
class Attribute {
  constructor(fragment) {
    this.name = fragment.getName(
      fragment.readUInt(4)
    );
    this.type = fragment.readInt(1);
    switch(this.type) {
      case 0x05, 0x45:
        // read value
        break;
      case 0x0d, 0x0e:
        // read substitution
        break;
      case 0x08, 0x48:
        // char entity reference
        break;
      case 0x09, 0x49:
        // entity reference
        break;
      default:
        throw new Error('Bad attribute type : ' + this.type);
    }
    this.value = null;
  }
  toString() {
    return ' ' + this.name + '=' + this.value.toString();
  }
}

module.exports = Attribute;