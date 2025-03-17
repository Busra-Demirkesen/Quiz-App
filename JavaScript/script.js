let quizCategory = "programming";


const getRandomQuestion = () =>{
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase());
    console.log(categoryQuestions);

}
    getRandomQuestion();