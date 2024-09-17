document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const backButton = document.getElementById('back-button');

    const urlParams = new URLSearchParams(window.location.search);
    const cardDescription = urlParams.get('card');

    if (!cardDescription) {
        console.error('No card specified in query parameters');
        return;
    }

    async function loadCardDetails() {
        const cardFiles = ['økologi.json', 'anotherCard.json'];
        for (const file of cardFiles) {
            try {
                const response = await fetch(`../cards/${file}`);
                if (!response.ok) continue;
                const cardData = await response.json();
                if (cardData.DESCRIPTION === cardDescription) {
                    console.log('Loaded card details:', cardData); // Log card data for debugging
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
        if (!data.DESCRIPTION || !data.WORDS || !data.EXPLANATIONS || !data.PUBLISHER) {
            console.error('Card data is missing required fields:', data);
            return;
        }

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

    backButton.addEventListener('click', () => {
        window.history.back();
    });

    loadCardDetails();
});
