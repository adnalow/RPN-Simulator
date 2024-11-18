const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('stepButton');
const coinSlot = document.getElementById('coin_slot');
const tokenOut = document.getElementById('token_out');
const token = document.getElementById('draggable-token');

// initial animation for button
function startInitial()
{
    ButtonPressEffect(startButton);
}

function nextInitial()
{
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
            token.parentNode.removeChild(token);
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
    if (isFirstClick)
    {
        showMainContent(); // Transition to main content
        isFirstClick = false; // Set the flag to false after first click
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

function resetToStart() {
    // Reset all variables
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
    isFirstClick = true;

    // Reset all relevant UI elements
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

    // Hide all containers except the starting point
    document.querySelector('.to-postfix').classList.add('hidden');
    document.querySelector('.finalOutputContainer').classList.add('hidden');
    document.querySelector('.postfix-evaluation').classList.add('hidden');
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('insertCoin').style.display = 'flex';

    // Reset button events
    startButton.removeEventListener('click', onStartPostfix);
    startButton.addEventListener('click', startInitial);
    nextButton.removeEventListener('click', transitionToFinalEvaluation);
    nextButton.addEventListener('click', nextInitial);
}

// Function to trigger reset after GAME OVER
function gameoverDisplay() {
    document.querySelector('.finalOutputContainer').classList.add('hidden');
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    document.getElementById('gameOver').style.display = 'flex';

    // Set a 5-second timeout to reset the program
    setTimeout(resetToStart, 5000);
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
    return 0;
}

//stepConversion event listener separately
function onNextButtonClick()
{
    stepConversion();
    ButtonPressEffect(nextButton);
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
    const numericPattern = /^[\d+\-*/().\s]+$/; // Matches digits and math operators
    const algebraicPattern = /^[a-zA-Z+\-*/().\s]+$/; // Matches alphabetic characters and math operators

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
    if (currentToken === null)
    {
        document.getElementById('outputDisplay').textContent = 'Conversion Complete!';
    } else
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
                finalOutputButton();
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
            } else if (['+', '-', '*', '/'].includes(currentToken))
            {
                while (stack.length && precedence(stack[stack.length - 1]) >= precedence(currentToken) && stack[stack.length - 1] !== '(')
                {
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

                finalOutputButton();
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
            } else if (['+', '-', '*', '/'].includes(currentToken))
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

                finalOutputButton();
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
            } else if (['+', '-', '*', '/'].includes(currentToken))
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

    if (result === 1)
    {
        // Reset event listeners to transition to the next phase on button click
        nextButton.removeEventListener('click', onNextButtonClick);
        nextButton.addEventListener('click', transitionToPostfixEvaluation);
    } else
    {
        nextButton.removeEventListener('click', onNextButtonClick);
        nextButton.addEventListener('click', gameoverDisplay);
    }

    startButton.removeEventListener('click', onStartButtonClick);
    startButton.addEventListener('click', onStartPostfix);

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
        document.getElementById('postfixOutput').innerHTML = `FINAL POSTFIX:<br><span style="color: #FFD700">${postfixFinal}</span><br>PRESS NEXT`;
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
    // Hide the final output container and show the postfix evaluation container
    document.querySelector('.finalOutputContainer').classList.add('hidden');
    document.querySelector('.postfix-evaluation').classList.remove('hidden');

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
        default: return 0;
    }
}

function stepEvaluation()
{
    document.querySelector('.finalOutputContainer').classList.add('hidden');

    // Skip spaces to move directly to the next character or token
    while (evaluationIndex < postfixFinal.length && postfixFinal[evaluationIndex] === ' ')
    {
        evaluationIndex++;
    }

    // End evaluation if we've processed all characters
    if (evaluationIndex >= postfixFinal.length)
    {

        document.getElementById('stepButton').disabled = true;

        nextfinalEvaluationButton();
        return;
    }

    // Process the current token
    let char = postfixFinal[evaluationIndex];
    let numberBuffer = '';

    // Handle multi-digit numbers
    if (!isNaN(char) && char !== ' ')
    {
        while (evaluationIndex < postfixFinal.length && !isNaN(postfixFinal[evaluationIndex]) && postfixFinal[evaluationIndex] !== ' ')
        {
            numberBuffer += postfixFinal[evaluationIndex];
            evaluationIndex++;
        }
        evaluationStack.push(parseFloat(numberBuffer));
        placeholderStack.push(parseFloat(numberBuffer));
        document.getElementById('currentOutput').textContent = `Current operand: ${numberBuffer}`;
    } else if (['+', '-', '*', '/'].includes(char))
    {  // if it's an operator
        if (placeholderStack.length < 2)
        {
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

        evaluationIndex++;  // Increment the index after processing operator
    }

    // Update display elements
    document.getElementById('evaluationStackOutput').textContent = `Stack: [${evaluationStack.join(', ')}]`;
    document.getElementById('resultStackOutput').textContent = `Result: [${resultStack.join(', ')}]`;

    // Clean up operations and results after display
    if (operations.length > 0)
    {
        operations.pop();
    }
    if (resultStack.length > 0)
    {
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

    nextButton.removeEventListener('click', onNextButtonClick);
    nextButton.addEventListener('click', gameoverDisplay);

    
    startButton.removeEventListener('click', onStartEvaluation);
    startButton.addEventListener('click', startfinalEvaluationButton);
}

function transitionToFinalEvaluation()
{
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    document.querySelector('.postfix-evaluation').classList.add('hidden');
    document.querySelector('.evaluatedOutputContainer').classList.remove('hidden');

    document.getElementById('postfix-final').textContent = postfixFinal;

    // Update button event listeners for evaluation phase
    nextButton.removeEventListener('click', onStepEvaluation);
    nextButton.addEventListener('click', nextfinalEvaluationButton);

    // Reset start button for the evaluation phase
    startButton.removeEventListener('click', onStartEvaluation);
    startButton.addEventListener('click', startfinalEvaluationButton);
}

function showEvaluatedOutput()
{
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    document.querySelector('.postfix-evaluation').classList.add('hidden');
    document.querySelector('.evaluatedOutputContainer').classList.remove('hidden');

    const finalPostfixElement = document.getElementById('evaluationOutput');
    if (finalPostfixElement)
    {
        document.getElementById('outputDisplay').textContent = 'Conversion Complete!';
        finalPostfixElement.innerHTML = `FINAL ANSWER:<br><span style="color: #FFD700">${placeholderStack[0]}</span>`;
    } else
    {
        console.error("Element with id 'evaluationOutput' not found in the DOM.");
    }
}

// Video Player
const videos = [
    { id: 'QM_RsQ9Yeio?si=hqVmX0iNdmBkbR-Z', title: 'REVERSE POLISH NOTATION' },
    { id: '1VjJe1PeExQ?si=bOwKg5_prB4j5cyo', title: 'THE SHUNTING YARD ALGORITHM' },
    { id: 'vXPL6UavUeA?si=XnSRXCkF36Rd9-k1', title: 'INFIX TO POSTFIX CONVERSION' },
    { id: 'vq-nUF0G4fI?si=9TJ6Dz3FungziQWr', title: 'INFIX TO POSTFIX USING STACK' },
    { id: '84BsI5VJPq4?si=YNXATQ00WSHc2BPu', title: 'EVALUATION OF POSTFIX EXPRESSION' },
];

let currentVideoIndex = 0;
const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.getElementById('videoTitle');
const prevBtn = document.getElementById('prevButton');
const nextBtn = document.getElementById('nextButton');

function updateVideo()
{
    const video = videos[currentVideoIndex];
    videoPlayer.src = `https://www.youtube.com/embed/${video.id}`;
    videoTitle.textContent = video.title;

    prevBtn.disabled = currentVideoIndex === 0;
    nextBtn.disabled = currentVideoIndex === videos.length - 1;
}

prevBtn.addEventListener('click', () =>
{
    if (currentVideoIndex > 0)
    {
        currentVideoIndex--;
        updateVideo();
    }
});

nextBtn.addEventListener('click', () =>
{
    if (currentVideoIndex < videos.length - 1)
    {
        currentVideoIndex++;
        updateVideo();
    }
});

// Initialize the first video
updateVideo();
