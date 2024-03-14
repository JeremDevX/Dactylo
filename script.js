import { allWords } from "./wordsList.js";

const startTime = Date.now();
const timer = document.createElement("div");
timer.textContent = "0";
const wpmDisplay = document.createElement("div");
wpmDisplay.textContent = "M/Mins: 0";
document.body.appendChild(wpmDisplay);
let correctWords = 0;

let intervalTimer = setInterval(() => {
  const timeElapsedSeconds = (Date.now() - startTime) / 1000;
  timer.textContent = "Temps écoulé : " + timeElapsedSeconds.toFixed(1) + "s";

  const elapsedTimeInMinutes = timeElapsedSeconds / 60;
  const wordsPerMinutes = correctWords / elapsedTimeInMinutes;

  wpmDisplay.textContent = `M/Mins : ${wordsPerMinutes.toFixed(1)}`;
}, 100);

document.body.appendChild(timer);

const shuffle = (array) => {
  const copy = [...array];
  copy.sort(() => Math.random() - 0.5);
  return copy;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffleWords(allWords) {
  const shuffledArray = shuffle(allWords);
  const randInt = getRandomInt(allWords.length - 10);
  const tenRandomWords = shuffledArray.slice(randInt, randInt + 10);
  return tenRandomWords;
}

const randomWords = shuffleWords(allWords);

function showRandomWords(randomWords) {
  const addWords = document.querySelector(".words-container");
  randomWords.forEach((word, index) => {
    const addWordOnScreen = document.createElement("div");
    addWordOnScreen.textContent = word;
    addWordOnScreen.id = `word${index}`;
    addWords.appendChild(addWordOnScreen);
  });
}

showRandomWords(randomWords);

let error = 0;
let errorNumber = document.createElement("div");
errorNumber.innerText = "Number of errors : " + error;
document.body.appendChild(errorNumber);

const userInput = document.getElementById("word-user");
userInput.focus();
let i = 0;

const firstWord = document.querySelector(`#word0`);
firstWord.style.color = "blue";

userInput.addEventListener("keypress", (event) => {
  if (event.code === "Enter") {
    const wordElement = document.querySelector(`#word${i}`);
    if (userInput.value === wordElement.textContent) {
      wordElement.style.color = "green";
      wordElement.style.textDecoration = "line-through";
      const validSound = document.getElementById("validSound");
      validSound.pause();
      validSound.currentTime = 0;
      validSound.play();
      i++;
      correctWords++;
      if (i < 10) {
        const highlightedWord = document.querySelector(`#word${i}`);
        highlightedWord.style.color = "blue";
      }
    } else {
      wordElement.style.color = "red";
      error++;
      errorNumber.innerText = "Nombre d'erreurs : " + error;
      const errorSound = document.getElementById("errorSound");
      errorSound.pause();
      errorSound.currentTime = 0;
      errorSound.play();
    }
    userInput.value = "";
    if (i === 10) {
      clearInterval(intervalTimer);
      userInput.disabled = true;
    }
  }
});
