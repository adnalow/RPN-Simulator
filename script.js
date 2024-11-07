const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('stepButton');

// Set up event listeners for start and next buttons
startButton.addEventListener('click', () => {
    startConversion();
});

nextButton.addEventListener('click', stepConversion);



function showMainContent(buttonElement) {
    document.querySelector('.to-postfix').classList.remove('hidden');
    document.getElementById('start').style.display = 'none';

    buttonElement.src = 'assets/images/active_button.png';

    setTimeout(() => {
        buttonElement.src = 'assets/images/button.png';
    }, 200); // Adjust timing for a realistic arcade press effect
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