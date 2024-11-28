// Postfix Evaluation
function onStartEvaluation()
{
    startButtonSound.currentTime = 0;
    startButtonSound.play();
    startEvaluation();
    ButtonPressEffect(startButton);
}

function onStepEvaluation()
{
    // Play the sound and reset its current time
    nextButtonSound.currentTime = 0;
    nextButtonSound.play().catch(error => console.error("Audio playback failed: ", error));
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
        finalAnswerSound.play();
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