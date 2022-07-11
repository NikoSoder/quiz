let question_DIV = document.querySelector('.question') as HTMLDivElement;
let buttonAnswers = document.querySelectorAll<HTMLButtonElement>('.answer');
const nextQuestionButton = document.getElementById('next-question') as HTMLButtonElement;
let gameRound: number = 0;

// get quiz data
async function getData(): Promise<QuestionList> {
    const API_URL: string = 'https://opentdb.com/api.php?amount=5&type=multiple';
    const response = await fetch(API_URL);
    return await response.json();
}

function useData(data: QuestionList) {
    const questions = data.results;  // get all questions
    const correctAnswer: string = questions[gameRound].correct_answer;  // save correct answer 
    const answers: string[] = [];                                       // save all answers to this list
    console.log(questions);
    question_DIV.innerHTML = questions[gameRound].question;
    answers.push(questions[gameRound].correct_answer);
    answers.push(...questions[gameRound].incorrect_answers);
    
    let i: number = 0;                 // this is for answers
    buttonAnswers.forEach(answer => {  // display answers
        answer.innerHTML = answers[i];
        i++
        
    })
    
    buttonAnswers.forEach(button => {
        button.addEventListener('click', () => {
            // tsekkaa onko vastaus oikein 
            // sen jälkeen loop uudestaan 
            // gameRound++;
            main();
        });
    })
    
}

// main
function main() {
    if(gameRound === 0) {
        const triviaData = getData();
        triviaData.then(function(triviaData) {
            useData(triviaData);
        });
    } else {
        useData(triviaData);  // FIX
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






