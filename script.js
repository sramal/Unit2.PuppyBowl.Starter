//const playerContainer = document.getElementById("all-players-container");
//const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2308-ACC-ET-WEB-PT-B";
// Use the APIURL variable for fetch requests
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

// handle to addButton object
const allPlayersContainer = document.getElementById("all-players-container");
const addButton = document.getElementById("addPlayer");

// playerId of player being view by user
let playerId = -1;

// Maintain player list, which should be same as the server
const state = {
    players: [],
    player: {},
};

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(API_URL + "players");
        const json = await response.json();
        state.players = json.data.players;
    } catch (err) {
        console.error("Uh oh, trouble fetching players!", err);
    }

    return state.players;
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(API_URL + `players/${playerId}`);
        const json = await response.json();
        console.log(json);
        state.player = json.data.player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }

    return state.player;
};

const addNewPlayer = async (e) => {
    e.preventDefault();

    obj = {
        name: `${e.target.form.inputName.value}`,
        breed: `${e.target.form.inputBreed.value}`,
        status: `${e.target.form.inputStatus.value}`,
        imageUrl: `${e.target.form.inputUrl.value}`,
        teamId: `${e.target.form.inputTeamId.value}`,
    };

    try {
        const response = await fetch(API_URL + "players/", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(obj),
        });
    } catch (error) {
        console.error(error);
    }

    e.target.form.inputName.value = "";
    e.target.form.inputBreed.value = "";
    e.target.form.inputStatus.value = "field";
    e.target.form.inputUrl.value = "";
    e.target.form.inputTeamId.value = "";

    const players = await fetchAllPlayers();
    renderAllPlayers(players);
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(API_URL + `players/${playerId}`, {
            method: "DELETE",
        });
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }

    const players = await fetchAllPlayers();
    renderAllPlayers(players);
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (players) => {
    try {
        let tmpHTML = players.map(
            (player) =>
                '<div class="col">' +
                '<div class="card shadow p-3 mb-5 bg-body-tertiary rounded">' +
                `<img src="${player.imageUrl}" class="card-img-top img-fluid" alt="Image of ${player.name}" />` +
                '<div class="card-body">' +
                `<p class="card-text text-start">Name: ${player.name}</p>` +
                `<p class="card-text text-start">Breed: ${player.breed}</p>` +
                `<p class="card-text text-start">Status: ${
                    player.status[0].toUpperCase() + player.status.substring(1)
                }</p>` +
                `<p class="card-text text-start">Team: ${player.teamId}</p>` +
                `<a href="./player.html" class="btn btn-primary btn-sm m-1" onclick="sessionStorage.setItem('playerId', ${player.id})">Info</a>` +
                `<button onclick="removePlayer(${player.id})" type="button" class="btn btn-primary btn-sm m-1">Delete</button>` +
                "</div>" +
                "</div>" +
                "</div>"
        );

        allPlayersContainer.innerHTML =
            '<div class="row">' + tmpHTML + "</div>";
    } catch (err) {
        console.error("Uh oh, trouble rendering players!", err);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        addButton.addEventListener("click", addNewPlayer);
    } catch (err) {
        console.error("Uh oh, trouble rendering the new player form!", err);
    }
};

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
};

const renderPlayer = (player) => {
    const playerContainer = document.getElementById("player-container");
    try {
        let tmpHTML =
            "" +
            '<div class="col">' +
            '<div class="card shadow p-3 mb-5 bg-body-tertiary rounded">' +
            `<img src="${player.imageUrl}" class="card-img-top img-fluid" alt="Image of ${player.name}" />` +
            '<div class="card-body">' +
            `<p class="card-text text-start">Name: ${player.name}</p>` +
            `<p class="card-text text-start">Breed: ${player.breed}</p>` +
            `<p class="card-text text-start">Status: ${
                player.status[0].toUpperCase() + player.status.substring(1)
            }</p>` +
            `<p class="card-text text-start">Team: ${player.teamId}</p>` +
            `<a href="./index.html" class="btn btn-primary btn-sm m-1">Home</a>` +
            "</div>" +
            "</div>" +
            "</div>";

        playerContainer.innerHTML = '<div class="row">' + tmpHTML + "</div>";
    } catch (err) {
        console.error("Uh oh, trouble rendering player!", err);
    }
};

const renderTeammates = (players) => {
    const teammatesContainer = document.getElementById("teammates-container");
    try {
        let tmpHTML = players
            .filter((x) => x.id != sessionStorage.getItem("playerId"))
            .map(
                (player) =>
                    '<div class="col">' +
                    '<div class="card shadow p-3 mb-5 bg-body-tertiary rounded">' +
                    `<img src="${player.imageUrl}" class="card-img-top img-fluid" alt="Image of ${player.name}" />` +
                    '<div class="card-body">' +
                    `<p class="card-text text-start">Name: ${player.name}</p>` +
                    `<p class="card-text text-start">Breed: ${player.breed}</p>` +
                    `<p class="card-text text-start">Status: ${
                        player.status[0].toUpperCase() +
                        player.status.substring(1)
                    }</p>` +
                    "</div>" +
                    "</div>" +
                    "</div>"
            );

        teammatesContainer.innerHTML = '<div class="row">' + tmpHTML + "</div>";
    } catch (err) {
        console.error("Uh oh, trouble rendering teammates!", err);
    }
};

const playerInit = async () => {
    const player = await fetchSinglePlayer(sessionStorage.getItem("playerId"));

    renderPlayer(player);
    renderTeammates(player.team.players);
};
