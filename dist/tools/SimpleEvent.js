"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Handle = _interopRequireDefault(require("./Handle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SimpleEvent =
/*#__PURE__*/
function () {
  function SimpleEvent() {
    _classCallCheck(this, SimpleEvent);

    this.handlers = undefined;
  }

  _createClass(SimpleEvent, [{
    key: "subscribe",
    value: function subscribe(handler) {
      var _this = this;

      var includeLast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.handlers == null) {
        this.handlers = [];
      }

      this.handlers.push(handler);

      if (this.lastEvent != null && includeLast) {
        handler(this.lastEvent);
      }

      return new _Handle["default"](function () {
        return _this.unsubscribe(handler);
      });
    }
  }, {
    key: "emit",
    value: function emit(event) {
      var _this2 = this;

      if (this.handlers != null) {
        this.handlers.forEach(function (handler) {
          handler(event, _this2.lastEvent);
        });
      }

      this.lastEvent = event;
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(handler) {
      if (this.handlers == null) {
        return;
      }

      this.handlers = this.handlers.filter(function (h) {
        return h !== handler;
      });

      if (this.handlers.length === 0) {
        this.handlers = undefined;
      }
    }
  }]);

  return SimpleEvent;
}();

exports["default"] = SimpleEvent;