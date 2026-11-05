
import { renderTickets } from './render.js'
import { addTicket, updateTicket, filterTicket } from './tickets.js'
import { loadTickets, saveTickets } from './storage.js'

import {
    importFromFile,
    importFromUrl,
    importFromCsv,
    importFromXml
} from './import.js'


let tickets = []

try {
    tickets = loadTickets()
} catch (err) {
    alert(err.message)
}

let currentFilter = 'all'
let importing = false


const form = document.querySelector(".helpdeskForm")
const titleInput = document.querySelector(".helpdeskTitle")
const prioritySelect = document.querySelector(".helpdeskPriority")
const filterSelect = document.querySelector(".helpdeskFilter")
const list = document.querySelector(".helpdeskList")

const fileInput = document.querySelector('#importFile')
const importFileBtn = document.querySelector('#importFileBtn')

const urlInput = document.querySelector('#importUrl')
const importUrlBtn = document.querySelector('#importUrlBtn')

const csvInput = document.querySelector('#importCsv')
const importCsvBtn = document.querySelector('#importCsvBtn')

const xmlInput = document.querySelector('#importXml')
const importXmlBtn = document.querySelector('#importXmlBtn')


// Renderowanie
function rerender() {
    renderTickets(list, filterTicket(tickets, currentFilter))
}


// Zapisywanie i renderowanie
function saveAndRender(newTickets) {
    saveTickets(newTickets)
    tickets = newTickets
    rerender()
}


// Dodawanie ticketów
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


// Zmiana statusu
list.addEventListener("change", e => {
    if (importing) return

    const li = e.target.closest('li')
    if (!li) return

    const id = li.dataset.id

    try {
        saveAndRender(updateTicket(tickets, id, e.target.value))
    } catch (err) {
        alert(err.message)
        rerender()
    }
})


// Wspólna funkcja importowania
async function handleImport(loader) {
    if (importing) return

    importing = true

    const controls = [
        ...form.querySelectorAll('input, select, button'),
        ...list.querySelectorAll('select'),
        fileInput,
        importFileBtn,
        urlInput,
        importUrlBtn,
        csvInput,
        importCsvBtn,
        xmlInput,
        importXmlBtn
    ]

    const previousStates = controls.map(el => el.disabled)

    controls.forEach(el => {
        el.disabled = true
    })

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

        controls.forEach((el, index) => {
            el.disabled = previousStates[index]
        })
    }
}


// Filtrowanie
filterSelect.addEventListener("change", e => {
    currentFilter = e.target.value
    rerender()
})


// Import JSON
importFileBtn.addEventListener('click', async () => {
    const file = fileInput.files[0]

    if (!file) {
        alert('Wybierz plik JSON')
        return
    }

    await handleImport(() => importFromFile(file))
})


// Import URL
importUrlBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim()

    if (!url) {
        alert('Podaj adres URL')
        return
    }

    await handleImport(() => importFromUrl(url))
})


// Import CSV
importCsvBtn.addEventListener('click', async () => {
    const file = csvInput.files[0]

    if (!file) {
        alert('Wybierz plik CSV')
        return
    }

    await handleImport(() => importFromCsv(file))
})


// Import XML
importXmlBtn.addEventListener('click', async () => {
    const file = xmlInput.files[0]

    if (!file) {
        alert('Wybierz plik XML')
        return
    }

    await handleImport(() => importFromXml(file))
})


// Pierwsze renderowanie
rerender()
