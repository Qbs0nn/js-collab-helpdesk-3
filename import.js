
import { validateTickets } from './tickets.js'

// Import JSON
export async function importFromFile(file) {
    if (!file || !file.name.endsWith('.json')) {
        throw new Error('Wybierz plik JSON')
    }

    const text = await file.text()
    const tickets = JSON.parse(text)

    validateTickets(tickets)

    return tickets
}

// Import z URL
export async function importFromUrl(url) {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Nie udało się pobrać danych')
    }

    const tickets = await response.json()

    validateTickets(tickets)

    return tickets
}

// Import CSV
export async function importFromCsv(file) {
    if (!file || !file.name.endsWith('.csv')) {
        throw new Error('Wybierz plik CSV')
    }

    const text = await file.text()

    const lines = text.trim().split(/\r?\n/)
    const headers = lines[0].split(',')

    const tickets = lines.slice(1).map(line => {
        const values = line.split(',')

        return Object.fromEntries(
            headers.map((header, index) => [
                header.trim(),
                values[index]?.trim()
            ])
        )
    })

    validateTickets(tickets)

    return tickets
}

// Import XML
export async function importFromXml(file) {
    if (!file || !file.name.endsWith('.xml')) {
        throw new Error('Wybierz plik XML')
    }

    const text = await file.text()

    const parser = new DOMParser()
    const xml = parser.parseFromString(text, 'application/xml')

    if (xml.querySelector('parsererror')) {
        throw new Error('Niepoprawny plik XML')
    }

    const tickets = [...xml.querySelectorAll('ticket')].map(ticket => ({
        title: ticket.querySelector('title')?.textContent,
        priority: ticket.querySelector('priority')?.textContent,
        status: ticket.querySelector('status')?.textContent
    }))

    validateTickets(tickets)

    return tickets
}
