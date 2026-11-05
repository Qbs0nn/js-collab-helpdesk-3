import { validateTickets } from './tickets.js'
// Import ticketów z pliku JSON
export async function importFromFile(file) {
    const text = await file.text()
    const tickets = JSON.parse(text)

    validateTickets(tickets)

    return tickets
}

// Import ticketów z adresu URL
export async function importFromUrl(url) {
    const response = await fetch(url)
    const tickets = await response.json()

    validateTickets(tickets)

    return tickets
}
// w tym pliku bedziemy robic import JSON z pliku i url
// uzyjemy sobie tutaj async/await i Promise

// export async function importFromFile(file) { const text = await file.text(), const tickets = JSON.parse(text), validateTickets(tickets), return tickets OPROCZ TEGO WALIDACJA PLIKU}
// export async function importFromUrl(url) {const response = await fetch(url), const tickets = await response.json(), validateTickets(tickets), return tickets}