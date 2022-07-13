let questionContainer_DIV = document.querySelector('.quiz-container') as HTMLDivElement;  // quiz screen
let endingContainer_DIV = document.querySelector('.ending-container') as HTMLDivElement;  // ending screen
let question_DIV = document.querySelector('.question') as HTMLDivElement;
let buttonAnswers = document.querySelectorAll<HTMLButtonElement>('.answer');
let questionNumber_p = document.getElementById('question-number') as HTMLParagraphElement;
let gameRound: number = 0; 
let questionNumber: number = 1; 
let allData: QuestionList; 
let correctAnswer: string;
let gamePoints: number = 0; 

// get quiz data
async function getData(): Promise<QuestionList> {
    const API_URL: string = 'https://opentdb.com/api.php?amount=5&type=multiple';
    const response = await fetch(API_URL);
    return await response.json();
}

function useData(data: QuestionList) {
    questionNumber_p.textContent = `Question ${questionNumber}/5`;  // show how many questions there are
    questionNumber++;
    allData = data;  // save data
    const questions = data.results;  // get all questions
    correctAnswer = questions[gameRound].correct_answer;  // save correct answer 
    const answers: string[] = [];                         // save all answers to this list
    question_DIV.innerHTML = questions[gameRound].question;
    answers.push(questions[gameRound].correct_answer);
    answers.push(...questions[gameRound].incorrect_answers);
    shuffle(answers);
    
    let i: number = 0;                 
    buttonAnswers.forEach(answer => {  // display answers
        answer.innerHTML = answers[i];
        i++
    })
}

function shuffle(array: string[]) {         // shuffle answers 
    array.sort(() => Math.random() - 0.5);
}

buttonAnswers.forEach(button => {
    button.addEventListener('click', () => {
        // tsekkaa onko vastaus oikein 
        // sen jälkeen loop uudestaan 
        if(questionNumber === 6) {  // if last question
            questionContainer_DIV.classList.add('hidden');
            endingContainer_DIV.classList.remove('hidden');
            // lisää tavaraa loppu screenii 
            // näytä pisteet
            // play again button
        } else {
            gameRound++;
            main();
        }
        
        
    });
})

// main
function main() {
    // get all data first round
    if(gameRound === 0) {
        let triviaData = getData();
        triviaData.then(function(triviaData) {
            useData(triviaData);
        });
    // other rounds    
    } else {
        useData(allData);
    }
}
main();






// typescript interfaces
interface QuestionList {
    response_code:number;
    results: {
        category: string;
        type: string;
        difficulty: string;
        question: string;
        correct_answer: string;
        incorrect_answers: string[];
    }[];
}






