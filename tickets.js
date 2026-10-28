// addTicket(tickets, ticket)
// updateTicket(tickets, STATUS)
// filterTickets(tickets, STATUS)
let newId = 1;
export function addTicket(title,priority){
    return {id: newId++, title: title, priority: priority, status: "new"}
}
export function updateTicket(tickets, id, status){
    return tickets.map(t =>(t.id === id) ? {...t, status} : t); 
}
export function filterTicket(tickets, status) {
    if(status == 'all') return tickets;
    return tickets.filter(t => t.status === status);
}