// trzeba usunac newID - nadpis danych przez import lub localStorage bedzie duplikowac ID
// do funkcji addTicket dodajemy w parametrach tickets czyli (tickets, title, priority)
// na poczatku funkcji let newId = 1, while(tickets.some(t => t.id === String(newId))) { newId++ }
// te some() sprawdza czy istnieje juz ticket z podanym id. jesli istnieje to zwiekszamy licznik az znajdziemy jakies wolne id.

// przez to trzeba bedzie zamienic sprawdzanie typu (newId > MAX_TICKETS) na (tickets.length >= MAX_TICKETS)
// oraz const idS = String(newId) -> bez tego ++

const MAX_TICKETS = 1000
export function addTicket(tickets,title,priority ) {
    console.log("tickets:", tickets);
    console.log("Array?", Array.isArray(tickets));
    console.log("Type:", typeof tickets);
    let newId = 1
    while(tickets.some(t => t.id === String(newId))) { newId++ }
    if(title.length < 3 || title.length > 80)
        throw new Error("Tytul nie moze miec mnie niz 3 lub wiecej niz 80 znaków")
    if(tickets.length >= MAX_TICKETS)
        throw new Error("Osiagnieto limit możliwych ticketów")
    const idS = String(newId)
    return { id: idS, title, priority, status: "new"}   
}
export function updateTicket(tickets, id, status) {
    return tickets.map(t =>(t.id === id) ? {...t, status} : t); 
}
export function filterTicket(tickets, status) {
    if(status == 'all') return tickets;
    return tickets.filter(t => t.status === status);
}
export function validateTickets(tickets) {
    if(!Array.isArray(tickets))
        throw new Error("JSON nie jest tablicą")
    if(tickets.length > MAX_TICKETS)
        throw new Error("Próba dodania zbyt wielkiej ilośći ticketów")

    const idS = new Set()

    for(const t of tickets) {
        if(!t || typeof t !== 'object' || Array.isArray(t))
            throw new Error("Nieprawidłowe zgłoszenie")
        if(typeof t.id !== 'string' || t.id.length < 1 || t.id.length > 100)
            throw new Error("Nieprawidłowe ID")
        if(idS.has(t.id))
            throw new Error("Powtarzające się ID")

        idS.add(t.id)

        if(typeof t.title !== 'string' || t.title.trim().length < 3 || t.title.trim().length > 80)
            throw new Error("Chociaż jeden ticket ma nieprawidłowy tytuł")
        if(!['new', 'doing', 'done'].includes(t.status))
            throw new Error("Chociaż jeden ticket zawiera nieprawidłowy tytuł")
        if(!['low', 'medium', 'high'].includes(t.priority))
            throw new Error("Chociaż jeden ticket zawiera nieprawidłowy priorytet")
    }
    return true
}

// bedzie trzeba zrobic funckje do importowanie danych z JSON, walidacja danych itp. 
// proponuje cos w stylu export function validateTickets(tickets) 
// i sprawdzic: czy Json jest tablica, czy nie ma za duzo zgloszen (max tickets 1000), czy jest jakies nieprawidlowe zgloszenie, nieprawidlowe id, powtarzajace sie id
// nieprawidlowy tytul, nieprawidlowy priorytet lub nieprawidlowy status.

// wczesniej jedynie czy !Array.isArray(tickets) -> sprawdzic czy uzytkownik wgl podal prawidlowo tablice
// to wszystko ofc wystarczy zrobic w loopie for (const t of tickets) { i jak uzytkownik wkleja ci tablice to masz t.id, t.title itp itd} 
// do sprawdzenia powtarzajacego sie Id w importowanych danych zrobimy cos w stylu:
//  const idS = new Set()
// if(idS.has(t.id)) throw new Error() -> a jezeli nie ma to jest juz pewnie wszystko git (sprawdzmy to jako ostatnie) i wtedy mozemy zrobic idS.add(t.id)