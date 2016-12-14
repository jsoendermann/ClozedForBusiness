import React, { Component } from 'react';
import './App.scss';
import 'antd/dist/antd.css';
import { Input, Button } from 'antd';
import * as _ from 'lodash';


const alphabet = "abcdefghijklmnopqrstuvwxyz";
const nonChineseChars = [
  ...alphabet.split(''),
  ...alphabet.toLocaleUpperCase().split(''),
  ...'0123456789（）()！!？?~～"「」《》<>【】[]{}^&*$#…\'‘’。，、　 ；.,;"“”—-_：:\n·", \t'.split('')
];

const colemak = 'tnseriaodhglvkpcmfuwyxqzbj';
const codes = [];

for (let i = 1; i < colemak.length; i++) {
  for (let j = 0; j < i; j++) {
    codes.push(`${colemak[j]}${colemak[i]}`)
  }
}

const reversedCodes = codes.map(c => c.split('').reverse().join(''));

let combinedCodes = colemak.split('').map(l => l + l);

for (let i = 0; i < codes.length; i++) {
  combinedCodes.push(codes[i]);
  combinedCodes.push(reversedCodes[i]);
}


const Character = ({ character, code, hasBeenClozed }) => (
  <ruby><rb>{character}</rb><rt className={ hasBeenClozed ? 'hasBeenClozed' : ''}>{code}</rt></ruby>
);

const UnclozedCharacter = ({ character }) => (
  <ruby><rb>{character}</rb><rt style={{ color: 'white'}}>{'j'}</rt></ruby>
)

class App extends Component {
  constructor() {
    super();

    this.state = {
      title: '',
      text: '',
      code: '',

      clozedCharsStartAtIndex: 0,
      clozedCharsEndAtIndex: 0,

      codeToIndex: null,
      indexToCode: null,

      clozedCharacterIndices: [],

      cardsToBeSubmitted: [],
    }

    _.bindAll(this, ['onChangeText', 'onCodeChange'])
  }

  onChangeText(e) {
    const text = e.target.value;
    
    this.setState({
      text,
      code: '',
      clozedCharsStartAtIndex: 0,
      ...this.getMapsForTextAndIndex(text, 0),
      clozedCharacterIndices: [],
    });
  }

  moveClozesBackwards() {
    let newClozedCharsStartAtIndex = this.state.clozedCharsStartAtIndex;
    let combinedCodesCounter = 0;

    while (newClozedCharsStartAtIndex >= 0 && combinedCodesCounter < combinedCodes.length) {
      if (!nonChineseChars.includes(this.state.text[newClozedCharsStartAtIndex])) {
        combinedCodesCounter++;
      }

      newClozedCharsStartAtIndex--;
    }

    newClozedCharsStartAtIndex = Math.max(0, newClozedCharsStartAtIndex);

    this.setState({
      ...this.getMapsForTextAndIndex(this.state.text, newClozedCharsStartAtIndex),
      clozedCharsStartAtIndex: newClozedCharsStartAtIndex,
    });
  }

  moveClozesForwards() {
    let nextClozableCharacter = this.state.clozedCharsEndAtIndex;

    while (nonChineseChars.includes(this.state.text[nextClozableCharacter]) && nextClozableCharacter < this.state.text.length) {
      nextClozableCharacter++;
    }

    this.setState({
      ...this.getMapsForTextAndIndex(this.state.text, nextClozableCharacter),
      clozedCharsStartAtIndex: nextClozableCharacter,
    });
  }

  onCodeChange(e) {
    if (e.target.value === '[') {
      this.moveClozesBackwards();
    
      this.setState({ code: '' });
    } else if (e.target.value === ']') {
      this.moveClozesForwards();

      this.setState({ code: '' });
    } else if (e.target.value.length <= 1) {
      this.setState({ code: e.target.value });
    } else {
      const code = e.target.value;
      const index = this.state.codeToIndex.get(code);

      const clozedCharacterIndices = [...this.state.clozedCharacterIndices];
      if (index !== undefined) {
        clozedCharacterIndices.push(index);
      }



      this.setState({ 
        code: '',
        clozedCharacterIndices,
        cardsToBeSubmitted: [
          ...this.state.cardsToBeSubmitted,
          {
            title: this.state.title,
            text: this.state.text,
            index: this.state.codeToIndex.get(code),
          }
        ]
      });
    }
  }

  getMapsForTextAndIndex(text, index) {
    let combinedCodesIndex = 0, textOffset = 0;
    const codeToIndex = new Map();
    const indexToCode = new Map();

    while (combinedCodesIndex <= combinedCodes.length && (index + textOffset) < text.length) {
      if (!nonChineseChars.includes(text[index + textOffset])) {
        codeToIndex.set(combinedCodes[combinedCodesIndex], index + textOffset);
        indexToCode.set(index + textOffset, combinedCodes[combinedCodesIndex]);

        combinedCodesIndex++;
      }

      textOffset++;
    }

    return {
      codeToIndex,
      indexToCode,
      clozedCharsEndAtIndex: index + textOffset - 1,
    }
  }

  render() {
    const charElements = this.state.text.split('').map((c, i) => {
      if (c === '\n') {
        return <br key={c+i} />;
      }
      if (c === ' ') {
        return <span key={c+i}>&nbsp;</span>;
      }
        
      if (i < this.state.clozedCharsStartAtIndex || i > this.state.clozedCharsEndAtIndex) {
        return <UnclozedCharacter key={c+i} character={c} />;
      }

      return <Character key={c+i} character={c} code={this.state.indexToCode.get(i)} hasBeenClozed={this.state.clozedCharacterIndices.includes(i)} />;
    })

    return (
      <div className="App">
        <section className="title-and-text-section">
          <div className="title-container">
            <Input value={this.state.title} onChange={e => this.setState({ title: e.target.value })} className="title" type="textarea" placeholder="Title (can be empty)" />
          </div>
          <div className="text-container">
            <Input value={this.state.text} onChange={this.onChangeText} className="text" type="textarea" placeholder="Text" />
          </div>
        </section>
        <section className="cloze-codes-and-generate-button-section">
          <div className="cloze-code-container">
            <Input value={this.state.code} onChange={this.onCodeChange} className="cloze-code" size="small" placeholder="Code" style={{ position: 'relative', left: 0, width: '100px' }} />
          </div>
          <div className="generate-button-container">
            <Button>Generate {this.state.cardsToBeSubmitted.length} cards</Button>
          </div>
        </section>
        <section className="chinese-text">
          {charElements}
        </section>
      </div>
    );
  }
}

export default App;

/*

      <div className="title">

          </div>
          <div className="text">
           </div>


    <div className="codes-and-button">
          <div className="cloze-code">
          <Input  placeholder="Text" style={{width: '100px'}} />
          </div>
          <div className="generate">
            <Button>Generate 127 cards</Button>
          </div>
        </div>
        */