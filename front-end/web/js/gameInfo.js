const gridInfo = document.getElementById("grid-info")
let gamesListo = []

window.onload = async () =>{
    const respuesta = await fetch("http://localhost:8800/api/games");
    gamesListo = await respuesta.json();
    pintarInfo(gamesListo);
}

const pintarInfo = (games) =>{
    gridInfo.innerHTML=""
    games.forEach(game =>{
        let template = `
        <article class="card">
        <div id="detalles-juego">
            <div>
                <img src="./img/${game.imagen}"/>
                <h1>${game.nombre}</h1>
            </div>   

            <div id="developer">${game.desarrollador.nombre}</div>   
            <div class="plataforma p-${game.plataforma}">${game.plataforma}</div>
                    
            <div id="detalles-tecnicos"> 
                <div class="pegi age-${game.pegi}">${game.pegi}</div>
        </div>
        
        </div>

        <div id="descripcion-juego">
                <p>${game.descripcion}</p>
            </div>
        </article>
        `
        gridInfo.innerHTML += template
    })
};