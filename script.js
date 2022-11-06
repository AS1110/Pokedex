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
let pokemonJson2 = [{'empty': 'empty'}];


async function loadPokemonJson(amountNewLoad) {
    for (let i = amountLoadedPokemon + 1; i < amountNewLoad + 1; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let pokemonArray = await response.json();
        pokemonJson.push(pokemonArray);

        let url2 = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
        let response2 = await fetch(url2);
        let pokemonArray2 = await response2.json();
        pokemonJson2.push(pokemonArray2);
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
    renderTypeContainer(`types${currentId}`, currentPokemon);
    renderContainerBgColorByType(currentId, currentPokemon, `pokeContainer${currentId}`, 33, 50);
}





function renderTypeContainer(idName, currentPokemon) {
    for (let i = 0; i < currentPokemon['types']['length']; i++) {
        document.getElementById(idName).innerHTML += `<div class="typeContainer"><h4>${currentPokemon['types'][`${i}`]['type']['name']}</h4></div>`;
    }
}



function loadMorePokemon() {
    let amountNewLoad = amountLoadedPokemon + 20;
    loadPokemonJson(amountNewLoad);
}

function closeSelcted() {
    document.getElementById('selectedContainerBg').classList.add('dNone');
}

function renderPokemonContainer(currentId) {
    let name = currentPokemon['name'];
    let nameUpperCase = name.charAt(0).toUpperCase() + name.slice(1);
    return `
    <div id="pokeContainer${currentId}" onclick="openSelected(${currentId})" class="pokeContainer">
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


function openSelected(i) {
    let currentPokemonSelected = pokemonJson[i];
    let name = currentPokemonSelected['name'];
    let nameUpperCase = name.charAt(0).toUpperCase() + name.slice(1);

    document.getElementById('selectedContainerBg').classList.remove('dNone');

    document.getElementById('selectedContainer').innerHTML = `
    <div class="selectedContainerTop" id="selectedContainerTop"></div>
    <div class="selectedContainerBottom" id="selectedContainerBottom"></div>
    `;
    document.getElementById('selectedContainerTop').innerHTML = `
    <div class="selectedContainerTopHeadline">
        <div><h2>${nameUpperCase}</h2></div>
        <div><h2>#${currentPokemonSelected['id']}</h2></div>
        <div><img class="hover" src="img/close.png" onclick="closeSelcted()"></div>
    </div>
    <div id="typesSelected${i}"></div>
    `;


    renderContainerBgColorByType(i, currentPokemonSelected, 'selectedContainerTop', 25, 40);
    renderTypeContainer(`typesSelected${i}`, currentPokemonSelected);
}


function renderContainerBgColorByType(i, j, idName, left, right) {
    if (j['types']['length'] == 1) {
        document.getElementById(`${idName}`).classList.add(`${j['types'][`0`]['type']['name']}`)
    } else {
        let x = j['types'][`0`]['type']['name'];
        let y = j['types'][`1`]['type']['name'];
        document.getElementById(`${idName}`).style.background = `linear-gradient(115deg, ${typesBgColors[0][`${y}`]} ${left}%, ${typesBgColors[0][`${x}`]} ${right}%)`;
    }
}