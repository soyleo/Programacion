const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;

const jugadores = [];

class Jugador{
    constructor(id){
        this.id = id;
    }

    asignarWebPet (webPet){
        this.webPet = webPet;
        this.nombre = webPet.nombre;
    }
}

class WebPet{
    constructor(webPet){
        this.nombre = webPet.nombre;
        this.img = webPet.img;
        this.vida = webPet.vida;
        this.tipo = webPet.tipo;
    }
}

app.get('/unirse', (req, res) => {
    const id = `${Math.random()}`;

    const jugador = new Jugador(id);

    jugadores.push(jugador);

    res.setHeader("Access-Control-Allow-Origin", "*")
    
    res.send(id);
});

app.post("/webpet/:jugadorId", (req, res) =>{
    const jugadorId = req.params.jugadorId || "";
    const nombreWebPet = req.body.webPet || "";
    const webPet = new WebPet(nombreWebPet);

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id);

    if (jugadorIndex >= 0){
        jugadores[jugadorIndex].asignarWebPet(webPet);
    }
    console.log(jugadores);
    console.log(jugadorId);

    res.end();
});

app.get("/matchmaking/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || "";

    const oponentesPosibles = jugadores.filter((jugador) =>
        jugador.id !== jugadorId && jugador.webPet
    );

    if (oponentesPosibles.length > 0) {
        const indexAleatorio = Math.floor(Math.random() * (oponentesPosibles.length));
        const oponente = oponentesPosibles[indexAleatorio];

        res.send({
            hayOponente: true,
            oponente: oponente.webPet
        });
    } else {
        res.send({
            hayOponente:false
        });
    }
});

app.listen(port, () => {
    console.log("Servidor funcionando")
});