const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('stepButton');

let isFirstClick = true; // Flag to track if it's the first click

startButton.addEventListener('click', () => {
    if (isFirstClick) {
        // Run transition to main content on first click
        showMainContent();
        isFirstClick = false; // Set the flag to false after the first click
        
        // Change the button's behavior to start conversion from now on
        startButton.removeEventListener('click', arguments.callee); // Remove the current event listener
        startButton.addEventListener('click', () => {
            startConversion(); // Start conversion on subsequent clicks
            handleButtonPressEffect(startButton);
        });
    }
});

nextButton.addEventListener('click', () => {
    stepConversion();
    handleButtonPressEffect(nextButton);
});

function handleButtonPressEffect(buttonElement) {
    // Change button image to active state
    buttonElement.src = 'assets/images/active_button.png';

    // Revert button image back to original after 200ms
    setTimeout(() => {
        buttonElement.src = 'assets/images/button.png';
    }, 200);
}

// Display Main
function showMainContent() {
    document.querySelector('.to-postfix').classList.remove('hidden');
    document.getElementById('start').style.display = 'none';
}


// Infix to Postfix
let stack = [];
    let postfix = '';
    let index = 0;
    let expression = '';
    let currentToken = '';

    function precedence(op) {
      if (op === '+' || op === '-') return 1;
      if (op === '*' || op === '/') return 2;
      return 0;
    }

function startConversion() {
    expression = document.getElementById('infixInput').value;
    postfix = '';
    stack = [];
    index = 0;
    currentToken = '';

    document.getElementById('postfixOutput').textContent = '';
    document.getElementById('stackOutput').textContent = 'Stack: []';
    document.getElementById('currentPostfix').textContent = 'Postfix: ';
    document.getElementById('stepButton').disabled = false;

    displayNextCharacter();
  }

function getNextToken() {
        if (index >= expression.length) return null;

        let char = expression[index];
        let numberBuffer = '';

        // Capture multi-digit numbers
        if (!isNaN(char) && char !== ' ') {
            while (index < expression.length && !isNaN(expression[index]) && expression[index] !== ' ') {
            numberBuffer += expression[index];
            index++;
            }
            return numberBuffer;
        } else {
            index++;  // Move index to next character for operators or parentheses
            return char;
        }
    }

function displayNextCharacter() {
        currentToken = getNextToken();
        if (currentToken === null) {
            document.getElementById('outputDisplay').textContent = 'Conversion Complete!';
        } else {
            document.getElementById('outputDisplay').textContent = `Next Character: ${currentToken}`;
        }
    }

function stepConversion() {
        if (currentToken === null) {
            while (stack.length) {
            postfix += stack.pop() + ' ';
            }
            document.getElementById('postfixOutput').textContent = `Final Postfix: ${postfix.trim()}`;
            document.getElementById('stepButton').disabled = true;
            document.getElementById('outputDisplay').textContent = 'Conversion Complete!';
            return;
        }

        // Process current token
        if (!isNaN(currentToken)) {
            postfix += currentToken + ' ';
        } else if (currentToken === '(') {
            stack.push(currentToken);
        } else if (currentToken === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
            postfix += stack.pop() + ' ';
            }
            stack.pop();
        } else if (['+', '-', '*', '/'].includes(currentToken)) {
            while (stack.length && precedence(stack[stack.length - 1]) >= precedence(currentToken) && stack[stack.length - 1] !== '(') {
            postfix += stack.pop() + ' ';
            }
            stack.push(currentToken);
        }

        // Update stack and postfix display
        document.getElementById('stackOutput').textContent = `Stack: [${stack.join(', ')}]`;
        document.getElementById('currentPostfix').textContent = `Postfix: ${postfix.trim()}`;

        // Display the next character
        displayNextCharacter();
    }

