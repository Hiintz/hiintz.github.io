// script.js

// Variables
const puzzleContainer = document.getElementById('puzzleContainer');
const revealText = document.getElementById('revealText');
let puzzlePieces = [];
let correctPositions = [];
let rows = 2; // Nombre de lignes du puzzle
let cols = 2; // Nombre de colonnes du puzzle
let totalPieces = rows * cols; // Calcul du nombre total de pièces
const imageSrc = 'echographie.jpg'; // Chemin de l'image
const imageWidth = 450;  // Largeur de l'image en pixels
const imageHeight = 450; // Hauteur de l'image en pixels
const pieceWidth = imageWidth / cols;  // Largeur d'une pièce
const pieceHeight = imageHeight / rows; // Hauteur d'une pièce

// Fonction pour mélanger un tableau
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fonction pour générer les pièces du puzzle
function generatePuzzle() {
    // Ajuster la grille du puzzle pour le nombre de colonnes et de lignes
    puzzleContainer.style.display = 'grid';
    puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, ${pieceWidth}px)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${rows}, ${pieceHeight}px)`;
    
    // Créer un tableau des indices des pièces
    let indices = [];
    for (let i = 0; i < totalPieces; i++) {
        indices.push(i);
    }

    // Mélanger les indices
    shuffle(indices);

    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');

        const index = indices[i];
        const row = Math.floor(index / cols);
        const col = index % cols;

        // Définir la taille de chaque pièce
        // piece.style.width = `${pieceWidth}px`;
        // piece.style.height = `${pieceHeight}px`;

        piece.style.backgroundImage = `url(${imageSrc})`;
        piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
        piece.style.backgroundPosition = `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`;
        piece.setAttribute('data-id', index);
        piece.setAttribute('draggable', true);
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragover', dragOver);
        piece.addEventListener('drop', drop);
        piece.addEventListener('dragend', dragEnd);
        puzzleContainer.appendChild(piece);
        puzzlePieces.push(piece);
        correctPositions.push(i);
    }
}

// Fonction pour gérer le début du drag
function dragStart(event) {
    event.dataTransfer.setData('text', event.target.getAttribute('data-id'));
}

function dragEnd(event) {
    event.preventDefault();
}

// Fonction pour permettre le drop
function dragOver(event) {
    event.preventDefault();
}

// Fonction pour gérer le drop
function drop(event) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData('text'); // ID de la pièce déplacée
    const targetId = event.target.getAttribute('data-id'); // ID de la pièce cible

    // Obtenez les pièces correspondantes
    const draggedElement = document.querySelector(`[data-id='${draggedId}']`);
    const targetElement = document.querySelector(`[data-id='${targetId}']`);

    // Échangez uniquement leurs styles (background-position et background-image)
    const tempBackgroundPosition = draggedElement.style.backgroundPosition;
    const tempBackgroundImage = draggedElement.style.backgroundImage;

    draggedElement.style.backgroundPosition = targetElement.style.backgroundPosition;
    draggedElement.style.backgroundImage = targetElement.style.backgroundImage;

    targetElement.style.backgroundPosition = tempBackgroundPosition;
    targetElement.style.backgroundImage = tempBackgroundImage;

    // Vérifiez si le puzzle est résolu
    checkPuzzle();
}

// Vérifie si le puzzle est correctement résolu
function checkPuzzle() {
    let isSolved = true;

    const pieces = puzzleContainer.children;

    for (let i = 0; i < totalPieces; i++) {
        const expectedRow = Math.floor(correctPositions[i] / cols);
        const expectedCol = correctPositions[i] % cols;

        const expectedPosition = `${(expectedCol / (cols - 1)) * 100}% ${(expectedRow / (rows - 1)) * 100}%`;
        const actualPosition = pieces[i].style.backgroundPosition;

        if (expectedPosition !== actualPosition) {
            isSolved = false;
            break;
        }
    }

    if (isSolved) {
        revealText.style.display = 'block'; // Afficher l'annonce
    }
}


// Fonction pour initialiser le puzzle
generatePuzzle();
