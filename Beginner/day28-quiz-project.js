// Day 28: Final Project - Quiz App
// ============================

class QuizApp {
    constructor() {
        // Quiz data
        this.questions = [
            {
                question: "What is the output of: console.log(typeof typeof 42)?",
                options: ["'number'", "'string'", "'undefined'", "'object'"],
                correct: 1,
                explanation: "typeof 42 returns 'number', and typeof 'number' returns 'string'"
            },
            {
                question: "Which method removes the last element from an array?",
                options: ["shift()", "unshift()", "pop()", "push()"],
                correct: 2,
                explanation: "pop() removes and returns the last element of an array"
            },
            {
                question: "What is the result of: 3 + '3' - 2?",
                options: ["31", "32", "4", "1"],
                correct: 1,
                explanation: "3 + '3' concatenates to '33', then '33' - 2 converts '33' to number and subtracts 2"
            },
            {
                question: "What is a closure in JavaScript?",
                options: [
                    "A function that has access to variables in its outer scope",
                    "A way to close browser windows",
                    "A method to end loops",
                    "A type of array method"
                ],
                correct: 0,
                explanation: "A closure is a function that has access to variables in its outer (enclosing) lexical scope"
            },
            {
                question: "Which statement about promises is true?",
                options: [
                    "Promises can only be resolved",
                    "Promises can be both resolved and rejected",
                    "Promises are synchronous",
                    "Promises can only handle errors"
                ],
                correct: 1,
                explanation: "Promises can either be resolved (fulfilled) or rejected, and they handle both success and error cases"
            }
        ];
        
        // Quiz state
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        
        // DOM elements
        this.quizContainer = document.getElementById('quizContainer');
        this.questionElement = document.getElementById('quizQuestion');
        this.optionsElement = document.getElementById('quizOptions');
        this.progressElement = document.getElementById('quizProgress');
        this.submitButton = document.getElementById('submitAnswer');
        this.nextButton = document.getElementById('nextQuestion');
        this.resultsElement = document.getElementById('quizResults');
        
        // Initialize the quiz
        this.initialize();
    }
    
    initialize() {
        // Set up event listeners
        this.submitButton.addEventListener('click', () => this.submitAnswer());
        this.nextButton.addEventListener('click', () => this.showNextQuestion());
        
        // Display first question
        this.displayQuestion();
    }
    
    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        
        // Update progress
        this.progressElement.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        
        // Display question
        this.questionElement.textContent = question.question;
        
        // Clear previous options
        this.optionsElement.innerHTML = '';
        
        // Create option elements
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            
            // Add click handler
            optionElement.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.quiz-option').forEach(opt => 
                    opt.classList.remove('selected'));
                
                // Select this option
                optionElement.classList.add('selected');
                this.selectedAnswer = index;
                
                // Enable submit button
                this.submitButton.style.display = 'block';
                this.nextButton.style.display = 'none';
            });
            
            this.optionsElement.appendChild(optionElement);
        });
        
        // Reset buttons
        this.submitButton.style.display = 'block';
        this.nextButton.style.display = 'none';
        this.selectedAnswer = null;
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        // Disable all options
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // Show correct/incorrect
        options[this.selectedAnswer].classList.remove('selected');
        options[this.selectedAnswer].classList.add(
            this.selectedAnswer === question.correct ? 'correct' : 'incorrect'
        );
        
        // Always show correct answer
        options[question.correct].classList.add('correct');
        
        // Update score
        if (this.selectedAnswer === question.correct) {
            this.score++;
        }
        
        // Show explanation
        const explanation = document.createElement('div');
        explanation.className = 'explanation';
        explanation.textContent = question.explanation;
        this.optionsElement.appendChild(explanation);
        
        // Show next button if not last question
        this.submitButton.style.display = 'none';
        if (this.currentQuestion < this.questions.length - 1) {
            this.nextButton.style.display = 'block';
        } else {
            this.showFinalResults();
        }
    }
    
    showNextQuestion() {
        this.currentQuestion++;
        this.displayQuestion();
    }
    
    showFinalResults() {
        // Calculate percentage
        const percentage = (this.score / this.questions.length) * 100;
        
        // Create results message
        const resultsMessage = `
            <h2>Quiz Complete!</h2>
            <p>Your score: ${this.score} out of ${this.questions.length} (${percentage.toFixed(1)}%)</p>
            <div class="feedback">
                ${this.getFeedbackMessage(percentage)}
            </div>
            <button onclick="location.reload()">Try Again</button>
        `;
        
        // Display results
        this.resultsElement.innerHTML = resultsMessage;
        this.resultsElement.style.display = 'block';
        
        // Hide question container
        this.questionElement.style.display = 'none';
        this.optionsElement.style.display = 'none';
        this.progressElement.style.display = 'none';
    }
    
    getFeedbackMessage(percentage) {
        if (percentage === 100) {
            return "Perfect score! You've mastered JavaScript!";
        } else if (percentage >= 80) {
            return "Excellent work! You have a strong understanding of JavaScript!";
        } else if (percentage >= 60) {
            return "Good job! Keep practicing to improve your JavaScript skills!";
        } else {
            return "Keep learning! Review the concepts and try again!";
        }
    }
}

// Initialize the Quiz App
const quizApp = new QuizApp();

// Add some styling
const style = document.createElement('style');
style.textContent = `
    .explanation {
        margin-top: 20px;
        padding: 10px;
        background-color: #f8f9fa;
        border-left: 4px solid #007bff;
        font-style: italic;
    }
    
    .feedback {
        margin: 20px 0;
        padding: 15px;
        background-color: #e9ecef;
        border-radius: 4px;
        text-align: center;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// That's it for Day 28! This project demonstrates:
// 1. Object-Oriented Programming
// 2. DOM Manipulation
// 3. Event Handling
// 4. State Management
// 5. Conditional Logic
// 6. Array Methods
// 7. Template Literals
// 8. CSS Styling
// 9. Error Handling
// 10. User Interaction 