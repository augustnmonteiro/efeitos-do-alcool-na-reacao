import sharedVariables from './sharedVariables.js';
import test from "./test.js";

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

const verifications = new Validations();
export default verifications;