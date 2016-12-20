import React, { Component } from 'react';
import { Input, Modal } from 'antd';
import './CardModal.scss';

const CardModal = (props) => (
  <Modal
    title="Cards"
    okText="Clear text & cards"
    cancelText="Cancel"
    closable={true}
    {...props}
    >
    <p id="import-instructions">Copy the following text into a .tsv file and import into <a href="/deck.apkg">this Anki deck</a>.</p>
    <Input id="generated-cards-input" value={props.generatedCards} type="textarea" />
  </Modal>
);

export default CardModal;