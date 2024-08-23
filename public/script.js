// Fetch and display games
async function loadGames() {
    try {
        const response = await fetch('/forRepo.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const games = await response.json();
        console.log('Games loaded:', games); // Log the loaded games
        displayGames(games);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Function to map categories to corresponding image paths
function getCategoryImage(category) {
    let imagePath = '';

    switch (category.toLowerCase()) {  // Convert category to lower case for consistent matching
        case 'urban development':
            imagePath = 'public/images/urban_development.png';
            break;
        case 'energy efficiency and transition':
            imagePath = '/images/energy_efficiency.png';
            break;
        case 'water':
            imagePath = '/images/water.png';
            break;
        case 'circular economy':
            imagePath = '/images/circular_economy.png';
            break;
        case 'natural hazards':
            imagePath = '/images/natural_hazards.png';
            break;
        case 'general sustainable development':
            imagePath = '/images/general_sustainable_development.png';
            break;
        case 'construction':
            imagePath = '/images/construction.png';
            break;
        default:
            imagePath = '/images/default_category.png';  // Ensure this path is correct
            break;
    }

    return imagePath;
}

function updateCategoryImage(category) {
    const categoryImage = document.getElementById('category-image');  // Ensure 'category-image' matches the HTML ID
    let imagePath = getCategoryImage(category);  // Reuse getCategoryImage for consistency

    if (imagePath) {
        categoryImage.src = imagePath;
        categoryImage.style.display = 'block';  // Make the image visible
    } else {
        categoryImage.style.display = 'none';  // Hide the image if no valid category
    }
}

function filterCategory(category) {
    console.log(`Filtering by category: ${category}`);

    // Get all buttons and remove the 'selected-category' class from them
    const buttons = document.querySelectorAll('.category-buttons button');
    buttons.forEach(button => button.classList.remove('selected-category'));

    // Add the 'selected-category' class to the clicked button
    const selectedButton = Array.from(buttons).find(button => button.textContent.trim().toLowerCase() === category.toLowerCase());
    if (selectedButton) {
        selectedButton.classList.add('selected-category');
    }

    // Hide the category image
    const categoryImage = document.getElementById('category-image');
    categoryImage.style.display = 'none';

    fetch('/forRepo.json')
        .then(response => response.json())
        .then(games => {
            const filteredGames = category.toLowerCase() === 'all'
                ? games
                : games.filter(game => game.category && game.category.toLowerCase() === category.toLowerCase());

            console.log(`Filtered Games for category "${category}":`, filteredGames);
            displayGames(filteredGames);
        })
        .catch(error => console.error('Error filtering by category:', error));
}
// Attach to the global window object
window.filterCategory = filterCategory;



window.filterGames = function filterGames() {
    const queryElement = document.querySelector('.search-container input');
    if (!queryElement) {
        console.error('Search input not found!');
        return;
    }
    const query = queryElement.value.toLowerCase();
    console.log(`Search query: ${query}`);

    fetch('public/forRepo.json')
        .then(response => response.json())
        .then(games => {
            const filteredGames = games.filter(game =>
                Object.values(game).some(value =>
                    String(value).toLowerCase().includes(query)
                )
            );

            console.log('Filtered games:', filteredGames);
            displayGames(filteredGames, query); // Pass the query to displayGames for highlighting
        })
        .catch(error => console.error('Error filtering games:', error));
};

// Add this event listener to trigger search on Enter key
document.querySelector('.search-container input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault(); // Prevent the default form submission if any
        filterGames(); // Call the search function
    }
});



function displayGames(games, query) {
    const gamesContainer = document.getElementById('games-container');
    if (!gamesContainer) {
        console.error('Games container not found!');
        return;
    }

    gamesContainer.innerHTML = '';  // Clear existing content

    if (games.length === 0) {
        gamesContainer.innerHTML = '<p>No games found.</p>';  // Display a message if no games match the search
        console.log('No games found.');
        return;
    }

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        // Ensure both game name and description are strings before highlighting
        const gameName = game['Game name'] || '';
        const gameDescription = game.Description || 'No Description';

        // Highlight the matching text in the game name
        const highlightedName = gameName.replace(new RegExp(query, 'gi'), match => {
            return `<span class="highlight">${match}</span>`;
        });

        // Highlight the matching text in the description
        const highlightedDescription = gameDescription.replace(new RegExp(query, 'gi'), match => {
            return `<span class="highlight">${match}</span>`;
        });

        // Render the game card with highlighted text
        gameCard.innerHTML = `
            <img src="${getCategoryImage(game.category)}" alt="${game.category}" class="category-image">
            <h2>${highlightedName}</h2>
            <p>${highlightedDescription}</p>
            <p>Category: ${game.category || 'Uncategorised'}</p>
            <p><a href="${game.publicationLink}" target="_blank">Publication</a> | 
               <a href="${game.gameLink}" target="_blank">Play Game</a></p>
        `;
        
        // Append each game card to the container
        gamesContainer.appendChild(gameCard);
    });
}


// Load games when the page loads
window.onload = loadGames;

