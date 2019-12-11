"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _readDirectory = _interopRequireDefault(require("./readDirectory"));

var _findRootDirectory = _interopRequireDefault(require("./findRootDirectory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var writeConfig = function writeConfig() {
  var root = (0, _findRootDirectory["default"])(); // Add config items from koji json files

  var projectConfig = (0, _readDirectory["default"])(root).reduce(function (config, path) {
    try {
      if (!(path.endsWith('koji.json') || path.includes('.koji')) && !path.includes('.koji-resources')) return config;
      var file = JSON.parse(_fs["default"].readFileSync(path, 'utf8'));
      Object.keys(file).forEach(function (key) {
        // If the key already exists in the project config, use it
        var configValue = config[key];
        var fileValue = file[key];

        if (configValue) {
          configValue = Array.isArray(configValue) && Array.isArray(fileValue) ? configValue.concat(fileValue) : Object.assign(configValue, fileValue);
        } else {
          // Otherwise, set it
          configValue = fileValue;
        } // Finally, set the config key's value


        config[key] = configValue;
      });
    } catch (e) {//
    }

    return config;
  }, {}); // Expose the serviceMap based on environment variables

  projectConfig.serviceMap = Object.keys(process.env).reduce(function (serviceMap, envVariable) {
    if (envVariable.startsWith('KOJI_SERVICE_URL')) {
      serviceMap[envVariable.replace('KOJI_SERVICE_URL_', '').toLowerCase()] = process.env[envVariable];
    }

    return serviceMap;
  }, {}); // Expose some metadata about the project

  projectConfig.metadata = _objectSpread({}, projectConfig.metadata || {}, {
    projectId: process.env.KOJI_PROJECT_ID
  }); // Write the generated config to a json file

  try {
    _fs["default"].writeFileSync("".concat(__dirname, "/../res/config.json"), JSON.stringify(projectConfig, null, 2));
  } catch (err) {
    var error = new Error("[@withkoji/vcc] ".concat(err.message));
    error.stack = err.stack;
    throw err;
  }
};

var _default = writeConfig;
exports["default"] = _default;