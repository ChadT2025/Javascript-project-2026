// Connecting Firebase database
import { db, auth } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const words = ["JAVASCRIPT", "PROGRAMMING", "DEVELOPER", "WEBSITE", "CODE"];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Current game state
let chosenWord = "";
let guessedLetters = [];
const maxGuesses = 6;
let wrongGuesses = 0;

// The logged in user and their win and loss counters
let currentUser = null;
let wins = 0;
let losses = 0;

const wordDisplay = document.querySelector("#wordDisplay");
const message = document.querySelector("#message");
const keyboard = document.querySelector("#keyboard");
const resetBtn = document.querySelector("#resetBtn");
const hangmanImg = document.querySelector("#hangmanImg");
const statsDisplay = document.querySelector("#statsDisplay");

// Starts or resets the game with a random word
function initGame() {
  wrongGuesses = 0;
  guessedLetters = [];
  chosenWord = words[Math.floor(Math.random() * words.length)];

  resetBtn.style.display = "none";
  message.innerText = "Guesses Left: " + maxGuesses;
  hangmanImg.src = "../Images/hangman_0.png";

  createKeyboard();
  updateDisplay();
}

// Shows guessed letters and _ for missing letters
function updateDisplay() {
  let displayText = "";

  for (let i = 0; i < chosenWord.length; i++) {
    if (guessedLetters.includes(chosenWord[i])) {
      displayText = displayText + chosenWord[i] + " ";
    } else {
      displayText = displayText + "_ ";
    }
  }

  wordDisplay.innerText = displayText;

  // No blanks left means the player found every letter
  if (!displayText.includes("_")) {
    message.innerText = "You Win! Brilliant Job!";
    endGame();
    saveResult("win");
  }
}

// Builds the a-z buttons
function createKeyboard() {
  let keyboardHTML = "";

  for (let i = 0; i < alphabet.length; i++) {
    keyboardHTML =
      keyboardHTML + '<button class="letter-btn">' + alphabet[i] + "</button>";
  }

  keyboard.innerHTML = keyboardHTML;

  const buttons = document.querySelectorAll("#keyboard button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", handleGuess);
  }
}

// Checks the guess, if wrong it changes to the next hangman png
function handleGuess() {
  // this is the button that was clicked
  const letter = this.innerText;
  this.disabled = true;
  guessedLetters.push(letter);

  if (!chosenWord.includes(letter)) {
    wrongGuesses = wrongGuesses + 1;
    message.innerText = "Guesses Left: " + (maxGuesses - wrongGuesses);
    hangmanImg.src = "../Images/hangman_" + wrongGuesses + ".png";
  }

  updateDisplay();

  if (wrongGuesses === maxGuesses) {
    message.innerText = "Game Over! The word was: " + chosenWord;
    endGame();
    saveResult("loss");
  }
}

// Locks every button and shows the reset button
function endGame() {
  const buttons = document.querySelectorAll("#keyboard button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }

  resetBtn.style.display = "inline-block";
}

// Shows the win and loss counters on the page
function showStats() {
  statsDisplay.innerText = "Wins: " + wins + " | Losses: " + losses;
}

// Gets this user's wins and losses from firebase
async function loadStats() {
  const statsSnap = await getDoc(doc(db, "hangmanStats", currentUser.uid));

  // A new player has no document yet, so they stay on 0 and 0
  if (statsSnap.exists()) {
    wins = statsSnap.data().wins;
    losses = statsSnap.data().losses;
  }

  showStats();
}

// Adds one win or loss, shows it, and saves it to firebase
async function saveResult(result) {
  // Not logged in yet, so there is nowhere to save
  if (currentUser === null) {
    return;
  }

  if (result === "win") {
    wins = wins + 1;
  } else {
    losses = losses + 1;
  }

  showStats();

  await setDoc(doc(db, "hangmanStats", currentUser.uid), {
    wins: wins,
    losses: losses,
  });
}

// Lets the HTML button call this function
window.initGame = initGame;

// Runs when we find out if someone is logged in
function handleAuthChange(user) {
  if (user) {
    currentUser = user;
    loadStats();
  } else {
    window.location.href = "../Student-Portal/learner-login.html";
  }
}

onAuthStateChanged(auth, handleAuthChange);

initGame();
