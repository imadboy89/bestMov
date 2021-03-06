"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buttons_style = exports.header_style = void 0;

var _reactNative = require("react-native");

var header_style = _reactNative.StyleSheet.create({
  header: {
    backgroundColor: "#34495e"
  },
  container: {
    flex: 1,
    flexDirection: "row"
  },
  title: {
    fontSize: 16,
    color: "#e67e22" //width:"80%",

  },
  title_home: {
    fontSize: 20,
    color: "#e67e22",
    marginLeft: 10 //width:"80%",

  }
});

exports.header_style = header_style;

var buttons_style = _reactNative.StyleSheet.create({
  button: {
    padding: 5,
    fontSize: 26,
    color: "white"
  }
}); //export modules


exports.buttons_style = buttons_style;