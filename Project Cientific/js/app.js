let divContainer = document.querySelector('#container');
let currentColor = "white";
let tempoDaUltimaCor = null;
let reacaoVermelho = [];
let mediaVermelho = 0;
let reacaoBranco = 0;
let reacaoAmarelo = 0;
let endTime = null;
let counter = localStorage.getItem("counter");
let lastID = counter ? parseInt(counter) : 0;
let stateDivContainer = false;
let nameUser;
let doseUser;

function createData() {
    let testData = JSON.parse(localStorage.getItem(`Testes_${nameUser}`) || "[]");

    testData.push({
        id: testData.length + 1, 
        name: nameUser,
        dose: doseUser,
        errorWhite: reacaoBranco,
        errorOrange: reacaoAmarelo,
        timeReaction: reacaoVermelho,
        mediaTimeReaction: mediaVermelho
    });

    localStorage.setItem(`Testes_${nameUser}`, JSON.stringify(testData));
}

function controllerElementsAndStyle() {
    if (divContainer.style.display === "none") {
        console.log("IF");
        console.log(divContainer.style.display);
        divContainer.style.display = "block";
        document.body.style.backgroundColor = "white";
        stateDivContainer = false;
        currentColor = "white";
    } else {
        console.log("Else");
        divContainer.style.display = "none";
        document.body.style.backgroundColor = "white";
        currentColor = "White";
        stateDivContainer = true;
    }
}
function start() {
    endTime = Date.now() + (10 * 1000);
    controllerElementsAndStyle();
    const name = document.querySelector('#username').value;
    const dose = document.querySelector('#dose').value;
    nameUser = name;
    doseUser = dose;
    nextColor();
}

function finish() {
    createData();
    controllerElementsAndStyle();
    reacaoVermelho = [];
    console.log("Acabou");
    lastID++;
}

function nextColor() {
    if (endTime < Date.now()) {
        finish();
        return;
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
                currentColor = 'white';
                nextColor();
            }, 2000);
        }
    }, 2000);
}

function calculateAverage(dataTime) {
    if (dataTime.length === 1) {
        return dataTime[0]; // Se houver apenas um valor, retorne esse valor
    }
    
    const totalReactionTime = dataTime.reduce(function(a, b) {
        return a + b;
    }, 0);
    const media = totalReactionTime / dataTime.length;
    return media;
}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && stateDivContainer === true) {
        if (currentColor === "red") {
            tempoClique = (Date.now() - tempoDaUltimaCor);
            reacaoVermelho.push(tempoClique);
            console.log(reacaoVermelho);
            const media = calculateAverage(reacaoVermelho);//média de reação 
            mediaVermelho = media;
            nextColor();
            console.log("Tempo de Reação: " + tempoClique);
        } else if (currentColor === "orange") {
            reacaoAmarelo++;
            console.log(reacaoAmarelo, reacaoBranco);
        } else {
            reacaoBranco++;
            console.log(reacaoAmarelo, reacaoBranco);
        }
    }
});

document.querySelector("#toggleStart").addEventListener('click', () => {
    console.log('Iniciei');
    start();
});