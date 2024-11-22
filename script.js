const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('stepButton');
const coinSlot = document.getElementById('coin_slot');
const tokenOut = document.getElementById('token_out');
const token = document.getElementById('draggable-token');

// initial animation for button
function startInitial()
{
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    ButtonPressEffect(startButton);
}

function nextInitial()
{
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    document.getElementById('gameOver').style.display = 'none';
    ButtonPressEffect(nextButton);
}

startButton.addEventListener('click', startInitial);
nextButton.addEventListener('click', nextInitial);


// token out
function onTokenOutClick()
{
    document.querySelector('.token').classList.remove('hidden');
}

tokenOut.addEventListener('click', onTokenOutClick);

// insert coin functionality
let isFirstClick = true; // Flag to check if it's the first click
let insertCoin = false;
let isDragging = false;
let offsetX, offsetY;
let isGameOver = false;


// token movement to coin slot

token.addEventListener('mousedown', () =>
{
    isDragging = true;
    token.style.pointerEvents = 'none'; // Prevent interference
});

document.addEventListener('mousemove', (event) =>
{
    if (isDragging)
    {
        event.preventDefault();

        // Set the token's position to follow the exact cursor location
        token.style.left = `${event.pageX}px`;
        token.style.top = `${event.pageY}px`;

        // Check if token is within the coin slot bounds
        const coinSlotRect = coinSlot.getBoundingClientRect();
        const tokenRect = token.getBoundingClientRect();

        const margin = 10; // Allow for a margin around the slot
        if (
            tokenRect.left >= coinSlotRect.left - margin &&
            tokenRect.right <= coinSlotRect.right + margin &&
            tokenRect.top >= coinSlotRect.top - margin &&
            tokenRect.bottom <= coinSlotRect.bottom + margin
        )
        {
            // Only execute once when token enters the slot
            insertCoin = true;
            token.classList.add('hidden');
            console.log("Token entered the coin slot!");

            // Transition to the start screen
            document.getElementById('insertCoin').style.display = 'none';
            document.getElementById('start').style.display = 'flex';

            startButton.removeEventListener('click', startInitial);
            startButton.addEventListener('click', onStartButtonClick);

            // Stop dragging since token is now "inserted"
            isDragging = false;
        }
    }
});

document.addEventListener('mouseup', () =>
{
    if (isDragging)
    {
        isDragging = false;
        token.style.pointerEvents = 'auto'; // Re-enable pointer events
    }
});

function onStartButtonClick()
{
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    document.getElementById('outputDisplay').textContent = '';
    if (isFirstClick)
    {
        showMainContent(); // Transition to main content
        isFirstClick = false; // Set the flag to false after first click
        if (isGameOver)
        {
            resetToStart();
        }
    } else
    {
        startConversion(); // Start conversion for subsequent clicks
    }
    ButtonPressEffect(startButton); // Always handle the button press effect
}

// press effect for start button
function ButtonPressEffect(buttonElement)
{
    if (buttonElement == startButton)
    {
        // Change button image to active state
        buttonElement.src = 'assets/images/pressed-start-button.png';

        // Revert button image back to original after 200ms
        setTimeout(() =>
        {
            buttonElement.src = 'assets/images/start-button.png';
        }, 200);
    }

    if (buttonElement == nextButton)
    {
        buttonElement.src = 'assets/images/pressed-next-button.png';

        setTimeout(() =>
        {
            buttonElement.src = 'assets/images/next-button.png';
        }, 200);
    }

}

// Display Main
function showMainContent()
{
    document.querySelector('.to-postfix').classList.remove('hidden');
    document.getElementById('start').style.display = 'none';
}

function resetToStart()
{
    // Reset all necessary flags and variables
    stack = [];
    postfix = '';
    index = 0;
    expression = '';
    currentToken = '';
    postfixFinal = '';
    evaluationStack = [];
    placeholderStack = [];
    evaluationIndex = 0;
    operations = [];
    resultStack = [];
    isDragging = true;
    isGameOver = false;
    isFirstClick = true;

    // Clear input and output fields
    document.getElementById('infixInput').value = '';
    document.getElementById('postfixOutput').textContent = '';
    document.getElementById('stackOutput').textContent = 'Stack: []';
    document.getElementById('currentPostfix').textContent = 'Postfix: ';
    document.getElementById('evaluationOutput').textContent = '';
    document.getElementById('evaluationStackOutput').textContent = 'Stack: []';
    document.getElementById('operationsOutput').textContent = 'Operations: []';
    document.getElementById('resultStackOutput').textContent = 'Result: []';
    document.getElementById('outputDisplay').textContent = '';
    document.getElementById('currentOutput').textContent = '';

    // Reset visibility of containers
    document.querySelector('.to-postfix').classList.add('hidden');
    document.querySelector('.finalOutputContainer').classList.add('hidden');
    document.querySelector('.postfix-evaluation').classList.add('hidden');
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('insertCoin').style.display = 'flex';

    // Reset event listeners
    startButton.removeEventListener('click', startfinalEvaluationButton);
    startButton.addEventListener('click', startInitial);

    nextButton.addEventListener('click', nextInitial);
    nextButton.removeEventListener('click', gameoverDisplay);
}


// Function to trigger reset after GAME OVER
function gameoverDisplay()
{
    // Display the "Game Over" screen
    document.querySelector('.finalOutputContainer').classList.add('hidden');
    document.querySelector('.postfix-evaluation').style.display = 'none';
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('insertCoin').style.display = 'none';

    isGameOver = true;

    // Automatically reset after 5 seconds
    setTimeout(() =>
    {
        resetToStart(); // Reset the game
    }, 2000);
}


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

function checkExpressionType()
{
    // Get the user input from the input field
    const input = document.getElementById('infixInput').value.trim();

    // Check if the input is empty
    if (input === "")
    {
        return "Input is empty. Please enter an expression.";
    }

    // Regular expressions to test the input
    const numericPattern = /^[\d+\-*/^().\s]+$/; // Matches digits, operators, and parentheses
    const algebraicPattern = /^[a-zA-Z+\-*/^().\s]+$/; // Matches letters, operators, and parentheses


    // Check if the input matches the numeric pattern
    if (numericPattern.test(input))
    {
        return 1;
    }

    // Check if the input matches the algebraic pattern
    if (algebraicPattern.test(input))
    {
        return 2;
    }

    // If the input contains both numbers and letters, it is mixed
    return 3;
}

function startConversion()
{
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
}

function getNextToken(expressionType)
{
    switch (expressionType)
    {
        case 1:
            if (index >= expression.length) return null;

            let char1 = expression[index];
            let numberBuffer1 = '';

            // Handle negative numbers
            if (char1 === '-' && (index === 0 || /[+\-*/(^]/.test(expression[index - 1]))) {
                numberBuffer1 += '-';
                index++;
                while (index < expression.length && !isNaN(expression[index]) && expression[index] !== ' ') {
                    numberBuffer1 += expression[index];
                    index++;
                }
                return numberBuffer1; // Return the negative number
            }

            // Capture multi-digit numbers
            if (!isNaN(char1) && char1 !== ' ')
            {
                while (index < expression.length && !isNaN(expression[index]) && expression[index] !== ' ')
                {
                    numberBuffer1 += expression[index];
                    index++;
                }
                return numberBuffer1;
            } else
            {
                index++;  // Move index to next character for operators or parentheses
                return char1;
            }
        case 2:
            if (index >= expression.length) return null;

            let char2 = expression[index];

            // Capture single alphabetic characters
            if (/[a-zA-Z]/.test(char2))
            {
                index++; // Move to the next character
                return char2;
            } else
            {
                // Move index to the next character for operators or parentheses
                index++;
                return char2;
            }
        case 3:
            if (index >= expression.length) return null;

            let char = expression[index];

            // Capture multi-digit numbers
            if (!isNaN(char) && char !== ' ')
            {
                let numberBuffer = '';
                while (index < expression.length && !isNaN(expression[index]) && expression[index] !== ' ')
                {
                    numberBuffer += expression[index];
                    index++;
                }
                return numberBuffer; // Return the complete number
            }

            // Capture single alphabetic characters
            if (/[a-zA-Z]/.test(char))
            {
                index++; // Move to the next character
                return char; // Return the alphabetic character
            }

            // For operators or parentheses
            index++;
            return char; // Return the operator or parenthesis

    }
}

function displayNextCharacter()
{
    const expressionType = checkExpressionType();
    currentToken = getNextToken(expressionType);
    if (currentToken !== null)
    {
        document.getElementById('outputDisplay').textContent = `Next Character: ${currentToken}`;
    }
}


function stepConversion()
{
    const result = checkExpressionType();
    switch (result)
    {
        // if it is numeric expression
        case 1:
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
            break;
        // if algebraic expression
        case 2:
            if (currentToken === null)
            {
                while (stack.length)
                {
                    postfix += stack.pop() + ' ';
                }

                document.getElementById('stackOutput').textContent = 'Stack: []';
                document.getElementById('currentPostfix').textContent = 'Postfix: ' + postfix.trim();
                document.getElementById('stepButton').disabled = true;

                transitionToPostfixAnswer();
                return;
            }

            // Ensure currentToken is read correctly
            if (/[a-zA-Z]/.test(currentToken))
            {
                // Append alphabetic operands directly to the postfix result
                postfix += currentToken + ' ';
            } else if (currentToken === '(')
            {
                // Push opening parentheses onto the stack
                stack.push(currentToken);
            } else if (currentToken === ')')
            {
                // Pop from stack until an opening parenthesis is encountered
                while (stack.length && stack[stack.length - 1] !== '(')
                {
                    postfix += stack.pop() + ' ';
                }
                stack.pop(); // Remove the '(' from the stack
            } else if (['+', '-', '*', '/', '^'].includes(currentToken))
            {
                // Process operators
                while (
                    stack.length &&
                    precedence(stack[stack.length - 1]) >= precedence(currentToken)
                )
                {
                    postfix += stack.pop() + ' ';
                }
                stack.push(currentToken);
            }

            // Update the display for the current step
            document.getElementById('stackOutput').textContent = `Stack: [${stack.join(', ')}]`;
            document.getElementById('currentPostfix').textContent = `Postfix: ${postfix.trim()}`;
            displayNextCharacter();
            break;
        case 3:
            if (currentToken === null)
            {
                // Process remaining stack at the end
                while (stack.length)
                {
                    postfix += stack.pop() + ' ';
                }

                document.getElementById('stackOutput').textContent = 'Stack: []';
                document.getElementById('currentPostfix').textContent = 'Postfix: ' + postfix.trim();
                document.getElementById('stepButton').disabled = true;

                transitionToPostfixAnswer();
                return;
            }

            // Handle operands (numbers or alphabetic characters)
            if (/[a-zA-Z0-9]/.test(currentToken))
            {
                postfix += currentToken + ' ';
            } else if (currentToken === '(')
            {
                // Push opening parenthesis onto the stack
                stack.push(currentToken);
            } else if (currentToken === ')')
            {
                // Pop until an opening parenthesis is encountered
                while (stack.length && stack[stack.length - 1] !== '(')
                {
                    postfix += stack.pop() + ' ';
                }
                stack.pop(); // Remove the '(' from the stack
            } else if (['+', '-', '*', '/', '^'].includes(currentToken))
            {
                // Process operators
                while (
                    stack.length &&
                    precedence(stack[stack.length - 1]) >= precedence(currentToken) &&
                    stack[stack.length - 1] !== '('
                )
                {
                    postfix += stack.pop() + ' ';
                }
                stack.push(currentToken); // Push current operator onto the stack
            }

            // Update UI for each step
            document.getElementById('stackOutput').textContent = `Stack: [${stack.join(', ')}]`;
            document.getElementById('currentPostfix').textContent = `Postfix: ${postfix.trim()}`;

            // Get the next token
            displayNextCharacter();
            break;
        default:
            break;
    }
}

function onStartPostfix()
{
    showFinalOutput();
    ButtonPressEffect(startButton);
}

function finalOutputButton()
{
    // Display final output and trigger button effect
    showFinalOutput();
    ButtonPressEffect(nextButton);

    const result = checkExpressionType();

    if (result !== 1)
    {
        console.log(result);
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

// Postfix Evaluation
function onStartEvaluation()
{
    startEvaluation();
    ButtonPressEffect(startButton);
}

function onStepEvaluation()
{
    stepEvaluation();
    ButtonPressEffect(nextButton);
}

function transitionToPostfixEvaluation()
{

    ButtonPressEffect(nextButton);
    // Hide the final output container and show the postfix evaluation container
    document.querySelector('.finalOutputContainer').classList.add('hidden');
    document.querySelector('.postfix-evaluation').classList.remove('hidden');
    document.querySelector('.postfix-evaluation').style.display = 'flex';

    document.getElementById('postfix-final').textContent = postfixFinal;

    // Update button event listeners for evaluation phase
    nextButton.removeEventListener('click', transitionToPostfixEvaluation);
    nextButton.addEventListener('click', onStepEvaluation);

    // Reset start button for the evaluation phase
    startButton.removeEventListener('click', onStartPostfix);
    startButton.addEventListener('click', onStartEvaluation);
}

let evaluationStack = [];
let placeholderStack = [];
let evaluationIndex = 0;
let evaluationExpression = '';
let operations = [];
let resultStack = [];

function startEvaluation()
{
    evaluationStack = [];
    placeholderStack = [];
    evaluationIndex = 0;
    operations = [];
    resultStack = [];
    document.getElementById('evaluationOutput').textContent = '';
    document.getElementById('evaluationStackOutput').textContent = 'Stack: []';
    document.getElementById('operationsOutput').textContent = 'Operations: []';
    document.getElementById('resultStackOutput').textContent = 'Result: []';
    document.getElementById('currentOutput').textContent = '';
    document.getElementById('stepButton').disabled = false;
}

function performOperation(op, operand1, operand2)
{
    switch (op)
    {
        case '+': return operand1 + operand2;
        case '-': return operand1 - operand2;
        case '*': return operand1 * operand2;
        case '/': return operand1 / operand2;
        case '^': return Math.pow(operand1, operand2);
        default: return 0;
    }
}

function stepEvaluation() {
    document.querySelector('.finalOutputContainer').classList.add('hidden');

    // Skip spaces to move directly to the next character or token
    while (evaluationIndex < postfixFinal.length && postfixFinal[evaluationIndex] === ' ') {
        evaluationIndex++;
    }

    // End evaluation if we've processed all characters
    if (evaluationIndex >= postfixFinal.length) {
        document.getElementById('stepButton').disabled = true;
        nextfinalEvaluationButton();
        return;
    }

    // Process the current token
    let char = postfixFinal[evaluationIndex];
    let numberBuffer = '';

    // Handle multi-digit numbers
    if (!isNaN(char) && char !== ' ' || (char === '-' && evaluationIndex + 1 < postfixFinal.length 
        && !isNaN(postfixFinal[evaluationIndex + 1]) && postfixFinal[evaluationIndex + 1] !== ' ')) {
        // Check if '-' is a negative sign for a number
        if (char === '-') {
            numberBuffer += char; // Add the negative sign
            evaluationIndex++;
        }
        // Continue reading digits to form the number
        while (evaluationIndex < postfixFinal.length && !isNaN(postfixFinal[evaluationIndex]) && postfixFinal[evaluationIndex] !== ' ') {
            numberBuffer += postfixFinal[evaluationIndex];
            evaluationIndex++;
        }
        evaluationStack.push(parseFloat(numberBuffer)); // Convert and push to stack
        placeholderStack.push(parseFloat(numberBuffer));
        document.getElementById('currentOutput').textContent = `Current operand: ${numberBuffer}`;
    } else if (['+', '-', '*', '/', '^'].includes(char)) { // If it's an operator
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
        document.getElementById('operationsOutput').textContent = `Operations: [${operations.join(', ')}]`;

        evaluationIndex++; // Increment the index after processing operator
    }

    // Update display elements
    document.getElementById('evaluationStackOutput').textContent = `Stack: [${evaluationStack.join(', ')}]`;
    document.getElementById('resultStackOutput').textContent = `Result: [${resultStack.join(', ')}]`;

    // Clean up operations and results after display
    if (operations.length > 0) {
        operations.pop();
    }
    if (resultStack.length > 0) {
        resultStack.pop();
    }
}


function startfinalEvaluationButton()
{
    // Display final output and trigger button effect
    document.getElementById('gameOver').style.display = 'none';
    showEvaluatedOutput();
    ButtonPressEffect(startButton);
}

function nextfinalEvaluationButton()
{
    // Display final output and trigger button effect
    showEvaluatedOutput();
    ButtonPressEffect(nextButton);

    nextButton.removeEventListener('click', onStepEvaluation);
    nextButton.addEventListener('click', gameoverDisplay);


    startButton.removeEventListener('click', onStartEvaluation);
    startButton.addEventListener('click', startfinalEvaluationButton);
}

function showEvaluatedOutput()
{
    if (!isGameOver)
    {
        document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
        document.querySelector('.postfix-evaluation').classList.add('hidden');
        document.querySelector('.postfix-evaluation').style.display = 'none';
        document.querySelector('.evaluatedOutputContainer').classList.remove('hidden');

        const finalPostfixElement = document.getElementById('evaluationOutput');
        if (finalPostfixElement)
        {
            document.getElementById('outputDisplay').textContent = 'Conversion Complete!';
            finalPostfixElement.innerHTML = `Final Answer:<br><span style="color: #FFD700">${placeholderStack[0]}</span>`;
        } else
        {
            console.error("Element with id 'evaluationOutput' not found in the DOM.");
        }
    }
    else
    {
        resetToStart();
    }

}