const API_URL: string = 'https://opentdb.com/api.php?amount=5&type=multiple';

// get quiz data
async function getData(): Promise<QuestionList> {
    const response = await fetch(API_URL);
    return await response.json();
}

function useData(data: QuestionList) {
    const questions = data.results;  // get all questions
    console.log(questions);
}

// main
function main() {
    const triviaData = getData();
    triviaData.then(function(triviaData) {
        useData(triviaData);
    });
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






