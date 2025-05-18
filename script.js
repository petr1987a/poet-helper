// --- Основные элементы ---
const textArea = document.getElementById('inputText');
const countButton = document.getElementById('countButton');
const resultDiv = document.getElementById('result');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const savedPoemsList = document.getElementById('savedPoemsList');

const vowels = "аеёиоуыэюя";
const initialResultText = "Здесь будет результат...";

// Подсчёт слогов в строках
function countSyllablesInLine(line) {
    const lowerLine = line.toLowerCase();
    let syllableCount = 0;
    for (let i = 0; i < lowerLine.length; i++) {
        if (vowels.includes(lowerLine[i])) syllableCount++;
    }
    return syllableCount;
}

// Обработка текста
function processAndDisplayResults() {
    const fullText = textArea.value;
    if (fullText.length === 0) {
        resultDiv.innerHTML = "Поле ввода девственно чисто...";
        return;
    }

    const lines = fullText.split('\n');
    let resultsHTML = "";

    for (let line of lines) {
        const syllables = countSyllablesInLine(line);
        resultsHTML += `${line} (${syllables} слогов)<br>`;
    }

    resultDiv.innerHTML = resultsHTML;
}

// Очистка полей
function clearFields() {
    textArea.value = "";
    resultDiv.innerHTML = initialResultText;
}

// Сохранение стихов
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

// Загрузка сохранённых стихов
function loadSavedPoems() {
    const poems = JSON.parse(localStorage.getItem("savedPoems")) || [];
    savedPoemsList.innerHTML = "";
    poems.forEach((poem, index) => {
        const li = document.createElement("li");
        li.textContent = poem.substring(0, 30) + (poem.length > 30 ? "..." : "");
        savedPoemsList.appendChild(li);
    });
}

// Привязка событий
if (countButton) countButton.addEventListener('click', processAndDisplayResults);
if (clearButton) clearButton.addEventListener('click', clearFields);
if (saveButton) saveButton.addEventListener('click', savePoem);

// Инициализация
loadSavedPoems();
