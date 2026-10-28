import { renderTickets } from './render.js'
import { addTicket, updateTicket, filterTickets } from './tickets.js'

let tickets = []
let currentFilter = 'all'

const form = document.querySelector(".helpdeskForm")
const titleInput = document.querySelector(".helpdeskTitle")
const prioritySelect = document.querySelector(".helpdeskPriority")
const filterSelect = document.querySelector(".helpDeskFilter")
const list = document.querySelector(".helpdeskList")

function rerender() {
    renderTickets(list, filterTickets(tickets, currentFilter))
}

form.addEventListener("submit", e => {
    e.preventDefault()
    try {
        tickets = [...tickets, createTicket(titleInput.value, prioritySelect.value)]
        form.reset()
        rerender()
    }
})

list.addEventListener("change", e => {
    const id = Number(e.target.closest('li').dataset.id)
    tickets = updateTicket(tickets, id, e.target.value)
    rerender()
})

filterSelect.addEventListener("change", e => {
    currentFilter = e.target.value
    rerender()
})