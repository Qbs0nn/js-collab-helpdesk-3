// addTicket(tickets, ticket)
// updateTicket(tickets, STATUS)
// filterTickets(tickets, STATUS)
const status = ["new","doing","done"];
const priority = ["low","normal","high"];
let newId = 1;
export function addTicket(title,priority){
    if(title.length < 3 || ticket.length > 80) {return false};
    if(stauts !== "new" || status !== "doing" || status !== "done") {return false};
    if(priority !=="low" || priority !=="normal" || priority !=="high") {return false};
    title.trim();
    return {id: newId, title: title, priority: priority, status: "new"}
    
}

export function updateTicket(tickets,id,title,priority,status) {
    const ticket = tickets.find
}
