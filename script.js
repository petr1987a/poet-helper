// script.js — Обновлённый для нового движка

const ChessEngine = require('./chess_ai'); // Импорт нового шахматного движка

const PIECES = {
    'wK': '♔','wQ': '♕','wR': '♖','wB': '♗','wN': '♘','wP': '♙',
    'bK': '♚','bQ': '♛','bR': '♜','bB': '♝','bN': '♞','bP': '♟'
};

const initialBoardSetup = [
    ['bR','bN','bB','bQ','bK','bB','bN','bR'],
    ['bP','bP','bP','bP','bP','bP','bP','bP'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['wP','wP','wP','wP','wP','wP','wP','wP'],
    ['wR','wN','wB','wQ','wK','wB','wN','wR']
];

let currentBoardState = [];
let selectedSquare = null;
let currentPlayer = 'w';
let boardSize = 8;
let gameStatus = "ongoing";

const boardElement = document.getElementById('chessBoard');
const messageElement = document.getElementById('message');
const currentPlayerElement = document.getElementById('currentPlayer');
const resetButton = document.getElementById('resetButton');

const chessEngine = new ChessEngine(); // Создаём экземпляр нового шахматного движка

function initializeBoard() {
    currentBoardState = JSON.parse(JSON.stringify(initialBoardSetup));
    selectedSquare = null;
    currentPlayer = 'w';
    gameStatus = "ongoing";
    renderBoard();
    updateInfoPanel("Игра началась. Ход Белых.");
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = row;
            square.dataset.col = col;
            const pieceCode = currentBoardState[row][col];
            if (pieceCode) {
                square.textContent = PIECES[pieceCode];
                square.classList.add('piece');
                square.classList.add(pieceCode.startsWith('w') ? 'white' : 'black');
            }
            square.addEventListener('click', () => onSquareClick(row, col));
            boardElement.appendChild(square);
        }
    }
    updateInfoPanel(`Ход ${currentPlayer === 'w' ? 'Белых' : 'Черных'}.`);
}

function onSquareClick(row, col) {
    if (gameStatus !== "ongoing") {
        updateInfoPanel("Игра завершена. Начните новую игру, нажав 'Начать заново'.");
        return;
    }
    const pieceCode = currentBoardState[row][col];
    if (selectedSquare) {
        // Делаем ход
        const move = { from: selectedSquare, to: { row, col } };
        chessEngine.makeMove(selectedSquare, { rank: row, file: col });
        selectedSquare = null;
        renderBoard();
        switchPlayer();
    } else if (pieceCode && pieceCode.startsWith(currentPlayer)) {
        selectedSquare = { rank: row, file: col };
        updateInfoPanel("Выбрана фигура. Куда походить?");
    }
}

function makeBotMove() {
    const botColor = 'b';
    if (currentPlayer !== botColor || gameStatus !== "ongoing") return;

    const move = chessEngine.generateMove(); // Новый способ генерации хода
    if (move) {
        chessEngine.makeMove(move.from, move.to);
        renderBoard();
        switchPlayer();
    } else {
        updateInfoPanel("Бот не смог сделать ход.");
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'w' ? 'b' : 'w';
    updateInfoPanel(`Ход ${currentPlayer === 'w' ? 'Белых' : 'Черных'}.`);
    if (currentPlayer === 'b') makeBotMove();
}

function updateInfoPanel(message) {
    messageElement.textContent = message;
}

resetButton.addEventListener('click', initializeBoard);
document.addEventListener('DOMContentLoaded', initializeBoard);