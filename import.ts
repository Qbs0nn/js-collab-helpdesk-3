import { validateTickets } from './tickets.js'
import type { Ticket } from './types.js'
// Import ticketów z pliku JSON
export async function importFromFile(file: File): Promise<Ticket[]> {
    if(!file)
        throw new Error("Nie wybrano pliku")
    if(!file.name.toLowerCase().endsWith('.json'))
        throw new Error("Wybierz plik JSON")

    const text: string | null = await file.text()
    const tickets: Ticket[] = JSON.parse(text)

    validateTickets(tickets)

    return tickets as Ticket[]
}

// Import ticketów z adresu URL
export async function importFromUrl(url: string): Promise<Ticket[]> {
    if(!url)
        throw new Error("Nie podano adresu url")

    const response: Response = await fetch(url)
    if(!response.ok)
        throw new Error(`Bład HTTP: ${response.status}`)

    const tickets: Ticket[] = await response.json()

    validateTickets(tickets)

    return tickets as Ticket[]
}

type CsvRow = Record<string, string>;
function parseCSV(text: string): CsvRow[] {
    const rows: string[][] = [];
    let row: string[] = [];
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
    if(!headers)
        throw new Error("Podane CSV nie posiada headerow")
    return rows
        .filter(row => row.some(value => value.trim() !== ''))
        .map(row => {
            return Object.fromEntries(
                headers.map((header, index) => [
                    header.trim(),
                    (row[index] ?? '').trim()
                ]) 
            ) as CsvRow
        });
}
// Import ticketów z pliku CSV
export async function importFromCsvFile(file: File): Promise<Ticket[]> {
    if(!file)
        throw new Error("Nie wybrano pliku")

    const csvText: string = await file.text()
    const importedTickets: unknown = parseCSV(csvText)

    validateTickets(importedTickets)
    return importedTickets as Ticket[]
}
// w tym pliku bedziemy robic import JSON z pliku i url
// uzyjemy sobie tutaj async/await i Promise

// export async function importFromFile(file) { const text = await file.text(), const tickets = JSON.parse(text), validateTickets(tickets), return tickets OPROCZ TEGO WALIDACJA PLIKU}
// export async function importFromUrl(url) {const response = await fetch(url), const tickets = await response.json(), validateTickets(tickets), return tickets}