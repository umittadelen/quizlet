// List of deck names, each corresponding to a JSON file with cards
const deck_names = ['økologi', 'test', 'theme'];

// Generate the paths to each deck's JSON file
const decks = deck_names.map((item) => `./cards/${item}.json`);

// Function to fetch all decks' data
async function loadDecks() {
    // Fetch each deck and convert the response to JSON
    const promises = decks.map(deck => fetch(deck).then(res => res.json()));
    // Wait for all deck data to be loaded and return them
    return await Promise.all(promises);
}

// Function to filter and display decks based on the search query
async function filterDecks() {
    const query = document.getElementById('search').value.toLowerCase(); // Get search input
    const deckList = document.getElementById('deckList');
    deckList.innerHTML = ''; // Clear previous search results

    const allDecks = await loadDecks(); // Fetch all decks
    allDecks.forEach((deck, index) => {
        // Check if NAME or PUBLISHER matches the query
        if (deck.NAME.toLowerCase().includes(query) || deck.PUBLISHER.toLowerCase().includes(query)) {
            const li = document.createElement('li'); // Create a list item for the result
            li.textContent = `${deck.NAME} by ${deck.PUBLISHER}`; // Display deck info
            li.onclick = () => openDeck(index); // Set click event to open the deck
            deckList.appendChild(li); // Add result to the list
        }
    });
}

// Function to open a deck and store its index in localStorage
function openDeck(deckIndex) {
    localStorage.setItem('selectedDeck', deckIndex); // Store the selected deck index
    window.location.href = `card.html?name=${deck_names[deckIndex]}`; // Redirect to card display page
}

// Function to load and display cards from the selected deck
async function loadCards() {
    const urlParams = new URLSearchParams(window.location.search); // Get URL parameters
    const deckNameFromURL = urlParams.get('name'); // Get deck name from the URL

    let deckIndex = null;

    if (deckNameFromURL) {
        // Find deck index by URL name
        deckIndex = deck_names.indexOf(deckNameFromURL);
        if (deckIndex === -1) return; // If invalid, do nothing
    } else {
        // Get deck from localStorage if no URL parameter
        deckIndex = localStorage.getItem('selectedDeck');
        if (deckIndex === null) return; // If no selection, do nothing
    }

    const allDecks = await loadDecks(); // Fetch all decks
    const deck = allDecks[deckIndex]; // Get the selected deck

    const container = document.getElementById('cardsContainer');
    container.innerHTML = ''; // Clear old cards

    // Create and display cards for each WORD and its corresponding EXPLANATION
    deck.WORDS.forEach((word, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="front"><p class="text">${word}</p></div>
            <div class="back"><p class="text">${deck.EXPLANATIONS[index]}</p></div>
        `;
        card.onclick = () => card.classList.toggle('flipped'); // Flip card on click
        container.appendChild(card); // Add card to container
    });

    if (deck.THEME) {
        document.querySelector(':root').style.setProperty('--body-bg-color', deck.THEME.body_bg_color, 'important');
        document.querySelector(':root').style.setProperty('--body-text-color', deck.THEME.body_text_color, 'important');

        document.querySelector(':root').style.setProperty('--search-bar-bg-color', deck.THEME.search_bar_bg_color, 'important');
        document.querySelector(':root').style.setProperty('--search-bar-text-color', deck.THEME.search_bar_text_color, 'important');
        document.querySelector(':root').style.setProperty('--search-bar-focus-border', deck.THEME.search_bar_focus_border, 'important');
        document.querySelector(':root').style.setProperty('--search-bar-border', deck.THEME.search_bar_border, 'important');
        document.querySelector(':root').style.setProperty('--search-bar-hover-color', deck.THEME.search_bar_hover_color, 'important');

        document.querySelector(':root').style.setProperty('--search-element-border', deck.THEME.search_element_border, 'important');
        document.querySelector(':root').style.setProperty('--search-element-hover-border', deck.THEME.search_element_hover_border, 'important');
        document.querySelector(':root').style.setProperty('--search-element-bg-color', deck.THEME.search_element_bg_color, 'important');
        document.querySelector(':root').style.setProperty('--search-element-hover-color', deck.THEME.search_element_hover_color, 'important');

        document.querySelector(':root').style.setProperty('--card-scrollbar-width', deck.THEME.card_scrollbar_width, 'important');
        document.querySelector(':root').style.setProperty('--card-text-color', deck.THEME.card_text_color, 'important');

        document.querySelector(':root').style.setProperty('--card-front-border-color', deck.THEME.card_front_border_color, 'important');
        document.querySelector(':root').style.setProperty('--card-front-border', deck.THEME.card_front_border, 'important');
        document.querySelector(':root').style.setProperty('--card-front-scrollbar-thumb-color', deck.THEME.card_front_scrollbar_thumb_color, 'important');
        document.querySelector(':root').style.setProperty('--card-front-bg-color', deck.THEME.card_front_bg_color, 'important');
        document.querySelector(':root').style.setProperty('--card-front-text-color', deck.THEME.card_front_text_color, 'important');

        document.querySelector(':root').style.setProperty('--card-back-border-color', deck.THEME.card_back_border_color, 'important');
        document.querySelector(':root').style.setProperty('--card-back-border', deck.THEME.card_back_border, 'important');
        document.querySelector(':root').style.setProperty('--card-back-scrollbar-thumb-color', deck.THEME.card_back_scrollbar_thumb_color, 'important');
        document.querySelector(':root').style.setProperty('--card-back-bg-color', deck.THEME.card_back_bg_color, 'important');
        document.querySelector(':root').style.setProperty('--card-back-text-color', deck.THEME.card_back_text_color, 'important');
    }
}

// Event listener for copying URL with selected deck name
document.addEventListener('copy', function (e) {
    const deckIndex = localStorage.getItem('selectedDeck');
    const urlParams = new URLSearchParams(window.location.search);
    const deckNameFromURL = urlParams.get('name');
    let deckName;

    // Determine which deck to use (from URL or localStorage)
    if (deckNameFromURL) {
        deckName = deckNameFromURL;
    } else if (deckIndex !== null) {
        deckName = deck_names[deckIndex];
    }

    // If a deck is selected, modify the copied URL to include the deck name
    if (deckName) {
        const urlWithParams = `${window.location.origin}${window.location.pathname}?name=${deckName}`;
        e.clipboardData.setData('text/plain', urlWithParams); // Set copied content
        e.preventDefault(); // Prevent default copy behavior
        alert(`Copied URL: ${urlWithParams}`); // Show alert with copied URL
    }
});

// Function to disable zoom on mobile devices (iOS, Android) and PC
function disableZoom() {
    // Disable zoom on double-tap for mobile
    document.addEventListener('touchstart', function (e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Disable pinch-to-zoom for mobile
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    }, { passive: false });

    // Disable zoom via scroll wheel on PC
    document.addEventListener('wheel', function (e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Call the function to disable zoom behavior
disableZoom();