export default function Letter({
  letter,
  letterIndex,
  wordIndex,
  typeboxState
}) {
  const isCurrentLetter = () => {
    return (
      wordIndex === typeboxState.wordIndex &&
      letterIndex === typeboxState.letterIndex
    );
  };

  const isPastLetter = () => {
    return (
      wordIndex < typeboxState.wordIndex ||
      (
        wordIndex === typeboxState.wordIndex &&
        letterIndex < typeboxState.letterIndex
      )
    );
  };

  const isIncorrect = () => {
    return typeboxState.incorrects.find(([incorrectWordIndex, incorrectLetterIndex]) => {
      console.table({
        incorrectWordIndex,
        incorrectLetterIndex,
        wordIndex,
        letterIndex
      });
      return (
        wordIndex === incorrectWordIndex && letterIndex === incorrectLetterIndex
      )
    })
  };

  let letterClassName = '';
  if (isCurrentLetter()) {
    letterClassName = 'active';
  } else if (isPastLetter()) {
    letterClassName = 'correct';
  } else if (isIncorrect()) {
    letterClassName = 'incorrect';
  }

  return (
    <span className={`letter ${letterClassName}`}>{letter}</span>
  );
}