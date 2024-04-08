import React, { useState, useEffect, useRef, useCallback } from 'react';
import Word from './Word';
import { extractWords, recoverLessonData } from '../utils';

const {
  storedLessonData,
  storedCurrentLesson
} = recoverLessonData();

console.log('storedLessonData', storedLessonData);
console.log('storedCurrentLesson', storedCurrentLesson);

const defaultLessonData = {
  1: {
    letters: ['a', 's', 'd', 'f'],
    unlocked: true
  },
  2: {
    letters: ['a', 'c', 'd', 'e'],
    unlocked: false
  },
  3: {
    letters: ['a', 'e', 'i', 'd', 'j'],
    unlocked: false
  },
};

export default function TypeBox() {
  const [rawText, setRawText] = useState('');
  const [isLessonInProgress, setIsLessonInProgress] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(storedCurrentLesson
    ? Number(storedCurrentLesson)
    : 1
  );

  const [wordList, setWordList] = useState(() => {
    const cachedWordList = sessionStorage.getItem('wordList');
    if (cachedWordList) {
      console.log('cachedWordList', cachedWordList);
      return JSON.parse(cachedWordList);
    }
    return [];
  });
  const [lessonWordList, setLessonWordList] = useState([]);
  const [typeboxState, setTypeboxState] = useState({
    wordIndex: 0,
    letterIndex: 0,
    incorrects: [],
  });

  const [secondsLeft, setSecondsLeft] = useState(10);
  const [lessonResult, setLessonResult] = useState({
    show: false,
    success: false,
    message: null
  });

  const totalLettersRef = useRef(0);
  const intervalRef = useRef(null);
  const lessonDataRef = useRef(storedLessonData || defaultLessonData);

  const resetTypebox = () => {
    setIsLessonInProgress(false);
    setTypeboxState({
      wordIndex: 0,
      letterIndex: 0,
      incorrects: []
    });
  };

  const handlerCountDown = useCallback(() => {
    if (intervalRef.current !== null) return;
    setSecondsLeft(Math.ceil(totalLettersRef.current / 2)); // 2 letters per second
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => {
        const updatedCountDownInSeconds = prevSecondsLeft - 1;
        if (updatedCountDownInSeconds <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          resetTypebox();
          setLessonResult({
            show: true,
            success: false,
            message: 'Time is up! Try again'
          });
          return 0;
        }
        return updatedCountDownInSeconds;
      });
    }, 1000);
  }, []);

  const handleKeyDown = useCallback((pressedKey) => {
    const currentWord = lessonWordList[typeboxState.wordIndex];
    const currentLetter = currentWord[typeboxState.letterIndex];

    const nextLetterIndex = typeboxState.letterIndex + 1;
    const nextLetter = currentWord[nextLetterIndex];
    const nextWordIndex = typeboxState.wordIndex + 1;
    const nextWord = lessonWordList[nextWordIndex];

    if (pressedKey === ' ' && !nextLetter) {
      if (nextWord) {
        setTypeboxState({
          wordIndex: typeboxState.wordIndex + 1,
          letterIndex: 0,
          incorrects: [...typeboxState.incorrects]
        });
      }
    } else if (pressedKey === currentLetter) {
      setTypeboxState({
        wordIndex: typeboxState.wordIndex,
        letterIndex: typeboxState.letterIndex + 1,
        incorrects: [...typeboxState.incorrects]
      });
      if (!nextLetter && !nextWord) {
        // Level passed
        resetTypebox();
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        const nextLesson = lessonDataRef.current[currentLesson + 1];
        if (nextLesson) {
          nextLesson.unlocked = true;
          localStorage.setItem('lessonData', JSON.stringify(lessonDataRef.current));
          setLessonResult({
            show: true,
            success: true,
            message: 'Lesson passed',
          });
        } else {
          setLessonResult({
            show: true,
            success: true,
            message: 'All lessons passed',
          });
        }
      }
    } else {
      const duplicateIncorrect = typeboxState.incorrects.find((
        [wordIndex, letterIndex]) => {
        return (
          wordIndex === typeboxState.wordIndex &&
          letterIndex === typeboxState.letterIndex
        );
      });
      if (duplicateIncorrect) return;
      setTypeboxState({
        ...typeboxState,
        incorrects: [...typeboxState.incorrects, [typeboxState.wordIndex, typeboxState.letterIndex]]
      });

      console.log({
        ...typeboxState,
        incorrects: [...typeboxState.incorrects, [typeboxState.wordIndex, typeboxState.letterIndex]]
      })
    }
  }, [lessonWordList, typeboxState, currentLesson]);

  const handleClickRestart = () => {
    setLessonResult({
      show: false,
      success: false,
      message: null
    });
  };

  const handleChangeLesson = (requestedLessonNumber) => {
    if (isLessonInProgress) return;
    if (lessonDataRef?.current?.[requestedLessonNumber]?.unlocked) {
      handleClickRestart();
      setCurrentLesson(requestedLessonNumber);
      localStorage.setItem('currentLesson', requestedLessonNumber)
    } else {
      alert('Invalid lesson number')
    }
  };

  useEffect(() => {
    // TODO: cache the wordList
    fetch('/Harry-Potter-1-Sorcerer\'s-Stone.txt', { cache: 'force-cache' })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(text => {
        setRawText(text);
      })
      .catch(error => console.error('Error:', error))
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key.length === 1) {
        if (!isLessonInProgress) {
          const totalLetters = lessonWordList.reduce((acc, word) => acc + word.length, 0);
          totalLettersRef.current = totalLetters;
          handlerCountDown(totalLetters);
          setIsLessonInProgress(true);
        }
        handleKeyDown(e.key);
        e.preventDefault();
      }
    };
    return () => {
      document.onkeydown = null;
    };
  }, [handleKeyDown, handlerCountDown, isLessonInProgress, lessonWordList]);


  useEffect(() => {
    if (!rawText.length) {
      setWordList([]);
    } else {
      let words = extractWords(rawText);
      sessionStorage.setItem('wordList', JSON.stringify(words));
      setWordList(words);
    }
  }, [rawText]);

  useEffect(() => {
    const currentLessonData = lessonDataRef?.current?.[currentLesson];
    if (currentLessonData.wordList) {
      console.log('cached currentLessonData.wordList', currentLessonData.wordList);
      return setLessonWordList(currentLessonData.wordList);
    }

    const letters = currentLessonData?.letters;
    if (!letters) {
      return setLessonResult({
        show: true,
        success: false,
        message: 'Invalid lesson data'
      });
    };

    const filteredWords = wordList.filter(word => {
      return word.split('').every(char => letters.includes(char));
    });
    setLessonWordList(filteredWords);
    currentLessonData.wordList = filteredWords;
    localStorage.setItem('lessonData', JSON.stringify(lessonDataRef.current));
  }, [currentLesson, wordList]);

  if (lessonResult.show) {
    return (
      <div className="typeboxContainer">
        <h2>Lesson {currentLesson}</h2>
        <p>{lessonResult.success ? 'Lesson passed' : lessonResult.message || 'Try again!'}</p>

        <div className="typebox-results-buttons">
          {
            lessonDataRef?.current?.[currentLesson - 1]?.unlocked &&
            (
              <button onClick={() => handleChangeLesson(currentLesson - 1)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M20.24 7.22005V16.7901C20.24 18.7501 18.11 19.98 16.41 19L12.26 16.61L8.10996 14.21C6.40996 13.23 6.40996 10.78 8.10996 9.80004L12.26 7.40004L16.41 5.01006C18.11 4.03006 20.24 5.25005 20.24 7.22005Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M3.76001 18.1801V5.82007" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </g>
                </svg>
              </button>
            )
          }

          <button id="restart-button" onClick={() => handleClickRestart()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
              <path d="M20 4v5h-5" />
            </svg>
          </button>

          {
            lessonDataRef?.current?.[currentLesson + 1]?.unlocked &&
            (
              <button onClick={() => handleChangeLesson(currentLesson + 1)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M3.76001 7.22005V16.7901C3.76001 18.7501 5.89 19.98 7.59 19L11.74 16.61L15.89 14.21C17.59 13.23 17.59 10.78 15.89 9.80004L11.74 7.40004L7.59 5.01006C5.89 4.03006 3.76001 5.25005 3.76001 7.22005Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M20.24 18.1801V5.82007" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </g>
                </svg>
              </button>
            )
          }
        </div>
      </div>
    );
  }

  return (
    <div className="typeboxContainer">
      <div className="lessonInfo">
        <h2>Lesson {currentLesson}</h2>
      </div>


      <div className="typebox">
        {lessonWordList && lessonWordList.map((word, wordIndex) => {
          return (
            <Word
              key={word + wordIndex}
              word={word}
              wordIndex={wordIndex}
              typeboxState={typeboxState}
            />)
        })}
      </div>
      {
        isLessonInProgress && <div>
          {secondsLeft}s
        </div>
      }
    </div>
  );
};


