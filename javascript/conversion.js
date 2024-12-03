// Infix to Postfix
let stack = [];
let postfix = '';
let index = 0;
let expression = '';
let currentToken = '';
let postfixFinal = '';

function precedence(op)
{
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    if (op === '^') return 3; 
    return 0;
}

//stepConversion event listener separately
function onNextButtonClick()
{
    // Play the sound and reset its current time
    nextButtonSound.currentTime = 0;
    nextButtonSound.play().catch(error => console.error("Audio playback failed: ", error));
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    if (!isGameOver)
    {
        stepConversion();
        ButtonPressEffect(nextButton);
    }
    else
    {
        resetToStart();
    }
}

function checkExpressionType() {
    // Get the user input from the input field
    const input = document.getElementById('infixInput').value.trim();

    // Check if the input is empty
    if (input === "") {
        return "Input is empty. Please enter an expression.";
    }

    // Regular expression to validate numeric expressions
    const numericPattern = /^[\d+\-*/^().\s]+$/; // Matches digits, operators, and parentheses

    // Check if the input contains invalid characters
    if (!numericPattern.test(input)) {
        return "Input contains invalid characters. Only numeric expressions are allowed.";
    }

    // Check for syntax errors
    if (!isValidExpression(input)) {
        return 0; // Invalid expression
    }

    return 1; // Valid numeric expression
}

// Helper function to validate expression syntax
function isValidExpression(expression) {
    // Remove spaces for easier processing
    expression = expression.replace(/\s+/g, '');

    // Check for invalid consecutive operators (e.g., `++`, `--`, `+*`, etc.)
    // Allow cases like `1+-2` where `-` acts as a unary operator
    if (/([+\-*\/^]{2,})/.test(expression)) {
        const invalidPattern = /[*/^]{2,}|\*\-|\/\-|\^\-/;
        if (invalidPattern.test(expression)) {
            return false; // Disallow invalid consecutive operators
        }
    }

    // Check if the expression starts or ends with an invalid operator
    if (/^[+*\/^]/.test(expression) || /[+\-*\/^]$/.test(expression)) {
        return false;
    }

    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (const char of expression) {
        if (char === '(') {
            parenthesesCount++;
        } else if (char === ')') {
            parenthesesCount--;
        }
        if (parenthesesCount < 0) {
            return false; // More closing parentheses than opening
        }
    }
    if (parenthesesCount !== 0) {
        return false; // Unbalanced parentheses
    }

    return true; // The expression is valid
}

function startConversion() {
    const expressionType = checkExpressionType();

    if (expressionType === 1) {
        expression = document.getElementById('infixInput').value;
        postfix = '';
        stack = [];
        index = 0;
        currentToken = '';

        document.getElementById('postfixOutput').textContent = '';
        document.getElementById('stackOutput').textContent = 'Stack: []';
        document.getElementById('currentPostfix').textContent = 'Postfix: ';
        document.getElementById('stepButton').disabled = false;

        nextButton.removeEventListener('click', nextInitial);
        nextButton.addEventListener('click', onNextButtonClick);

        displayNextCharacter();
    } else {
        // Display error message for invalid input
        const outputDisplay = document.getElementById('outputDisplay');
        outputDisplay.textContent = 
            expressionType === 0 
                ? "The expression is invalid. Enter a valid numeric expression."
                : expressionType;
    }
}

function getNextToken() {

    if (index >= expression.length) return null;

    let char1 = expression[index];
    let numberBuffer1 = '';

    // Handle negative numbers
    if (
        char1 === '-' &&
        (index === 0 || /[+\-*/(^]/.test(expression[index - 1]))
    ) {
        numberBuffer1 += '-';
        index++;
        while (
            index < expression.length &&
            !isNaN(expression[index]) &&
            expression[index] !== ' '
        ) {
            numberBuffer1 += expression[index];
            index++;
        }
        return numberBuffer1; // Return the negative number
    }

    // Capture multi-digit numbers
    if (!isNaN(char1) && char1 !== ' ') {
        while (
            index < expression.length &&
            !isNaN(expression[index]) &&
            expression[index] !== ' '
        ) {
            numberBuffer1 += expression[index];
            index++;
        }
        return numberBuffer1;
    } else {
        index++; // Move index to next character for operators or parentheses
        return char1;
    }
}

function displayNextCharacter() {
    const expressionType = checkExpressionType();

    if (expressionType === 1) {
        currentToken = getNextToken();
        if (currentToken !== null) {
            document.getElementById('outputDisplay').textContent = `Next Character: ${currentToken}`;
        }
    } else {
        const outputDisplay = document.getElementById('outputDisplay');
        outputDisplay.textContent = 
            expressionType === 0 
                ? "The expression is invalid. Enter a valid numeric expression."
                : expressionType;
    }
}


function stepConversion()
{
    if (currentToken === null)
    {
        while (stack.length)
        {
            postfix += stack.pop() + ' ';
        }
        postfixFinal = postfix.trim();
        document.getElementById('stepButton').disabled = true;
        transitionToPostfixAnswer();
        return;
    }

    // Process current token
    if (!isNaN(currentToken))
    {
        postfix += currentToken + ' ';
    } else if (currentToken === '(')
    {
        stack.push(currentToken);
    } else if (currentToken === ')')
    {
        while (stack.length && stack[stack.length - 1] !== '(')
        {
            postfix += stack.pop() + ' ';
        }
        stack.pop();
    } else if (['+', '-', '*', '/', '^'].includes(currentToken)) {
        while (
            stack.length &&
            ((currentToken !== '^' && precedence(stack[stack.length - 1]) >= precedence(currentToken)) ||
            (currentToken === '^' && precedence(stack[stack.length - 1]) > precedence(currentToken))) &&
            stack[stack.length - 1] !== '('
        ) {
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

function onStartPostfix()
{
    startButtonSound.currentTime = 0;
    startButtonSound.play();
    showFinalOutput();
    ButtonPressEffect(startButton);
}

function finalOutputButton()
{
    resultSound.play();
    // Display final output and trigger button effect
    showFinalOutput();
    ButtonPressEffect(nextButton);

    const result = checkExpressionType();

    if (result !== 1)
    {
        console.log(result);
        document.querySelector('.postfix-evaluation').classList.add('hidden');
        document.querySelector('.postfix-evaluation').style.display = 'none';
        nextButton.removeEventListener('click', finalOutputButton);
        nextButton.addEventListener('click', gameoverDisplay);
    }
     // Reset event listeners to transition to the next phase on button click
     nextButton.removeEventListener('click', finalOutputButton);
     nextButton.addEventListener('click', transitionToPostfixEvaluation);

    startButton.removeEventListener('click', onStartButtonClick);
    startButton.addEventListener('click', onStartPostfix);

}

function transitionToPostfixAnswer()
{
    ButtonPressEffect(nextButton);

    // Update the display for the current step
    document.getElementById('stackOutput').textContent = `Stack: [${stack.join(', ')}]`;
    document.getElementById('currentPostfix').textContent = `Postfix: ${postfix.trim()}`;
    document.getElementById('outputDisplay').textContent = 'Conversion Complete!';

    // Update button event listeners for evaluation phase
    nextButton.removeEventListener('click', onNextButtonClick);
    nextButton.addEventListener('click', finalOutputButton);
}

function showFinalOutput()
{
    // Hide the postfix conversion container and show the final output container
    document.querySelector('.to-postfix').classList.add('hidden');
    document.querySelector('.finalOutputContainer').classList.remove('hidden');

    postfixFinal = postfix.trim();

    // Ensure the finalPostfixExpression element exists before setting text
    const finalPostfixElement = document.getElementById('postfixOutput');
    if (finalPostfixElement)
    {
        document.getElementById('outputDisplay').textContent = 'Conversion Complete!';
        document.getElementById('stepButton').disabled = false;
        document.getElementById('postfixOutput').innerHTML = `Final Postfix:<br><span style="color: #FFD700">${postfixFinal}</span>`;
    } else
    {
        console.error("Element with id 'finalPostfixExpression' not found in the DOM.");
    }

}