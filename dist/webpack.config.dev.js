"use strict";

var createExpoWebpackConfigAsync = require('@expo/webpack-config');

var TerserPlugin = require("terser-webpack-plugin");

module.exports = function _callee(env, argv) {
  var config;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          env["offline"] = true;
          _context.next = 3;
          return regeneratorRuntime.awrap(createExpoWebpackConfigAsync(env, argv));

        case 3:
          config = _context.sent;

          // Customize the config before returning it.
          if (config.mode === 'production') {
            config.optimization.minimize = true; //config.optimization.minimizer = [new TerserPlugin()];
          }

          return _context.abrupt("return", config);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};