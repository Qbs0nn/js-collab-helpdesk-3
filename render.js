// renderTickets(tickets, container)
const STATUSES = ['new', 'doing', 'done']
export function renderTickets(container, tickets) {
    container.innerHTML = ''
    for (const t of tickets) {
        const li = document.createElement("li")
        li.dataset.id = t.id

        const title = document.createElement("span")
        title.textContent = `${t.title} [${t.priority}]`

        const select = document.createElement("select")
        select.className = 'status-select'
        for(const s of STATUSES) {
            const opt = document.createElement("option")
            opt.value = s
            opt.textContent = s
            opt.selected = s === t.status
            select.appendChild(opt)
        }

        li.append(title, select)
        container.appendChild(li)
    }
}