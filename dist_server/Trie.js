'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Trie = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Trie = exports.Trie = function () {
  function Trie(words) {
    var _this = this;

    (0, _classCallCheck3.default)(this, Trie);

    this.head = {};

    words.forEach(function (word) {
      var currentNode = _this.head;
      word.split('').forEach(function (char) {
        if (currentNode[char] === undefined) {
          currentNode[char] = {};
        }
        currentNode = currentNode[char];
      });
    });
  }

  (0, _createClass3.default)(Trie, [{
    key: 'longestMatchingWordLength',
    value: function longestMatchingWordLength(text) {
      var currentNode = this.head;
      var chars = text.split('');

      var i = 0;

      while (i < text.length && currentNode[chars[i]] !== undefined) {
        currentNode = currentNode[chars[i]];
        i++;
      }

      return i;
    }
  }]);
  return Trie;
}();