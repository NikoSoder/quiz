// TODO: 
// 

// 
let startGameContainer_DIV = document.querySelector('.starting-container') as HTMLDivElement; // starting screen
let countdownContainer_Div = document.querySelector('.countdown-container') as HTMLDivElement // countdown screen
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
let startGameButton = document.getElementById('start-game-button') as HTMLButtonElement;
let countdown_p = document.getElementById('countdown') as HTMLParagraphElement;
let timerBar_Div = document.querySelector('.timer-bar') as HTMLDivElement;
let gameRound = 0; 
let questionNumber = 1; 
let allData: QuestionList; 
let correctAnswer: string;
let gamePoints = 0; 
//let Interval: number; // timer for questions
let timer: any = 15; // question timer 
let questionTimer: number;
let buttonClicked: boolean = false;
let countdownTimer: any = 3;
let startGameTimer: number;


startGameButton.addEventListener('click', () => {
    startGameTimer = setInterval(startGameCountdown, 1000);
    startGameContainer_DIV.classList.add('hidden');
    countdownContainer_Div.classList.remove('hidden');
    
})

function startGameCountdown() {
    if(countdownTimer === 0) {
        clearInterval(startGameTimer);
        countdownContainer_Div.classList.add('hidden');
        loadingScreen_DIV.classList.remove('hidden');
        loaderAnimation.classList.remove('hidden');
        main();
    }
    countdown_p.classList.add('countdown');
    countdown_p.textContent = countdownTimer;
    countdownTimer--;
    const removeTimerAnimation = setTimeout(removeAnimation, 800);
}

function removeAnimation() {
    countdown_p.classList.remove('countdown');
}

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
    timer = 15;
    timer_span.innerHTML = timer;
    questionTimer = setInterval(startQuizTimer, 1000);
    timerBar_Div.classList.add('timer-bar-animation');
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
        answer.classList.remove('right-answer', 'wrong-answer', 'show-right-answer');
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
                timerBar_Div.classList.remove('timer-bar-animation');
                gamePoints++;
                const showEndingScreen = setTimeout(endQuiz, 1500);  
            } else {  // if wrong answer
                button.classList.add('wrong-answer');
                timerBar_Div.classList.remove('timer-bar-animation');
                showRightAnswer();
                const showEndingScreen = setTimeout(endQuiz, 1500);
            }
            
        } else {  // if not last question
            if(button.innerHTML === correctAnswer) {  // check for correct answer
                button.classList.add('right-answer');
                timerBar_Div.classList.remove('timer-bar-animation');
                gamePoints++; 
                gameRound++;
                const showNextQuestion = setTimeout(main, 1500);
            } else {  // if wrong answer 
                button.classList.add('wrong-answer');
                timerBar_Div.classList.remove('timer-bar-animation');
                showRightAnswer();
                gameRound++;
                const showNextQuestion = setTimeout(main, 1500);
            }
        }
    });
})

function showRightAnswer() {
    buttonAnswers.forEach(button => {    
        if(button.innerHTML === correctAnswer) button.classList.add('show-right-answer');
    });
}

playAgainButton.addEventListener('click', () => {
    endingContainer_DIV.classList.add('hidden');
    loadingScreen_DIV.classList.remove('hidden');
    loaderAnimation.classList.remove('hidden');
    main(); // gameRound is now 0 so it gets new questions
})

function startQuizTimer() {
    if(buttonClicked) return;  // if user already clicked answer then stop the timer
    if(timer === 0) {
        if(questionNumber === 6) {  // if last question then show ending screen
            clearInterval(questionTimer);
            showRightAnswer();
            const showEndingScreen = setTimeout(endQuiz, 1500);
            
        } else {                    // else show next question
            clearInterval(questionTimer);
            showRightAnswer();
            timerBar_Div.classList.remove('timer-bar-animation');
            const showNextQuestion = setTimeout(main, 1500);
            timer = 15;
        }
    }
    if(timer >= 10) {
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
    result_p.textContent = `${gamePoints}/5`;
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






