const wordEl = document.getElementById('word');
const popup = document.getElementById('popup-container');
const finalMassage = document.getElementById('final-massage');
const playAgainBtn = document.getElementById('play-again');
const notification = document.getElementById('notification-container');
const wrongLetterEl = document.getElementById('wrong-notification');

const figureParts = document.querySelectorAll('.figure-part');

let isGameEnd = false;
let selectedWord = [];
const correctLetters = [];
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
    await sleep(2000);
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
    finalMassage.innerHTML = `<p>You won! 😎<p>
    <span>New game will start 2s later after click 'play again'</span>
    `;
    isGameEnd = true;
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
    if (index < errors) {
      console.log(part);
      part.style.display = 'block';
      if (errors > 5) {
        popup.style.display = 'flex';
        finalMassage.innerHTML = `<p>You lose! 😔<p>
        <span>New game will start 2s later after click 'play again'</span>
        `;
        isGameEnd = true;
      }
    } else {
      part.style.display = 'none';
    }
  });
}

function sameKey() {
  notification.style.bottom = '0';
  setTimeout(() => {
    notification.style.bottom = '-50px';
  }, 2000);
}

window.addEventListener('keydown', (e) => {
  const letter = e.key;
  if (!isGameEnd) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      if (selectedWord.toString().includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);
          displayWord();
        } else {
          sameKey();
        }
      }

      if (!selectedWord.toString().includes(letter)) {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);
          wrongLetter();
        } else {
          sameKey();
        }
      }
    }
  }
});

playAgainBtn.addEventListener('click', async () => {
  correctLetters.splice(0);
  selectedWord.splice(0);
  wrongLetters.splice(0);

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => setWord('word', data));

  displayWord();
  wrongLetter();

  //game will start 1.5s later
  await sleep(2000);
  isGameEnd = false;

  popup.style.display = 'none';
  wrongLetterEl.innerHTML = '';
});

displayWord();
