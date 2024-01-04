let lastRandomNumber = null;
let users = [];

function startTest() {
    let username = document.getElementById("username").value;
    const divDataUsers = document.getElementById('dataUsers');

    const date = new Date();
    const data = {name: username, dataInit: date};

    divDataUsers.style.display = 'none';
    intervalNumberRandom();
    console.log(data)

}

function showColor(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
}

function hideColors() {
    const redColor = document.getElementById('color-red');
    const blueColor = document.getElementById('color-blue');

    redColor.style.display = 'none';
    blueColor.style.display = 'none';
}

function informUserAboutNewDraw(newNumber) {
    if (lastRandomNumber !== null && newNumber !== lastRandomNumber) {
        console.log('Novo sorteio!');
    }
    lastRandomNumber = newNumber;
}

function intervalNumberRandom() {
   const intervalID = setInterval(() => {
        hideColors(); 

        setTimeout(() => {
            const min = 1;
            const max = 2;
            const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);

            informUserAboutNewDraw(randomNumber);

            if (randomNumber === 1) {
                showColor('color-red');
            } else if (randomNumber === 2) {
                showColor('color-blue');
            }
        }, 1000);
    }, 5000);

    setTimeout(() => {
        const containerColors = document.getElementById('container-colors');
        const titleOfFinally = document.createElement('h1');

        titleOfFinally.textContent = "Fim";

        clearInterval(intervalID);
        hideColors();

        containerColors.appendChild(titleOfFinally);

        console.log("Teste encerrado");
    }, 20000);
}

function getTimeUser(clickTime) {
    const redColor = document.getElementById('color-red');

    redColor.addEventListener('click', () => {
        const currentDate = new Date(); // Momento atual
        const reactionTime = currentDate.getTime() - clickTime.getTime();

        console.log(`Tempo de reação: ${reactionTime / 1000} milissegundos`);
    });
}



document.getElementById('toggleStart').addEventListener('click', () => {
    startTest();
});


