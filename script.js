// script.js

// Variables
const puzzleContainer = document.getElementById('puzzleContainer');
const revealText = document.getElementById('revealText');
let puzzlePieces = [];
let correctPositions = [];
let rows = 3; // Nombre de lignes du puzzle
let cols = 3; // Nombre de colonnes du puzzle
let totalPieces = rows * cols; // Calcul du nombre total de pièces
const imageSrc = 'echographie.jpg'; // Chemin de l'image
const imageWidth = 450;  // Largeur de l'image en pixels
const imageHeight = 450; // Hauteur de l'image en pixels
const pieceWidth = imageWidth / cols;  // Largeur d'une pièce
const pieceHeight = imageHeight / rows; // Hauteur d'une pièce
let selectedPiece = null;

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
    puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    puzzleContainer.style.gap = '1px';

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

        piece.style.backgroundImage = `url(${imageSrc})`;
        piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
        piece.style.backgroundPosition = `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`;
        piece.setAttribute('data-id', index);
        piece.setAttribute('draggable', true);
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragover', dragOver);
        piece.addEventListener('drop', drop);
        piece.addEventListener('dragend', dragEnd);
        piece.addEventListener('click', handlePieceClick);
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

// Fonction pour gérer le clic sur une pièce
function handlePieceClick(event) {
    const piece = event.target;

    if (selectedPiece) {
        swapPieces(selectedPiece, piece);
        selectedPiece.classList.remove('selected');
        selectedPiece = null;
    } else {
        selectedPiece = piece;
        piece.classList.add('selected');
    }

    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Fonction pour échanger deux pièces
function swapPieces(piece1, piece2) {
    const tempBackgroundPosition = piece1.style.backgroundPosition;
    const tempBackgroundImage = piece1.style.backgroundImage;

    piece1.style.backgroundPosition = piece2.style.backgroundPosition;
    piece1.style.backgroundImage = piece2.style.backgroundImage;

    piece2.style.backgroundPosition = tempBackgroundPosition;
    piece2.style.backgroundImage = tempBackgroundImage;

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
        // on scroll jusqu'à l'annonce
        revealText.scrollIntoView({ behavior: "smooth" });
    }
}


// Fonction pour initialiser le puzzle
generatePuzzle();
