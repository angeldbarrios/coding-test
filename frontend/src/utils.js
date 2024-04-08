export function extractWords(text) {
  const wordList = new Set();
  let currentWord = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' || char === '-') continue;

    const wordSeparator = [' ', '\n', '.', ',', '?', '!', ':', ';'];
    if (wordSeparator.includes(char)) {
      if (currentWord.length) {
        if (!currentWord.includes("'")) wordList.add(currentWord.toLocaleLowerCase());
        currentWord = '';
      }
    } else {
      currentWord += char;
    }
  }
  return Array.from(wordList);
}

export function recoverLessonData() {
  const lessonData = localStorage.getItem('lessonData');
  const currentLesson = localStorage.getItem('currentLesson');
  if (!lessonData) return {};
  return {
    storedLessonData: JSON.parse(lessonData),
    storedCurrentLesson: currentLesson
  }
};
