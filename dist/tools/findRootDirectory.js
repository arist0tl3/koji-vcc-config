"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var findRootDirectory = function findRootDirectory() {
  // Start in the dir where this module is installed
  var dirPath = process.cwd(); // Look for the .koji dir

  try {
    while (!_fs["default"].readdirSync(dirPath).includes('.koji')) {
      var parentPath = _path["default"].dirname(dirPath);

      if (dirPath === parentPath) throw Error('[@withkoji/vcc] Couldn\'t find ".koji" folder.');
      dirPath = parentPath;
    }
  } catch (err) {
    // Fallback to using the default path?
    dirPath = process.cwd();
    console.log("[@withkoji/vcc] Couldn't find \".koji\" folder. Default path was used: \"".concat(dirPath, "\""));
  }

  return dirPath;
};

var _default = findRootDirectory;
exports["default"] = _default;