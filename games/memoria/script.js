class Eredmeny{
    constructor(nev, ford, t){
        this.nev = nev
        this.forditas = ford
        this.ido = t
    }
}
const cardsEl = document.getElementById("cards")
let runs = JSON.parse(localStorage.getItem("tops"))
if(runs == null) runs = {"2x2": [], "4x4": [], "6x6":[], "8x8":[]}
const names = ["2x2", "4x4", "6x6", "8x8"]

let tries = 0
let first = true;
let end = false;
let startTime;
let endTime;
let poolLength;
let size;
function reset(el = null){
    if(el != null) el.innerText = "Újrakezdés"
    document.getElementById("saveBtn").disabled = true;
    // alapok visszaállítása
    first = true;
    displayLoop()
    document.getElementById("timer").innerText = formatTime(0)
    setTimeout(() => {
        tries = 0;
    }, 100)
    end = false;
    // kártyák sorsolása
    size = parseInt( document.getElementById("size").value) // méret lekérdezése
    let temp = ""
    for(let i = 0; i < size; i++){
        temp += "auto "                                         // méret beállítása css-ben
    }
    cardsEl.style.gridTemplateColumns = temp.trim()
    while(cardsEl.hasChildNodes()){                             // meglévő kártyák törlése
        cardsEl.removeChild(cardsEl.firstChild)
    }

    poolLength = size * size / 2 // legyen ennyi kép a mappában
    let pool = []                                               // kártyák random kiválasztása
    while(pool.length < poolLength){                            // arra figyelve hogy egy kártya egyszer szerepelhessen
        let n = Random(1,32) // képek nevei! legyen min a legelső kép neve, a max az utolsó kép neve!
        if(!pool.includes(n)) pool.push(n)
    }
    let card = [] // az összes kártya (tábla)
    let sl = pool.length
    while(pool.length > 0){                                     
        let i = Random(0, pool.length-1)
        let select = pool[i]                                    // kiválasztott kártyák random sorrendbe sorsolása
        if(card.includes(select)) pool.splice(i, 1)             // oly módon, hogy minden kártya 2x legyen a táblán
        card.push(select)
    }
    card.forEach(c=>addCard(c))                                 // kártyák táblára töltése

    document.querySelectorAll(".card").forEach(c => {
        c.style.height= `${90/size}vh`                          // kártyák méretének beállítása, hogy elférjenek a képernyőn
    })
}

function clickHandle(e){
    if(end) return;
    if(first) {startTime = Date.now(); first = false; displayLoop()}
    card = e.target.parentElement
    //let o1 = null;
    let openCount = 0;
    document.querySelectorAll(".card").forEach(c => {
        if(c.classList.contains("open")){
            openCount++
        }
    })
    
    if(openCount >= 2) document.querySelectorAll(".card").forEach(c => c.classList.remove("open"))
    else if(openCount == 1) {
        document.querySelectorAll(".card").forEach(c => {
            if(c !== card && c.lastChild.src == card.lastChild.src){
                if(c.classList.contains("open")){
                    card.classList.add("fix")
                    c.classList.add("fix")
                    c.classList.remove("open")
                }
            }
        })
    }

    let fixCount = 0;
    document.querySelectorAll(".card").forEach(c => {
        if(c.classList.contains("fix")){
            fixCount++
        }
    })
    if(fixCount >= poolLength*2){
        end = true;
        endTime = Date.now()
        setTimeout(() => {
            document.getElementById("timer").innerText = formatTime(endTime - startTime)
        }, 100)
        setTimeout(() => alert("Sikerült mindet felfordítanot! Kattints az 'Eredmény mentése' gombra, hogy elmentsd az eredményed!"), 10)
        document.getElementById("saveBtn").disabled = false;
    }

    if(!card.classList.contains("open")) tries++;
    if(!card.classList.contains("open") && !card.classList.contains("fix")) card.classList.add("open")
}

function addCard(id){
    let card = document.createElement("div")
    card.classList.add("card")
    let front = document.createElement("img")
    front.src = `./magyar/${id}.png`
    let back = document.createElement("img")
    back.src = "./magyar/back.png"
    card.appendChild(back)
    card.appendChild(front)
    card.addEventListener("click", e => clickHandle(e))
    cardsEl.appendChild(card)
}

function Random(min, max){
    return Math.round(Math.random() * (max - min) + min)
}

function displayLoop(){
    document.getElementById("tries").innerText = tries
    document.getElementById("timer").innerText = formatTime(Date.now() - startTime)
    if(!end && !first) requestAnimationFrame(displayLoop)
}
function formatTime(time){
     return `${Math.trunc(time/1000/60%60).toString().padStart(2, "0")}:${Math.trunc(time/1000%60).toString().padStart(2, "0")}.${(time%1000).toString().padStart(3, "0")}`
}

function save(el){
    let name = prompt(`${names[size/2-1]}: ${tries} fordítás, ${formatTime(endTime - startTime)}. Adj meg egy becenevet!`)
    if(name != "" && name != null){
        runs[names[size/2-1]].push(new Eredmeny(name, tries, endTime - startTime))
        el.disabled = true
        updateTop(runs, names)
        localStorage.setItem("tops", JSON.stringify(runs))
    }
}

function updateTop(table, head){
    let sorted = {}
    const tableEl = document.querySelector("#tops > table")
    while(tableEl.hasChildNodes()) tableEl.removeChild(tableEl.firstChild)
    let maxL = 0;
    for (let i = 0; i < head.length; i++) {
        sorted[head[i]] = eredmenyRendezes(table[head[i]])
        if(table[head[i]].length > maxL){
            maxL = table[head[i]].length
        }
    }
    let hr = document.createElement("tr")
    let c1 = document.createElement("th")
    c1.innerText = "Helyezés"
    hr.appendChild(c1)
    head.forEach(h => {
        let c = document.createElement("th")
        c.innerText = h
        hr.appendChild(c)
    })
    tableEl.appendChild(hr)
    for(let i = 0; i < maxL; i++){
        let r = document.createElement("tr")
        let h = document.createElement("th")
        h.innerText = `${i+1}.`
        r.appendChild(h)
        head.forEach(h=>{
            let c = document.createElement("td")
            let t = sorted[h][i]
            if(t != undefined) c.innerHTML = `${t.forditas} - ${t.nev} <br> ${formatTime(t.ido)}`
            r.appendChild(c)
        })
        tableEl.appendChild(r)
    }
}

function eredmenyRendezes(eredmenyek){
    if(eredmenyek.length == 0) return [];
    let sorted = [eredmenyek[0]]
    for (let i = 1; i < eredmenyek.length; i++) {
        const nez = eredmenyek[i];
        let helyezve = false;
        for (let j = 0; j < sorted.length; j++) {
            const hely = sorted[j];
            if(!helyezve && (hely.forditas > nez.forditas || (hely.forditas == nez.forditas && hely.ido > nez.ido))){
                helyezve = true;
                sorted.splice(j, 0, nez)
            }
        }
        if(!helyezve) sorted.push(nez)
    }
    return sorted;
}

function exportTop(){
    navigator.clipboard.writeText(JSON.stringify(runs))
    alert("Eredmények vágólapra másolva!")
}

function importTop(){
    let tmp = null;
    try{
        tmp = JSON.parse(navigator.clipboard.readText())
        console.log(tmp)
    } catch {
        try{
            tmp = JSON.parse(prompt("Másold be az eredményeket!"))
        } catch {
            if(confirm("Nem sikerült importálni. Üresen szeretnéd importálni?")) tmp = ""
        }
    }
    if(tmp != null && tmp != ""){
        runs = tmp
        alert("Eredmények sikeresen importálva, felülírva!")
        updateTop(runs, names)
    } else if(tmp == ""){
        names.forEach(n => 
            runs[n] = []
        )
        alert("Eredmények felülírva!")
        updateTop(runs, names)
    } else {
        alert("Eredmények importálása sikertelen!")
    }
}

updateTop(runs, names)