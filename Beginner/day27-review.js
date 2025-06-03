// Day 27: JavaScript Review Flashcards
// ================================

// Flashcard data structure
const flashcards = [
    {
        front: "What are the primitive data types in JavaScript?",
        back: "string, number, boolean, null, undefined, symbol, and bigint"
    },
    {
        front: "What is the difference between == and ===?",
        back: "== performs type coercion before comparison, while === compares both value and type without coercion"
    },
    {
        front: "What is closure in JavaScript?",
        back: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned"
    },
    {
        front: "What is the difference between let, const, and var?",
        back: "var: function-scoped, hoisted\nlet: block-scoped, not hoisted\nconst: block-scoped, cannot be reassigned"
    },
    {
        front: "What is the purpose of the 'this' keyword?",
        back: "The 'this' keyword refers to the current execution context and depends on how a function is called"
    },
    {
        front: "What is a Promise in JavaScript?",
        back: "A Promise is an object representing the eventual completion (or failure) of an asynchronous operation"
    },
    {
        front: "What is the difference between map() and forEach()?",
        back: "map() creates a new array with the results of calling a function for every array element\nforEach() executes a function once for each array element without creating a new array"
    },
    {
        front: "What is the DOM?",
        back: "The Document Object Model (DOM) is a programming interface for HTML and XML documents, representing the page as a tree of objects"
    },
    {
        front: "What is event bubbling?",
        back: "Event bubbling is the process where an event triggers on the deepest target element and propagates up through its ancestors"
    },
    {
        front: "What is async/await?",
        back: "async/await is a syntax for handling Promises that makes asynchronous code look and behave more like synchronous code"
    }
];

// Flashcard System Implementation
class FlashcardSystem {
    constructor(cards) {
        this.cards = cards;
        this.currentIndex = 0;
        this.container = document.getElementById('flashcardContainer');
        this.prevButton = document.getElementById('prevCard');
        this.nextButton = document.getElementById('nextCard');
        
        this.initialize();
    }
    
    initialize() {
        // Create flashcard element
        this.createFlashcardElement();
        
        // Add event listeners
        this.addEventListeners();
        
        // Display first card
        this.displayCard(0);
    }
    
    createFlashcardElement() {
        const flashcard = document.createElement('div');
        flashcard.className = 'flashcard';
        
        const inner = document.createElement('div');
        inner.className = 'flashcard-inner';
        
        const front = document.createElement('div');
        front.className = 'flashcard-front';
        
        const back = document.createElement('div');
        back.className = 'flashcard-back';
        
        inner.appendChild(front);
        inner.appendChild(back);
        flashcard.appendChild(inner);
        
        this.container.appendChild(flashcard);
        
        this.flashcard = flashcard;
        this.frontContent = front;
        this.backContent = back;
    }
    
    addEventListeners() {
        // Flip card on click
        this.flashcard.addEventListener('click', () => {
            this.flashcard.classList.toggle('flipped');
        });
        
        // Navigation buttons
        this.prevButton.addEventListener('click', () => {
            this.showPreviousCard();
        });
        
        this.nextButton.addEventListener('click', () => {
            this.showNextCard();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.showPreviousCard();
                    break;
                case 'ArrowRight':
                    this.showNextCard();
                    break;
                case ' ':
                    event.preventDefault();
                    this.flashcard.classList.toggle('flipped');
                    break;
            }
        });
    }
    
    displayCard(index) {
        const card = this.cards[index];
        
        // Update content
        this.frontContent.textContent = card.front;
        this.backContent.textContent = card.back;
        
        // Reset flip state
        this.flashcard.classList.remove('flipped');
        
        // Update button states
        this.updateNavigationButtons();
    }
    
    showNextCard() {
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.displayCard(this.currentIndex);
        }
    }
    
    showPreviousCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.displayCard(this.currentIndex);
        }
    }
    
    updateNavigationButtons() {
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.disabled = this.currentIndex === this.cards.length - 1;
    }
}

// Additional study features
class StudyFeatures {
    constructor(cards) {
        this.cards = cards;
        this.studyHistory = [];
    }
    
    shuffleCards() {
        return [...this.cards].sort(() => Math.random() - 0.5);
    }
    
    markCardReview(index, needsReview) {
        this.studyHistory.push({
            cardIndex: index,
            needsReview,
            timestamp: new Date()
        });
    }
    
    getCardsNeedingReview() {
        const reviewMap = new Map();
        
        this.studyHistory.forEach(record => {
            reviewMap.set(record.cardIndex, record.needsReview);
        });
        
        return this.cards.filter((card, index) => reviewMap.get(index));
    }
    
    getStudyStats() {
        const total = this.studyHistory.length;
        const needsReview = this.studyHistory.filter(record => record.needsReview).length;
        
        return {
            totalCards: this.cards.length,
            cardsStudied: total,
            cardsNeedingReview: needsReview,
            completionRate: `${((total / this.cards.length) * 100).toFixed(1)}%`
        };
    }
}

// Initialize the flashcard system
const flashcardSystem = new FlashcardSystem(flashcards);
const studyFeatures = new StudyFeatures(flashcards);

// Add keyboard shortcuts help
const keyboardShortcuts = `
Keyboard Shortcuts:
- Left Arrow: Previous card
- Right Arrow: Next card
- Spacebar: Flip card
`;

console.log(keyboardShortcuts);

// That's it for Day 27! You've learned:
// 1. Core JavaScript concepts review
// 2. Interactive flashcard implementation
// 3. Study progress tracking
// 4. Keyboard navigation
// 5. DOM manipulation review
// 6. Event handling review
// 7. Class implementation review 