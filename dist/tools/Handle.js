"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Handle =
/*#__PURE__*/
function () {
  function Handle(onRelease) {
    var _this = this;

    _classCallCheck(this, Handle);

    this.release = function () {
      if (_this.releaseFn == null) {
        return false;
      }

      _this.releaseFn();

      _this.releaseFn = undefined;
      return true;
    };

    this.releaseFn = onRelease;
  }

  _createClass(Handle, [{
    key: "isReleased",
    get: function get() {
      return this.releaseFn == null;
    }
  }]);

  return Handle;
}();

exports["default"] = Handle;