// renderTickets(tickets, container)
import type { Ticket } from './types.js'
const STATUSES = ['new', 'doing', 'done']
export function renderTickets(container: HTMLUListElement, tickets: Ticket[]): void {
    container.innerHTML = ''

    for (const t of tickets) {
        const li = document.createElement("li")
        li.dataset.id = t.id

        const ticketInfo = document.createElement("div")
        ticketInfo.className = 'ticketInfo'

        const title = document.createElement("span")
        title.className = 'ticketTitle'
        title.textContent = t.title

        const priority = document.createElement("span")
        priority.className = `priorityBadge ${t.priority}`
        priority.textContent = t.priority
        ticketInfo.append(title, priority)

        const select = document.createElement("select")
        select.className = 'status-select'

        for(const s of STATUSES) {
            const opt = document.createElement("option")
            opt.value = s
            opt.textContent = s
            opt.selected = s === t.status
            select.appendChild(opt)
        }
        const deleteButton = document.createElement("button")
        deleteButton.type = "button"
        deleteButton.className = "deleteButton"
        deleteButton.textContent = "x"

        li.append(ticketInfo, select, deleteButton)
        container.appendChild(li)
    }
}