// token out
function onTokenOutClick()
{
    tokenOutSound.play();
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
            insertCoinSound.play();
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