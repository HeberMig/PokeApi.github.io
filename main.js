const baseUrl = 'https://pokeapi.co/api/v2/'

function crearCarta(pokemon){
    let article = document.createElement('article')
    article.classList.add('carta')
    article.innerHTML = `
    <img src="${pokemon.image}" alt="${pokemon.name}">
    <h3 style="text-transform: uppercase;">${pokemon.name}</h3>
    <ul style="list-style: none;">
      <li>Altura: ${pokemon.height} m</li>
      <li>Peso: ${pokemon.weight} kg</li>
      <li>Ataque: ${pokemon.attack} </li>
      <li>Experiencia base: ${pokemon.base_experience}</li>
      <li>Id: ${pokemon.id}</li>
      <li>Tipo: ${pokemon.type}</li>
    </ul>
    `
    article.addEventListener('click', () => {
        mostrarSweetAlert(pokemon);
    });


    document.getElementById('render').appendChild(article)
}


function mostrarSweetAlert(pokemon) {
    
    const onClose = () => {
        if (!pokemon) {
            obtenerListado(); 
        }
    };

    
    Swal.fire({
        title: `${pokemon ? pokemon.name : 'Error'}`,
        html: pokemon ? `
            <img src="${pokemon.image}" alt="${pokemon.name}" style="max-width: 100%;">
            <p>Altura: ${pokemon.height} m</p>
            <p>Peso: ${pokemon.weight} kg</p>
            <p>Ataque: ${pokemon.attack}</p>
            <p>Experiencia base: ${pokemon.base_experience}</p>
            <p>Id: ${pokemon.id}</p>
            <p>Tipo: ${pokemon.type}</p>
        ` : 'No se encontró el Pokémon',
        confirmButtonText: 'Cerrar',
        onClose: onClose 
    });
}





// async function obtenerPokemon(nombre){
//     let respuestaApi = await fetch(`${baseUrl}pokemon/${nombre}`)
//     let pokemon = await respuestaApi.json()
//     let propiedadesPokemon = {
//         name: pokemon.name,
//         height: pokemon.height,
//         id: pokemon.id,
//         weight: pokemon.weight,
//         image: pokemon.sprites.front_default
//     }
//     crearCarta(propiedadesPokemon)
// }
async function obtenerPokemon(nombre){
    try {
        let respuestaApi = await fetch(`${baseUrl}pokemon/${nombre}`);

        if (!respuestaApi.ok) {
            throw new Error(`No se encontró el Pokémon: ${nombre}`);
        }

        let pokemon = await respuestaApi.json();
        let propiedadesPokemon = {
            name: pokemon.name,
            height: pokemon.height,
            id: pokemon.id,
            weight: pokemon.weight,
            attack: pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 'No disponible',
            base_experience: pokemon.base_experience,
            type: pokemon.types.map(type => type.type.name),
            image: pokemon.sprites.front_default,
        };

        crearCarta(propiedadesPokemon);
    } catch (error) {
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
            onClose: limpiarBusqueda()//mandamos a listado
        });
    }
}


// async function obtenerListado(){
//     let respuestaApi = await fetch(`${baseUrl}pokemon`)
//     let listadoPokemons = await respuestaApi.json()
//     console.log('informacion obtenerListado:',listadoPokemons.results);
//     for (let index = 0; index < listadoPokemons.results.length; index++) {
//         await obtenerPokemon(listadoPokemons.results[index].name)
//     }
// } 
async function obtenerListado() {
    try {
        let offset = 0; 
        const limit = 50; 

        for (let i = 0; i < limit; i++) {
            let respuestaApi = await fetch(`${baseUrl}pokemon?offset=${offset}&limit=1`); 
            let pokemon = await respuestaApi.json();
            await obtenerPokemon(pokemon.results[0].name); 
            offset++; 
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener la lista de Pokémon.',
        });
    }
}



function buscarPokemon() {
    const nombrePokemon = document.getElementById('inputPokemon').value.trim().toLowerCase();
    
    
    document.getElementById('render').innerHTML = '';

    if (nombrePokemon) {
        obtenerPokemon(nombrePokemon);
    } else {
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingresa el nombre de un Pokémon.',
        });
        limpiarBusqueda();
    }
}

function limpiarBusqueda() {
    document.getElementById('inputPokemon').value = '';
    document.getElementById('render').innerHTML = '';
    obtenerListado(); 
}


obtenerListado()



