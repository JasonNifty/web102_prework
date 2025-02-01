/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
	for (let i = 0; i < games.length; i++) {
		// Loop runs 11 times
		const game = games[i];

		// Create a div element for the game card
		const gameCard = document.createElement("div");
		gameCard.classList.add("game-card");

		// Set innerHTML using template literals
		gameCard.innerHTML = `
            <h3>${game.name}</h3>
            <p>Backers: ${game.backers}</p>
            <p>Goal: $${game.goal.toLocaleString()}</p>
            <img class="game-img" src="${game.img}" alt="${game.name}">
        `;

		// Append game card to the container
		gamesContainer.appendChild(gameCard);
	}
}

addGamesToPage(GAMES_JSON);
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

const totalContributions = GAMES_JSON.reduce(
	(acc, game) => acc + game.backers,
	0
);
contributionsCard.innerHTML = totalContributions.toLocaleString();

// use reduce() to count the number of total contributions by summing the backers

// set the inner HTML using a template literal and toLocaleString to get a number with commas

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalPledged = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);
raisedCard.innerHTML = `$${totalPledged.toLocaleString()}`;

// set inner HTML using template literal

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = GAMES_JSON.length;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
	deleteChildElements(gamesContainer); // Clear previous results
	const unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);
	addGamesToPage(unfundedGames);
	console.log(unfundedGames.length); // Check the number of filtered games
}

// show only games that are fully funded
function filterFundedOnly() {
	deleteChildElements(gamesContainer); // Clear previous results
	const fundedGames = GAMES_JSON.filter((game) => game.pledged >= game.goal);
	addGamesToPage(fundedGames);
	console.log(fundedGames.length); // Check the number of filtered games
}

// show all games
function showAllGames() {
	deleteChildElements(gamesContainer); // Clear previous results
	addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");
// Step 1: Filter unfunded games
const unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);
const numUnfundedGames = unfundedGames.length;

// Step 2: Calculate total raised and create display string
const totalRaised = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);

const displayStr = `
    A total of $${totalRaised.toLocaleString()} has been raised for ${
	GAMES_JSON.length
} games.
    Currently, ${numUnfundedGames} ${
	numUnfundedGames === 1 ? "game remains" : "games remain"
} unfunded.
    We need your help to fund these amazing games!
`;

// Step 3: Append display string to the description container
const descriptionElement = document.createElement("p");
descriptionElement.innerHTML = displayStr;
descriptionContainer.appendChild(descriptionElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

// Sort games by pledged amount in descending order
const sortedGames = GAMES_JSON.sort((a, b) => b.pledged - a.pledged);

// Destructure to get the top two funded games
const [mostFundedGame, secondMostFundedGame] = sortedGames;

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
	// Grab containers
	const firstGameContainer = document.getElementById("first-game");
	const secondGameContainer = document.getElementById("second-game");

	// Append the top funded game
	const mostFundedGameElement = document.createElement("p");
	mostFundedGameElement.innerText = `Top Funded: ${mostFundedGame.name}`;
	firstGameContainer.appendChild(mostFundedGameElement);

	// Append the runner-up game
	const secondMostFundedGameElement = document.createElement("p");
	secondMostFundedGameElement.innerText = `Runner-Up: ${secondMostFundedGame.name}`;
	secondGameContainer.appendChild(secondMostFundedGameElement);
});

// Search bar functionality
const searchInput = document.getElementById("game-search");
searchInput.addEventListener("input", (event) => {
	const query = event.target.value.toLowerCase();

	// Filter games based on the search query
	const filteredGames = GAMES_JSON.filter((game) =>
		game.name.toLowerCase().includes(query)
	);

	// Clear and re-add games to the page
	deleteChildElements(gamesContainer);
	addGamesToPage(filteredGames);
});
