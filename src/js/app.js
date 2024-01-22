const sharedVariables = {
    nameUser: null,
    doseUser: null,
    currentColor: "white",
    reactionRed: [],
    ReactionWhite: 0,
    reactionOrange: 0,
    averageReactionTime: 0,
    lastColorTime: null,
    stateDivContainer: false,
    durationTest: (60 * 1000)
};

class Test {

    constructor() {
        this.endTime = null;
        this.clearTimer;
    }

    start() {
        this.endTime = Date.now() + sharedVariables.durationTest;
        const name = document.querySelector('#username').value;
        const dose = document.querySelector('#dose').value;
        sharedVariables.nameUser = name;
        sharedVariables.doseUser = dose;
        sharedVariables.nameUser = sharedVariables.nameUser.replace(/\s+$/, '');
        verifications.verifyUser(sharedVariables.nameUser, sharedVariables.doseUser);
    }

    setDuration(timeInSeconds) {
        if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
            sharedVariables.durationTest = timeInSeconds * 1000;
        } else {
            console.log(timeInSeconds + "Dados válido")
        }
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
                timeReaction: sharedVariables.reactionRed,
                avgTimeReaction: parseFloat(sharedVariables.averageReactionTime.toFixed(2))
            });

            localStorage.setItem(`Testes_${sharedVariables.nameUser}`, JSON.stringify(testData));

            localStorage.setItem('UltimoUsuario', `Testes_${sharedVariables.nameUser}`);
        } catch (error) {
            console.error("Ocorreu um erro: ", error);
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
            document.querySelector('#contentElements').style.display = "flex";
        } else {
            divContainer.style.display = "none";
            document.body.style.backgroundColor = "white";
            sharedVariables.currentColor = "White";
            sharedVariables.stateDivContainer = true;
            document.querySelector('#contentElements').style.display = "none";
        }
    }

    nextColor() {
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
                if (drawnColor > 0.25) {
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
            console.error("Ocorreu um erro: ", error);
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
        const avg = totalReactionTime / dataTime.length;
        return avg;
    }

    finish() {
        test.createData();
        test.controllerElementsAndStyle();
        sharedVariables.reactionRed = [];

        const nameInput = document.querySelector("#username");
        const doseInput = document.querySelector('#dose');

        if (nameInput && doseInput) {
            nameInput.value = "";
            doseInput.value = "";
        }

        //Comentar esse trecho de código abaixo para não mostrar o resultado após o fim do teste
        manipuleElements.manipuleModalResults();

        const results = document.querySelector("#resultsUsersModal");

        if (results.childNodes.length < 1) {
            manipuleElements.showResultsModal();
        } else {
            results.innerHTML = '';
            manipuleElements.showResultsModal();
        }
    }
};

class Validations {

    verifyUser(name, dose) {
        const divDataUsers = document.querySelector("#dataUsers");
        name = name.replace(/\s/g, '');

        let verifyName = /^[a-zA-Z]+$/;

        if (verifyName.test(name) && name != "" && dose != "") {
            verifications.verifyDose();
        } else {
            if (!document.querySelector(".error-text")) {
                this.createError(divDataUsers, "Preencha os Campos Corretamente...");
            }
        }
    }

    verifyDose() {
        try {
            let testData = JSON.parse(localStorage.getItem(`Testes_${sharedVariables.nameUser}`));

            if (testData) {
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

    createError(campo, msg) {
        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('error-text');
        campo.insertAdjacentElement('afterend', div);

        setTimeout(() => {
            div.remove();
        }, 5000);
    }

};

class ManipuleElements {

    generateCSV() {
        let allKeys = Object.keys(localStorage);
        allKeys.sort();
    
        if (allKeys.length === 0) {
            alert('Não Existem Dados para Serem Exportados pois Você Ainda não Realizou Nenhum Teste...');
            console.error('Nenhum dado encontrado.');
            return;
        }
    
        let csvContentWithoutName = 'id,dose,errorWhite,errorOrange,timeReaction,avgTimeReaction\n';
        let csvContentWithName = 'id,name,dose,errorWhite,errorOrange,timeReaction,avgTimeReaction\n';
    
        let sortedKeys = allKeys.filter(key => key.startsWith('Testes_')).sort((a, b) => a.localeCompare(b));
    
        sortedKeys.forEach(key => {
            let testData = localStorage.getItem(key);
    
            if (testData) {
                let data = JSON.parse(testData);
    
                data.forEach(item => {
                    const timeReactionString = Array.isArray(item.timeReaction) ? item.timeReaction.join(';') : item.timeReaction;
    
                    const csvLine = `${item.id},${item.name || ''},${item.dose || ''},${item.errorWhite || '0'},${item.errorOrange || '0'},${timeReactionString || ''},${item.avgTimeReaction || '0'}\n`;
    
                    if (item.name) {
                        csvContentWithName += csvLine;
                    } else {
                        csvContentWithoutName += csvLine;
                    }
                });
            }
        });
    
        this.downloadFileTest(csvContentWithName, `Teste com o nome do Usuário.csv`);
        this.downloadFileTest(csvContentWithoutName, `Teste sem o nome do Usuário.csv`);
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
            manipuleElements.generateCSV();
        })
    }

    manipuleModalConfig() {
        const divModal = document.querySelector('#divModalConfig');
        divModal.classList.add('open');
        document.querySelector('#inputConfigTime').value = sharedVariables.durationTest / 1000;
        divModal.addEventListener('click', (e) => {
            if (e.target.id === 'close' || e.target.id === 'divModalConfig') {
                divModal.classList.remove('open');
            }
        });
    }

    manipuleModalResults() {
        const divModal = document.querySelector('#divModal');
        divModal.classList.add('open');

        divModal.addEventListener('click', (e) => {
            if (e.target.id === 'close' || e.target.id === 'divModal') {
                divModal.classList.remove('open');
            }
        });
    }

    showResultsModal() {
        const lastUsers = localStorage.getItem('UltimoUsuario');
        const resultsUser = localStorage.getItem(lastUsers);

        if (!resultsUser) {
            document.querySelector('#headerResults').style.display = 'none';
            this.createElement('h1', "Você ainda não realizou o teste...");
            console.error("Erro: Dados do usuário não encontrados.");
            return;
        }

        let addedNames = new Set();
        let Average = [];
        let errorsOranged = [];
        let errorsWhite = [];
        let timeReactionTOTAL = [];

        for (const i of JSON.parse(resultsUser)) {
            const name = i.name;
            Average.push(i.avgTimeReaction);
            timeReactionTOTAL = timeReactionTOTAL.concat(i.timeReaction);
            errorsOranged.push(i.errorOrange);
            errorsWhite.push(i.errorWhite);

            if (!addedNames.has(name)) {
                this.createElement('p', `Nome: ${i.name}`);
                addedNames.add(name);
            }
        }

        // Manipulando Média de Reação
        let sumAverage = Average.reduce((soma, valor) => soma + valor, 0);
        let generalAverage = sumAverage / Average.length;

        // Manipulando Erros
        let sumErrorsOranged = errorsOranged.reduce((soma, valor) => soma + valor, 0);
        let sumErrorsWhite = errorsWhite.reduce((soma, valor) => soma + valor, 0);

        // Manipulando Tempo de Reação
        let arrTimesTotal = timeReactionTOTAL.map(Number);

        // Manipulando Tempo de Reação
        let reactionFaster = NaN;
        let reactionSlower = NaN;

        if (arrTimesTotal.length > 0) {
            reactionFaster = Math.min(...arrTimesTotal);
            reactionSlower = Math.max(...arrTimesTotal);
        }

        this.createElement('p', `Média de Reação: ${generalAverage.toFixed(2)}ms`);
        this.createElement('p', `Reação mais Rápida: ${isNaN(reactionFaster) ? 'N/A' : reactionFaster}ms`);
        this.createElement('p', `Reação mais Lenta: ${isNaN(reactionSlower) ? 'N/A' : reactionSlower}ms`);
        this.createElement('p', `Erros no Laranja: ${sumErrorsOranged}`);
        this.createElement('p', `Erros no Branco: ${sumErrorsWhite}`);
    }

    createElement(el, msg) {
        const element = document.createElement(`${el}`);
        element.textContent = msg;
        element.classList.add(`${el}ModalResults`);
        document.querySelector('#resultsUsersModal').appendChild(element);
    }

    clearHistoryResults () {
        document.querySelector('#msgHistorySucessConfig').style.display = 'block';
        setTimeout(() => {
            document.querySelector('#msgHistorySucessConfig').style.display = 'none';
        }, 3000);
        return localStorage.clear();
    }
};

const test = new Test();
const verifications = new Validations();
const manipuleElements = new ManipuleElements();

manipuleElements.exportData();

document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && sharedVariables.stateDivContainer === true) {
        if (sharedVariables.currentColor === "red") {
            reactionTime = (Date.now() - sharedVariables.lastColorTime);
            sharedVariables.reactionRed.push(reactionTime);
            const avg = test.calculateAverage(sharedVariables.reactionRed);
            sharedVariables.averageReactionTime = avg;
            test.nextColor();
        } else if (sharedVariables.currentColor === "orange") {
            sharedVariables.reactionOrange++;
        } else {
            sharedVariables.ReactionWhite++;
        }
    }
});

document.querySelector("#toggleStart").addEventListener('click', () => {
    test.start();
});

document.querySelector("#btnResults").addEventListener('click', () => {
    manipuleElements.manipuleModalResults();

    const results = document.querySelector("#resultsUsersModal");

    if (results.childNodes.length < 1) {
        manipuleElements.showResultsModal();
    } else {
        results.innerHTML = '';
        manipuleElements.showResultsModal();
    }
});

document.querySelector("#btnConfig").addEventListener('click', () => {
    manipuleElements.manipuleModalConfig();
});

document.querySelector('#sendConfigTime').addEventListener('click', () => {
    let inputConfigTime = document.querySelector('#inputConfigTime');

    if(inputConfigTime.value > 0) {
        const timeInSeconds = parseFloat(inputConfigTime.value);
        let msgSucessConfig = document.querySelector('#msgSucessConfig');
        test.setDuration(timeInSeconds)
        
        msgSucessConfig.style.display = 'block';
        
        setTimeout(() => {
            msgSucessConfig.style.display = 'none';
        }, 4000)
    } else {
        let msgErroConfig = document.querySelector('#msgErroConfig');
        
        msgErroConfig.style.display = 'block';
        
        setTimeout(() => {
            msgErroConfig.style.display = 'none';
        }, 4000)
    }
});

document.querySelector("#clearResults").addEventListener('click', () => {
    manipuleElements.clearHistoryResults();


});