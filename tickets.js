// addTicket(tickets, ticket)
// updateTicket(tickets, STATUS)
// filterTickets(tickets, STATUS)
let newId = 1;
const MAX_TICKETS = 1000
export function addTicket(title,priority ) {
    if(title.length < 3 || title.length > 80)
        throw new Error("Tytul nie moze miec mnie niz 3 lub wiecej niz 80 znaków")
    if(newId > 1000)
        throw new Error("Osiagnieto limit możliwych ticketów")

    const idS = String(newId++)
    if(idS.length === 0 ||  idS.length > 100)
        throw new Error("ID musi mieć od 1 do 100 znaków")
    return { id: idS, title, priority, status: "new"}   
}
export function updateTicket(tickets, id, status) {
    return tickets.map(t =>(t.id === id) ? {...t, status} : t); 
}
export function filterTicket(tickets, status) {
    if(status == 'all') return tickets;
    return tickets.filter(t => t.status === status);
}