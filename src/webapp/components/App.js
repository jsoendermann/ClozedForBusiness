import React, { Component } from 'react';
import * as _ from 'lodash';
import axios from 'axios';
import product from 'cartesian-product';

import 'antd/dist/antd.css';
import './App.scss';

import CardModal from './CardModal';
import Character from './Character';
import Header from './Header';

import isHanzi from '../utils/isHanzi';
import truncateAroundIndex from '../utils/truncateAroundIndex';


class App extends Component {
  constructor() {
    super();

    this.state = {
      title: '',
      code: '',

      characters: [],
      codeLength: 0,

      cardsToBeSubmitted: [],

      cardModalVisible: false,
      generatedCards: '',
    };

    _.bindAll(this, [
      'onTextChange',
      'onCodeChange',
      'onGenerateCardsButtonClicked',
      'onModalCancelClick',
      'onModalOkClick',
    ]);
  }

  onTextChange(text) {
    const numberOfHanziInText = text.split('').filter(char => isHanzi(char)).length;
    let codeLength;
    if (numberOfHanziInText <= 26) {
      codeLength = 1;
    } else if (numberOfHanziInText <= 26 ** 2) {
      codeLength = 2;
    } else {
      codeLength = 3;
    }

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const codes = product(Array(codeLength).fill(alphabet)).map(c => c.join(''));

    let codeIndex = 0;

    const characters = text.split('').map((char) => {
      const isHanziChar = isHanzi(char);

      let result = {
        char,
        isHanzi: isHanziChar,
      };

      if (isHanziChar) {
        result = {
          ...result,
          code: codes[codeIndex],
          hasBeenClozed: false,
        };

        codeIndex += 1;
      }

      return result;
    });

    this.setState({
      characters,
      codeLength,
    });
  }

  onCodeChange(code) {
    if (code.length < this.state.codeLength) {
      this.setState({ code });
    } else {
      const characterIndex = this.state.characters.findIndex(c => c.code === code);

      if (characterIndex === -1) {
        this.setState({ code: '' });
        return;
      }

      const characters = [...this.state.characters];
      characters[characterIndex] = { ...characters[characterIndex], hasBeenClozed: true };

      const text = characters.map(c => c.char).join('');
      const { truncatedText, truncatedIndex } = truncateAroundIndex({ text, index: characterIndex, cutString: '…' });

      this.setState({
        code: '',
        characters,
        cardsToBeSubmitted: [
          ...this.state.cardsToBeSubmitted,
          {
            title: this.state.title,
            text: truncatedText,
            index: truncatedIndex,
          },
        ],
      });
    }
  }

  async onGenerateCardsButtonClicked() {
    const response = await axios.post('/generate-cards', this.state.cardsToBeSubmitted);
    this.setState({ generatedCards: response.data, cardModalVisible: true });
  }

  onModalCancelClick() {
    this.setState({ cardModalVisible: false });
  }

  onModalOkClick() {
    this.setState({
      title: '',
      code: '',
      characters: [],
      cardsToBeSubmitted: [],
      cardModalVisible: false,
    });
  }

  render() {
    const charElements = this.state.characters.map((c, i) => {
      switch (c.char) {
        case '\n': return <br key={c.char + i} />;
        case ' ': return <span key={c.char + i}>&nbsp;</span>;
        default: return <Character key={c.char + i} {...c} />;
      }
    });

    const instructions = (
      <ol className="instructions">
        <li>Find something interesting to read online and copy it into the text box above.</li>
        <li>To create a card with a particular chararcter clozed, enter its code into the "Code" field.</li>
        <li>Repeat the previous two steps as many times as you like.</li>
        <li>Click on the "Generate" button and follow the instructions to add your new cards to Anki.</li>
      </ol>
    );

    return (
      <div className="App">
        <Header
          title={this.state.title}
          onTitleChange={title => this.setState({ title })}
          text={this.state.characters.map(c => c.char).join('')}
          onTextChange={this.onTextChange}
          code={this.state.code}
          onCodeChange={this.onCodeChange}
          onGenerateCardsButtonClicked={this.onGenerateCardsButtonClicked}
          numberOfCardsToBeGenerated={this.state.cardsToBeSubmitted.length}
        />

        <CardModal
          visible={this.state.cardModalVisible > 0}
          onCancel={this.onModalCancelClick}
          onOk={this.onModalOkClick}
          generatedCards={this.state.generatedCards}
        />

        <section className="chinese-text">
          {
            charElements.length > 0 ?
              charElements
            :
              instructions
          }
        </section>
      </div>
    );
  }
}

export default App;
