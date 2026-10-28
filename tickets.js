// addTicket(tickets, ticket)
// updateTicket(tickets, STATUS)
// filterTickets(tickets, STATUS)
const status = ["new","doing","done"];
const priority = ["low","normal","high"];
let newId = 1;
export function addTicket(title,priority){
    
    return {id: newId, title: title, priority: priority, status: "new"}
    
}

export function updateTicket(ticket,status){
    tickets = [...ticket, status: status];
}

