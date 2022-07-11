"use strict";
let question_DIV = document.querySelector('.question');
let buttonAnswers = document.querySelectorAll('.answer');
const nextQuestionButton = document.getElementById('next-question');
let gameRound = 0;
// get quiz data
async function getData() {
    const API_URL = 'https://opentdb.com/api.php?amount=5&type=multiple';
    const response = await fetch(API_URL);
    return await response.json();
}
function useData(data) {
    const questions = data.results; // get all questions
    const correctAnswer = questions[gameRound].correct_answer; // save correct answer 
    const answers = []; // save all answers to this list
    console.log(questions);
    question_DIV.innerHTML = questions[gameRound].question;
    answers.push(questions[gameRound].correct_answer);
    answers.push(...questions[gameRound].incorrect_answers);
    let i = 0; // this is for answers
    buttonAnswers.forEach(answer => {
        answer.innerHTML = answers[i];
        i++;
    });
    buttonAnswers.forEach(button => {
        button.addEventListener('click', () => {
            // tsekkaa onko vastaus oikein 
            // sen jälkeen loop uudestaan 
            // gameRound++;
            main();
        });
    });
}
// main
function main() {
    if (gameRound === 0) {
        const triviaData = getData();
        triviaData.then(function (triviaData) {
            useData(triviaData);
        });
    }
    else {
        useData(triviaData); // FIX
    }
}
main();
