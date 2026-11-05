// musimy zamienic w eventListener "submit" to jak dodajemy tickety na uzycie saveAndRender()
import { renderTickets } from './render.js'
import { addTicket, updateTicket, filterTicket } from './tickets.js'
import { loadTickets, saveTickets } from './storage.js'
import { importFromFile, importFromUrl } from './import.js'


let tickets = []
try {
    tickets = loadTickets()
} catch (err) {
    alert(err.message)
}

let currentFilter = 'all'

const form = document.querySelector(".helpdeskForm")
const titleInput = document.querySelector(".helpdeskTitle")
const prioritySelect = document.querySelector(".helpdeskPriority")
const filterSelect = document.querySelector(".helpdeskFilter")
const list = document.querySelector(".helpdeskList")

const fileInput = document.querySelector('#importFile')
const importFileBtn = document.querySelector('#importFileBtn')
const urlInput = document.querySelector('#importUrl')
const importUrlBtn = document.querySelector('#importUrlBtn')
let importing = false


function rerender() {
    renderTickets(list, filterTicket(tickets, currentFilter))
}
function saveAndRender(newTickets) {
    saveTickets(newTickets)
    tickets = newTickets
    rerender()
}

form.addEventListener("submit", e => {
    e.preventDefault()
if (importing) return
    try {
      saveAndRender([
        ...tickets,
    addTicket(titleInput.value, prioritySelect.value)
])
form.reset()
    } catch (err) {
        alert(err.message)
    }
})

list.addEventListener("change", e => {
    if (importing) return
    const id = e.target.closest('li').dataset.id
    saveAndRender(updateTicket(tickets, id, e.target.value))
})

async function handleImport(loader) {
    importing = true

    // Blokujemy wszystkie kontrolki na czas importowania
form.querySelectorAll('input, select, button').forEach(el => {
    el.disabled = true
})

list.querySelectorAll('select').forEach(el => {
    el.disabled = true
})

    fileInput.disabled = true
    importFileBtn.disabled = true
    urlInput.disabled = true
    importUrlBtn.disabled = true

try {
    const importedTickets = await loader()

if (!confirm('Czy chcesz zastąpić obecną listę ticketów?')) {
    return
    }

    saveAndRender(importedTickets)

} catch (err) {
    alert(err.message)

} finally {
    importing = false

        // Odblokowujemy kontrolki
    form.querySelectorAll('input, select, button').forEach(el => {
        el.disabled = false
    })

    list.querySelectorAll('select').forEach(el => {
        el.disabled = false
    })

    fileInput.disabled = false
    importFileBtn.disabled = false
    urlInput.disabled = false
    importUrlBtn.disabled = false
    }
}

filterSelect.addEventListener("change", e => {
    currentFilter = e.target.value
    rerender()
})

// jakas funkcja saveAndRender(noweTickety) { uzywa saveTickets(nowe bilety), tickety = nowe tickety, rerender() }
rerender()

importFileBtn.addEventListener('click', async () => {
const file = fileInput.files[0]

if (!file) {
    alert('Wybierz plik JSON')
    return
}

await handleImport(() => importFromFile(file))
})

importUrlBtn.addEventListener('click', async () => {
const url = urlInput.value.trim()

if (!url) {
    alert('Podaj adres URL')
    return
}

await handleImport(() => importFromUrl(url))
})
// jak bedzie gotowy import.js to mozemy zrobic async function handleImport(loader)
// wtedy importing = true
// wtedy wylaczamy opcje uzywanie tych importFileBtn, importUrlBtn, fileInput, urlInput
// form.querySelectorAll('input, select, button').forEach(el => el.disabled = true)
// list.querySelectorAll('select').forEach(el => el.disabled = true)
// w try { } const importedTickets = await loader(), if(!confirm('zastapic obecna liste?')) return, saveAndRender(importedTickets)
// w catch { } jedynie error message
// w finally { } importing = false, odblokowujemy wszystko to co zablokowalismy wczesniej

// NA SAMYM KONCU
// dodajemy eventListenery na te buttony nowe importfromfile i importfromurl
// w listenerze formularza i zmiany statusu dodac if(importing) return