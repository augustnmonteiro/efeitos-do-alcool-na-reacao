let divContainer = document.querySelector('#container');
let currentColor = "white";
let lastColorTime = null;
let reactionRed = [];
let averageReactionTime = 0;
let ReactionWhite = 0;
let reactionOrange = 0;
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
        errorWhite: ReactionWhite,
        errorOrange: reactionOrange,
        timeReaction: formatarArray(reactionRed),
        mediaTimeReaction: parseFloat(averageReactionTime.toFixed(2))
    });

    localStorage.setItem(`Testes_${nameUser}`, JSON.stringify(testData));
}

function verifyDose() {
    let testData = JSON.parse(localStorage.getItem(`Testes_${nameUser}`));
    console.log(testData);
    console.log(nameUser, doseUser);
    if (testData) {
        console.log("Verificação");
        for (let i = 0; i < testData.length; i++) {
            console.log(testData[i].dose);
            if (testData[i].name === nameUser && testData[i].dose === doseUser) {
                console.log("VOCÊ NÂO PODE REPETIR A DOSE");
                return;
            }
        }
    }
    controllerElementsAndStyle();
    nextColor();
}

function formatarArray(arr) {
    return arr.map(value => value.toString()).join(';');
}

function downloadCSV() {
    let allKeys = Object.keys(localStorage);
    console.log(allKeys);

    if (allKeys.length === 0) {
        console.error('Nenhum dado encontrado no localStorage.');
        return;
    }

    let csvContent = 'id,name,dose,errorWhite,errorOrange,timeReaction,mediaTimeReaction\n';

    allKeys.forEach(key => {
        if (key.startsWith('Testes_')) {
            let testData = localStorage.getItem(key);

            if (testData) {
                let data = JSON.parse(testData);

                data.forEach(item => {
                    csvContent += Object.values(item).join(',') + '\n';
                });
            }
        }
    });

    let blob = new Blob([csvContent], { type: 'text/csv' });

    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'todos_os_dados.csv';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

function exportData() {
    const btnExportData = document.querySelector('#btn-exportData');

    btnExportData.addEventListener('click', () => {
        downloadCSV()
    })
}

function controllerElementsAndStyle() {
    if (divContainer.style.display === "none") {
        divContainer.style.display = "block";
        document.body.style.backgroundColor = "white";
        stateDivContainer = false;
        currentColor = "white";
    } else {
        divContainer.style.display = "none";
        document.body.style.backgroundColor = "white";
        currentColor = "White";
        stateDivContainer = true;
    }
}
function start() {
    endTime = Date.now() + (10 * 1000);
    const name = document.querySelector('#username').value;
    const dose = document.querySelector('#dose').value;
    nameUser = name;
    doseUser = dose;
    verifyDose();
}

function finish() {
    createData();
    controllerElementsAndStyle();
    reactionRed = [];
    lastID++;
    console.log("Acabou");
}

function nextColor() {
    if (endTime < Date.now()) {
        finish();
        return;
    }

    document.body.style.backgroundColor = "white";
    lastColorTime = Date.now();

    let drawnColor = Math.random();

    setTimeout(() => {
        if (drawnColor > 0.5) {
            document.querySelector("body").style.backgroundColor = "red";
            lastColorTime = Date.now();
            currentColor = "red";
        } else {
            document.querySelector("body").style.backgroundColor = "orange";
            lastColorTime = Date.now();
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

    const totalReactionTime = dataTime.reduce(function (a, b) {
        return a + b;
    }, 0);
    const media = totalReactionTime / dataTime.length;
    return media;
}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && stateDivContainer === true) {
        if (currentColor === "red") {
            tempoClique = (Date.now() - lastColorTime);
            reactionRed.push(tempoClique);
            const media = calculateAverage(reactionRed);//média de reação 
            averageReactionTime = media;
            nextColor();
            console.log("Tempo de Reação: " + tempoClique);
        } else if (currentColor === "orange") {
            reactionOrange++;
            console.log(reactionOrange, ReactionWhite);
        } else {
            ReactionWhite++;
            console.log(reactionOrange, ReactionWhite);
        }
    }
});


document.addEventListener("keydown", function (e) {
    console.log(e)
    if (e.code === "Space" && e.ctrlKey) {
        console.log("atalho")
        document.querySelector("#content-download").style.display = "block";
    }
});
exportData()
document.querySelector("#toggleStart").addEventListener('click', () => {
    console.log('Iniciei');
    start();
});