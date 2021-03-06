function Encoder() {
  this.defaultByteCount = 16;
}

Encoder.prototype.encode = function(bytes, byteLength) {
  var lines = [];

  var recordTypeHex = "00";
  var byteCount = this.defaultByteCount;

  for(var addr = 0; addr < byteLength; addr += byteCount) {
    byteCount = Math.min(this.defaultByteCount, byteLength - addr);
    while(bytes[addr+byteCount-1] === 0 && byteCount > 0) {
      byteCount --;
    }

    if(byteCount === 0) {
      byteCount = this.defaultByteCount;
      continue;
    }
    byteCount = Math.min(this.defaultByteCount, byteLength - addr);

    var checksum = 0;
    var addressHex = this.hex(addr, 4);
    var byteCountHex = this.hex(byteCount, 2);
    var dataHexParts = [];

    for(var offset = 0; offset < byteCount; offset++) {
      dataHexParts.push(this.hex(bytes[addr+offset], 2));
      checksum += bytes[addr+offset];
    }

    checksum += (addr & 0xff) + ((addr >> 8) & 0xff);
    checksum += byteCount & 0xff;
    checksum = (-checksum) & 0xff; // two's complement
    var checksumHex = this.hex(checksum, 2);

    var dataHex = dataHexParts.join("");
    lines.push(":"+byteCountHex+addressHex+recordTypeHex+dataHex+checksumHex);
  }
  lines.push(":00000001FF"); // end of file

  return lines.join("\n");
};

Encoder.prototype.hex = function(value, count) {
  var hexStr = value.toString(16).toUpperCase();
  while(hexStr.length < count) {
    hexStr = "0"+hexStr;
  }

  if(hexStr.length > count) {
    hexStr = hexStr.substr(hexStr.length-count,count);
  }

  return hexStr;
};

