// --- Основные элементы ---
const textArea = document.getElementById('inputText');
const countButton = document.getElementById('countButton');
const resultDiv = document.getElementById('result');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const savedPoemsList = document.getElementById('savedPoemsList');
const lightRed = document.getElementById('lightRed');
const lightYellow = document.getElementById('lightYellow');
const lightGreen = document.getElementById('lightGreen');
const trafficLightCommentDiv = document.getElementById('trafficLightComment');
const searchWordInput = document.getElementById('searchWordInput');
const searchButtonsContainer = document.querySelector('#dictionaryHelper .search-buttons-container');
const vowels = "аеёиоуыэюя";
const initialResultText = "Здесь будет результат...";



// --- Комментарии для светофора ---
const comments = {
    green: ["Ритм идеален! 🤖✨", "Муза одобряет! 👍", "Всё точно, как швейцарские часы! 🇨🇭⚙️"],
    yellow: ["Есть неровности, но жить можно. 🤔", "Ритм слегка хромает. 😬", "Слогам не хватает синхронизации. 🚧"],
    red: ["Катастрофа! 💥", "Ваш ритм только что убил котёнка. 😿", "Полный хаос, перезапустите свою музу. 🔥"],
    default: ["Светофор ждёт ваших творений... ✨", "Поле пусто, как душа киборга. 🤖💔"]
};

const PLACEHOLDERS = {
    textarea: {
        dark: [
            "Твои мрачные строки ждут... ", 
            "Готовься к ритмическому апокалипсису...",
            "Слова должны гореть в аду плохого ритма...",
            "Строки-зомби ищут мозги...", 
            "Слова должны танцевать на краю бездны...",
            "Здесь рождаются стихи-оборотни...",
            "Чернила из сердца демона...",
            "Строчки, от которых дрожит тьма..."
        ],
        light: [
            "Начни писать солнечные стихи...", 
            "Лепестки слов ждут своего цветка...",
            "Строки должны пахнуть свежестью...",
			"Пиши, будто рисуешь радугу...️",
            "Слова-бабочки ждут своего полёта...",
            "Строки из облачной пряжи...",
            "Рифмы, как капли росы...",
            "Стихи, которые обнимет солнце...",
            "Слова-пушинки из крыльев фей...",
            "Пиши медом, а не кровью..."
        ]
    },
    search: {
        dark: [
            "Ищи смысл во тьме... ️", 
            "Анализ слов в стиле ноктюрн ",
            "Что скрывает теневая лексика? "
        ],
        light: [
            "Поиск светлых смыслов ", 
            "Слово как лучик вдохновения ",
            "Лингвистический детектив "
        ]
    }
};

// --- Подсчёт слогов в строках ---
function countSyllablesInLine(line) {
    const lowerLine = line.toLowerCase();
    let syllableCount = 0;
    for (let char of lowerLine) {
        if (vowels.includes(char)) syllableCount++;
    }
    return syllableCount || (line.trim().length > 0 ? 1 : 0); // Минимум 1 слог для непустых строк
}

// --- Анализ текста ---
function processAndDisplayResults() {
    const fullText = textArea.value;
    resetTrafficLightsAndComment();

    if (!fullText.trim()) {
        resultDiv.innerHTML = "Поле ввода девственно чисто...";
        return;
    }

    const lines = fullText.split('\n');
    let resultsHTML = "";
    const syllableCounts = lines.map(countSyllablesInLine);

    for (let [index, line] of lines.entries()) {
        resultsHTML += `${line} ${syllableCounts[index]}<br>`;
    }

    resultDiv.innerHTML = resultsHTML;
    updateTrafficLight(syllableCounts);
}

// --- Логика светофора ---
function updateTrafficLight(syllableCounts) {
    const dominantCount = getDominantSyllableCount(syllableCounts);
    let yellowWarnings = 0, redAlerts = 0;

    for (let count of syllableCounts) {
        const deviation = Math.abs(count - dominantCount);
        if (deviation === 2) yellowWarnings++;
        else if (deviation > 2) redAlerts++;
    }

    if (redAlerts >= 2 || yellowWarnings >= 3) {
        lightRed.classList.add('active');
        trafficLightCommentDiv.textContent = getRandomComment('red');
    } else if (yellowWarnings >= 1) {
        lightYellow.classList.add('active');
        trafficLightCommentDiv.textContent = getRandomComment('yellow');
    } else {
        lightGreen.classList.add('active');
        trafficLightCommentDiv.textContent = getRandomComment('green');
    }
}

// --- Получение доминирующего числа слогов ---
function getDominantSyllableCount(syllableCounts) {
    const counts = new Map();
    let maxCount = 0, dominant = syllableCounts[0];

    for (let count of syllableCounts) {
        counts.set(count, (counts.get(count) || 0) + 1);
        if (counts.get(count) > maxCount) {
            maxCount = counts.get(count);
            dominant = count;
        }
    }
    return dominant;
}

// --- Очистка полей ---
function clearFields() {
    textArea.value = "";
    resultDiv.innerHTML = initialResultText;
    resetTrafficLightsAndComment();
}

// --- Сохранение стихов ---
function savePoem() {
    const poem = textArea.value.trim();
    if (!poem) {
        alert("Нечего сохранять — поле пустое!");
        return;
    }
    const poems = JSON.parse(localStorage.getItem("savedPoems")) || [];
    poems.unshift(poem);
    localStorage.setItem("savedPoems", JSON.stringify(poems));
    loadSavedPoems();
    alert("Стихотворение сохранено!");
}

// --- Загрузка сохранённых стихов ---
function loadSavedPoems() {
    const poems = JSON.parse(localStorage.getItem("savedPoems")) || [];
    savedPoemsList.innerHTML = "";
    poems.forEach((poem, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${poem.substring(0, 30)}${poem.length > 30 ? "..." : ""}</span>
                        <button onclick="loadPoem(${index})">📖</button>
                        <button onclick="deletePoem(${index})">🗑️</button>`;
        savedPoemsList.appendChild(li);
    });
}

function loadPoem(index) {
    const poems = JSON.parse(localStorage.getItem("savedPoems")) || [];
    if (poems[index]) textArea.value = poems[index];
}

function deletePoem(index) {
    const poems = JSON.parse(localStorage.getItem("savedPoems")) || [];
    poems.splice(index, 1);
    localStorage.setItem("savedPoems", JSON.stringify(poems));
    loadSavedPoems();
}

// --- Логика для Лингвистического Комбайна ---
if (searchButtonsContainer) {
    searchButtonsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('search-btn')) {
            const word = searchWordInput.value.trim();
            const searchType = event.target.dataset.searchType;
            if (!word) {
                trafficLightCommentDiv.textContent = "Введите слово для анализа!";
                return;
            }
            let query = "";
            switch (searchType) {
                case "synonyms": query = `синонимы к слову ${word}`; break;
                case "rhymes": query = `рифмы к слову ${word}`; break;
                case "meaning": query = `значение слова ${word}`; break;
                case "antonyms": query = `антонимы к слову ${word}`; break;
                case "etymology": query = `этимология слова ${word}`; break;
            }
            if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    });
}

// --- Обработчик кликов по светофору для переключения тем ---
const trafficLightContainer = document.getElementById('trafficLightContainer');

trafficLightContainer.addEventListener('click', () => {
    const body = document.body;
    const isDarkTheme = body.classList.contains('dark-theme');
    
    // Переключаем тему
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    
    // Обновляем элементы интерфейса
    updateTitle(isDarkTheme ? 'light' : 'dark');
    updatePlaceholders(isDarkTheme ? 'light' : 'dark');
    flashLights();
});


// --- Функция мигания светофора ---
function flashLights() {
    // Включаем все огоньки
    lightRed.classList.add('active');
    lightYellow.classList.add('active');
    lightGreen.classList.add('active');

    // Через 500 мс выключаем их
    setTimeout(() => {
        lightRed.classList.remove('active');
        lightYellow.classList.remove('active');
        lightGreen.classList.remove('active');
    }, 500); // 500 мс
}

// Добавляем после функции flashLights()
function updatePlaceholders(themeType) {
    textArea.placeholder = PLACEHOLDERS.textarea[themeType][Math.floor(Math.random() * 3)];
    searchWordInput.placeholder = PLACEHOLDERS.search[themeType][Math.floor(Math.random() * 3)];
}

// --- Вспомогательные функции ---
function resetTrafficLightsAndComment() {
    lightRed.classList.remove('active');
    lightYellow.classList.remove('active');
    lightGreen.classList.remove('active');
    trafficLightCommentDiv.textContent = getRandomComment('default');
}

function getRandomComment(type) {
    const typeComments = comments[type] || comments.default;
    return typeComments[Math.floor(Math.random() * typeComments.length)];
}




// --- Динамическое название ---
const dynamicTitles = {
    
	dark: ["Терминатор Свободного Стиха 🤖🔫", "Укротитель Слогов 😈", "BDSM Светофорчик🦯", "Злой Светофорчик🚦😈", "Камертон Сердитой Музы 😡🎵", "Ваш Личный Слого-Сомелье 🍷", "Слоговой Сканер 'Око Поэта' 👁️", "Слого-Мясорубка ⚙️🥩",
    "Вердикт Ритма: Без Апелляций! ⚖️💥", "Поэтический Полиграф™ 🤥", "Светофор Судного Дня (для Стихов)", "Экзекутор Гармонии 💀🎼", "Диспетчер Слоговых Катастроф 🚨", "Ритмический Дефибриллятор ⚡💔", "Анализатор 'Чёрная Метка' 🏴‍☠️📜",
    "Счётчик Грехов... то есть, Слогов 🎰", "Машина Боли для Плохих Стихов 😩", "Кибер-Цензор Рифмы 🤖🚫", "Нейро-Инквизитор Поэзии 🔥", "Слого-Детектор Лжи 🕵️‍"],
    
	light: ["⚪ Добрый Светофорчик", "🌞 Стихотворный Рассвет", "🌞 Стихотворный Садовник", "🦋 Муза в Полете", "🌈 Волшебный Слого-Дирижёр", "🍃 Слоговой Ветерок",
    "🧚♂️ Фея Гармонии", "📚 Поэтический Библиотекарь", "🎈 Воздушный Рифмоплёт", "🌻 Солнечный Счётчик", "🕊️ Голубь Мира (для Стихов)", "🎠 Карусель Слогов", "🐇 Поэтический Кролик", "🧁 Слого-Пекарь", "🤖 Робот-Няня (для Стихов)"],
    
	base: [ "НейроСлогоМетр 🤖", "Слого-Магия ✨", "Это НЕ просто Счётчик Слогов 😉", "Силлабо-Квантовый Анализатор v0.3 ⚛️", "СЛОГоворот Событий в Стихе! 🌪️", "Мастерская Ритма 🛠️", "Не Считай Ворон – Считай Слоги! 👀", "Доктор Слог: Приём по Записи! 🩺"]
};



function updateTitle(themeType) {
    const titleElement = document.getElementById('mainPageTitle');
    const titles = themeType ? 
        dynamicTitles[themeType] : 
        dynamicTitles.base;
    
    // Плавное исчезновение
    titleElement.style.opacity = 0;
    
    setTimeout(() => {
        // Выбор случайного названия
        const newTitle = titles[Math.floor(Math.random() * titles.length)];
        titleElement.textContent = newTitle;
        
        // Плавное появление
        titleElement.style.opacity = 1;
        titleElement.style.transform = 'translateY(0px)';
        setTimeout(() => {
            titleElement.style.transform = 'translateY(0)';
        }, 1);
    }, 50);
}




// Обновляем название при смене темы
document.body.addEventListener('click', (e) => {
    if (e.target.closest('#trafficLightContainer')) {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        updateTitle(isDarkTheme ? 'dark' : 'light');
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateTitle('base');
    // ... остальная инициализация
});

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
	const pageTitle = document.title;
    document.getElementById('mainPageTitle').textContent = pageTitle;
    loadSavedPoems();
    resetTrafficLightsAndComment();
    const initialTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    updatePlaceholders(initialTheme);
    // ... остальная инициализация
});

// --- Привязка событий ---
if (countButton) countButton.addEventListener('click', processAndDisplayResults);
if (clearButton) clearButton.addEventListener('click', clearFields);
if (saveButton) saveButton.addEventListener('click', savePoem);


