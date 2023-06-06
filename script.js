const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearList = document.getElementById('clear')
const filterItem = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')

let isEditMode = false;

function displayItem() {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach((item) => addItemToDom(item));

    checkUI();

}

function onAddItemSubmit(event) {
    event.preventDefault();
    const newItem = itemInput.value;
    if (newItem.value === '') {
        alert('Pls Add Item')
        return;
    }

    // check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('Item already exits!')
            return;
        }
    }

    addItemToDom(newItem)

    addItemToStorage(newItem);
    
    // Add list back to dom
    checkUI();
    itemInput.value = '';
}

// Add item to DOM

function addItemToDom(item) {
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))

    const button = createButton("remove-item btn-link text-red")
    li.appendChild(button)

    itemList.appendChild(li)
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemFromStorage();
    

    itemsFromStorage.push(item)

    // convert to json string and set to local storage
localStorage.setItem('items', JSON.stringify(itemsFromStorage))

}

function getItemFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage;

}


function createButton(classes) {
    const button = document.createElement('button')
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon)
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i')
    icon.className = classes;
    return icon;
}


function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.style.backgroundColor = '#228b22'
    formBtn.innerHTML = '<i class="fa-solid fa-pen">  UPDATE ITEM'
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if (confirm('want to delete?')) {
       // remove item from Dom
        item.remove();

        // remove item from storage
        removeItemFromStorage(item.textContent);
        checkUI();
   }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();
    console.log(itemsFromStorage);

    // filter item to be removed

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Reset to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


function clearItem(event) {
    //itemList.innerHTML = '';
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // Clearing from Local Storage
    localStorage.removeItem('items');
    checkUI();
    
}

function filterItems(event) {
    const item = itemList.querySelectorAll('li')
    const text = event.target.value.toLowerCase();

    item.forEach((item) => {
        const itemName = item.firstChild.textContent.toLocaleLowerCase();
        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    })

}

function checkUI() {
    itemInput.value = '';
    const item = itemList.querySelectorAll('li')
    if (item.length === 0) {
        clearList.style.display = 'none';
        filterItem.style.display = 'none';
    } else {
        clearList.style.display = 'block';
        filterItem.style.display = 'block';  
    }
    
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333'

    isEditMode = false;
}


function checkIfItemExists(item) {
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);
}


// Event listeners
function init() {
    itemForm.addEventListener('submit', onAddItemSubmit)
itemList.addEventListener('click', onClickItem)
clearList.addEventListener('click', clearItem)
filterItem.addEventListener('input', filterItems)
document.addEventListener('DOMContentLoaded', displayItem)

checkUI();
}

init();
