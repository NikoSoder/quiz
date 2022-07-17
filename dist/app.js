"use strict";
// TODO: 1. lisää niin kun painaa oikeaa vastausta väri muuttu vihreäksi
// ja toiste päin kun väärä vastaus nii punaiseksi.
let questionContainer_DIV = document.querySelector('.quiz-container'); // quiz screen
let endingContainer_DIV = document.querySelector('.ending-container'); // ending screen
let question_DIV = document.querySelector('.question');
let buttonAnswers = document.querySelectorAll('.answer');
let questionNumber_p = document.getElementById('question-number');
let playAgainButton = document.getElementById('play-again-button');
let result_p = document.getElementById('result');
let loaderAnimation = document.querySelector('.loader');
let loadingScreen_DIV = document.querySelector('.loading-screen');
let timer_span = document.getElementById('timer');
let gameRound = 0;
let questionNumber = 1;
let allData;
let correctAnswer;
let gamePoints = 0;
let Interval; // timer for questions
let timer = 10; // timer variable
let questionTimer;
// get quiz data
async function getData() {
    const API_URL = 'https://opentdb.com/api.php?amount=5&type=multiple';
    const response = await fetch(API_URL);
    return await response.json();
}
function useData(data) {
    clearInterval(questionTimer);
    timer = 10;
    timer_span.innerHTML = timer;
    questionTimer = setInterval(startTimer, 1000);
    loadingScreen_DIV.classList.add('hidden');
    loaderAnimation.classList.add('hidden');
    questionContainer_DIV.classList.remove('hidden');
    questionNumber_p.textContent = `Question ${questionNumber}/5`; // show how many questions there are
    questionNumber++;
    allData = data; // save data
    const questions = data.results; // get all questions
    correctAnswer = questions[gameRound].correct_answer; // save correct answer 
    const answers = []; // save all answers to this list
    question_DIV.innerHTML = questions[gameRound].question;
    answers.push(questions[gameRound].correct_answer);
    answers.push(...questions[gameRound].incorrect_answers);
    shuffle(answers);
    let i = 0;
    buttonAnswers.forEach(answer => {
        answer.innerHTML = answers[i];
        i++;
    });
}
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
buttonAnswers.forEach(button => {
    button.addEventListener('click', () => {
        if (questionNumber === 6) { // if last question
            if (button.innerHTML === correctAnswer)
                gamePoints++; // check for correct answer
            endGame();
        }
        else {
            if (button.innerHTML === correctAnswer)
                gamePoints++; // check for correct answer
            gameRound++;
            main();
        }
    });
});
playAgainButton.addEventListener('click', () => {
    endingContainer_DIV.classList.add('hidden');
    loadingScreen_DIV.classList.remove('hidden');
    loaderAnimation.classList.remove('hidden');
    main(); // gameRound is now 0 so it gets new questions
});
function startTimer() {
    if (timer === 0) {
        if (questionNumber === 6) { // if last question then show ending screen
            endGame();
        }
        else { // else show next question
            clearInterval(questionTimer);
            timer = 10;
            main();
        }
    }
    if (timer === 10) {
        timer_span.innerHTML = timer;
    }
    else {
        timer_span.innerHTML = `0${timer}`;
    }
    timer--;
}
function endGame() {
    clearInterval(questionTimer);
    questionContainer_DIV.classList.add('hidden');
    endingContainer_DIV.classList.remove('hidden');
    result_p.textContent = `You got ${gamePoints}/5`;
    gamePoints = 0;
    questionNumber = 1;
    gameRound = 0;
}
// main
function main() {
    // get all data first round
    if (gameRound === 0) {
        let triviaData = getData();
        triviaData.then(function (triviaData) {
            useData(triviaData);
        });
        // other rounds    
    }
    else {
        useData(allData);
    }
}
main();
