import Char from './Char';

export default function CharGroup({
  rawText,
  charGroup,
  charGroupIndex,
  typeState
}) {
  const chars = charGroup.split('');
  return (
    <div className={`char-group ${chars.includes('\n') ? 'char-group-br' : ''}`}>
      {chars.map((char, charIndex) => {
        return (
          <Char
            key={char + charIndex}
            char={char}
            charIndex={charIndex}
            charGroup={charGroup}
            charGroupIndex={charGroupIndex}
            typeState={typeState}
          />
        );
      })}
    </div>
  );
};

