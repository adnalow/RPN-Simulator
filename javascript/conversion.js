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