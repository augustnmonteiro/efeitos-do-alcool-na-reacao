let btnIniciar = document.querySelector("#iniciar");
let divCor = document.querySelector(".quadrado_cores");
let corDeFundo;
let intervalId;
let cronometroId;
let tempoInicioCronometro;
let hits = [];
let errors = [];

// Função para escolher uma cor específica entre vermelho e azul
function escolherCor() {
    const cores = ["rgb(255, 0, 0)", "rgb(0, 0,255)"]; // Vermelho, Azul
    return cores[Math.floor(Math.random() * cores.length)];
}

// Função chamada ao clicar no botão "Iniciar"
function mudarCor() {
    console.log("Mudei a cor");
    
    // Gera uma cor aleatória
    var corAleatoria = escolherCor();
    
    // Aplica a cor à div
    divCor.style.backgroundColor = corAleatoria;
    corDeFundo = getComputedStyle(divCor).backgroundColor;
    console.log(corDeFundo);

    // Registra o tempo de início do cronômetro
    tempoInicioCronometro = Date.now();

    // Inicia o cronômetro
    iniciarCronometro();

    setTimeout(function () {
        // Para o cronômetro
        pararCronometro();

        // Inicia a próxima mudança de cor
        iniciarMudancaAutomatica();
    }, tempoAleatorio(3000, 10000));
}

// Função para iniciar a mudança automática de cor
function iniciarMudancaAutomatica() {
    console.log("iniciei");
    // Reinicia a mudança automática de cor após um tempo aleatório entre 1 e 10 segundos
    intervalId = setTimeout(mudarCor, tempoAleatorio(2000, 10000));
}

// Função para parar a mudança automática de cor após 1 minuto
function pararMudancaAutomatica() {
    setTimeout(function () {
        clearInterval(intervalId);
        clearInterval(cronometroId);
        console.log("CABOOU");
    }, 60000);
}

// Função para iniciar o cronômetro
function iniciarCronometro() {
    console.log("Iniciei o cronometro");
    cronometroId = setInterval(function () {
        let tempoDecorridoCronometro = (Date.now() - tempoInicioCronometro) / 1000;
        console.log("Tempo decorrido: " + tempoDecorridoCronometro + " segundos");
    }, 1000);
}

// Função para parar o cronômetro
function pararCronometro() {
    clearInterval(cronometroId);
}

// Função para gerar um tempo aleatório entre min e max
function tempoAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// Ao pressionar a tecla "espaço"
document.addEventListener("keydown", function (e) {
    let tempoClique;

    if (e.code === "Space" && tempoInicioCronometro) {
        tempoClique = (Date.now() - tempoInicioCronometro) / 1000;
        console.log("Cliquei na tecla de espaço. Tempo exato: " + tempoClique + " segundos");

        if (corDeFundo === "rgb(255, 0, 0)") {
            console.log("É VERMELHOOOO");
            hits.push(tempoClique);
            console.log("Acertos: " + hits.length);
        } else {
            console.log("ERROUU");
            errors.push(tempoClique);
            console.log("Erros : " + errors.length);
        }
    }
});

// Ao clicar no botão "Iniciar"
btnIniciar.addEventListener("click", e => {
    iniciarMudancaAutomatica();
    pararMudancaAutomatica();
    tempoInicioCronometro = Date.now();
});
