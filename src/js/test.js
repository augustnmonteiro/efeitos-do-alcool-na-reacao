import sharedVariables from './sharedVariables.js';
import verifications from './validations.js';
import manipuleElements from "./manipuleElements.js";

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

            sharedVariables.avgReactionTime = parseFloat(
                Array.isArray(sharedVariables.timeReactionRed) ? sharedVariables.timeReactionRed.reduce((sum, value) => sum + value, 0) / sharedVariables.timeReactionRed.length : sharedVariables.timeReactionRed)
                .toFixed(2);

            testData.push({
                id: testData.length + 1,
                name: sharedVariables.nameUser,
                dose: sharedVariables.doseUser,
                errorWhite: sharedVariables.errorWhite,
                errorOrange: sharedVariables.errorOrange,
                timeReactionRed: sharedVariables.timeReactionRed,
                avgTimeReaction: sharedVariables.avgReactionTime
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
        sharedVariables.timeReactionRed = [];
        sharedVariables.errorWhite = 0;
        sharedVariables.errorOrange = 0;

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

const test = new Test();
export default test;