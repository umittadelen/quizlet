const decks = ['./cards/økologi.json', './cards/test.json']; // Add other deck paths here

// Fetch all decks for searching
async function loadDecks() {
    const promises = decks.map(deck => fetch(deck).then(res => res.json()));
    return await Promise.all(promises);
}

// Search function
async function filterDecks() {
    const query = document.getElementById('search').value.toLowerCase();
    const deckList = document.getElementById('deckList');
    deckList.innerHTML = ''; // Clear old results

    const allDecks = await loadDecks();
    allDecks.forEach((deck, index) => {
        if (deck.NAME.toLowerCase().includes(query) || deck.PUBLISHER.toLowerCase().includes(query)) {
            const li = document.createElement('li');
            li.textContent = `${deck.NAME} by ${deck.PUBLISHER}`;
            li.onclick = () => openDeck(index);
            deckList.appendChild(li);
        }
    });
}

// Open selected deck
function openDeck(deckIndex) {
    localStorage.setItem('selectedDeck', deckIndex);
    window.location.href = 'card.html';
}

// Load and display cards
async function loadCards() {
    const deckIndex = localStorage.getItem('selectedDeck');
    if (deckIndex === null) return; // No deck selected

    const allDecks = await loadDecks();
    const deck = allDecks[deckIndex];

    const container = document.getElementById('cardsContainer');
    container.innerHTML = ''; // Clear old cards

    deck.WORDS.forEach((word, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="front"><p class="text">${word}</p></div>
            <div class="back"><p class="text">${deck.EXPLANATIONS[index]}</p></div>
        `;
        card.onclick = () => card.classList.toggle('flipped');
        container.appendChild(card);
    });
}

window.onload = loadCards;