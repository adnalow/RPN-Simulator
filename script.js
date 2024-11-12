const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('stepButton');
const coinSlot = document.getElementById('coin_slot');
const tokenOut = document.getElementById('token_out');
const token = document.getElementById('draggable-token');

// initial animation for button
function startInitial() {
    ButtonPressEffect(startButton);
}

function nextInitial() {
    ButtonPressEffect(nextButton);
}

startButton.addEventListener('click', startInitial);
nextButton.addEventListener('click', nextInitial);

// insert coin functionality
let isFirstClick = true; // Flag to check if it's the first click
let insertCoin = false;
let isDragging = false;
let offsetX, offsetY;


// token out

function onTokenOutClick() {
    document.querySelector('.token').classList.remove('hidden');
}


tokenOut.addEventListener('click', onTokenOutClick);



// token movement to coin slot

token.addEventListener('mousedown', (event) => {
    isDragging = true;
    const tokenRect = token.getBoundingClientRect();
    offsetX = event.clientX - tokenRect.left;
    offsetY = event.clientY - tokenRect.top;
    token.style.pointerEvents = 'none';
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        event.preventDefault();

        // Adjusting the position considering the zoom level
        const zoomScale = window.devicePixelRatio; // Get zoom scale factor

        const adjustedX = (event.clientX - offsetX) * zoomScale; // Adjust with zoom
        const adjustedY = (event.clientY - offsetY) * zoomScale;

        token.style.left = `${adjustedX}px`;
        token.style.top = `${adjustedY}px`;

        // Check if token is within the coin slot bounds
        const coinSlotRect = coinSlot.getBoundingClientRect();
        const tokenRect = token.getBoundingClientRect();

        const margin = 10; // Allow for a margin around the slot
        if (
            tokenRect.left >= coinSlotRect.left - margin &&
            tokenRect.right <= coinSlotRect.right + margin &&
            tokenRect.top >= coinSlotRect.top - margin &&
            tokenRect.bottom <= coinSlotRect.bottom + margin
        ) {
            insertCoin = true;
            token.parentNode.removeChild(token);
            console.log("Token entered the coin slot!");

            // when insertCoin = true, go to start screen
            document.getElementById('insertCoin').style.display = 'none';
            document.getElementById('start').style.display = 'flex';

            startButton.removeEventListener('click', startInitial);
            startButton.addEventListener('click', onStartButtonClick);
        }
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        token.style.pointerEvents = 'auto'; // Re-enable pointer events
        if (!insertCoin) {
            console.log("Token dropped outside the coin slot");
        }
    }
});

function onStartButtonClick() {
    if (isFirstClick) {
        showMainContent(); // Transition to main content
        isFirstClick = false; // Set the flag to false after first click
    } else {
        startConversion(); // Start conversion for subsequent clicks
    }
    ButtonPressEffect(startButton); // Always handle the button press effect
}

// press effect for start button
function ButtonPressEffect(buttonElement) {
    if (buttonElement == startButton) {
        // Change button image to active state
        buttonElement.src = 'assets/images/pressed-start-button.png';

        // Revert button image back to original after 200ms
        setTimeout(() => {
            buttonElement.src = 'assets/images/start-button.png';
        }, 200);
    }

    if (buttonElement == nextButton) {
        buttonElement.src = 'assets/images/pressed-next-button.png';

        setTimeout(() => {
            buttonElement.src = 'assets/images/next-button.png';
        }, 200);
    }
    
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

//stepConversion event listener separately
function onNextButtonClick() {
    stepConversion();
    ButtonPressEffect(nextButton);
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


    nextButton.removeEventListener('click', nextInitial);
    nextButton.addEventListener('click', onNextButtonClick);

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
    ButtonPressEffect(startButton); 
}

function onStepEvaluation() {
    stepEvaluation();
    ButtonPressEffect(nextButton);
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
    document.getElementById('operationsOutput').textContent = 'Operations: []';
    document.getElementById('resultStackOutput').textContent = 'Result: []';
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
        document.getElementById('operationsOutput').textContent = `Operations: [${operations.join(', ')}]`;

        evaluationIndex++;  // Increment the index after processing operator
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

function updateVideo() {
    const video = videos[currentVideoIndex];
    videoPlayer.src = `https://www.youtube.com/embed/${video.id}`;
    videoTitle.textContent = video.title;
    
    prevBtn.disabled = currentVideoIndex === 0;
    nextBtn.disabled = currentVideoIndex === videos.length - 1;
}

prevBtn.addEventListener('click', () => {
    if (currentVideoIndex > 0) {
        currentVideoIndex--;
        updateVideo();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentVideoIndex < videos.length - 1) {
        currentVideoIndex++;
        updateVideo();
    }
});

// Initialize the first video
updateVideo();
