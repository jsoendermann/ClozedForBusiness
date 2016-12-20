import React, { Component } from 'react';
import { Input, Modal } from 'antd';
import './CardModal.scss';

const CardModal = props => (
  <Modal
    title="Cards"
    okText="Clear text & cards"
    cancelText="Cancel"
    closable
    {...props}
  >
    <p id="import-instructions">Copy the text below into a .tsv file and import it into <a href="/deck.apkg">this Anki deck</a>. Make sure to select "Tab" as field separator and enable "Allow HTML in fields" in the import dialog.</p>
    <Input id="generated-cards-input" value={props.generatedCards} type="textarea" />
  </Modal>
);

export default CardModal;
