const deck_names = ['økologi', 'test'];
const decks = deck_names.map((item) => `./cards/${item}.json`); // Add other deck paths here

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
    window.location.href = `card.html?name=${deck_names[deckIndex]}`;
}

// Load and display cards based on URL or selection
async function loadCards() {
    // Check for URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const deckNameFromURL = urlParams.get('name');

    let deckIndex = null;

    // If there's a URL parameter for deck
    if (deckNameFromURL) {
        deckIndex = deck_names.indexOf(deckNameFromURL);
        if (deckIndex === -1) return; // Invalid deck name, do nothing
    } else {
        // If no URL parameter, check localStorage
        deckIndex = localStorage.getItem('selectedDeck');
        if (deckIndex === null) return; // No deck selected
    }

    // Load and display cards
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

// Copy the URL with deck name when using Ctrl+C
document.addEventListener('copy', function (e) {
    const deckIndex = localStorage.getItem('selectedDeck');
    const urlParams = new URLSearchParams(window.location.search);
    const deckNameFromURL = urlParams.get('name');
    let deckName;

    // Use the deck from the URL or fallback to selected deck in localStorage
    if (deckNameFromURL) {
        deckName = deckNameFromURL;
    } else if (deckIndex !== null) {
        deckName = deck_names[deckIndex];
    }

    // If there is a selected deck, modify the copied URL
    if (deckName) {
        const urlWithParams = `${window.location.origin}${window.location.pathname}?name=${deckName}`;
        e.clipboardData.setData('text/plain', urlWithParams);
        e.preventDefault(); // Prevent the default copy behavior
        alert(`Copied URL: ${urlWithParams}`);
    }
});

function disableZoom() {
    // Disable zoom on double-tap (iOS)
    document.addEventListener('touchstart', function (e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Disable pinch-to-zoom (iOS and Android)
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    }, { passive: false });

    // Disable zoom on wheel (PC)
    document.addEventListener('wheel', function (e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Call the function to apply the zoom prevention
disableZoom();