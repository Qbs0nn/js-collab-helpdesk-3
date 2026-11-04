// trzeba usunac newID - nadpis danych przez import lub localStorage bedzie duplikowac ID
// do funkcji addTicket dodajemy w parametrach tickets czyli (tickets, title, priority)
// na poczatku funkcji let newId = 1, while(tickets.some(t => t.id === String(newId))) { newId++ }
// te some() sprawdza czy istnieje juz ticket z podanym id. jesli istnieje to zwiekszamy licznik az znajdziemy jakies wolne id.

// przez to trzeba bedzie zamienic sprawdzanie typu (newId > MAX_TICKETS) na (tickets.length >= MAX_TICKETS)
// oraz const idS = String(newId) -> bez tego ++


let newId = 1;
const MAX_TICKETS = 1000
export function addTicket(title,priority ) {
    if(title.length < 3 || title.length > 80)
        throw new Error("Tytul nie moze miec mnie niz 3 lub wiecej niz 80 znaków")
    if(newId > MAX_TICKETS)
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

// bedzie trzeba zrobic funckje do importowanie danych z JSON, walidacja danych itp. 
// proponuje cos w stylu export function validateTickets(tickets) 
// i sprawdzic: czy Json jest tablica, czy nie ma za duzo zgloszen (max tickets 1000), czy jest jakies nieprawidlowe zgloszenie, nieprawidlowe id, powtarzajace sie id
// nieprawidlowy tytul, nieprawidlowy priorytet lub nieprawidlowy status.

// wczesniej jedynie czy !Array.isArray(tickets) -> sprawdzic czy uzytkownik wgl podal prawidlowo tablice
// to wszystko ofc wystarczy zrobic w loopie for (const t of tickets) { i jak uzytkownik wkleja ci tablice to masz t.id, t.title itp itd} 
// do sprawdzenia powtarzajacego sie Id w importowanych danych zrobimy cos w stylu:
//  const idS = new Set()
// if(idS.has(t.id)) throw new Error() -> a jezeli nie ma to jest juz pewnie wszystko git (sprawdzmy to jako ostatnie) i wtedy mozemy zrobic idS.add(t.id)