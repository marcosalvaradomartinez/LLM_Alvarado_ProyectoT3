import DeveloperService from "./services/DeveloperService.js";
import Loading from "./components/Loading.js";
import { scrollToHash } from "./util.js";
const listContainer = document.querySelector('#list-container');
const btnInsert = document.querySelector('#btn-insert');
const btnUpdate = document.querySelector('#btn-update');
const btnCancel = document.querySelector('#btn-cancel');
const messageAlert = document.querySelector('#message');
const form = document.querySelector('#frm-item');
const inputSearch = document.querySelector("#input-search");
const loadingObj = new Loading("modal-message", "Loading...")

let currentDeveloper = null;

const newDeveloper = () => {
    const nombre = document.querySelector('#field-name').value;
    const developer = {nombre};
    console.log("developer", developer);
    loadingObj.open();
    DeveloperService.insert(developer).then(data => {
        console.log("message", data);
        renderDevelopers();
        form.reset();
        scrollToHash("title-list");
    }).finally(() => {
        loadingObj.close();
    });
}

const editDeveloper = (id) => {
    DeveloperService.getItemById(id).then(data => {
        currentDeveloper = data;
        document.querySelector('#field-name').value = data.name;
        document.querySelector('#field-description').value = data.description;
    });
    btnInsert.classList.replace("d-inline", "d-none");
    btnUpdate.classList.replace("d-none", "d-inline");
    btnCancel.classList.replace("d-none", "d-inline");
    scrollToHash("title-form");
}

const updateDeveloper = () => {
    const id = currentDeveloper.id;
    const nombre = document.querySelector('#field-name').value;
    const developer = {id, nombre}

    DeveloperService.update(developer).then(data => {
        currentDeveloper = null;
        messageAlert.textContent = data.message;
        btnCancel.classList.replace("d-inline", "d-none");
        btnUpdate.classList.replace("d-inline", "d-none");
        btnInsert.classList.replace("d-none", "d-inline");
        form.reset();
        renderDevelopers();
    });

}

const deleteDeveloper = (id) => {
    DeveloperService.delete(id)
        .then(data => {
            messageAlert.textContent = data.message;
            //Change state
            renderDevelopers();
        })
}

const populateDevelopers = (items) => {
    items.forEach((e, i) => {
        listContainer.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${e.nombre}</td>
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
            deleteDeveloper(id);
        })
    });

    // Buttons Edit
    const buttonsEdit = document.querySelectorAll('.btn-edit');
    buttonsEdit.forEach(button => {
        button.addEventListener("click", function () {
            let id = this.id.split("-")[2];
            editDeveloper(id);
        })
    });
}

const renderDevelopers = (searchValue) => {
    listContainer.innerHTML = "";
    if (searchValue) {
        loadingObj.open();
        DeveloperService.searchItemByName(searchValue)
            .then(items => {
                if (items.length===0){
                    listContainer.innerHTML = "<tr><td colspan='4'>No items found<td></tr>";
                }else{
                    populateDevelopers(items);
                }
               
            }).finally(() => {
                loadingObj.close();
            });
    } else {
        loadingObj.open();
        DeveloperService.getItemsList()
            .then(items => {
                populateDevelopers(items);
            }).finally(() => {
                loadingObj.close();
            });
    }
}
const validateForm = (event) => {
    event.preventDefault();
    //Execute insert or update depends to button name 
    if (event.target.id === "btn-insert") {
        newDeveloper();
    } else if (event.target.id === "btn-update") {
        updateDeveloper();
    }else{
        console.log("id button not found in validateForm function");
    }
}

function init() {
    renderDevelopers();
    btnCancel.addEventListener("click", function (e) {
        currentDeveloper = null;
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
}

init();