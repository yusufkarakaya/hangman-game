const wordEl = document.getElementById('word');
const popup = document.getElementById('popup-container');
const finalMassage = document.getElementById('final-massage');
const playAgainBtn = document.getElementById('play-again');
const notification = document.getElementById('notification-container');
const wrongLetterEl = document.getElementById('wrong-notification');

const figureParts = document.querySelectorAll('.figure-part');

let didWeGetWord = false;
let selectedWord = [];
let correctLetters = [];
const wrongLetters = [];

const apiUrl = 'https://random-word-api.herokuapp.com/word';
setWord = (key, value) => localStorage.setItem(key, JSON.stringify(value));
getWord = (key) =>
  localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : '';
delWord = (key) => localStorage.removeItem(key);

(async function () {
  if (!getWord('word')) {
    await fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setWord('word', data));
  }
})();

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function displayWord() {
  selectedWord = getWord('word');

  if (selectedWord.toString() === '') {
    await sleep(1500);
    await displayWord();
  }

  wordEl.innerHTML = `
          ${selectedWord
            .toString()
            .split('')
            .map(
              (letter) =>
                `
                <span class="letter">
                  ${correctLetters.includes(letter) ? letter : ''}
                </span>
              `
            )
            .join('')}
        `;

  const innerWord = wordEl.innerText.replace(/\n/g, '');

  if (selectedWord.toString() === innerWord) {
    popup.style.display = 'flex';
    finalMassage.innerText = 'you won!😎';
  }
}

function wrongLetter() {
  const errors = wrongLetters.length;

  wrongLetterEl.innerHTML = `
  <p>Wrong</p>

  ${wrongLetters.map(
    (letter) =>
      `
   <span>${letter} </span>
   `
  )}
`;

  figureParts.forEach((part, index) => {
    console.log(index, errors);
    if (index < errors) {
      console.log(part);
      part.style.display = 'block';
      if (errors > 5) {
        popup.style.display = 'flex';
        finalMassage.innerText = 'you lose😔';
      }
    } else {
      part.style.display = 'none';
    }
  });
}

window.addEventListener('keydown', (e) => {
  const errors = wrongLetters.length;
  const letter = e.key;
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    if (selectedWord.toString().includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      }
    }

    if (!selectedWord.toString().includes(letter)) {
      wrongLetters.push(letter);
      wrongLetter();
    }
  }
});

displayWord();
