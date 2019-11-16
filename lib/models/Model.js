"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Publisher2 = _interopRequireDefault(require("./Publisher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Model =
/*#__PURE__*/
function (_Publisher) {
  _inherits(Model, _Publisher);

  _createClass(Model, null, [{
    key: "defaultState",
    //===============
    // CLASS METHODS
    //===============
    value: function defaultState() {
      return {};
    } //=============
    // CONSTRUCTOR
    //=============

  }]);

  function Model(state) {
    var _this;

    _classCallCheck(this, Model);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Model).call(this));

    _this._initId();

    _this.initState(state);

    _this.createHelpers();

    return _this;
  } //=====================
  // INTERFACING METHODS
  //=====================


  _createClass(Model, [{
    key: "initState",
    value: function initState(state) {
      this.state = Object.assign(this.constructor.defaultState(), state);
    }
  }, {
    key: "createHelpers",
    value: function createHelpers() {
      var _this2 = this;

      Object.keys(this.state).forEach(function (key) {
        var cappedKey = key[0].toUpperCase() + key.substring(1);
        var getKey = "get".concat(cappedKey);
        var setKey = "set".concat(cappedKey);
        var hasKey = "has".concat(cappedKey);
        var isKey = "is".concat(cappedKey);

        if (typeof _this2.state[key] === 'boolean') {
          _this2.constructor.prototype[isKey] = _this2[isKey] || function () {
            return this.state[key];
          };
        } else {
          _this2.constructor.prototype[getKey] = _this2[getKey] || function () {
            return this.state[key];
          };
        }

        _this2.constructor.prototype[hasKey] = _this2[hasKey] || function () {
          if (Array.isArray(this.state[key])) {
            return !!this.state[key].length;
          }

          return !!this.state[key];
        };

        _this2.constructor.prototype[setKey] = _this2[setKey] || function (value) {
          return this.setState(_defineProperty({}, key, value));
        };
      });
    }
  }, {
    key: "setState",
    value: function setState(nextState) {
      var _this$_diffState = this._diffState(nextState),
          prev = _this$_diffState.prev,
          next = _this$_diffState.next,
          diff = _this$_diffState.diff;

      var prevState = Object.assign({}, this.state);

      if (diff) {
        // FOR LOGGING
        // console.groupCollapsed(this);
        // console.log('%cnext', 'font-weight: bold;', next);
        // console.log('%cprev', 'color: grey; font-weight: bold;', prev);
        // console.groupEnd();
        Object.assign(this.state, nextState);
        this.modelDidUpdate(prevState);
        this.publish();
      }
    }
  }, {
    key: "modelDidUpdate",
    value: function modelDidUpdate() {} // Template method for invoking behavior after
    // a model has correctly updated state.
    //==================
    // INTERNAL METHODS
    //==================

  }, {
    key: "_initId",
    value: function _initId() {
      this._id = Model.baseId;
      Model.baseId += 1;
    }
  }, {
    key: "_diffState",
    value: function _diffState(nextState) {
      var _this3 = this;

      var prev = {};
      var next = {};
      var diff = false;
      Object.keys(nextState).forEach(function (key) {
        if (_this3.state[key] !== nextState[key]) {
          prev[key] = _this3.state[key];
          next[key] = nextState[key];
          diff = true;
        }
      });
      return {
        prev: prev,
        next: next,
        diff: diff
      };
    }
  }]);

  return Model;
}(_Publisher2["default"]);

; //==================
// CLASS PROPERTIES
//==================

Model.baseId = 1;
var _default = Model;
exports["default"] = _default;