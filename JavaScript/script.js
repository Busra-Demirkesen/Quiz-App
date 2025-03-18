const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const configContainer = document.querySelector(".config-container");
const nextQuestionBtn = document.querySelector(".next-question-btn");

const startQuizBtn = document.querySelector(".start-quiz-btn");

const questionStatus = document.querySelector(".question-status");

const timerDisplay = document.querySelector(".time-duration");

const resultContainer = document.querySelector('.result-container');

const tryAgainButton = document.querySelector('.try-again-btn');

let quizCategory = "programming";
let numberOfQuestions = 5;
let currentQuestion = null;
const questionsIndexHistory = [];

const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let correctAnswerCount = 0;


// sonuç container'ını göster quiz containerını gizle
const showQuizResult = () => {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great effort!`;
    document.querySelector('.result-message').innerHTML = resultText;

}

const resetTimer = () =>{
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;
}

//Timer 
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`; 


    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrectAnswer();
      // Sonraki Soru butonunu görünür yap
nextQuestionBtn.style.visibility = "visible";


      // Cevaplandıktan sonra tüm seçenekleri devre dışı bırak
  answerOptions
  .querySelectorAll(".answer-option")
  .forEach((option) => (option.style.pointerEvents = "none"));



    }
  }, 1000);
};

// Rastgele bir soru seçme fonksiyonu
const getRandomQuestion = () => {
  const categoryData = questions.find(
    (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
  );

  if (!categoryData) {
    console.error("Category not found!");
    return null;
  }

  const categoryQuestions = categoryData.questions || [];

  // Tüm sorular bittiğinde sonuç gösterilsin
  if (
    questionsIndexHistory.length >=
    Math.min(categoryQuestions.length, numberOfQuestions)
  ) {
    return showQuizResult();
  }

  // Filtrelenmiş sorular
  const avaliableQuestions = categoryQuestions.filter(
    (_, index) => !questionsIndexHistory.includes(index)
  );

  if (avaliableQuestions.length === 0) {
    console.warn("No available questions left in this category!");
    return null;
  }

  const randomQuestion =
    avaliableQuestions[Math.floor(Math.random() * avaliableQuestions.length)];

  // Soru tarihçesine ekleme
  questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));

  return randomQuestion;
};

// Doğru cevabı işaretleme fonksiyonu
const highlightCorrectAnswer = () => {
  const correctOption =
    answerOptions.querySelectorAll(".answer-option")[
      currentQuestion.correctAnswer
    ];
  correctOption.classList.add("correct");
  const iconHTML = `<i class="fa-regular fa-circle-check"></i>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

// Kullanıcının cevabını kontrol eden fonksiyon
const handleAnswer = (li, answerIndex) => {
    clearInterval(timer);
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  li.classList.add(isCorrect ? "correct" : "incorrect");

  // Yanlış cevap verildiyse doğru cevabı göster
  if (!isCorrect) {
    highlightCorrectAnswer();
    correctAnswerCount++;
  }

  // Yanıt iconunu ekle (sadece ikon, metin eklenmemeli)
  const iconHTML = `<i class="fa-regular fa-circle-${
    isCorrect ? "check" : "xmark"
  }"></i>`;
  li.insertAdjacentHTML("beforeend", iconHTML);

  // Cevaplandıktan sonra tüm seçenekleri devre dışı bırak
  answerOptions
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = "none"));

  // Sonraki Soru butonunu görünür yap
  nextQuestionBtn.style.visibility = "visible";
};

// UI'yi güncelleyen fonksiyon
const renderQuestion = () => {
  currentQuestion = getRandomQuestion();

  if (!currentQuestion) {
    document.querySelector(".question-text").textContent =
      "No questions available!";
    return;
  }

  resetTimer();
  startTimer();

  // UI Güncelleme
  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  document.querySelector(".question-text").textContent =
    currentQuestion.question;

  questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b>of<b>${numberOfQuestions}</b>Questions`;

  // Şıkları ekleme ve event listener ekleme
  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

const startQuiz = () =>{
    configContainer.style.display = "none";
    quizContainer.style.display = "block";

quizCategory = configContainer.querySelector('.category-option.active').textContent;

numberOfQuestions = parseInt(configContainer.querySelector('.question-option.active').textContent);

    // İlk soruyu render et
renderQuestion();
}

document.querySelectorAll('.category-option , .question-option').forEach(option =>{
    option.addEventListener('click', () =>{
        option.parentNode.querySelector('.active').classList.remove('active');
        option.classList.add('active');
    });
});


//Quizi resetler
const resetQuiz = () =>{
   resetTimer();
   correctAnswerCount = 0;
   questionsIndexHistory.length = 0;
   configContainer.style.display = "block";
   resultContainer.style.display = "none";

}

// "Sonraki Soru" butonuna event listener ekleme
nextQuestionBtn.addEventListener("click", renderQuestion);
tryAgainButton.addEventListener('click' ,resetQuiz);

startQuizBtn.addEventListener('click', startQuiz);