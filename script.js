import { allWords } from "./wordsList.js";

const scoreDiv = document.querySelector(".actual-score");
let startTime = Date.now();
const timer = document.createElement("div");
timer.textContent = "0";
const wpmDisplay = document.createElement("div");
scoreDiv.appendChild(timer);
wpmDisplay.textContent = "M/Mins: 0";
scoreDiv.appendChild(wpmDisplay);
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

function resetTimer() {
  clearInterval(intervalTimer);
  startTime = Date.now();
  correctWords = 0;
  globalWordsPerMinutes = 0;
  timer.textContent = "Temps écoulé : 0s";
  wpmDisplay.textContent = "M/Mins : 0";
  intervalTimer = setInterval(() => {
    const timeElapsedSeconds = (Date.now() - startTime) / 1000;
    timer.textContent = "Temps écoulé : " + timeElapsedSeconds.toFixed(1) + "s";
    const elapsedTimeInMinutes = timeElapsedSeconds / 60;
    const wordsPerMinutes = correctWords / elapsedTimeInMinutes;
    globalWordsPerMinutes = wordsPerMinutes.toFixed(1);
    wpmDisplay.textContent = `M/Mins : ${wordsPerMinutes.toFixed(1)}`;
  }, 100);
}

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

let randomWords = shuffleWords(allWords);

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

export function resetShuffleAndReplay() {
  i = 0;
  error = 0;
  document.querySelector(".words-container").innerHTML = "";
  randomWords = shuffleWords(allWords);
  showRandomWords(randomWords);
  resetTimer();
  lightenFirstWord();
  userInput.disabled = false;
  userInput.focus();
  userInput.placeholder = "";
  userInput.value = "";
  errorNumber.innerText = "Nombre d'erreur : " + error;
}

document.querySelector("#replay").addEventListener("click", () => {
  userInput.removeEventListener;
  resetShuffleAndReplay();
});

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}
let error = 0;
let errorNumber = document.createElement("div");
errorNumber.innerText = "Nombre d'erreur : " + error;
scoreDiv.appendChild(errorNumber);

function lightenFirstWord() {
  const firstWord = document.querySelector(`#word0`);
  firstWord.style.color = "blue";
  firstWord.style.fontWeight = "bold";
}

const userInput = document.getElementById("word-user");
userInput.focus();
let userName = "";

let i = 0;
lightenFirstWord();
userInput.addEventListener("keypress", (event) => {
  if (event.code === "Enter") {
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
      userName = prompt("Nom du joueur :");
      let scoreToStore = displayScore();
      storeScore(scoreToStore);
      displayScoreboard();
    }
  }
});

function displayScore() {
  let pointsFinaux = (globalWordsPerMinutes * 10 - error * 5) / 10;
  let score = new Object();
  score.user = userName;
  score.wpm = globalWordsPerMinutes;
  score.nberror = error;
  score.fs = pointsFinaux;
  return score;
}

function storeScore(scoreToStore) {
  let scores = JSON.parse(localStorage.getItem("Scores")) || [];
  scores.unshift(scoreToStore);
  if (scores.length > 5) {
    scores.pop();
  }
  localStorage.setItem("Scores", JSON.stringify(scores));
}

function displayScoreboard() {
  let scores = JSON.parse(localStorage.getItem("Scores")) || [];
  let tableBody = document.querySelector(".scoreboard-table table tbody");

  if (!tableBody) {
    tableBody = document.createElement("tbody");
    document.querySelector(".scoreboard-table table").appendChild(tableBody);
  } else {
    tableBody.innerHTML = "";
  }

  scores.forEach((score, index) => {
    let row = tableBody.insertRow();
    let cellOne = row.insertCell(0);
    let cellTwo = row.insertCell(1);
    let cellThree = row.insertCell(2);
    let cellFour = row.insertCell(3);

    cellOne.textContent = score.user;
    cellTwo.textContent = score.wpm;
    cellThree.textContent = score.nberror;
    cellFour.textContent = score.fs;
  });
}

document.addEventListener("DOMContentLoaded", displayScoreboard);
