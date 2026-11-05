# TESTY 

# TYTULY DLUGOSCI - 2 / 3 / 80 / 81
2 - Nie dodaje - > tytul musi byc dluzszy lub rowny 3
3 - Dodaje, wszystko okej
80 - Dodaje, wszystko okej
81 - Nie dodaje -> tytul musi byc krotszy lub rowny 80.

# DWA TAKIE SAME TYTYLU 
W naszym programie aktualnie mozna dodawac tickety o tej samej nazwie.

# WSZYSTKIE STATUSY
Wszystkie statusy działaja. Mozna po nich sortowac, oraz wyswietlac wszystkie tickety nie wazne jaki status.

# PUSTY FILTR
Nie mozna dodawac ticketa o pustej nazwie.

# TEKST HTML
Dodawanie tekstu html dodaje go jako normlane znaki, np. zapisanie `<h1>TEST</h1>` wyswietli `<h1>TEST</h1>`

# DODAWANIE PRZEZ WCISNIECIE ENTER
Tickety mozna dodawac poprzez wcisniecie ENTER.

# ODSWIEZANIE
Odswiezanie powoduje zresetowanie aplikacji 0 (Usuwa wczesniej dodane tickety.)

# 1000/1001 ZGLOSZEN W PROBIE DOMENY
W programie mozna umiescic maksymalnie 1000 ticketow. Przekroczenie tej ilosci powoduje wyskoczenie bledu.

# importowanie JSON
Walidacja programu nie pozwoli na dodanie ticketu z nieprawidłowym tytułem, priorytetem lub statusem. Nie zezwoli na niezgodne ID - lub powtarzające. 
Import z URL oraz z pliku dokładnie sprawdza czy każdy z podanych ticketów jest obiektem oraz czy cały JSON jest tablicą. Każdy bład jest poprawnie wyrzucany do konsoli oraz opisany i nie pozwala on na dodanie źle zimportowanych ticketów do pliku. 

# Pamięć lokalna
Program korzysta z pamięci lokalnej przeglądarki, oznacza to, że odświeżenie nie resetuje stanów ticketów.