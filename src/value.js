class Value {

}

Value.checkSize = function(type, size) {
  if (type == 0x03 || type == 0x04) { // Int8Type
    if (size != 1) throw new Error('Bad Int8Type size : ' + size);
  }
  if (type == 0x05 || type == 0x06) { // Int16Type
    if (size != 2) throw new Error('Bad Int16Type size : ' + size);
  }
  if (type == 0x07 || type == 0x08) { // Int32Type
    if (size != 4) throw new Error('Bad Int32Type size : ' + size);
  }
  if (type == 0x09 || type == 0x0A) { // Int64Type
    if (size != 8) throw new Error('Bad Int64Type size : ' + size);
  }
  if (type == 0x0D) { // BoolType
    if (size != 4) throw new Error('Bad BoolType size : ' + size);
  }
  if (type == 0x0F) { // GuidType
    if (size != 16) throw new Error('Bad GuidType size : ' + size);
  }  
  if (type == 0x11) { // FileTimeType
    if (size != 8) throw new Error('Bad FileTimeType size : ' + size);
  }
  if (type == 0x12) { // SysTimeType
    if (size != 16) throw new Error('Bad SysTimeType size : ' + size);
  }     
  if (type == 0x13) { // SidType
    if (size != 28) throw new Error('Bad SidType size : ' + size);
  }     
  if (type == 0x14) { // HexInt32Type
    if (size != 4) throw new Error('Bad HexInt32Type size : ' + size);
  }
  if (type == 0x15) { // HexInt64Type
    if (size != 8) throw new Error('Bad HexInt64Type size : ' + size);
  }

}

Value.read = function(input, type, size) {
  if (type == 0x00) { // NullType
    input.move(size);
    return null;
  }
  if (type == 0x01) { // StringType 
    return input.readString16(size);
  }
  if (type == 0x02) { // AnsiStringType
    return input.readString(size);
  }
  if (type == 0x03) { // Int8Type
    Value.checkSize(type, size);
    return input.readInt(1);
  }
  if (type == 0x04) { // UInt8Type
    Value.checkSize(type, size);
    return input.readUInt(1);
  }
  if (type == 0x05) { // Int16Type
    Value.checkSize(type, size);
    return input.readInt(2);
  }
  if (type == 0x06) { // UInt16Type
    Value.checkSize(type, size);
    return input.readUInt(2);
  }
  if (type == 0x07) { // Int32Type
    Value.checkSize(type, size);
    return input.readInt(4);
  }
  if (type == 0x08) { // UInt32Type
    Value.checkSize(type, size);
    return input.readUInt(4);
  }
  if (type == 0x09) { // Int64Type
    Value.checkSize(type, size);
    return input.readInt(8);
  }
  if (type == 0x0a) { // UInt64Type
    Value.checkSize(type, size);
    return input.readUInt(8);
  }
  if (type == 0x0d) { // BoolType
    Value.checkSize(type, size);
    return input.readUInt(4) == 1;
  }
  if (type == 0x0e) { // BinaryType
    return input.readBuffer(size);
  }
  if (type == 0x0f) { // GuidType
    Value.checkSize(type, size);
    return input.readBuffer(16);
  }
  if (type == 0x10) { // SizeTType
    type = input.readUInt(1);
  }
  if (type == 0x11) { // FileTimeType
    Value.checkSize(type, size);
    let time = Number(input.readUInt(8));
    var ms = ( time / 10000 ) % 86400000;
    var day = time / 864000000000 - 109207;
    let date = new Date( 1900, 1, 1 );
    date.setMilliseconds( ms );
    date.setDate( day );    
    return date;
  }
  if (type == 0x12) { // SysTimeType
    Value.checkSize(type, size);
    let Year = input.readUInt(2);
    let Month = input.readUInt(2);
    let DayOfWeek = input.readUInt(2);
    let Day = input.readUInt(2);
    let Hour = input.readUInt(2);
    let Minute = input.readUInt(2);
    let Second = input.readUInt(2);
    let Millisecond = input.readUInt(2);
    return new Date(Year, Month, Day, Hour, Minute, Second, Millisecond);
  }
  if (type == 0x13) { // SidType
    // @todo : parse this structure
    return input.readBuffer(size);
  }
  if (type == 0x14) { // HexInt32Type
    Value.checkSize(type, size);
    return input.readUInt(4);
  }
  if (type == 0x15) { // HexInt64Type
    Value.checkSize(type, size);
    return input.readUInt(8);
  }

  // not implemented
  if (type == 0x20) { // EvtHandle
    return input.readBuffer(size);
  }
  if (type == 0x21) { // BinXmlType
    return input.readBuffer(size);
  }
  if (type == 0x23) { // EvtXml
    return input.readBuffer(size);
  }

  // arrays
  if (type > 0x80 && type < 0x95) {
    type -= 0x80;
    // @todo
    return input.readBuffer(size);
  }

  // not handled
  input.move(size);
  throw new Error('Bad value type : ' + type);
};

module.exports = Value;