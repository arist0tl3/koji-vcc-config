"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _deepDiff = _interopRequireDefault(require("deep-diff"));

var _deepmerge = _interopRequireDefault(require("deepmerge"));

var _resolveSecret = _interopRequireDefault(require("./tools/resolveSecret"));

var _SimpleEvent = _interopRequireDefault(require("./tools/SimpleEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function parseQuery(queryString) {
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');

  for (var i = 0; i < pairs.length; i += 1) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }

  return query;
}

function deprecationNotice(method) {
  var isBreaking = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (isBreaking) {
    console.warn("[@withkoji/vcc] ".concat(method, " is deprecated and no longer available."));
  } else {
    console.warn("[@withkoji/vcc] ".concat(method, " is deprecated and no longer needs to be called.\nYou can safely remove this call from your project!"));
  }
}

var configDidChange = new _SimpleEvent["default"]();

var config = require('./res/config.json');

if (window && window.location.search && window.location.search !== '') {
  var query = parseQuery(window.decodeURI(window.location.search));
  var urlConfig = JSON.parse(query.config);
  config = (0, _deepmerge["default"])(_objectSpread({}, config), urlConfig);
}

var _default = {
  config: config,
  configDidChange: configDidChange,
  enableConfigDidChange: function enableConfigDidChange() {
    if (module.hot) {
      module.hot.accept('./res/config.json', function () {
        var previousValue = _objectSpread({}, config); // eslint-disable-next-line global-require


        config = require('./res/config.json');
        var originalDiff = (0, _deepDiff["default"])(previousValue, config);
        console.log(originalDiff);
        var changes = originalDiff.map(function (diff) {
          if (diff.kind === 'A') {
            return {
              previousValue: diff.item.lhs,
              newValue: diff.item.rhs,
              path: [].concat(_toConsumableArray(diff.path), [diff.index])
            };
          }

          return {
            previousValue: diff.lhs,
            newValue: diff.rhs,
            path: diff.path
          };
        });
        configDidChange.emit({
          newValue: config,
          previousValue: previousValue,
          changes: changes
        });
      });
    }
  },
  resolveSecret: _resolveSecret["default"],
  // Deprecated
  pageLoad: function pageLoad() {
    return deprecationNotice('Koji.pageLoad()');
  },
  on: function on() {
    return deprecationNotice('Koji.on()');
  },
  request: function request() {
    return deprecationNotice('Koji.request()', true);
  },
  pwaPrompt: function pwaPrompt() {
    return deprecationNotice('Koji.pwaPrompt()', true);
  }
};
exports["default"] = _default;