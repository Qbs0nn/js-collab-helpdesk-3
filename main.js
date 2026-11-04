// musimy zamienic w eventListener "submit" to jak dodajemy tickety na uzycie saveAndRender()
import { renderTickets } from './render.js'
import { addTicket, updateTicket, filterTicket } from './tickets.js'
import { loadTickets, saveTickets } from './storage.js'
// import { importFromFile, importFromUrl } from './import.js'
// 

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
/* to mozemy dac jak juz zrobimy import z JSOON
const fileInput = document.querySelector('#importFile')
const importFileBtn = document.querySelector('#importFileBtn')
const urlInput = document.querySelector('#importUrl')
const importUrlBtn = document.querySelector('#importUrlBtn')
let importing = false
*/

function rerender() {
    renderTickets(list, filterTicket(tickets, currentFilter))
}

form.addEventListener("submit", e => {
    e.preventDefault()
    try {
        tickets = [...tickets, addTicket(titleInput.value, prioritySelect.value)] // to trzeba wtedy zamienic na cos w stylu saveAndRender([...tickets, addTicket(tickets, titleInput.value, prioritySelect.value)])
        form.reset()
        rerender() // to jest wtedy do wyjebania bo saveAndRender samo z siebie wywoluje rerender()
    } catch (err) {
        alert(err.message)
    }
})

list.addEventListener("change", e => {
    const id = e.target.closest('li').dataset.id
    tickets = updateTicket(tickets, id, e.target.value) // to tez trzeba bedzie zmienic. try { saveAndRender(updateTicket(tickets, id, e.target.value)) } catch(err) { alert(err.message) rerender() } 
    rerender()
})

filterSelect.addEventListener("change", e => {
    currentFilter = e.target.value
    rerender()
})

// jakas funkcja saveAndRender(noweTickety) { uzywa saveTickets(nowe bilety), tickety = nowe tickety, rerender() }
rerender()

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