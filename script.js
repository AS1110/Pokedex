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



let currentPokemon;
let amountLoadedPokemon = 0;

let pokemonJson = [{'empty': 'empty'}];

async function loadPokemonJson(amountNewLoad) {
    for (let i = amountLoadedPokemon + 1; i < amountNewLoad + 1; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let pokemonArray = await response.json();
        pokemonJson.push(pokemonArray);
    }
    loadPokemon(amountNewLoad);
    amountLoadedPokemon = amountNewLoad;
}



async function init() {
    await includeHTML();
    await loadMorePokemon();
}


async function loadPokemon(amountNewLoad) {
    for (let currentId = amountLoadedPokemon + 1; currentId < amountNewLoad + 1; currentId++) {
        currentPokemon = pokemonJson[currentId];
        renderPokemonContainers(currentId);
    };
}


function renderPokemonContainers(currentId) {
    document.getElementById('mainContainer').innerHTML += renderPokemonContainer(currentId);
    renderTypeContainer(currentId);
    renderContainerBgColorByType(currentId);
}


function renderPokemonContainer(currentId) {
    let name = currentPokemon['name'];
    let nameUpperCase = name.charAt(0).toUpperCase() + name.slice(1);
    return `
    <div id="pokeContainer${currentId}" class="pokeContainer">
        <div class="pokeContainerHead">
            <h2>${nameUpperCase}</h2>
            <h2>#${currentPokemon['id']}</h2>
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
    loadPokemonJson(amountNewLoad);
}