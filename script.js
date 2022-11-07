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

let pokemonJson = [{ 'empty': 'empty' }];
let pokemonJson2 = [{ 'empty': 'empty' }];
let selectedState = ["about", "stats", "moves"];
let selectedCurrent = 0;


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
    await loadMorePokemon(20);
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



function loadMorePokemon(i) {
    let amountNewLoad = amountLoadedPokemon + i;
    loadPokemonJson(amountNewLoad);
}

function closeSelcted() {
    document.getElementById('selectedContainerBg').classList.add('dNone');
    document.body.classList.remove('stopScroll');

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
                <img class="pokeballBottom" src="img/iconPokeball.png">
                <img class="pokeballTop" src="img/iconPokeballTop.png">
            </div>
        </div>
    </div>
`;
}


function openSelected(i) {
    if (i > pokemonJson.length - 2) {
        loadMorePokemon(1);
    }

    document.body.classList.add('stopScroll');

    let currentPokemonSelected = pokemonJson[i];
    let currentPokemonSelected2 = pokemonJson2[i];
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
    <div class="pokeContainerSelected">
        <div id="typesSelected${i}"></div>
        <div class="imgPokemonSelected">
        <img src="${currentPokemonSelected['sprites']['other']['dream_world']['front_default']}">
        </div>
    </div>
    <div class="leftRight">
        <img src="img/left.png" onclick="openLast(${i})">
        <img src="img/right.png" onclick="openNext(${i})">
    </div>
    `;

    document.getElementById('selectedContainerBottom').innerHTML = `
    <div class="selectedContainerBottomHead">
    <ul>
        <li id ="about" onclick="changeContainer('about', 0)" class="colorBlack"><h2>About</h2></li>
        <li id ="stats" onclick="changeContainer('stats', 1)"><h2>Base Stats</h2></li>
        <li id ="moves" onclick="changeContainer('moves', 2)"><h2>Moves</h2></li>
    </ul>
    </div>
    <div class="selectedContainerBottomDown" id="selectedContainerBottomDown">
    <ul id="aboutContainer" class="dNone">
        <li><h4 class="h4Left">Height:</h4><h4 class="h4Right">${currentPokemonSelected['height'] / 10}m</h4></li>
        <li><h4 class="h4Left">Weight:</h4><h4 class="h4Right">${currentPokemonSelected['weight'] / 10}kg</h4></li>
        <li><h4 class="h4Left">Abillities:</h4><div class="h4Right" id="abilities"></div></li>
        <li><h4 class="h4Left">Capture rate:</h4><h4 class="h4Right">${currentPokemonSelected2['base_happiness']}</h4></li>
        <li><h4 class="h4Left">Base happiness:</h4><h4 class="h4Right">${currentPokemonSelected2['capture_rate']}</h4></li>
    </ul>
    <ul id="statsContainer" class="dNone">
        <li><h4 class="h4Left">Hp:</h4><h4 class="h4Right">${currentPokemonSelected['stats'][0]['base_stat']}</h4></li>
        <li><h4 class="h4Left">Attack:</h4><h4 class="h4Right">${currentPokemonSelected['stats'][1]['base_stat']}</h4></li>
        <li><h4 class="h4Left">Defense:</h4><h4 class="h4Right">${currentPokemonSelected['stats'][2]['base_stat']}</h4></li>
        <li><h4 class="h4Left">Special-Attack:</h4><h4 class="h4Right">${currentPokemonSelected['stats'][3]['base_stat']}</h4></li>
        <li><h4 class="h4Left">Special-Defense:</h4><h4 class="h4Right">${currentPokemonSelected['stats'][4]['base_stat']}</h4></li>
        <li><h4 class="h4Left">Speed:</h4><h4 class="h4Right">${currentPokemonSelected['stats'][5]['base_stat']}</h4></li>
    </ul>
    <ul id="movesContainer" class="dNone movesContainer">
    </ul>
    </div>
    `;


    changeContainer(`${selectedState[selectedCurrent]}`, selectedCurrent);

    for (let i = 0; i < currentPokemonSelected['abilities'].length; i++) {
        document.getElementById('abilities').innerHTML += `<h4 class="h4Right">${currentPokemonSelected['abilities'][i]['ability']['name']}</h4>`;
    }



    for (let i = 0; i < currentPokemonSelected['moves'].length; i++) {
        document.getElementById('movesContainer').innerHTML += `
            <h4 class="h4Moves">${currentPokemonSelected['moves'][i]['move']['name']}</h4></li>
        `;
    }


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


function openLast(i) {
    i--;
    if (i > 0) {
        openSelected(i);
    }
}

function openNext(i) {
    i++;
    if (i < 906) {
        openSelected(i);
    }
}

function changeContainer(id, current) {

    selectedCurrent = current;

    if (about.classList.contains('colorBlack')) {
        document.getElementById('about').classList.remove('colorBlack');
    }
    if (stats.classList.contains('colorBlack')) {
        document.getElementById('stats').classList.remove('colorBlack');
    }
    if (moves.classList.contains('colorBlack')) {
        document.getElementById('moves').classList.remove('colorBlack');
    }

    if (!aboutContainer.classList.contains('dNone')) {
        document.getElementById('aboutContainer').classList.add('dNone');
    }
    if (!statsContainer.classList.contains('dNone')) {
        document.getElementById('statsContainer').classList.add('dNone');
    }
    if (!movesContainer.classList.contains('dNone')) {
        document.getElementById('movesContainer').classList.add('dNone');
    }

    document.getElementById(id).classList.add('colorBlack');
    document.getElementById(`${id}Container`).classList.remove('dNone');

}