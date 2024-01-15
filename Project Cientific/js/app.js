const sharedVariables = {
    nameUser: null,
    doseUser: null,
    currentColor: "white",
    reactionRed: [],
    ReactionWhite: 0,
    reactionOrange: 0,
    averageReactionTime: 0,
    lastColorTime: null,
    stateDivContainer: false
};

class Test {

    constructor() {
        this.endTime = null;
        this.clearTimer;
    }

    start() {
        this.endTime = Date.now() + (10 * 1000);
        const name = document.querySelector('#username').value;
        const dose = document.querySelector('#dose').value;
        sharedVariables.nameUser = name;
        sharedVariables.doseUser = dose;
        document.querySelector("#contentDownload").style.display = 'none';
        sharedVariables.nameUser = sharedVariables.nameUser.replace(/\s+$/, '');
        verifications.verifyUser(sharedVariables.nameUser, sharedVariables.doseUser);
    }

    formatArray(arr) {
        return arr.map(value => value.toString()).join(';');
    }

    createData() {
        try {
            let testData = JSON.parse(localStorage.getItem(`Testes_${sharedVariables.nameUser}`) || "[]");

            testData.push({
                id: testData.length + 1,
                name: sharedVariables.nameUser,
                dose: sharedVariables.doseUser,
                errorWhite: sharedVariables.ReactionWhite,
                errorOrange: sharedVariables.reactionOrange,
                timeReaction: this.formatArray(sharedVariables.reactionRed),
                mediaTimeReaction: parseFloat(sharedVariables.averageReactionTime.toFixed(2))
            });

            localStorage.setItem(`Testes_${sharedVariables.nameUser}`, JSON.stringify(testData));
        } catch (error) {
            console.error("Ocorreu um error: ", error);
            alert(`Ocorreu um erro, tente novamente.`);
        }
    }

    controllerElementsAndStyle() {
        let divContainer = document.querySelector('#container');
        if (divContainer.style.display === "none") {
            divContainer.style.display = "flex";
            document.body.style.backgroundColor = "white";
            sharedVariables.stateDivContainer = false;
            sharedVariables.currentColor = "white";
        } else {
            divContainer.style.display = "none";
            document.body.style.backgroundColor = "white";
            sharedVariables.currentColor = "White";
            sharedVariables.stateDivContainer = true;
        }
    }

    nextColor() {
        console.log("chamou");
        if (this.endTime < Date.now()) {
            test.finish();
            return;
        }

        document.body.style.backgroundColor = "white";
        sharedVariables.currentColor = 'white';
        sharedVariables.lastColorTime = Date.now();

        let drawnColor = Math.random();

        try {
            this.clearTimer = setTimeout(() => {
                if (drawnColor > 0.5) {
                    document.querySelector("body").style.backgroundColor = "red";
                    sharedVariables.lastColorTime = Date.now();
                    sharedVariables.currentColor = "red";
                } else {
                    document.querySelector("body").style.backgroundColor = "orange";
                    sharedVariables.lastColorTime = Date.now();
                    sharedVariables.currentColor = "orange";

                    setTimeout(() => {
                        document.body.style.backgroundColor = "white";
                        sharedVariables.currentColor = 'white';
                        clearTimeout(this.clearTimer);
                        test.nextColor();
                    }, 2000);
                }
            }, 2000);
        } catch (error) {
            console.error("Ocorreu um error: ", error);
            alert(`Ocorreu um erro, tente novamente.`);
        }

    }

    calculateAverage(dataTime) {
        if (dataTime.length === 1) {
            return dataTime[0];
        }

        const totalReactionTime = dataTime.reduce(function (a, b) {
            return a + b;
        }, 0);
        const media = totalReactionTime / dataTime.length;
        return media;
    }

    finish() {
        test.createData();
        test.controllerElementsAndStyle();
        sharedVariables.reactionRed = [];
        console.log("Finished");

        const nameInput = document.querySelector("#username");
        const doseInput = document.querySelector('#dose');

        if (nameInput && doseInput) {
            nameInput.value = "";
            doseInput.value = "";
        }
    }
};

class Validations {

    verifyUser(name, dose) {
        name = name.replace(/\s/g, '');

        let verifyName = /^[a-zA-Z]+$/;

        if (verifyName.test(name) && name != "" && dose != "") {
            verifications.verifyDose();
        } else {
            alert("Preencha os Dados Corretamente para Iniciar o Teste");
        }
    }

    verifyDose() {
        try {
            let testData = JSON.parse(localStorage.getItem(`Testes_${sharedVariables.nameUser}`));

            if (testData) {
                console.log("Verificação");
                for (const test of testData) {
                    if (test.name === sharedVariables.nameUser && test.dose === sharedVariables.doseUser) {
                        alert(`${test.name}, você não pode repetir o teste da ${test.dose}° dose. Tente Novamente!`);
                        return;
                    }
                }
            }
            test.controllerElementsAndStyle();
            test.nextColor();
        } catch (error) {
            console.error("Ocorreu um error: ", error);
            alert(`Ocorreu um erro, tente novamente.`);
        }
    }
};

class ManipuleCSV {

    generateCSV() {
        let allKeys = Object.keys(localStorage);
        allKeys.sort()

        if (allKeys.length === 0) {
            console.error('Nenhum dado encontrado no localStorage.');
            return;
        }

        let csvContentWithoutName = 'id,dose,errorWhite,errorOrange,timeReaction,mediaTimeReaction\n';
        let csvContentWithName = 'id,name,dose,errorWhite,errorOrange,timeReaction,mediaTimeReaction\n';

        // let sortedKeys = allKeys.filter(key => key.startsWith('Testes_')).sort();
        let sortedKeys = allKeys.filter(key => key.startsWith('Testes_')).sort((a, b) => a.localeCompare(b));


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
        this.downloadFileTest(csvContentWithName, `Teste com o nome do Usuário.csv`)
        this.downloadFileTest(csvContentWithoutName, `Teste sem o nome do Usuário.csv`)
    }

    downloadFileTest(content, fileName) {
        let blob = new Blob([content], { type: 'text/csv' });

        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    }

    exportData() {
        const btnExportData = document.querySelector('#btnExportData');
        btnExportData.addEventListener('click', () => {
            manipuleCSV.generateCSV();
        })
    }
};

const test = new Test();
const verifications = new Validations();
const manipuleCSV = new ManipuleCSV();

manipuleCSV.exportData();

document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && sharedVariables.stateDivContainer === true) {
        if (sharedVariables.currentColor === "red") {
            reactionTime = (Date.now() - sharedVariables.lastColorTime);
            sharedVariables.reactionRed.push(reactionTime);
            const media = test.calculateAverage(sharedVariables.reactionRed);
            sharedVariables.averageReactionTime = media;
            test.nextColor();
            console.log("Tempo de Reação: " + reactionTime);
        } else if (sharedVariables.currentColor === "orange") {
            sharedVariables.reactionOrange++;
            console.log(sharedVariables.reactionOrange, sharedVariables.ReactionWhite);
        } else {
            sharedVariables.ReactionWhite++;
            console.log(sharedVariables.reactionOrange, sharedVariables.ReactionWhite);
        }
    }
});

document.addEventListener("keydown", function (e) {
    let contentBtnDownload = document.querySelector("#contentDownload");
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

document.querySelector("#toggleStart").addEventListener('click', () => {
    console.log('Start');
    test.start();
});