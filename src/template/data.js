const Value = require('../value');
const Fragment = require('../fragment');

class TemplateData {
  constructor(fragment) {
    // count of values
    this.count = fragment.readUInt(4);
    let descriptors = [];
    for(var i = 0; i < this.count; i++)  {
      let size = fragment.readUInt(2);
      let type = fragment.readUInt(1);
      fragment.assertUInt(0, 1); // empty value
      descriptors.push({
        size: size,
        type: type
      });
    }
    // list of values
    this.values = [];
    descriptors.forEach((value) => {
      let data = Value.read(fragment, value.type, value.size);
      if (value.type == 0x21) {
        // binxml
        if (data[0] == 0x0C) {
          data = Buffer.concat([Buffer.from([0x0f, 0x01, 0x01, 0x00]), data]);
        }
        try {
          data = new Fragment(data, fragment._chunk);
        } catch(e) {
          data = e;
        }
      }
      this.values.push(data);
    });
  }
  get(offset) {
    return this.values[offset];
  }
}
module.exports = TemplateData;