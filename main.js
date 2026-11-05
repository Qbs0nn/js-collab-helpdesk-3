import { renderTickets } from './render.js';
import { addTicket, updateTicket, filterTicket } from './tickets.js';
import { loadTickets, saveTickets } from './storage.js';
import { importFromFile, importFromUrl } from './import.js';

let tickets = [];
let currentFilter = 'all';
let importing = false;
try {
    tickets = loadTickets();
} catch (err) {
    alert(err.message);
}
const form = document.querySelector('.helpdeskForm');
const titleInput = document.querySelector('.helpdeskTitle');
const prioritySelect = document.querySelector('.helpdeskPriority');
const filterSelect = document.querySelector('.helpdeskFilter');
const list = document.querySelector('.helpdeskList');

const fileInput = document.querySelector('#importFile');
const importFileBtn = document.querySelector('#importFileBtn');
const urlInput = document.querySelector('#importUrl');
const importUrlBtn = document.querySelector('#importUrlBtn');

// funkcje od renderu i zapisu do localStorage
function rerender() {
    renderTickets(list, filterTicket(tickets, currentFilter));
}

function saveAndRender(newTickets) {
    saveTickets(newTickets);
    tickets = newTickets;
    rerender();
}
// Listener na dodawanie ticketów
form.addEventListener('submit', e => {
    e.preventDefault();
    if (importing) 
        return;
    try {
        const newTicket = addTicket(tickets,titleInput.value,prioritySelect.value);
        saveAndRender([...tickets, newTicket]);
        form.reset();
    } catch (err) {
        alert(err.message);
    }
});
// Listener na update statusu
list.addEventListener('change', e => {
    if (importing) 
        return;
    const item = e.target.closest('li');
    if (!item) 
        return;
    const id = item.dataset.id;
    saveAndRender(updateTicket(tickets, id, e.target.value));
});
// Listener na filtrowanie ticketów
filterSelect.addEventListener('change', e => {
    currentFilter = e.target.value;
    rerender();
});
// Wyłączanie kontrolek podczas importu
function setImportingState(disabled) {
    form.querySelectorAll('input, select, button').forEach(el => {
        el.disabled = disabled;
    });
    list.querySelectorAll('select').forEach(el => {
        el.disabled = disabled;
    });
    fileInput.disabled = disabled;
    importFileBtn.disabled = disabled;
    urlInput.disabled = disabled;
    importUrlBtn.disabled = disabled;
}
// Funkcja od importowania!!
async function handleImport(loader) {
    if (importing) return;
    importing = true;
    setImportingState(true);
    try {
        const importedTickets = await loader();
        if (!confirm('Czy chcesz zastąpić obecną listę ticketów?'))
            return;
        saveAndRender(importedTickets);
    } catch (err) {
        alert(err.message);
    } finally { 
        importing = false;
        setImportingState(false);
    }
}
// IMPORTY JSON
importFileBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
        alert('Wybierz plik JSON');
        return;
    }
    await handleImport(() => importFromFile(file));
});
importUrlBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        alert('Podaj adres URL');
        return;
    }
    await handleImport(() => importFromUrl(url));
});
rerender();