import sharedVariables from './sharedVariables.js';

class ManipuleElements {

    generateCSV() {
        let allKeys = Object.keys(localStorage);
        allKeys.sort();
    
        if (allKeys.length === 0) {
            alert('Não Existem Dados para Serem Exportados pois Você Ainda não Realizou Nenhum Teste...');
            console.error('Nenhum dado encontrado.');
            return;
        }
    
        let csvContentWithName = 'id;name;dose;errorWhite;errorOrange;timeReactionRed;avgTimeReaction\n';
        let csvContentWithoutName = 'id;dose;errorWhite;errorOrange;timeReactionRed;avgTimeReaction\n';
    
        let sortedKeys = allKeys.filter(key => key.startsWith('Testes_')).sort((a, b) => a.localeCompare(b));
    
        let userIdsMap = {};
    
        sortedKeys.forEach(key => {
            let testData = localStorage.getItem(key);
    
            if (testData) {
                let data = JSON.parse(testData);
                data.forEach(item => {
                    if (!userIdsMap.hasOwnProperty(item.name)) {
                        userIdsMap[item.name] = this.generateUserId(item);
                    }
    
                    const userID = userIdsMap[item.name];
    
                    const csvWithNameLine = [
                        userID, item.name, item.dose, item.errorWhite, item.errorOrange, "\"" + item.timeReactionRed.join(',') + "\"", item.avgTimeReaction
                    ].join(';') + '\n';
    
                    const csvWithoutNameLine = [
                        userID, item.dose, item.errorWhite, item.errorOrange, "\"" + item.timeReactionRed.join(',') + "\"", item.avgTimeReaction
                    ].join(';') + '\n';
    
                    csvContentWithName += csvWithNameLine;
                    csvContentWithoutName += csvWithoutNameLine;
                });
            }
        });
    
        this.downloadFileTest(csvContentWithName, `Teste com o nome do Usuário.csv`);
        this.downloadFileTest(csvContentWithoutName, `Teste sem o nome do Usuário.csv`);
    }

    downloadFileTest(content, fileName) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    exportData() {
        const btnExportData = document.querySelector('#btnExportData');
        btnExportData.addEventListener('click', () => {
            manipuleElements.generateCSV();
        })
    }
    
    generateUserId(item) {
        const randomIntegerHundred = Math.floor(Math.random() * 900) + 100;
        const randomInteger = Math.floor(Math.random() * 90) + 10;
        const firstLetter = item.name.charAt(0).toLowerCase();
        const lastLetter = item.name.charAt(item.name.length - 1).toLowerCase();
    
        const randomString = this.generateRandomString(4);
    
        const userId = firstLetter + randomIntegerHundred + firstLetter + randomInteger + randomString + lastLetter;
    
        return userId;
    }
    
    generateRandomString(length) {
        const characters = "abcdefghijklmnopqrstuvwxyz@&$";
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }
        return randomString;
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
            timeReactionTOTAL = timeReactionTOTAL.concat(i.timeReactionRed);
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

    clearHistoryResults() {
        document.querySelector('#msgHistorySucessConfig').style.display = 'block';
        setTimeout(() => {
            document.querySelector('#msgHistorySucessConfig').style.display = 'none';
        }, 3000);
        return localStorage.clear();
    }
};

const manipuleElements = new ManipuleElements();
export default manipuleElements;