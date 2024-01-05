let lastRandomNumber = null;
let users = [];


function storeData(name) {
    let counter = localStorage.getItem('counter');
    counter = counter ? parseInt(counter) : 0;

    const id = counter;
    const createdAt = new Date();
    const data = {
        ID: id,
        name: name,
        createdAt: createdAt.toISOString()

    };

    localStorage.setItem(id, JSON.stringify(data));
    counter++;
    localStorage.setItem('counter', counter.toString());
}

function updateTestData(userID, hits, errors, timeReaction) {
    const userData = JSON.parse(localStorage.getItem(userID));

    if (userData) {
        userData.Hits = hits;
        userData.errors = errors;
        userData.timeReaction = timeReaction;

        localStorage.setItem(userID, JSON.stringify(userData));
    } else {
        console.log('User not found');
    }
}

const userID = 1; // Replace 1 with the actual user ID you want to update

// Test data
const hits = 10;
const errors = 2;
const timeReaction = 1500;

// Update the test data for the user
updateTestData(userID, hits, errors, timeReaction);

function startTest() {
    let username = document.getElementById("username").value;
    const divDataUsers = document.getElementById('dataUsers');
    const containerColors = document.getElementById("container-colors");
    const date = new Date();
    const data = { name: username, dataInit: date };

    storeData(username);
    users.push(data);

    containerColors.style.display = 'block';
    console.log(users)

    divDataUsers.style.display = 'none';
    intervalNumberRandom();
    console.log(data);
}

function restart() {
    const btnRestart = document.getElementById('toggleRestart');
    const containerColors = document.getElementById('container-colors');
    const alterStateButton = () => {
        btnRestart.style.display = 'none';
    }

    btnRestart.addEventListener('click', () => {
        const dataUsers = document.getElementById('dataUsers');
        dataUsers.style.display = 'block';
        alterStateButton();
    })
}

restart()

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
                getTimeUser();
            } else if (randomNumber === 2) {
                showColor('color-blue');
                getTimeUser();
            }
        }, 1000);
    }, 5000);

    setTimeout(() => {
        const containerColors = document.getElementById('container-colors');
        const toggleRestart = document.getElementById('toggleRestart');

        clearInterval(intervalID);
        hideColors();

        containerColors.style.display = 'none';
        toggleRestart.style.display = 'block';

        console.log("Teste encerrado");
    }, 30000);
}

function getTimeUser() {
    const redColor = document.getElementById('color-red');
    const blueColor = document.getElementById('color-blue');

    redColor.addEventListener('click', () => {
        const currentDate = new Date();
        const reactionTime = currentDate.getTime() - intervalID;

        console.log(`Tempo de reação: ${reactionTime / 1000} segundos`);
    });

    blueColor.addEventListener('click', () => {
        const currentDate = new Date();
        const reactionTime = currentDate.getTime() - intervalID;

        console.log(`Tempo de reação: ${reactionTime / 1000} segundos`);
    });
}

document.getElementById('toggleStart').addEventListener('click', () => {
    startTest();
});
