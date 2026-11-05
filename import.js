import { validateTickets } from './tickets.js'
// Import ticketów z pliku JSON
export async function importFromFile(file) {
    if(!file)
        throw new Error("Nie wybrano pliku")
    if(!file.name.toLowerCase().endsWith('.json'))
        throw new Error("Wybierz plik JSON")

    const text = await file.text()
    const tickets = JSON.parse(text)

    validateTickets(tickets)

    return tickets
}

// Import ticketów z adresu URL
export async function importFromUrl(url) {
    if(!url)
        throw new Error("Nie podano adresu url")

    const response = await fetch(url)
    if(!response.ok)
        throw new Error(`Bład HTTP: ${response.status}`)

    const tickets = await response.json()

    validateTickets(tickets)

    return tickets
}

function parseCSV(text) {
    const rows = [];
    let row = [];
    let value = '';
    let insideQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                value += '"';
                i++;
            } else 
                insideQuotes = !insideQuotes;
        } 
        else if (char === ',' && !insideQuotes) {
            row.push(value);
            value = '';
        } 
        else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n')
                i++;
            row.push(value);
            rows.push(row);
            row = [];
            value = '';
        } 
        else 
            value += char;
    }
    if (value.length > 0 || row.length > 0) {
        row.push(value);
        rows.push(row);
    }
    const headers = rows.shift();
    return rows
        .filter(row => row.some(value => value.trim() !== ''))
        .map(row => {
            return Object.fromEntries(
                headers.map((header, index) => [
                    header.trim(),
                    (row[index] ?? '').trim()
                ])
            );
        });
}
// Import ticketów z pliku CSV
export async function importFromCsvFile(file) {
    if(!file)
        throw new Error("Nie wybrano pliku")

    const csvText = await file.text()
    const importedTickets = parseCSV(csvText)
    return importedTickets
}
// w tym pliku bedziemy robic import JSON z pliku i url
// uzyjemy sobie tutaj async/await i Promise

// export async function importFromFile(file) { const text = await file.text(), const tickets = JSON.parse(text), validateTickets(tickets), return tickets OPROCZ TEGO WALIDACJA PLIKU}
// export async function importFromUrl(url) {const response = await fetch(url), const tickets = await response.json(), validateTickets(tickets), return tickets}