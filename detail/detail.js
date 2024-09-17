document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const backButton = document.getElementById('back-button');

    // Extract card name from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cardDescription = urlParams.get('card');

    if (!cardDescription) {
        console.error('No card specified in query parameters');
        return;
    }

    async function loadCardDetails() {
        // Search for the file name based on card description
        const cardFiles = ['økologi.json', 'anotherCard.json']; // Ensure these match your actual filenames
        for (const file of cardFiles) {
            try {
                const response = await fetch(`../cards/${file}`);
                if (!response.ok) continue; // Skip files that don't match
                const cardData = await response.json();
                if (cardData.DESCRIPTION === cardDescription) {
                    createCard(cardData);
                    return;
                }
            } catch (error) {
                console.error(`Failed to load card details for ${cardDescription}:`, error);
            }
        }
        console.error(`Card ${cardDescription} not found`);
    }

    function createCard(data) {
        const card = document.createElement('div');
        card.className = 'card';

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-face front';
        cardFront.innerHTML = `${data.DESCRIPTION}`;

        const cardBack = document.createElement('div');
        cardBack.className = 'card-face back';
        cardBack.innerHTML = `
            <h3>${data.PUBLISHER}</h3>
            <h4>Words:</h4>
            <ul>${data.WORDS.map(word => `<li>${word}</li>`).join('')}</ul>
            <h4>Explanations:</h4>
            <ul>${data.EXPLANATIONS.map(exp => `<li>${exp}</li>`).join('')}</ul>
        `;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

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
