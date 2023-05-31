const gridGames = document.getElementById("grid-games")
const textSearch = document.querySelector("#search-input")
const orderFilter = document.querySelector('#orderFilter')
const cartTag = document.querySelector('#cartUser');
let gamesList = []
let carrito = []

const init= async () =>{
    const respuesta = await fetch("http://localhost:8800/api/games"); //http://localhost:8800/api/games 
    gamesList = await respuesta.json();
    pintarJuegos(gamesList);
    loadCarrito();
}
init();

const pintarJuegos = (games) =>{
    gridGames.innerHTML=""
    games.forEach(game =>{
        let template = `
        <article class="card">
        <form id="formulario-estrellas">
            <p class="clasificacion">
                <input id="game${game.id}-radio1" type="radio" name="estrellas" value="5">
                <label for="game${game.id}-radio1">★</label>
                <input id="game${game.id}-radio2" type="radio" name="estrellas" value="4">
                <label for="game${game.id}-radio2">★</label>
                <input id="game${game.id}-radio3" type="radio" name="estrellas" value="3">
                <label for="game${game.id}-radio3">★</label>
                <input id="game${game.id}-radio4" type="radio" name="estrellas" value="2">
                <label for="game${game.id}-radio4">★</label>
                <input id="game${game.id}-radio5" type="radio" name="estrellas" value="1">
                <label for="game${game.id}-radio5">★</label>
            </p>
        </form>

            <div>
                <img src="./img/${game.imagen}"/>
                <h1>${game.nombre}</h1>
            </div>   

            <div id="developer">${game.desarrollador.nombre}</div>   
            <div class="plataforma p-${game.plataforma}">${game.plataforma}</div>
            
            <div id="detalles-tecnicos"> 
                <div class="pegi age-${game.pegi}">${game.pegi}</div>
                <div class="precio">${game.precio}€</div>
            </div>

            <div id="interaction">
                <button type="button" class="buy-btn" data-id="${game.id}">Comprar</button>
            </div>
        </article>
        `
        gridGames.innerHTML += template
    });
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', comprarProducto);
    });
}

const buscarJuegos = () => {
    if (textSearch.value === "") {
       pintarJuegos(gamesList);
       return;
    }
    const nuevaLista = gamesList.filter(e => {
       return (e.nombre.toUpperCase().includes(textSearch.value.toUpperCase()))
    });
    pintarJuegos(nuevaLista);
};

const filtrarJuegos = () => {
    let index = orderFilter.selectedIndex;
    let option = orderFilter.options[index];
    let listaActualizada = [];
    if (option.value === 'Pegi') {
       listaActualizada = gamesList.sort((a, b) => a.pegi - b.pegi);
    }else if (option.value === 'Nombre') {
       listaActualizada = gamesList.sort((c, d) => {
          if (c.nombre > d.nombre) return 1;
          else if (c.nombre < d.nombre) return -1;
          else return 0;
       });
    }else if(option.value === 'Plataforma') {
        listaActualizada = gamesList.sort((p, x) =>{
            if(p.plataforma > x.plataforma) return 1;
            else if(p.plataforma < x.plataforma) return -1;
            else return 0;
        });
    }else {
        return;
    }
 
    pintarJuegos(listaActualizada);
};

function comprarProducto(event) {
    const button = event.target;
    const idGame = button.getAttribute("data-id");
    const juego = gamesList.find(game => game.id === idGame);
    const producto = {
        "id": juego.id,
        "nombre": juego.nombre,
        "precio": juego.precio,
        "cantidad": 1
    };

    if (carrito.some(e => e.id === idGame)) {
        carrito = carrito.map(e => {
            if (e.id !== idGame) return e;

            e.cantidad++;
            return e;
        });
    } else {
        carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    pintarCarrito();
}

const deleteProduct = (event) => {
    let idJuego = event.target.dataset.id;
    carrito = carrito.filter(e => e.id !== idJuego);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    pintarCarrito();
};

const pintarCarrito = () => {
    if (!cartTag) {
        console.error("El elemento cartTag no existe.");
        return;
    }

    cartTag.innerHTML = "";
    carrito.forEach(e => {
        let article = document.createElement("article");
        article.innerHTML = `
            <div>${e.nombre}</div>
            <div class="price">${e.precio}€</div>
            <div class="quantity">${e.cantidad}</div>
            <button type="button" class="delete" data-id="${e.id}">X</button>
        `;
        article.querySelector('.delete').addEventListener('click', deleteProduct);
        cartTag.appendChild(article);
    });

    let total = calcularTotal();
    let totalContainer = document.createElement("div");
    totalContainer.classList.add("total-container");
    totalContainer.innerHTML = `Total: ${total} €`;
    cartTag.appendChild(totalContainer);
};

const calcularTotal = () => {
    return carrito.reduce((total, producto) => total += (producto.precio * producto.cantidad), 0);
};

const loadCarrito =()=>{
    if (localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        console.table(carrito);
    }else{
        carrito=[];
    }
    pintarCarrito();
};