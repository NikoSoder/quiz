// TODO: korjaa jos vastaa kun yksi sekuntti aikaa

let questionContainer_DIV = document.querySelector('.quiz-container') as HTMLDivElement;  // quiz screen
let endingContainer_DIV = document.querySelector('.ending-container') as HTMLDivElement;  // ending screen
let question_DIV = document.querySelector('.question') as HTMLDivElement;
let buttonAnswers = document.querySelectorAll<HTMLButtonElement>('.answer');
let questionNumber_p = document.getElementById('question-number') as HTMLParagraphElement;
let playAgainButton = document.getElementById('play-again-button') as HTMLButtonElement;
let result_p = document.getElementById('result') as HTMLParagraphElement;
let loaderAnimation = document.querySelector('.loader') as HTMLDivElement;
let loadingScreen_DIV = document.querySelector('.loading-screen') as HTMLDivElement;
let timer_span = document.getElementById('timer') as HTMLSpanElement;
let gameRound: number = 0; 
let questionNumber: number = 1; 
let allData: QuestionList; 
let correctAnswer: string;
let gamePoints: number = 0; 
let Interval: number; // timer for questions
let timer: any = 10; // timer variable
let questionTimer: number;
let buttonClicked: boolean = false;

// get quiz data
async function getData(): Promise<QuestionList> {
    const API_URL: string = 'https://opentdb.com/api.php?amount=5&type=multiple';
    const response = await fetch(API_URL);
    return await response.json();
}

function useData(data: QuestionList) {
    buttonClicked = false;
    removeClass();
    clearInterval(questionTimer);
    timer = 10;
    timer_span.innerHTML = timer;
    questionTimer = setInterval(startQuizTimer, 1000);
    loadingScreen_DIV.classList.add('hidden');
    loaderAnimation.classList.add('hidden');
    questionContainer_DIV.classList.remove('hidden');
    

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

function removeClass() {  // remove background colors from answers 
    buttonAnswers.forEach(answer => {
        answer.classList.remove('right-answer', 'wrong-answer');
    })
}

function shuffle(array: string[]) {         // shuffle answers 
    array.sort(() => Math.random() - 0.5);
}

buttonAnswers.forEach(button => {
    button.addEventListener('click', () => {
        if(buttonClicked) return;  // if button already clicked then return

        buttonClicked = true;
        if(questionNumber === 6) {  // if last question
            if(button.innerHTML === correctAnswer) {  // check for correct answer
                button.classList.add('right-answer');
                gamePoints++;
                const showEndingScreen = setTimeout(endQuiz, 1500);  
            } else {  // if wrong answer
                button.classList.add('wrong-answer');
                //endQuiz();
                const showEndingScreen = setTimeout(endQuiz, 1500);
            }
            
            
        } else {  // if not last question
            if(button.innerHTML === correctAnswer) {  // check for correct answer
                button.classList.add('right-answer');
                gamePoints++; 
                gameRound++;
                const showNextQuestion = setTimeout(main, 1500);
            } else {  // if wrong answer 
                button.classList.add('wrong-answer');
                gameRound++;
                const showNextQuestion = setTimeout(main, 1500);
                //main();
            }
        }
    });
})

playAgainButton.addEventListener('click', () => {
    endingContainer_DIV.classList.add('hidden');
    loadingScreen_DIV.classList.remove('hidden');
    loaderAnimation.classList.remove('hidden');
    main(); // gameRound is now 0 so it gets new questions
})

function startQuizTimer() {
    if(timer === 0) {
        if(questionNumber === 6) {  // if last question then show ending screen
            endQuiz();
        } else {                    // else show next question
            clearInterval(questionTimer);
            timer = 10;
            main();
        }
    }
    if(timer === 10) {
        timer_span.innerHTML = timer;
    } else {
        timer_span.innerHTML = `0${timer}`;
    }
    timer--;
}

function endQuiz() {
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






