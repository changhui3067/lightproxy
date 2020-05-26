var net = require('net');

function getIPV4Bytes(ip) {
  return ip.split('.').map(function(seg) {
    return +seg || 0;
  });
}

function getIPV6Bytes(ip) {
  var bytes = [];
  ip.split(':').forEach(function(seg) {
    if (seg.indexOf('.') !== -1) {
      return bytes.apply(bytes, getIPV4Bytes(seg));
    }
    var len = seg.length;
    if (len > 2) {
      bytes.push(parseInt(seg.slice(0, -2), 16) || 0);
    } else {
      bytes.push(0);
    }
    bytes.push(parseInt(seg.slice(-2), 16) || 0);
  });
  return bytes;
}

exports.ipbytes = function(str) {
  var type = net.isIP(str);

  if (type === 4) {
    return getIPV4Bytes(str);
  }
  if (type !== 6) {
    return;
  }
  var index = str.indexOf('::');
  if (index !== -1) {
    var first = getIPV6Bytes(str.substring(0, index));
    var last = getIPV6Bytes(str.substring(index + 2));
    var zeroCount = 16 - first.length - last.length;
    for (var i = 0; i < zeroCount; i++) {
      first.push(0);
    }
    return first.concat(last);
  }
  return getIPV6Bytes(str);
};
