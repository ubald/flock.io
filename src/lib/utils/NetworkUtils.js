"use strict";

// Note: This is used by webpack config, use ES5 only

var os = require('os');
/**
 * Get local address of the host
 */
module.exports = {

  getLocalIp : function() {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4') {
          if (!address.internal) {
            addresses.unshift(address.address);
          } else {
            addresses.push(address.address);
          }
        }
      }
    }
    return addresses[0];
  },

  getInterfaces : function() {
    var interfaces = os.networkInterfaces();
    var iface = {};
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4') {
          iface[k] = address.address;
        }
      }
    }
    return iface;
  }
};
