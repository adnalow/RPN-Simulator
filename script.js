function showMainContent(buttonElement) {
    document.querySelector('.to-postfix').classList.remove('hidden');
    document.getElementById('start').style.display = 'none';

    buttonElement.src = 'assets/images/active_button.png';

    setTimeout(() => {
        buttonElement.src = 'assets/images/button.png';
    }, 200); // Adjust timing for a realistic arcade press effect
}

