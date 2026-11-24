import { validateTickets } from './tickets.js'
import type { Ticket } from './types.js'
export function loadTickets(): Ticket[] {
    const data: string | null = localStorage.getItem("tickets")
    if (!data) return []
    const tickets: unknown = JSON.parse(data)
    validateTickets(tickets)
    return tickets as Ticket[]
}

export function saveTickets(tickets: Ticket[]): void {
    localStorage.setItem("tickets", JSON.stringify(tickets))
}