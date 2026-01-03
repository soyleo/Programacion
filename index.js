const express = require('express');

const app = express();

const port = 8080;

const jugadores = [];

class Jugador{
    constructor(id){
        this.id = id;
    }
}

app.get('/unirse', (req, res) => {
    const id = `${Math.random()}`;

    const jugador = new Jugador(id);

    jugadores.push(jugador);

    res.setHeader("Access-Control-Allow-Origin", "*")
    
    res.send(id);
});

app.listen(port, () => {
    console.log("Servidor funcionando")
});