import getQuoteFromKanye from './getKanyeQuote.js';
import { 
  checkForHighScore, 
  deleteLowestScore, 
  addHighScore } from './checkAndAddHighScore.js';

let streakCount = 0;
let quoteObject;
let toggle = true;

const buttonWest = document.getElementById('west');
const buttonEast = document.getElementById('east');
const quote = document.getElementById('quote');
const attribution = document.getElementById('attribution');
const nextQuote = document.getElementById('next-quote');
const streakDisplay = document.getElementById('streak');
const fullAttribution = document.getElementById('full-attrib');
const highScoreForm = document.getElementById('highscore-form');
const submit = document.getElementById('submit-score');

const winSound = new Audio('../assets/yeah.wav');
const loseSound = new Audio('../assets/naahhhhhhh.wav');

async function onRender() {
  await getQuoteFromKanye()
    .then(res => {
      quoteObject = res;
      quote.textContent = res.text;
    });
}

onRender();

function makeGuess(kanyeGuessed) {
  attribution.textContent = quoteObject.source;

  toggle = false;
  buttonWest.classList.remove('normal');
  buttonEast.classList.remove('normal');
  streakDisplay.classList.remove('normal-points');

  if(quoteObject.source === 'West') {
    buttonWest.classList.add('correct');
    buttonEast.classList.add('wrong');
  } else if(quoteObject.source === 'East') {
    buttonEast.classList.add('correct');
    buttonWest.classList.add('wrong');
  }
  if(quoteObject.source === kanyeGuessed) {
    winSound.play();
    streakCount++;
    streakDisplay.classList.add('add-point');
  } else {
    loseSound.play();

    if(checkForHighScore(streakCount)) {
      displayNewHSForm();
      deleteLowestScore();
    }
    streakCount = 0;
    streakDisplay.classList.add('reset-points');
  }
  streakDisplay.textContent = streakCount;
  nextQuote.classList.remove('hidden');
}

function displayNewHSForm() {
  quote.textContent = `GAME OVER
  New Highscore!
  Enter Name:`;

  fullAttribution.classList.add('hidden');
  highScoreForm.classList.remove('hidden');
}

async function getNextQuote() {
  toggle = true;
  attribution.textContent = '????';
  nextQuote.classList.add('hidden');

  streakDisplay.classList.remove('reset-points');
  streakDisplay.classList.remove('add-point');
  streakDisplay.classList.add('normal-points');
  buttonWest.classList.remove('correct');
  buttonEast.classList.remove('correct');
  buttonWest.classList.remove('wrong');
  buttonEast.classList.remove('wrong');
  buttonWest.classList.add('normal');
  buttonEast.classList.add('normal');

  await getQuoteFromKanye()
    .then(res => {
      quoteObject = res;
      quote.textContent = res.text;
    });
}

buttonWest.addEventListener('click', () => {
  if(toggle) {
    makeGuess('West');
  }
});

buttonEast.addEventListener('click', () => {
  if(toggle) {
    makeGuess('East');
  }
});

nextQuote.addEventListener('click', () => {
  getNextQuote();
});

submit.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const name = formData.get('name');
  addHighScore(name, streakCount);
});
