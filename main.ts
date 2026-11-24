import type { Ticket } from './types.js'
import { renderTickets } from './render.js';
import { addTicket, updateTicket, filterTicket } from './tickets.js';
import { loadTickets, saveTickets } from './storage.js';
import { importFromCsvFile, importFromFile, importFromUrl } from './import.js';

let tickets: Ticket[] = [];
let currentFilter: Ticket["status"] | "all" = 'all';
let importing: boolean = false;
try {
    tickets = loadTickets();
} catch (err: unknown) {
    if(err instanceof Error)
        alert(err.message);
}
const form = document.querySelector<HTMLFormElement>('.helpdeskForm');
const titleInput = document.querySelector<HTMLInputElement>('.helpdeskTitle');
const prioritySelect = document.querySelector<HTMLSelectElement>('.helpdeskPriority');
const filterSelect = document.querySelector<HTMLSelectElement>('.helpdeskFilter');  
const list = document.querySelector<HTMLUListElement>('.helpdeskList');

const fileInput = document.querySelector<HTMLInputElement>('#importFile');
const importFileBtn = document.querySelector<HTMLButtonElement>('#importFileBtn');
const urlInput = document.querySelector<HTMLInputElement>('#importUrl');
const importUrlBtn = document.querySelector<HTMLButtonElement>('#importUrlBtn');

const csvImportFile = document.querySelector<HTMLInputElement>('#csvImportFile');
const csvImportBtn = document.querySelector<HTMLButtonElement>('#csvImportBtn');

if (
    !form || !titleInput || !prioritySelect || !filterSelect ||
    !list || !fileInput || !importFileBtn || !urlInput ||
    !importUrlBtn || !csvImportFile || !csvImportBtn
) {
    throw new Error("Required HTML elements are missing");
}

function isTicketStatus(value: string): value is Ticket["status"] {
    return ['new', 'doing', 'done'].includes(value);
}

function isTicketPriority(value: string): value is Ticket["priority"] {
    return ['low', 'medium', 'high'].includes(value);
}

// funkcje od renderu i zapisu do localStorage
function rerender(): void {
    if (!list)
        throw new Error("Ticket list element not found");  
    renderTickets(list, filterTicket(tickets, currentFilter));
}

function saveAndRender(newTickets: Ticket[]): void {
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
        const priority = prioritySelect.value
        if(!isTicketPriority(priority))
            throw new Error("Zly priorytet")
        const newTicket = addTicket(tickets, titleInput.value, priority);
        saveAndRender([...tickets, newTicket]);
        form.reset();
    } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Unkown Error");
    }
});
// Listener na update statusu
list.addEventListener('change', (e: Event) => {
    if (importing) return;
    if (!(e.target instanceof HTMLSelectElement))
        return;
    const item = e.target.closest('li');
    if (!item) return;
    const id = item.dataset.id;
    if (!id) return;
    const status = e.target.value;
    if (!isTicketStatus(status))
        return;
    saveAndRender(updateTicket(tickets, id, status));
});
// Listener na filtrowanie ticketów
filterSelect.addEventListener('change', () => {
    const value = filterSelect.value;
    if (value === 'all' || isTicketStatus(value)) {
        currentFilter = value;
        rerender();
    }
});
// Wyłączanie kontrolek podczas importu
function setImportingState(disabled: boolean): void {
    if (
    !form || !titleInput || !prioritySelect || !filterSelect ||
    !list || !fileInput || !importFileBtn || !urlInput ||
    !importUrlBtn || !csvImportFile || !csvImportBtn
    ) {
        throw new Error("Required HTML elements are missing");
    }
    form.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLButtonElement
    >('input, select, button').forEach(el => {
        el.disabled = disabled;
    });
    list.querySelectorAll<HTMLSelectElement>('select').forEach(el => {
        el.disabled = disabled;
    });
    fileInput.disabled = disabled;
    importFileBtn.disabled = disabled;
    urlInput.disabled = disabled;
    importUrlBtn.disabled = disabled;
    csvImportFile.disabled = disabled;
    csvImportBtn.disabled = disabled;
}
// Funkcja od importowania!!
async function handleImport(loader: () => Promise<Ticket[]>): Promise<void> {
    if (importing) return;
    importing = true;
    setImportingState(true);
    try {
        const importedTickets = await loader();
        if (!confirm('Czy chcesz zastąpić obecną listę ticketów?'))
            return;
        saveAndRender(importedTickets);
    } catch (err: unknown) {
        alert(err instanceof Error ? err.message: "Unknown error");
    } finally { 
        importing = false;
        setImportingState(false);
    }
}
// IMPORTY JSON
importFileBtn.addEventListener('click', async () => {
    if(!fileInput)
        throw new Error("Brak potrzebnego elementu HTML")
    const file = fileInput.files?.[0];
    if (!file) {
        alert('Wybierz plik JSON');
        return;
    }
    await handleImport(() => importFromFile(file));
});
importUrlBtn.addEventListener('click', async () => {
    const url: string = urlInput.value.trim();
    if (!url) {
        alert('Podaj adres URL');
        return;
    }
    await handleImport(() => importFromUrl(url));
});

csvImportBtn.addEventListener('click', async () => {
    const file = csvImportFile.files?.[0]
    if(!file) {
        alert("Wybierz plik CSV")
        return
    }
    handleImport(() => importFromCsvFile(file))
})
rerender();