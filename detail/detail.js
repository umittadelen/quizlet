document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const backButton = document.getElementById('back-button');

    // Get card data from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cardName = urlParams.get('card');

    async function loadCardDetails() {
        const response = await fetch(`../cards/${cardName}.json`);
        if (!response.ok) {
            console.error(`Failed to load card details for ${cardName}`);
            return;
        }
        const cardData = await response.json();
        createCard(cardData);
    }

    function createCard(data) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="front">${data.DESCRIPTION}</div>
            <div class="back">
                <h3>${data.PUBLISHER}</h3>
                <h4>Words:</h4>
                <ul>${data.WORDS.map(word => `<li>${word}</li>`).join('')}</ul>
                <h4>Explanations:</h4>
                <ul>${data.EXPLANATIONS.map(exp => `<li>${exp}</li>`).join('')}</ul>
            </div>
        `;

        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });

        cardContainer.appendChild(card);
    }

    // Back button functionality
    backButton.addEventListener('click', () => {
        window.history.back();
    });

    loadCardDetails();
});
