import Letter from './Letter';

export default function Word({
  word,
  wordIndex,
  typeboxState
}) {
  const letters = word.split('');
  return (
    <div className={`word`}>
      {letters.map((letter, letterIndex) => {
        return (
          <Letter
            key={letter + letterIndex}
            letter={letter}
            letterIndex={letterIndex}
            word={word}
            wordIndex={wordIndex}
            typeboxState={typeboxState}
          />
        );
      })}
    </div>
  );
};

