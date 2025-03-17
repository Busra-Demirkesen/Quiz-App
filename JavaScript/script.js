const answerOptions = document.querySelector(".answer-options"); 
const nextQuestionBtn = document.querySelector(".next-question-btn"); 
let quizCategory = "programming";
let currentQuestion = null;
const questionsIndexHistory = [];

// Rastgele bir soru seçme fonksiyonu
const getRandomQuestion = () => {
    const categoryData = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase());

    if (!categoryData) {
        console.error("Category not found!");
        return null;
    }

    const categoryQuestions = categoryData.questions || [];
    
    // Filtrelenmiş sorular
    const avaliableQuestions = categoryQuestions.filter((_, index) => !questionsIndexHistory.includes(index));

    if (avaliableQuestions.length === 0) {
        console.warn("No available questions left in this category!");
        return null;
    }

    const randomQuestion = avaliableQuestions[Math.floor(Math.random() * avaliableQuestions.length)];
    
    // Soru tarihçesine ekleme
    questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    
    return randomQuestion;
};

// Doğru cevabı işaretleme fonksiyonu
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll('.answer-option')[currentQuestion.correctAnswer];
    correctOption.classList.add('correct');
    const iconHTML = `<i class="fa-regular fa-circle-check"></i>`;
    correctOption.insertAdjacentHTML('beforeend', iconHTML);
}

// Kullanıcının cevabını kontrol eden fonksiyon
const handleAnswer = (li, answerIndex) => {
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    li.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Yanlış cevap verildiyse doğru cevabı göster
    if (!isCorrect) {
        highlightCorrectAnswer();
    }

    // Yanıt iconunu ekle (sadece ikon, metin eklenmemeli)
    const iconHTML = `<i class="fa-regular fa-circle-${isCorrect ? 'check' : 'xmark'}"></i>`;
    li.insertAdjacentHTML('beforeend', iconHTML);

    // Cevaplandıktan sonra tüm seçenekleri devre dışı bırak
    answerOptions.querySelectorAll('.answer-option').forEach(option => option.style.pointerEvents = 'none');

    // Sonraki Soru butonunu görünür yap
    nextQuestionBtn.style.visibility = "visible";
};

// UI'yi güncelleyen fonksiyon
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    
    if (!currentQuestion) {
        document.querySelector('.question-text').textContent = "No questions available!";
        return;
    }

    // UI Güncelleme
    answerOptions.innerHTML = ""; 
    nextQuestionBtn.style.visibility = "hidden";
    document.querySelector('.question-text').textContent = currentQuestion.question;

    // Şıkları ekleme ve event listener ekleme
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add('answer-option');
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener('click', () => handleAnswer(li, index));
    });
};

// İlk soruyu render et
renderQuestion();

// "Sonraki Soru" butonuna event listener ekleme
nextQuestionBtn.addEventListener('click', renderQuestion);
