export function loadTickets() {
    const data = localStorage.getItem("tickets")
    return data ? JSON.parse(data) : []
}

export function saveTickets(tickets) {
    localStorage.setItem("tickets", JSON.stringify(tickets))
}