import { renderTickets } from './render.js'
import { addTicket, updateTicket, filterTicket } from './tickets.js'

let tickets = []
let currentFilter = 'all'

const form = document.querySelector(".helpdeskForm")
const titleInput = document.querySelector(".helpdeskTitle")
const prioritySelect = document.querySelector(".helpdeskPriority")
const filterSelect = document.querySelector(".helpdeskFilter")
const list = document.querySelector(".helpdeskList")

function rerender() {
    renderTickets(list, filterTicket(tickets, currentFilter))
}

form.addEventListener("submit", e => {
    e.preventDefault()
    try {
        tickets = [...tickets, addTicket(titleInput.value, prioritySelect.value)]
        form.reset()
        rerender()
    } catch (err) {
        alert(err.message)
    }
})

list.addEventListener("change", e => {
    const id = e.target.closest('li').dataset.id
    tickets = updateTicket(tickets, id, e.target.value)
    rerender()
})

filterSelect.addEventListener("change", e => {
    currentFilter = e.target.value
    rerender()
})