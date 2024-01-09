let currentColor = "white";
let tempoDaUltimaCor = null;
let reacaoVermelho = [];
let reacaoBranco = 0;
let reacaoAmarelo = 0;
let endTime = null;

function createUser(name, dose) {
    let counter = localStorage.getItem('counter');
    counter = counter ? parseInt(counter) : 0;
    const id = counter;

    const data = {name: name, dose: dose, errorWhite: 0, errorOrange: 0, timeReaction: [], mediaTimeReaction: null}
    const dataJson = JSON.stringify(data);
    localStorage.setItem('Data', dataJson);

    localStorage.setItem(id, JSON.stringify(data));
    counter++;
    localStorage.setItem('counter', counter.toString());
}

function updateData(data) {
    //erro 
}

function start() {
    endTime = Date.now() + (30 * 1000);
    document.querySelector('#container').style.display = "none";
    document.body.style.backgroundColor = "white";
    currentColor = "White";
    const name = document.querySelector('#username').value;
    const dose = document.querySelector('#dose').value;
    createUser(name, dose);
    nextColor();
}

function finish() {
    console.log("Acabou");
    document.querySelector('#container').style.display = "block";
    document.body.style.backgroundColor = "white";
    currentColor = "white";
}

function nextColor() {
    if (endTime < Date.now()) {
        finish();
    }
    document.body.style.backgroundColor = "white";
    tempoDaUltimaCor = Date.now();

    let drawnColor = Math.random();
    console.log(drawnColor);
    
    setTimeout(() => {
        if (drawnColor > 0.5) {
            document.querySelector("body").style.backgroundColor = "red";
            tempoDaUltimaCor = Date.now();
            currentColor = "red";
        } else {
            document.querySelector("body").style.backgroundColor = "orange";
            tempoDaUltimaCor = Date.now();
            currentColor = "orange";

            setTimeout(() => {
                document.body.style.backgroundColor = "white";
                nextColor();  // Sortear uma nova cor após 2 segundos
            }, 2000);
        }
    }, 2000);
}


document.querySelector("#toggleStart").addEventListener('click', () => {
    console.log('Iniciei');
    start();
});

function calculateAverage(dataTime) {
    const totalReactionTime = dataTime.reduce(function(a, b) {
        return a + b;
    }, 0);
    const media = totalReactionTime / dataTime.length;
    return media;
}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        if (currentColor === "red") {
            tempoClique = (Date.now() - tempoDaUltimaCor);
            reacaoVermelho.push(tempoClique);
            const media = calculateAverage(reacaoVermelho);//média de reação 
            nextColor();
            console.log("Tempo de Reação: " + tempoClique);
        } else if (currentColor === "white") {
            reacaoBranco++;
            console.log(reacaoAmarelo, reacaoBranco);
        } else {
            reacaoAmarelo++;
            console.log(reacaoAmarelo, reacaoBranco);
        }
    }
});