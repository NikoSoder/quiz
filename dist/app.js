"use strict";
const API_URL = 'https://opentdb.com/api.php?amount=5&type=multiple';
// get quiz data
async function getData() {
    const response = await fetch(API_URL);
    return await response.json();
}
function useData(data) {
    const questions = data.results; // get all questions
    console.log(questions);
}
// main
function main() {
    const triviaData = getData();
    triviaData.then(function (triviaData) {
        useData(triviaData);
    });
}
main();
