import React from 'react';
import { Input, Button } from 'antd';
import './Header.scss';

const Header = ({
  title,
  onTitleChange,
  text,
  onTextChange,
  code,
  onCodeChange,
  onGenerateCardsButtonClicked,
  numberOfCardsToBeGenerated,
}) => (
  <div>
    <section className="title-and-text-section">
      <div className="title-container">
        <Input
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          className="title"
          type="textarea"
          placeholder="Title (optional)"
        />
      </div>
      <div className="text-container">
        <Input
          value={text}
          onChange={e => onTextChange(e.target.value)}
          className="text"
          type="textarea"
          placeholder="Text"
        />
      </div>
    </section>
    <section className="cloze-codes-and-generate-button-section">
      <div className="cloze-code-container">
        <Input
          value={code}
          onChange={e => onCodeChange(e.target.value)}
          className="cloze-code"
          size="small"
          placeholder="Code"
        />
      </div>
      <div className="generate-button-container">
        <Button
          type="primary"
          disabled={numberOfCardsToBeGenerated === 0}
          onClick={onGenerateCardsButtonClicked}
        >
          Generate {numberOfCardsToBeGenerated} cards
        </Button>
      </div>
    </section>
  </div>
);

export default Header;
