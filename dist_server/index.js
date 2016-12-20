'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['', '\t', '\t', '\t', '\t', ''], ['', '\\t', '\\t', '\\t', '\\t', '']);

var _cedictTools = require('cedict-tools');

var _pinyinizer = require('pinyinizer');

var _pinyinizer2 = _interopRequireDefault(_pinyinizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLOZE_COLOR = '#f45df4';
var PINYIN_COLORS = {
  1: '#00ac00',
  2: '#021bff',
  3: '#996633',
  4: '#ff0000'
};

var makeTsvSafe = function makeTsvSafe(str) {
  return str.replace(/\n/g, '<br />').replace(/\t/g, '    ');
};
var wordForRecordAndCharset = function wordForRecordAndCharset(record, charset) {
  return charset === 'simplified' ? record.simp : record.trad;
};
var tsv = function tsv(strings) {
  var result = strings[0];
  for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i += 1) {
    result += makeTsvSafe(arguments.length <= i + 1 ? undefined : arguments[i + 1]);
    result += strings[i + 1];
  }
  return result;
};

var recordsToHtml = function recordsToHtml(records) {
  return records.map(function (record) {
    var pinyin = record.pinyin;
    pinyin = pinyin.replace(/5/g, '');
    pinyin = _pinyinizer2.default.pinyinize(pinyin);

    var originalPinyinSyllables = record.pinyin.split(' ');
    pinyin = pinyin.split(' ').map(function (w, i) {
      var org = originalPinyinSyllables[i];
      var color = PINYIN_COLORS[org[org.length - 1]] || 'black';

      return '<span style="color: ' + color + ';">' + w + '</span>';
    }).join(' ');

    var english = record.english;
    english = english.slice(1, english.length - 1);
    english = english.split('/').map(function (s) {
      return '\u2022&nbsp;' + s;
    }).join('<br />');

    return pinyin + '<br />' + english;
  }).join('<br /><br />');
};

var cardToTsvLine = function cardToTsvLine(_ref) {
  var title = _ref.title,
      text = _ref.text,
      index = _ref.index,
      records = _ref.records,
      charset = _ref.charset;

  var front = text.slice(0, index) + '<span style="color: ' + CLOZE_COLOR + ';">\uFF05</span>' + text.slice(index + 1);

  var back = text.slice(0, index) + '<span style="color: ' + CLOZE_COLOR + ';">' + text[index] + '</span>' + text.slice(index + 1);

  var clozedWord = records.length > 0 ? wordForRecordAndCharset(records[0], charset) : '';
  var recordsHtml = recordsToHtml(records);

  return tsv(_templateObject, front, back, title, clozedWord, recordsHtml);
};

var express = require('express');
var path = require('path');

var _require = require('body-parser'),
    json = _require.json;

var app = express();

app.use(express.static(path.join(__dirname, '..', 'static')));

app.use(json({ limit: '50mb' }));

_cedictTools.CedictTools.initialize();

app.post('/generate-cards', function (req, res) {
  var cards = req.body;

  var tsvString = cards.map(function (card) {
    var charset = _cedictTools.CedictTools.getCharset(card.text);
    var records = _cedictTools.CedictTools.getRecordsForWordAtIndex(card.text, card.index, charset) || [];

    return (0, _extends3.default)({}, card, {
      charset: charset,
      records: records
    });
  }).map(cardToTsvLine).join('\n');

  res.send(tsvString);
});

app.listen(8730);

console.log('Server running');