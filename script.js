import { allWords } from "./wordsList.js";

const startTime = Date.now();
const timer = document.createElement("div");
timer.textContent = "0";
const wpmDisplay = document.createElement("div");
wpmDisplay.textContent = "M/Mins: 0";
document.body.appendChild(wpmDisplay);
let correctWords = 0;
let globalWordsPerMinutes;

let intervalTimer = setInterval(() => {
  const timeElapsedSeconds = (Date.now() - startTime) / 1000;
  timer.textContent = "Temps écoulé : " + timeElapsedSeconds.toFixed(1) + "s";

  const elapsedTimeInMinutes = timeElapsedSeconds / 60;
  const wordsPerMinutes = correctWords / elapsedTimeInMinutes;
  globalWordsPerMinutes = wordsPerMinutes.toFixed(1);
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

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}
let error = 0;
let errorNumber = document.createElement("div");
errorNumber.innerText = "Nombre d'erreur : " + error;
document.body.appendChild(errorNumber);

const userInput = document.getElementById("word-user");
userInput.focus();
let i = 0;

const firstWord = document.querySelector(`#word0`);
firstWord.style.color = "blue";
firstWord.style.fontWeight = "bold";

userInput.addEventListener("keypress", (event) => {
  if (event.code === "Enter" || event.code === "Space") {
    const wordElement = document.querySelector(`#word${i}`);
    const errorSound = document.getElementById("errorSound");
    const validSound = document.getElementById("validSound");
    if (event.code === "Space") {
      event.preventDefault();
    }
    if (userInput.value === wordElement.textContent) {
      wordElement.style.color = "green";
      wordElement.style.textDecoration = "line-through";
      wordElement.style.fontWeight = "normal";
      playSound(validSound);
      i++;
      correctWords++;
      if (i < 10) {
        const highlightedWord = document.querySelector(`#word${i}`);
        highlightedWord.style.color = "blue";
        highlightedWord.style.fontWeight = "bold";
      }
    } else {
      wordElement.style.color = "red";
      error++;
      errorNumber.innerText = "Nombre d'erreur(s) : " + error;
      playSound(errorSound);
      userInput.value = null;
    }
    userInput.value = null;
    if (i === 10) {
      clearInterval(intervalTimer);
      const timeElapsedSeconds = (Date.now() - startTime) / 1000;
      const elapsedTimeInMinutes = timeElapsedSeconds / 60;
      globalWordsPerMinutes = (correctWords / elapsedTimeInMinutes).toFixed(1);
      wpmDisplay.textContent = `M/Mins : ${globalWordsPerMinutes}`;
      userInput.disabled = true;
      userInput.placeholder = "Fini !";
      let scoreToStore = displayScore();
      storeScore(scoreToStore);
      displayScoreboard();
    }
  }
});

function displayScore() {
  let pointsFinaux = globalWordsPerMinutes * 10 - error * 5;
  let score =
    "Score : Mots/mins : " +
    globalWordsPerMinutes +
    ", nombre d'erreurs : " +
    error +
    " Score total = " +
    pointsFinaux;
  return score;
}

function storeScore(scoreToStore) {
  let scores = JSON.parse(localStorage.getItem("Scores")) || [];
  console.log(scores[0]);
  // Add the new score to the beginning of the array
  scores.unshift(scoreToStore);

  // Ensure only the last five scores are kept
  scores = scores.slice(0, 5);

  // Save the updated scores array back to localStorage
  localStorage.setItem("Scores", JSON.stringify(scores));
}

function displayScoreboard() {
  let scores = JSON.parse(localStorage.getItem("Scores")) || [];
  let scoreboard = document.getElementById("scoreboard");
  console.table(scores);

  // If the scoreboard does not exist, create it
  if (!scoreboard) {
    scoreboard = document.createElement("div");
    scoreboard.id = "scoreboard";
    document.body.appendChild(scoreboard);
  }

  // Clear the existing scoreboard content
  scoreboard.innerHTML = "<h3>Scoreboard</h3>";

  // Add each score to the scoreboard
  scores.forEach((score, index) => {
    let scoreElement = document.createElement("div");
    scoreElement.textContent = `#${index + 1}: ${score}`;
    scoreboard.appendChild(scoreElement);
  });
}

document.addEventListener("DOMContentLoaded", displayScoreboard);
