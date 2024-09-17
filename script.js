document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const searchInput = document.getElementById('search');

    const cardFiles = ['økologi.json', 'anotherCard.json'];

    async function loadCards() {
        for (const file of cardFiles) {
            try {
                const response = await fetch(`cards/${file}`);
                if (!response.ok) throw new Error(`Network response was not ok ${response.statusText}`);
                const cardData = await response.json();
                console.log('Loaded card data:', cardData); // Log card data for debugging
                createSearchResult(cardData);
            } catch (error) {
                console.error(`Failed to load card ${file}:`, error);
            }
        }
    }

    function createSearchResult(data) {
        if (!data.DESCRIPTION) {
            console.error('Card data is missing DESCRIPTION:', data);
            return;
        }

        const result = document.createElement('div');
        result.className = 'search-result';
        result.innerHTML = `
            <a href="detail/card.html?card=${encodeURIComponent(data.DESCRIPTION)}">
                ${data.DESCRIPTION}
            </a>
        `;
        cardContainer.appendChild(result);
    }

    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const results = document.querySelectorAll('.search-result');

        results.forEach(result => {
            const description = result.textContent.toLowerCase();
            if (description.includes(searchValue)) {
                result.style.display = '';
            } else {
                result.style.display = 'none';
            }
        });
    });

    loadCards();
});
