import sharedVariables from "./sharedVariables.js";
import manipuleElements from "./manipuleElements.js";
import test from "./test.js";


export function handleKeyPress(event) {
    if (event.code === "Space" && sharedVariables.stateDivContainer === true) {
        if (sharedVariables.currentColor === "red") {
            let reactionTime = (Date.now() - sharedVariables.lastColorTime);
            sharedVariables.timeReactionRed.push(reactionTime);
            const avg = test.calculateAverage(sharedVariables.timeReactionRed);
            sharedVariables.avgReactionTime = avg;
            test.nextColor();
        } else if (sharedVariables.currentColor === "orange") {
            sharedVariables.errorOrange++;
        } else {
            sharedVariables.errorWhite++;
        }
    }
}

export function handleToggleStartClick() {
    test.start();
}

export function handleBtnResultsClick() {
    manipuleElements.manipuleModalResults();
    const results = document.querySelector("#resultsUsersModal");

    if (results.childNodes.length < 1) {
        manipuleElements.showResultsModal();
    } else {
        results.innerHTML = '';
        manipuleElements.showResultsModal();
    }
}

export function handleBtnConfigClick() {
    manipuleElements.manipuleModalConfig();
}

export function handleSendConfigTimeClick() {
    let inputConfigTime = document.querySelector('#inputConfigTime');

    if (inputConfigTime.value > 0) {
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
}

export function handleClearResultsClick() {
    manipuleElements.clearHistoryResults();
}