const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('stepButton');

let isFirstClick = true; // Flag to check if it's the first click

function onStartButtonClick() {
    if (isFirstClick) {
        showMainContent(); // Transition to main content
        isFirstClick = false; // Set the flag to false after first click
    } else {
        startConversion(); // Start conversion for subsequent clicks
    }
    handleButtonPressEffect(startButton); // Always handle the button press effect
}
startButton.addEventListener('click', onStartButtonClick);

// Define the stepConversion event listener separately
function onNextButtonClick() {
    stepConversion();
    handleButtonPressEffect(nextButton);
}

// Attach the stepConversion listener initially
nextButton.addEventListener('click', onNextButtonClick);

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

let postfixFinal = '';

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
        postfixFinal = postfix.trim(); // Store the final postfix expression for evaluation
        document.getElementById('postfixOutput').textContent = `Final Postfix: ${postfixFinal}`;
        document.getElementById('stepButton').disabled = true;
        document.getElementById('outputDisplay').textContent = 'Conversion Complete!';

        // Remove the previous stepConversion listener
        nextButton.removeEventListener('click', onNextButtonClick);

        // Add the transitionToPostfixEvaluation listener
        nextButton.addEventListener('click', transitionToPostfixEvaluation);
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

// Postfix Evaluation

function onStartEvaluation() {
    startEvaluation();
    handleButtonPressEffect(startButton); 
}

function onStepEvaluation() {
    stepEvaluation();
    handleButtonPressEffect(nextButton);

}

function transitionToPostfixEvaluation() {
    // Transition elements visibility
    document.querySelector('.to-postfix').classList.add('hidden');
    document.getElementById('postfix-final').textContent = postfixFinal;
    document.querySelector('.postfix-evaluation').classList.remove('hidden');

    startButton.removeEventListener('click', onStartButtonClick);
    startButton.addEventListener('click', onStartEvaluation);

    // Update the next button behavior for evaluation steps
    nextButton.removeEventListener('click', transitionToPostfixEvaluation);
    nextButton.addEventListener('click', onStepEvaluation);
}

let evaluationStack = [];
let placeholderStack = [];
let evaluationIndex = 0;
let evaluationExpression = '';
let operations = [];
let resultStack = [];

function startEvaluation() {
    evaluationStack = [];
    placeholderStack = [];
    evaluationIndex = 0;
    operations = [];
    resultStack = [];
    document.getElementById('evaluationOutput').textContent = '';
    document.getElementById('evaluationStackOutput').textContent = 'Stack: []';
    document.getElementById('operationsOutput').textContent = 'Operations to be done: []';
    document.getElementById('resultStackOutput').textContent = 'Result Stack: []';
    document.getElementById('currentOutput').textContent = '';
    document.getElementById('stepButton').disabled = false;
  }

  function performOperation(op, operand1, operand2) {
    switch (op) {
      case '+': return operand1 + operand2;
      case '-': return operand1 - operand2;
      case '*': return operand1 * operand2;
      case '/': return operand1 / operand2;
      default: return 0;
    }
  }

  function stepEvaluation() {
    // Skip spaces to move directly to the next character or token
    while (evaluationIndex < postfixFinal.length && postfixFinal[evaluationIndex] === ' ') {
        evaluationIndex++;
    }

    // End evaluation if we've processed all characters
    if (evaluationIndex >= postfixFinal.length) {
        document.getElementById('evaluationOutput').textContent = `Final Result: ${placeholderStack[0]}`;
        document.getElementById('stepButton').disabled = true;
        return;
    }
    
    // Process the current token
    let char = postfixFinal[evaluationIndex];
    let numberBuffer = '';

    // Handle multi-digit numbers
    if (!isNaN(char) && char !== ' ') {
        while (evaluationIndex < postfixFinal.length && !isNaN(postfixFinal[evaluationIndex]) && postfixFinal[evaluationIndex] !== ' ') {
            numberBuffer += postfixFinal[evaluationIndex];
            evaluationIndex++;
        }
        evaluationStack.push(parseFloat(numberBuffer));
        placeholderStack.push(parseFloat(numberBuffer));
        document.getElementById('currentOutput').textContent = `Current operand: ${numberBuffer}`;
    } else if (['+', '-', '*', '/'].includes(char)) {  // if it's an operator
        if (placeholderStack.length < 2) {
            document.getElementById('evaluationOutput').textContent = "Error: Invalid Expression"; 
            document.getElementById('stepButton').disabled = true;
            return;
        }
        
        document.getElementById('currentOutput').textContent = `Current operator: ${char}`;
        let operand2 = placeholderStack.pop();
        let operand1 = placeholderStack.pop();
        let result = performOperation(char, operand1, operand2);
        
        evaluationStack.pop();
        evaluationStack.pop();
        evaluationStack.push(result);
        placeholderStack.push(result);
        resultStack.push(result);

        let operation = `${operand1} ${char} ${operand2}`;
        operations.push(operation);
        document.getElementById('operationsOutput').textContent = `Operations to be done: [${operations.join(', ')}]`;

        evaluationIndex++;  // Increment the index after processing operator
    }

    // Update display elements
    document.getElementById('evaluationStackOutput').textContent = `Stack: [${evaluationStack.join(', ')}]`;
    document.getElementById('resultStackOutput').textContent = `Result Stack: [${resultStack.join(', ')}]`;

    // Clean up operations and results after display
    if (operations.length > 0) {
        operations.pop();
    }
    if (resultStack.length > 0) {
        resultStack.pop();
    }
}
