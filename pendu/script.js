document.addEventListener('DOMContentLoaded', function () {
    // Configuration du jeu 
    const secretName = "TONY"; // Le prénom à deviner

    // Variables du jeu
    let guessedLetters = [];
    let correctLetters = 0;
    const maxBlurLevel = 20;

    // Éléments du DOM
    const wordContainer = document.getElementById('word-container');
    const messageElement = document.getElementById('message');
    const babyPhoto = document.getElementById('baby-photo');
    const keys = document.querySelectorAll('.key');
    const timelineSection = document.getElementById('timeline-section');

    // Initialiser le jeu
    function initGame() {
        // Créer les cases pour les lettres
        for (let i = 0; i < secretName.length; i++) {
            const letterBox = document.createElement('div');
            letterBox.classList.add('letter-box');
            letterBox.dataset.letter = secretName[i].toUpperCase();
            wordContainer.appendChild(letterBox);
        }

        // Ajouter les événements aux touches du clavier
        keys.forEach(key => {
            key.addEventListener('click', function () {
                // Ignorer si la touche est déjà utilisée
                if (this.classList.contains('disabled')) {
                    return;
                }

                const letter = this.textContent;
                processGuess(letter);
            });
        });
    }

    // Traiter une lettre devinée
    function processGuess(letter) {
        // Vérifier si la lettre a déjà été devinée
        if (guessedLetters.includes(letter)) {
            return;
        }

        // Ajouter la lettre aux lettres devinées
        guessedLetters.push(letter);

        // Trouver la touche correspondante et la désactiver
        const keyElement = Array.from(keys).find(k => k.textContent === letter);
        keyElement.classList.add('disabled');

        // Vérifier si la lettre est dans le nom
        if (secretName.includes(letter)) {
            keyElement.classList.add('correct');

            // Afficher la lettre dans les cases correspondantes
            const letterBoxes = document.querySelectorAll('.letter-box');
            letterBoxes.forEach(box => {
                if (box.dataset.letter === letter) {
                    box.textContent = letter;
                    correctLetters++;
                }
            });

            // Mettre à jour le flou de la photo
            updatePhotoBlur();

            // Vérifier si le joueur a gagné
            checkForWin();
        } else {
            // Lettre incorrecte
            keyElement.classList.add('wrong');
        }
    }

    // Mettre à jour le niveau de flou de la photo
    function updatePhotoBlur() {
        const totalLetters = secretName.split('').filter((item, pos, self) => self.indexOf(item) === pos).length;
        const correctGuessRatio = Math.min(1, correctLetters / (secretName.length));
        const newBlurLevel = Math.max(0, maxBlurLevel * (1 - correctGuessRatio));
        babyPhoto.style.filter = `blur(${newBlurLevel}px)`;
    }

    // Vérifier si le joueur a gagné
    function checkForWin() {
        const allLettersFound = Array.from(document.querySelectorAll('.letter-box')).every(
            box => box.textContent !== ''
        );

        if (allLettersFound) {
            messageElement.textContent = 'Félicitations ! Vous avez deviné le prénom !';
            messageElement.style.color = '#2d5644';
            babyPhoto.style.filter = 'blur(0)';

            // Désactiver toutes les touches
            keys.forEach(key => {
                key.classList.add('disabled');
            });

            // Afficher la timeline
            setTimeout(() => {
                timelineSection.classList.remove('hidden');
                // Scroll doux jusqu'à la timeline
                timelineSection.scrollIntoView({ behavior: 'smooth' });
            }, 1500); // Délai avant d'afficher la timeline
        }
    }

    // Initialiser le jeu au chargement
    initGame();
});