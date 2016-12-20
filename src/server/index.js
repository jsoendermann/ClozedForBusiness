import { CedictTools } from 'cedict-tools';
import pinyinizer from 'pinyinizer';

const CLOZE_COLOR = '#f45df4';
const PINYIN_COLORS = {
  1: '#00ac00',
  2: '#021bff',
  3: '#996633',
  4: '#ff0000',
};

const makeTsvSafe = str => str.replace(/\n/g, '<br />').replace(/\t/g, '    ');
const wordForRecordAndCharset = ({ simp, trad }, charset) => (charset === 'simplified' ? simp : trad);
const tsv = (strings, ...values) => {
  let result = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    result += makeTsvSafe(values[i]);
    result += strings[i + 1];
  }
  return result;
};

const definitionsToHtml = records => records.map(({ pinyin, english }) => {
  const pinyinWithDiacritics = pinyinizer.pinyinize(pinyin.replace(/5/g, ''));

  const originalPinyinSyllables = pinyin.split(' ');
  const pinyinWithColorsAndDiacritics = pinyinWithDiacritics.split(' ').map((w, i) => {
    const org = originalPinyinSyllables[i];
    const color = PINYIN_COLORS[org[org.length - 1]] || 'black';

    return `<span style="color: ${color};">${w}</span>`;
  }).join(' ');

  const definitions = english
    .slice(1, english.length - 1)
    .split('/')
    .map(s => `•&nbsp;${s}`)
    .join('<br />');

  return `${pinyinWithColorsAndDiacritics}<br />${definitions}`;
}).join('<br /><br />');

const cardToTsvRow = ({ title, text, index, records, charset }) => {
  const front =
    `${text.slice(0, index)
    }<span style="color: ${CLOZE_COLOR};">％</span>${
    text.slice(index + 1)}`;

  const back =
    `${text.slice(0, index)
    }<span style="color: ${CLOZE_COLOR};">${text[index]}</span>${
    text.slice(index + 1)}`;

  const clozedWord = records.length > 0 ? wordForRecordAndCharset(records[0], charset) : '';
  const recordsHtml = definitionsToHtml(records);

  return tsv`${front}\t${back}\t${title}\t${clozedWord}\t${recordsHtml}`;
};

const express = require('express');
const path = require('path');
const { json } = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'static')));
app.use(json({ limit: '50mb' }));

CedictTools.initialize();

app.post('/generate-cards', (req, res) => {
  const cards = req.body;

  const tsvString = cards
    .map((card) => {
      const charset = CedictTools.getCharset(card.text);
      const records = CedictTools.getRecordsForWordAtIndex(card.text, card.index, charset) || [];

      return {
        ...card,
        charset,
        records,
      };
    })
    .map(cardToTsvRow)
    .join('\n');

  res.send(tsvString);
});

app.listen(8730);

console.log('Server running');
