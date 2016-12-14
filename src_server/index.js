import * as _ from 'lodash';

// const express = require('express');
// const app = express();
// const path = require('path');
// const { json } = require('body-parser');

// app.use(express.static(path.join(__dirname, 'src', 'static')));

// app.use(json());

// app.post('/process-cards', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');

//   res.send(req.body);
// });

// app.listen(8730);

// console.log('Server running');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dicts');
mongoose.Promise = global.Promise;

const commonSimplifiedCharacters = '这来国个说们为时会着过学对么没还无开见经头从动两长'.split('');

const isSimplified = text => commonSimplifiedCharacters.map(c => text.includes(c)).reduce((p, c) => p || c, false);

const test = {
  title: 'Blatitle',
  text: '数名亚洲问题专家表示，特朗普不是第一个质疑一个中国政策的共和党候任总统，但只有他提议可以将之作为纠正中国行为的筹码。分析人士表示，尽管特朗普以新眼光看待中国政策，受到了一些共和党人的称赞，但他的立场可能会面临北京的强烈反对。\n\n自1972年理查德·M·尼克松(Richard M. Nixon)总统和毛泽东在《上海公报》(Shanghai Communiqué)中确立了一个中国政策以来，还没有一位美国总统或候任总统如此公开、明确地质疑这项协议。因为该协议，美国在1979年终止了对台湾的外交承认。',
  index: 72
};

function cutOffPreviousSentences(text, index) {
  let c = index;

  while (c !== 0 && text[c - 1] !== '。') c--;

  let newText = text.slice(c);
  let newIndex = index - c;

  return {
    newText,
    newIndex,
  }
}

// console.log(cutOffPreviousSentences(test.text, 0))

let longestRecordLength = 20;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
  const cedictSchema = new mongoose.Schema({
    trad: String,
    simp: String,
    english: String,
    pinyin: String,
  }, { collection: 'cedict' });
  const CedictRecord = mongoose.model('CedictRecord', cedictSchema);

  // CedictRecord.find({ simp: /3C/ }).exec().then(results => console.log(results));

  CedictRecord.find().exec().then(allRecords => {
    longestRecordLength = Math.max(...allRecords.map(r => r.simp.length))
    // console.log(longestRecord)
  });

  function longestMatchingRecords(text) {
    const isSimp = isSimplified(text);
    let length = longestRecordLength;

    const substrings = _.uniq(_.range(longestRecordLength).map(l => l + 1).reverse().map(l => text.slice(0, l)));

    const substringRecordsPromises = substrings.map(substring => {
      if (isSimp) {
        return CedictRecord.find({ simp: substring }).exec();
      } else {
        return CedictRecord.find({ trad: substring }).exec();
      }
    });

    return Promise.all(substringRecordsPromises).then(substringRecords => {
      for (let i = 0; i < substringRecords.length; i++) {
        if (substringRecords[i].length > 0) {
          return substringRecords[i];
        }
      }
      return null;
    });
  }

  async function getRecordsForWordAtIndex(text, index) {
    let { newText, newIndex } = cutOffPreviousSentences(text, index);
    // console.log(newText)
    let seenChars = 0;

    while (seenChars <= newIndex) {
      const records = await longestMatchingRecords(newText);

      if (records === null) {
        newText = newText.slice(1);
        seenChars++;
        if (seenChars > newIndex) return [];
      } else {
        const wordLength = records[0].simp.length;
        newText = newText.slice(wordLength);
        seenChars += wordLength;
        if (seenChars > newIndex) return records;
      }
    }
  }

  (async () => {

    console.log('start')
    const r = await Promise.all(_.range(100).map(async () =>
  getRecordsForWordAtIndex(test.text, 81)));
     console.log(r)
  })();

  // recordsForWordAtIndex(test.text, test.index).then(r => console.log(r))

  // function addRecordToCard(card) {

  // }

  // console.log(addRecordToCard(test));
});

