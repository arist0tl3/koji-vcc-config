"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _child_process = require("child_process");

var _ansiColorsAndStyles = require("ansi-colors-and-styles");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var readDirectoryRelative = function readDirectoryRelative(directory) {
  try {
    var list = (0, _child_process.execSync)('git ls-files && git ls-files --exclude-standard --others', {
      cwd: directory
    }).toString().replace(/\n$/, '').split('\n'); // Find the paths of git submodules (not recursive):

    var submodulesInfo = (0, _child_process.execSync)('git submodule status', {
      cwd: directory
    }).toString();
    var regExp = /^ [A-Fa-f0-9]{40,64} (.+?) \(.+?\)$/gm; // live: https://regex101.com/r/yUEJNe/2/

    var _loop = function _loop() {
      var _list;

      var match = regExp.exec(submodulesInfo);
      if (match === null) return "break"; // const submoduleInfo = match[0]

      var submodulePath = match[1]; // Sample values for above variables:
      //     submoduleInfo: " debd72fe632d7315be8e31fe00c7e767c423a01f sub-repo1 (heads/master)"
      //     submodulePath: "sub-repo1"
      // Exclude submodule directory from the list:

      list = list.filter(function (p) {
        return p !== submodulePath;
      }); // Instead, add paths under the submodule (recursive):
      // Make path relative to `directory`:

      (_list = list).push.apply(_list, _toConsumableArray(readDirectoryRelative(_path["default"].resolve(directory, submodulePath)).map(function (nestedPath) {
        return _path["default"].join(submodulePath, nestedPath);
      })));
    };

    while (true) {
      var _ret = _loop();

      if (_ret === "break") break;
    }

    return list;
  } catch (err) {
    var error = new Error("\n      [@withkoji/vcc] ".concat(err.message, "\n").concat(_ansiColorsAndStyles._YLW).concat(_ansiColorsAndStyles.RED, "Have you installed \"git\" and added it to the \"PATH\"?\n      If not, see: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git").concat(_ansiColorsAndStyles.RST, "\n\n    "));
    error.stack = err.stack;
    throw error;
  }
}; // Get all git-indexed paths to find koji files
// Make path absolute:


var readDirectory = function readDirectory(directory) {
  return readDirectoryRelative(directory).map(function (relativePath) {
    return _path["default"].resolve(directory, relativePath);
  });
};

var _default = readDirectory;
exports["default"] = _default;