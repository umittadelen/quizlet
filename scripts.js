document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const searchInput = document.getElementById('search');
    
    // Load cards from JSON files
    async function loadCards() {
        // Example: Replace with actual card names
        const cardFiles = ['card1.json', 'card2.json'];
        for (const file of cardFiles) {
            const response = await fetch(`cards/${file}`);
            const cardData = await response.json();
            createCard(cardData);
        }
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

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            const description = card.querySelector('.front').textContent.toLowerCase();
            if (description.includes(searchValue)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    loadCards();
});
