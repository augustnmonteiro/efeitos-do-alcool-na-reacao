let array = [{
    nome: "David",
    sobrenome: "Freitas",
    idade: 15
}];



for (const i of array) {
    console.log(i);

    if (i.nome === "David" ) {
        console.log(i.sobrenome);
    } else if (i.sobrenome === "Freitas" ) {
        console.log(i.idade);
        return;
    }
}