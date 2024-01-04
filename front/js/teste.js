let listUsers = [
    {Name: "Luiz", idade: 23},
    {Name: "José", idade: 58},
    {Name: "Raimundo", idade: 60}
];

function addUser() 

for(let i = 0; i<listUsers.length; i++) {
    setInterval(() => {
        hideColors(); 

        setTimeout(() => {
            const min = 1;
            const max = 2;
            const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);

            console.log(`Número aleatório: ${randomNumber}`);

            informUserAboutNewDraw(randomNumber);

            if (randomNumber === 1) {
                showColor('color-red');
            } else if (randomNumber === 2) {
                showColor('color-blue');
            }
        }, 1000);
    }, 5000);
}