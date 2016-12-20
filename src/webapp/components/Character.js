import React from 'react';
import './Character.scss';

const Character = ({ char, isHanzi, code, hasBeenClozed }) => (
  <ruby className="character">
    <rb>{char}</rb>
    <rt className={hasBeenClozed || !isHanzi ? 'invisible' : ''}>
      {isHanzi ? code : '_'}
    </rt>
  </ruby>
);

export default Character;