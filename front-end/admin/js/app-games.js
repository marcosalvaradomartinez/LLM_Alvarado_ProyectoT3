import GameService from "./services/GameService.js";
import DeveloperService from "./services/DeveloperService.js";
import Loading from "./components/Loading.js";
import { scrollToHash } from "./util.js";
const listContainer = document.querySelector('#list-container');
const selectDeveloper = document.querySelector('#field-developer');
const btnInsert = document.querySelector('#btn-insert');
const btnUpdate = document.querySelector('#btn-update');
const btnCancel = document.querySelector('#btn-cancel');
const messageAlert = document.querySelector('#message');
const form = document.querySelector('#frm-item');
const inputSearch = document.querySelector("#input-search");
const loadingObj = new Loading("modal-message", "Loading...")
const inputName = document.querySelector('#field-name');
const inputPrice = document.querySelector('#field-price');
const inputPegi = document.querySelector('#field-pegi');

let currentGame = null;

const newGame = () => {
    const nombre = document.querySelector('#field-name').value;
    const imagen = document.querySelector('#field-image').value;
    const desarrollador = document.querySelector('#field-developer').value;
    const pegi = document.querySelector('#field-pegi').value;
    const precio = document.querySelector('#field-price').value;
    const plataforma = document.querySelector("#field-platform").value;
    const descripcion = document.querySelector('#field-descripcion').value;
    
    const game = {nombre, imagen, desarrollador, pegi, precio, plataforma, descripcion};
    console.log("game", game);
    loadingObj.open();
    GameService.insert(game).then(data => {
        console.log("message", data);
        renderGames();
        form.reset();
        scrollToHash("title-list");
    }).finally(() => {
        loadingObj.close();
    });
}

const editGame = (id) => {
    GameService.getItemById(id).then(data => {
        currentGame = data;
        document.querySelector('#field-name').value = data.nombre;
        document.querySelector('#field-developer').value = data.desarrollador;
        document.querySelector('#field-pegi').value = data.pegi;
        document.querySelector('#field-price').value = data.precio;
        document.querySelector('#field-cover').value = data.imagen;
        let option =document.querySelector(`#field-developer option[value*='${data.developer}']`);
        if(option) option.selected=true;
        document.querySelector('#field-description').value = data.description;
        //country
    });
    btnInsert.classList.replace("d-inline", "d-none");
    btnUpdate.classList.replace("d-none", "d-inline");
    btnCancel.classList.replace("d-none", "d-inline");
    scrollToHash("title-form");
}

const updateGame = () => {
    const id = currentGame.id;
    const nombre = document.querySelector('#field-name').value;
    const imagen = document.querySelector('#field-image').value;
    const desarrollador = document.querySelector('#field-developer').value;
    const pegi = document.querySelector('#field-pegi').value;
    const precio = document.querySelector('#field-price').value;
    const plataforma = document.querySelector("#field-platform").value;
    const descripcion = document.querySelector('#field-descripcion').value;
    const game = {id, nombre, imagen, desarrollador, pegi, precio, plataforma, descripcion};

    GameService.update(game).then(data => {
        currentGame = null;
        messageAlert.textContent = data.message;
        btnCancel.classList.replace("d-inline", "d-none");
        btnUpdate.classList.replace("d-inline", "d-none");
        btnInsert.classList.replace("d-none", "d-inline");
        form.reset();
        renderGames();
    });

}

const deleteGame = (id) => {
    GameService.delete(id)
        .then(data => {
            messageAlert.textContent = data.message;
            //Change state
            renderGames();
        })
}

const populateGames = (items) => {
    items.forEach((e, i) => {
        listContainer.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${e.nombre}</td>
                <td>${e.imagen}</td>
                <td>${e.desarrollador.nombre}</td>
                <td>${e.pegi}</td>
                <td>${e.precio}</td>
                <td>${e.plataforma}</td>
                <td>${e.descripcion}</td>
                <td class="text-center">
                    <button id="btn-delete-${e.id}" class="btn btn-danger btn-delete">Delete</button>
                    <button id="btn-edit-${e.id}" class="btn btn-info btn-edit" >Edit</button>
                </td>
            </tr>
        `;
    });

    // Buttons delete
    const buttonsDelete = document.querySelectorAll('.btn-delete');
    buttonsDelete.forEach(button => {
        button.addEventListener("click", function () {
            let id = this.id.split("-")[2];
            deleteGame(id);
        })
    });

    // Buttons Edit
    const buttonsEdit = document.querySelectorAll('.btn-edit');
    buttonsEdit.forEach(button => {
        button.addEventListener("click", function () {
            let id = this.id.split("-")[2];
            editGame(id);
        })
    });
}

const renderGames = (searchValue) => {
    listContainer.innerHTML = "";
    if (searchValue) {
        loadingObj.open();
        GameService.searchItemByName(searchValue)
            .then(items => {
                populateGames(items);
            }).finally(() => {
                loadingObj.close();
            });
    } else {
        loadingObj.open();
        GameService.getItemsList()
            .then(items => {
                populateGames(items);
            }).finally(() => {
                loadingObj.close();
            });
    }
}
const validateForm = (event) => {
    event.preventDefault();
    // Validate each field
    if(!inputName.validity.valid) {
        alert("Nombre no válido");
        inputName.focus();
        return false;
    }
    if(!inputPrice.validity.valid) {
        alert("Precio incorrecto");
        inputPrice.focus();
        return false;
    }
    if(!inputPegi.validity.valid) {
        alert("Pegi incorrecto");
        inputPegi.focus();
        return false;
    }
    //Execute insert or update depends to button name 
    if (event.target.id === "btn-insert") {
        newGame();
    } else if (event.target.id === "btn-update") {
        updateGame();
    }else{
        console.log("id button not found in validateForm function");
    }
}

const searchGame = (event) => {
    event.preventDefault();
    const input = event.target;
    if (input.value.length >= 3) {
        let nameSearch = input.value.toLowerCase();
        renderGames(nameSearch);
    } else if (input.value.length == 0) {
        renderGames();
    }
}

const renderGategoriesSelect = () => {
    selectDeveloper.innerHTML = "";
    loadingObj.open();
    DeveloperService.getItemsList()
        .then(items => {
            items.forEach(cat => {
                selectDeveloper.innerHTML+=`
                    <option value="${cat.id}">${cat.name}</option>
                `;
            });
            
        }).finally(() => {
            loadingObj.close();
        });
    
}

function init() {
    renderGames();
    btnCancel.addEventListener("click", function (e) {
        currentGame = null;
        messageAlert.textContent = "";
        btnCancel.classList.replace("d-inline", "d-none");
        btnUpdate.classList.replace("d-inline", "d-none");
        btnInsert.classList.replace("d-none", "d-inline");
        form.reset();
    });

    btnInsert.addEventListener("click", validateForm);
    btnUpdate.addEventListener("click", validateForm);
    // Reiniciamos el formulario por si hay datos precargados
    form.reset();

    renderGategoriesSelect();

}

init();