const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('stepButton');
const coinSlot = document.getElementById('coin-slot-container');
const tokenOut = document.getElementById('token_out');
const token = document.getElementById('draggable-token');

const startButtonSound = new Audio('assets/sounds/startButton.mp3');
const nextButtonSound = new Audio('assets/sounds/nextButton.mp3');
const tokenOutSound = new Audio('assets/sounds/tokenOut.mp3');
const insertCoinSound = new Audio('assets/sounds/insertCoin.mp3');
const resultSound = new Audio('assets/sounds/gameStart.mp3');
const gameEndSound = new Audio('assets/sounds/gameEnd.mp3');
const gameOverSound = new Audio('assets/sounds/gameOver.mp3');
const finalAnswerSound = new Audio('assets/sounds/finalAnswer.mp3');


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

function onStartButtonClick()
{
    startButtonSound.currentTime = 0;
    startButtonSound.play();
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

    tokenOut.addEventListener('click', onTokenOutClick);
}


// Function to trigger reset after GAME OVER
function gameoverDisplay()
{
    gameOverSound.play();
    // Display the "Game Over" screen
    document.querySelector('.finalOutputContainer').classList.add('hidden');
    document.querySelector('.postfix-evaluation').classList.add('hidden');
    document.querySelector('.postfix-evaluation').style.display = 'none';
    document.querySelector('.evaluatedOutputContainer').classList.add('hidden');
    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('insertCoin').style.display = 'none';

    isGameOver = true;

    // Automatically reset after 5 seconds
    setTimeout(() =>
    {
        resetToStart(); // Reset the game
    }, 4000);
}