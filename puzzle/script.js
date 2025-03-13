const puzzleContainer = document.getElementById('puzzleContainer');
const revealText = document.getElementById('revealText');
let puzzlePieces = [];
let correctPositions = [];
let rows = 4;
let cols = 4;
let totalPieces = rows * cols;
let imageSrc = 'puzzle.jpg';
if (window.location.search.includes('proxiad=1')) {
    imageSrc = 'puzzle-proxiad.jpg';
}
const imageWidth = 450;
const imageHeight = 450;
const pieceWidth = imageWidth / cols;
const pieceHeight = imageHeight / rows;
let selectedPiece = null;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generatePuzzle() {
    puzzleContainer.style.display = 'grid';
    puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    puzzleContainer.style.gap = '1px';

    let indices = [];
    for (let i = 0; i < totalPieces; i++) {
        indices.push(i);
    }

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

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.getAttribute('data-id'));
}

function dragEnd(event) {
    event.preventDefault();
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData('text');
    const targetId = event.target.getAttribute('data-id');

    const draggedElement = document.querySelector(`[data-id='${draggedId}']`);
    const targetElement = document.querySelector(`[data-id='${targetId}']`);

    const tempBackgroundPosition = draggedElement.style.backgroundPosition;
    const tempBackgroundImage = draggedElement.style.backgroundImage;

    draggedElement.style.backgroundPosition = targetElement.style.backgroundPosition;
    draggedElement.style.backgroundImage = targetElement.style.backgroundImage;

    targetElement.style.backgroundPosition = tempBackgroundPosition;
    targetElement.style.backgroundImage = tempBackgroundImage;

    checkPuzzle();
}

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

    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function swapPieces(piece1, piece2) {
    const tempBackgroundPosition = piece1.style.backgroundPosition;
    const tempBackgroundImage = piece1.style.backgroundImage;

    piece1.style.backgroundPosition = piece2.style.backgroundPosition;
    piece1.style.backgroundImage = piece2.style.backgroundImage;

    piece2.style.backgroundPosition = tempBackgroundPosition;
    piece2.style.backgroundImage = tempBackgroundImage;

    checkPuzzle();
}

function roundTo(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function checkPuzzle() {
    let isSolved = true;

    const pieces = puzzleContainer.children;

    for (let i = 0; i < totalPieces; i++) {
        const expectedRow = Math.floor(correctPositions[i] / cols);
        const expectedCol = correctPositions[i] % cols;

        const expectedPosition = `${roundTo((expectedCol / (cols - 1)) * 100, 4)}% ${roundTo((expectedRow / (rows - 1)) * 100, 4)}%`;
        const actualPosition = pieces[i].style.backgroundPosition;

        if (expectedPosition !== actualPosition) {
            isSolved = false;
            break;
        }
    }

    if (isSolved) {
        puzzleContainer.style.gap = '0px';
        revealText.style.display = 'block';
        revealText.scrollIntoView({ behavior: "smooth" });
    }
}

generatePuzzle();
