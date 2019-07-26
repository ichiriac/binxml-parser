
class Name {
  constructor(offset, fragment) {
    this.offset = offset;
    offset += fragment._chunk._offset;
    this.size = fragment._chunk._file._buffer.readInt16LE(offset + 6) * 2;
    this.value = fragment._chunk._file._buffer.toString('utf16le', offset + 8, offset + this.size + 8);
  }
  toString() {
    return this.value;
  }
}

module.exports = Name;