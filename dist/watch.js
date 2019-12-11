"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chokidar = _interopRequireDefault(require("chokidar"));

var _findRootDirectory = _interopRequireDefault(require("./tools/findRootDirectory"));

var _writeConfig = _interopRequireDefault(require("./tools/writeConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var watch = function watch() {
  // Generate a base config
  (0, _writeConfig["default"])(); // Note: Polling is used by default in the container via
  // the CHOKIDAR_USEPOLLING=1 env that is set in the container

  var kojiDir = "".concat((0, _findRootDirectory["default"])(), "/.koji");

  var watcher = _chokidar["default"].watch(kojiDir); // eslint-disable-next-line no-unused-vars


  var watcherDebounce = null;
  watcher.on('error', function (error) {
    return console.error("[@withkoji/vcc] Watcher error: ".concat(error));
  }).on('all', function () {
    if (watcherDebounce) {
      clearTimeout(watcherDebounce);
      watcherDebounce = null;
    }

    watcherDebounce = setTimeout(function () {
      console.log('[@withkoji/vcc] Rebuilding config...');
      (0, _writeConfig["default"])();
    }, 250);
  }).on('ready', function () {
    console.log("[@withkoji/vcc] Watching ".concat(kojiDir, "..."));
  });
};

var _default = watch;
exports["default"] = _default;