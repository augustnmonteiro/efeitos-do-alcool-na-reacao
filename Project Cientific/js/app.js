let nameUser;
let doseUser;
let currentColor = "white";
let reactionRed = [];
let ReactionWhite = 0;
let reactionOrange = 0;
let averageReactionTime = 0;
let endTime = null;
let lastColorTime = null;
let stateDivContainer = false;

function start() {
    endTime = Date.now() + (10 * 1000);
    const name = document.querySelector('#username').value;
    const dose = document.querySelector('#dose').value;
    nameUser = name;
    doseUser = dose;
    document.querySelector("#content-download").style.display = 'none';
    nameUser = nameUser.replace(/\s+$/, '');
    verifyUser(nameUser, doseUser);
}

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

function verifyUser(name, dose) {
    name = name.replace(/\s/g, '');

    let verifyName = /^[a-zA-Z]+$/;

    if (verifyName.test(name) && name != "" && dose != "") {
        verifyDose();
    } else {
        alert("Preencha os dados para iniciar o teste");
    }
}

function verifyDose() {
    let testData = JSON.parse(localStorage.getItem(`Testes_${nameUser}`));

    if (testData) {
        console.log("Verificação");
        for (const test of testData) {
            console.log(test);

            if (test.name === nameUser && test.dose === doseUser) {
                alert(`${test.name}, você não pode repetir o teste da ${test.dose}° dose. Tente Novamente!`);
                return;
            }
        }
    }
    controllerElementsAndStyle();
    nextColor();
}

function controllerElementsAndStyle() {
    let divContainer = document.querySelector('#container');
    if (divContainer.style.display === "none") {
        divContainer.style.display = "flex";
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
        return dataTime[0];
    }

    const totalReactionTime = dataTime.reduce(function (a, b) {
        return a + b;
    }, 0);
    const media = totalReactionTime / dataTime.length;
    return media;
}

function finish() {
    createData();
    controllerElementsAndStyle();
    reactionRed = [];
    lastID++;
    console.log("Finished");
}

function formatarArray(arr) {
    return arr.map(value => value.toString()).join(';');
}

function generateCSV() {
    let allKeys = Object.keys(localStorage);
    allKeys.sort()

    if (allKeys.length === 0) {
        console.error('Nenhum dado encontrado no localStorage.');
        return;
    }

    let csvContentWithoutName = 'id,dose,errorWhite,errorOrange,timeReaction,mediaTimeReaction\n';
    let csvContentWithName = 'id,name,dose,errorWhite,errorOrange,timeReaction,mediaTimeReaction\n';

    let sortedKeys = allKeys.filter(key => key.startsWith('Testes_')).sort();

    sortedKeys.forEach(key => {
        let testData = localStorage.getItem(key);

        if (testData) {
            let data = JSON.parse(testData);

            data.forEach(item => {
                csvContentWithName += Object.values(item).join(',') + '\n';

                csvContentWithoutName += `${item.id},${item.dose},${item.errorWhite},${item.errorOrange},${item.timeReaction},${item.mediaTimeReaction}\n`;
            });
        }
    });

    downloadFileTest(csvContentWithName, `Teste com o nome do Usuário.csv`)
    downloadFileTest(csvContentWithoutName, `Teste sem o nome do Usuário.csv`)
}

function downloadFileTest(content, fileName) {
    let blob = new Blob([content], { type: 'text/csv' });

    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

function exportData() {
    const btnExportData = document.querySelector('#btn-exportData');

    btnExportData.addEventListener('click', () => {
        generateCSV()
    })
}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && stateDivContainer === true) {
        if (currentColor === "red") {
            tempoClique = (Date.now() - lastColorTime);
            reactionRed.push(tempoClique);
            const media = calculateAverage(reactionRed);
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
    let contentBtnDownload = document.querySelector("#content-download");
    let stateContentDownload = false;

    if (contentBtnDownload.style.display === 'block') {
        stateContentDownload = true;
    } else {
        stateContentDownload = false;
    }

    if (e.code === "Space" && e.ctrlKey) {
        if (stateContentDownload === true) {
            contentBtnDownload.style.display = "none";
        } else {
            contentBtnDownload.style.display = "block";
        }
    }
});

exportData()
document.querySelector("#toggleStart").addEventListener('click', () => {
    console.log('Start');
    start();
});