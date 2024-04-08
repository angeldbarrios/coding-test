import React, { useState, useEffect } from 'react';
import CharGroup from './CharGroup';
import { getCharGroups } from '../utils';

export default function TypeBox() {
  const [rawText, setRawText] = useState('');
  const [charGroups, setCharGroups] = useState([]);
  const [typeState, setTypeState] = useState({
    textPointer: 0,
    currentCharGroup: 0,
    currentChar: 0,
  });

  const handleKeyDown = (pressedKey) => {
    const { currentCharGroup: charGroupIndex, currentChar: charIndex } = typeState;
    const charGroup = charGroups[charGroupIndex];
    const char = charGroup[charIndex];

    const nextChar = charGroup[charIndex + 1];
    const nextCharIndex = charIndex + 1;

    const nextCharGroup = charGroups[charGroupIndex + 1];
    const nextCharGroupIndex = charGroupIndex + 1;

    if (!nextCharGroup) {
      // load more text
      return;
    };


    if (pressedKey === 'Backspace') {
      if (charIndex === 0 && charGroupIndex === 0) return;
      if (charIndex === 0) {
        const prevCharIndex = charGroups[charGroupIndex - 1].length - 1;
        setTypeState({
          ...typeState,
          currentCharGroup: charGroupIndex - 1,
          currentChar: prevCharIndex
        });
      } else {
        setTypeState({
          ...typeState,
          currentChar: charIndex - 1
        });
      }
    } else if (
      (pressedKey === 'Enter' && char === '\n') ||
      (pressedKey === ' ' && char === '\n') ||
      (pressedKey === char)
    ) {
      if (nextChar) {
        setTypeState({
          ...typeState,
          textPointer: typeState.textPointer + 1,
          currentChar: nextCharIndex
        });
      } else {
        setTypeState({
          ...typeState,
          textPointer: typeState.textPointer + 1,
          currentCharGroup: nextCharGroupIndex,
          currentChar: 0
        });
      }
    }
  };

  useEffect(() => {
    fetch('/Harry-Potter-1-Sorcerer\'s-Stone.txt')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(text => {
        setRawText(text.substring(0, 807));
      })
      .catch(error => console.error('Error:', error))
  }, []);

  useEffect(() => {
    document.onkeydown = (e) => {
      if (
        e.key.length === 1 ||
        e.key === "Backspace" ||
        e.key === "Enter"
      ) {
        handleKeyDown(e.key);
        e.preventDefault();
      }
    };
    return () => {
      document.onkeydown = null;
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (rawText.length === 0) return;
    const charGroups = getCharGroups(rawText);
    setCharGroups(charGroups);
    setTypeState({
      ...typeState,
      currentCharGroup: 146,
      currentChar: 1,
    });
  }, [rawText]);

  return (
    <div className="typeboxContainer">
      <div className="typebox">
        {charGroups.map((charGroup, charGroupIndex) => {
          return (
            <CharGroup
              key={charGroup + charGroupIndex}
              rawText={rawText}
              charGroup={charGroup}
              charGroupIndex={charGroupIndex}
              typeState={typeState}
            />)
        })}
      </div>
    </div>
  );
};


