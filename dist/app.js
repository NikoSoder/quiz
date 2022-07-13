"use strict";
let questionContainer_DIV = document.querySelector('.quiz-container'); // quiz screen
let endingContainer_DIV = document.querySelector('.ending-container'); // ending screen
let question_DIV = document.querySelector('.question');
let buttonAnswers = document.querySelectorAll('.answer');
let questionNumber_p = document.getElementById('question-number');
let gameRound = 0;
let questionNumber = 1;
let allData;
let correctAnswer;
let gamePoints = 0;
// get quiz data
async function getData() {
    const API_URL = 'https://opentdb.com/api.php?amount=5&type=multiple';
    const response = await fetch(API_URL);
    return await response.json();
}
function useData(data) {
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
        // tsekkaa onko vastaus oikein 
        // sen jälkeen loop uudestaan 
        if (questionNumber === 6) { // if last question
            questionContainer_DIV.classList.add('hidden');
            endingContainer_DIV.classList.remove('hidden');
            // lisää tavaraa loppu screenii 
            // näytä pisteet
            // play again button
        }
        else {
            gameRound++;
            main();
        }
    });
});
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
