export function getCharGroups(text) {
  const charGroups = [];
  let currentCharGroup = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '') continue;

    if (char === ' ') {
      charGroups.push(currentCharGroup.join(''));
      charGroups.push(' ');
      currentCharGroup = [];
    } else if (char === '\n') {
      if (currentCharGroup.length) {
        // This is to handle the case where there are multiple new lines in a row
        // 2 consecutive new lines shouldn't be allowed
        charGroups.push(currentCharGroup.join(''));
        charGroups.push('\n');
        currentCharGroup = [];
      }
    } else {
      currentCharGroup.push(char);
    }
  }
  return charGroups;
}