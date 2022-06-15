const wordEl = document.getElementById('word');
const popup = document.getElementById('popup-container');
const finalMassage = document.getElementById('final-massage');
const playAgainBtn = document.getElementById('play-again');
const notification = document.getElementById('notification-container');
const wrongLetterEl = document.getElementById('wrong-notification');

const figureParts = document.querySelectorAll('.figure-part');

const words = ['application', 'wizard', 'javascript', 'california'];

let selectedWord = words[Math.floor(Math.random() * words.length)];
const correctLetters = [];
const wrongLetters = [];

//Show hide words
function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        (letter) =>
          `<span class="letter">
        ${correctLetters.includes(letter) ? letter : ''}
        </span>`
      )
      .join('')}
  `;

  const innerWord = wordEl.innerText.replace(/\n/g, '');
  if (innerWord === selectedWord) {
    popup.style.display = 'flex';
    finalMassage.innerText = 'You won! 😎';
  }
}

//Show wrong letters
function wrongLetter() {
  wrongLetterEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
      if (errors > 5) {
        popup.style.display = 'flex';
        finalMassage.innerText = 'You lose 😔';
      }
    } else {
      part.style.display = 'none';
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 95) {
    if (!correctLetters.includes(e.key)) {
      correctLetters.push(e.key);
      displayWord();
    } else {
      notification.style.bottom = '0';
      setTimeout(() => {
        notification.style.bottom = '-50px';
      }, 2000);
    }

    if (!selectedWord.includes(e.key)) {
      if (!wrongLetters.includes(e.key)) {
        wrongLetters.push(e.key);
        wrongLetter();
      }
    }
  }
});

playAgainBtn.addEventListener('click', () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  popup.style.display = 'none';
  finalMassage.innerText = '';

  wrongLetter();

  displayWord();
});

displayWord();
