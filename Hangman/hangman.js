const words = ["JAVASCRIPT", "PROGRAMMING", "DEVELOPER", "WEBSITE", "CODE"];

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// Current game state
let chosenWord = "";
let guessedLetters = [];
const maxGuesses = 6;
let wrongGuesses = 0;
let gameOver = false;

const wordDisplay = document.querySelector("#wordDisplay");
const message = document.querySelector("#message");
const keyboard = document.querySelector("#keyboard");
const resetBtn = document.querySelector("#resetBtn");
const hangmanImg = document.querySelector("#hangmanImg");

// This function starts or resets the game with a random word using math.random
function initGame() {
  wrongGuesses = 0;
  guessedLetters = [];
  gameOver = false;

  const randomIndex = Math.floor(Math.random() * words.length);
  chosenWord = words[randomIndex];

  resetBtn.style.display = "none";
  message.innerText = "Guesses Left: " + maxGuesses;
  hangmanImg.src = "../Images/hangman_0.png";

  createKeyboard();
  updateDisplay();
}

// Checks if an item is in a list (or word)
function contains(list, item) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === item) {
      return true;
    }
  }
  return false;
}

// This functions shows guessed letters and _ for missing letters
function updateDisplay() {
  let displayText = "";
  let blanksLeft = 0;

  for (let i = 0; i < chosenWord.length; i++) {
    const letter = chosenWord[i];

    if (i > 0) {
      displayText = displayText + " ";
    }

    if (contains(guessedLetters, letter)) {
      displayText = displayText + letter;
    } else {
      displayText = displayText + "_";
      blanksLeft = blanksLeft + 1;
    }
  }

  wordDisplay.innerText = displayText;
  checkGameStatus(blanksLeft);
}

// This function builds a-z buttons
function createKeyboard() {
  let keyboardHTML = "";

  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];

    if (gameOver === true || contains(guessedLetters, letter) === true) {
      keyboardHTML =
        keyboardHTML +
        '<button class="letter-btn" disabled>' +
        letter +
        "</button>";
    } else {
      keyboardHTML =
        keyboardHTML + '<button class="letter-btn">' + letter + "</button>";
    }
  }

  keyboard.innerHTML = keyboardHTML;

  // Buttons are rebuilt after each game, so click listeners must be re-added
  const buttons = document.querySelectorAll(".letter-btn");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", handleLetterClick);
  }
}

function handleLetterClick() {
  // this refers is the button that was clicked
  const letter = this.innerText;
  handleGuess(letter);
}

// This Function checks the guess if correct it reveals the letter, if wrong changes to the next hangman png
function handleGuess(letter) {
  guessedLetters.push(letter);
  createKeyboard();

  if (contains(chosenWord, letter) === true) {
    updateDisplay();
  } else {
    wrongGuesses = wrongGuesses + 1;
    message.innerText = "Guesses Left: " + (maxGuesses - wrongGuesses);
    hangmanImg.src = "../Images/hangman_" + wrongGuesses + ".png";
    updateDisplay();
  }
}

// Win and loss conditions
function checkGameStatus(blanksLeft) {
  if (blanksLeft === 0) {
    message.innerText = "You Win! Brilliant Job!";
    disableAllButtons();
  } else if (wrongGuesses >= maxGuesses) {
    message.innerText = "Game Over! The word was: " + chosenWord;
    disableAllButtons();
  }
}

// This function ends the game and shows the reset button
function disableAllButtons() {
  gameOver = true;
  createKeyboard();
  resetBtn.style.display = "inline-block";
}

initGame();
