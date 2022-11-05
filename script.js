let currentPokemon;
let amountLoadedPokemon = 0;



async function init() {
    await includeHTML();
    loadMorePokemon();
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


async function loadPokemon(amountNewLoad) {
    for (let currentId = amountLoadedPokemon + 1; currentId < amountNewLoad + 1; currentId++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${currentId}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        renderPokemonContainers(currentId);
    };
    amountLoadedPokemon = amountNewLoad;
}


function renderPokemonContainers(currentId) {
    document.getElementById('mainContainer').innerHTML += renderPokemonContainer(currentId);
    renderTypeContainer(currentId);
    renderContainerBgColorByType(currentId);
}


function renderPokemonContainer(currentId) {
    return `
    <div id="pokeContainer${currentId}" class="pokeContainer">
        <div class="pokeContainerHead">
            <h2>${currentPokemon['name']}</h2>
            <h2>${currentPokemon['id']}</h2>
        </div>
        <div class="pokeContainerMain">
            <div id="types${currentId}"></div>
            <div class="imgPokemon">
                <img src="${currentPokemon['sprites']['other']['dream_world']['front_default']}">
            </div>
            <div class="imgPokeball">
                <img src="img/iconPokeball.png">
            </div>
        </div>
    </div>
`;
}


function renderTypeContainer(currentId) {
    for (let i = 0; i < currentPokemon['types']['length']; i++) {
        document.getElementById(`types${currentId}`).innerHTML += `<div class="typeContainer"><h4>${currentPokemon['types'][`${i}`]['type']['name']}</h4></div>`;
    }
}

function renderContainerBgColorByType(currentId) {
    if (currentPokemon['types']['length'] == 1) {
        document.getElementById(`pokeContainer${currentId}`).classList.add(`${currentPokemon['types'][`0`]['type']['name']}`)
    } else {
        let x = currentPokemon['types'][`0`]['type']['name'];
        let y = currentPokemon['types'][`1`]['type']['name'];
        document.getElementById(`pokeContainer${currentId}`).style.background = `linear-gradient(115deg, ${typesBgColors[0][`${y}`]} 33%, ${typesBgColors[0][`${x}`]} 50%)`;
    }
}


function loadMorePokemon() {
    let amountNewLoad = amountLoadedPokemon + 20;
    loadPokemon(amountNewLoad);
}