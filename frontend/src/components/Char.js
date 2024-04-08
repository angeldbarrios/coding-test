export default function Char({
  char,
  charIndex,
  charGroupIndex,
  typeState
}) {
  const isCurrentChar = (
    charGroupIndex === typeState.currentCharGroup &&
    charIndex === typeState.currentChar
  );
  const isPastChar = (
    charGroupIndex < typeState.currentCharGroup ||
    (charGroupIndex === typeState.currentCharGroup && charIndex < typeState.currentChar)
  );

  const charClassName = isCurrentChar
    ? 'active'
    : isPastChar
      ? 'correct'
      : '';


  let charElement;
  if (char === ' ') {
    charElement = <span className="space">&nbsp;</span>;
  } else if (char === '\n') {
    charElement = <div className="br"></div>;
  } else {
    charElement = <span className={`char ${charClassName}`}>{char}</span>;
  }

  return charElement;
}