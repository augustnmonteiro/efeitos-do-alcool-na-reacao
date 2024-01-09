const iniciar = document.getElementById("toggleStart");
const divDataUsers = document.getElementById('dataUsers');
const divContainer = document.getElementById('container');
const body = document.body;
let cronometroId;
let tempoInicioCronometro;

function startTest() {
    divDataUsers.style.display = 'none';
    divContainer.style.display = 'none';
    intervalNumberRandom();
}

function showColor(elementId) {
    setTimeout(() => {
        if (elementId !== '#FFF') {
            iniciarCronometro();
        }
        document.querySelector("body").style.background = elementId;
        console.log("mostrei");
        console.log(elementId);
    }, numAleatorio(2000, 5000));
    hideColors();
}

function nextColor() {

}

function hideColors() {
    document.querySelector("body").style.background = "#FFF";
    pararCronometro();
    console.log("Ocultei");
}

function numAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function intervalNumberRandom() {
    console.log("Comecei");
        console.log("to no interval");
        const min = 1;
        const max = 2;
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);

        if (randomNumber === 1) {
            showColor('rgb(255, 0, 0)');
        } else if (randomNumber === 2) {
            showColor('rgb(255, 255, 0)');
        }

    setTimeout(() => {

        divDataUsers.style.display = 'flex';
        divContainer.style.display = 'block';

        console.log("Teste encerrado");
    }, 30000);
}

// Função para iniciar o cronômetro
function iniciarCronometro() {
    console.log("Iniciei o cronometro");
    tempoInicioCronometro = Date.now();
    cronometroId = setInterval(function () {
        let tempoDecorridoCronometro = (Date.now() - tempoInicioCronometro) / 1000;
        console.log("Tempo decorrido: " + tempoDecorridoCronometro + " segundos");
    }, 1000);
}

// Função para parar o cronômetro
function pararCronometro() {
    clearInterval(cronometroId);
}

// document.addEventListener("keydown", function (e) {
//     let tempoClique;

//     if (e.code === "Space" && tempoInicioCronometro) {
//         tempoClique = (Date.now() - tempoInicioCronometro) / 1000;
//         console.log("Cliquei na tecla de espaço. Tempo exato: " + tempoClique + " segundos");
//     }
// });

iniciar.addEventListener('click', () => {
    console.log('Cliquei');
    startTest();
});