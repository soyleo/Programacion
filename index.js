const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;

let jugadores = [];

const reglas = {
    "Fuego": { gana_a: ["Planta", "Hielo"], pierde_con: ["Agua", "Tierra"] },
    "Agua": { gana_a: ["Fuego", "Tierra"], pierde_con: ["Planta", "Hielo"] },
    "Planta": { gana_a: ["Agua", "Tierra"], pierde_con: ["Fuego", "Hielo"] },
    "Tierra": { gana_a: ["Hielo", "Fuego"], pierde_con: ["Agua", "Planta"] },
    "Hielo": { gana_a: ["Planta", "Agua"], pierde_con: ["Fuego", "Tierra"] },
    "Normal": { gana_a: [], pierde_con: [] }
};

class Jugador {
    constructor(id) {
        this.id = id;
        this.oponenteId = null; 
        this.webPet = null;
        this.ataque = null;
        this.lastSeen = Date.now();
        this.estado = "disponible"
        this.listoParaPelear = false;
    }
}

// Función auxiliar para actualizar el tiempo de vida del jugador
function actualizarLatido(id) {
    const jugador = jugadores.find(j => j.id === id);
    if (jugador) {
        jugador.lastSeen = Date.now();
    }
}

// --- LIMPIEZA AUTOMÁTICA ---
setInterval(() => {
    const ahora = Date.now();
    // Si no se ha visto al jugador en 30 segundos, se elimina
    jugadores = jugadores.filter(jugador => (ahora - jugador.lastSeen) < 30000);
}, 5000);

// --- RUTAS ---

app.get('/unirse', (req, res) => {
    const id = `${Math.random()}`;
    const jugador = new Jugador(id);
    jugadores.push(jugador);
    res.send(id);
});

app.post("/webpet/:jugadorId/confirmar-listo", (req, res) => {
    const jugador = jugadores.find(j => j.id === req.params.jugadorId);
    if (jugador) {
        jugador.listoParaPelear = true;
    }
    res.end();
});

// Endpoint para consultar si ambos están listos
app.get("/webpet/:jugadorId/ambos-listos", (req, res) => {
    const jugador = jugadores.find(j => j.id === req.params.jugadorId);
    if (!jugador || !jugador.oponenteId) return res.send({ listos: false });

    const oponente = jugadores.find(j => j.id === jugador.oponenteId);
    
    if (jugador.listoParaPelear && oponente && oponente.listoParaPelear) {
        res.send({ listos: true });
    } else {
        res.send({ listos: false });
    }
});

app.post("/webpet/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId;
    const nombreWebPet = req.body.webPet || "";
    
    actualizarLatido(jugadorId); // <--- Actualizamos aquí
    
    const jugador = jugadores.find((j) => jugadorId === j.id);
    if (jugador) {
        jugador.webPet = { nombre: nombreWebPet };
    }
    res.end();
});

app.get("/matchmaking/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId;
    actualizarLatido(jugadorId); // <--- Actualizamos aquí

    const jugador = jugadores.find(j => j.id === jugadorId);
    if (!jugador) return res.status(404).send("No existe el jugador");

    if (jugador.oponenteId) {
        const oponente = jugadores.find(j => j.id === jugador.oponenteId);
        if (oponente) {
            return res.send({ hayOponente: true, oponentePet: oponente.webPet });
        }
        jugador.oponenteId = null; // Si el oponente desapareció
        jugador.estado = "disponible";
    }

    const oponentePosible = jugadores.find(j => 
        j.id !== jugadorId && j.webPet && j.estado === "disponible" && !j.oponenteId
    );

    if (oponentePosible) {
        jugador.oponenteId = oponentePosible.id;
        jugador.estado = "jugando";
        oponentePosible.oponenteId = jugador.id;
        oponentePosible.estado = "jugando";
        res.send({ hayOponente: true, oponentePet: oponentePosible.webPet });
    } else {
        res.send({ hayOponente: false });
    }
});

app.post("/webpet/:jugadorId/ataque", (req, res) => {
    const jugadorId = req.params.jugadorId;
    const ataque = req.body.ataque;
    actualizarLatido(jugadorId);

    const jugador = jugadores.find(j => j.id === jugadorId);
    if (jugador) {
        jugador.ataque = ataque;
    }
    res.end();
});

app.post("/webpet/:jugadorId/bloquear", (req, res) => {
    const jugador = jugadores.find(j => j.id === req.params.jugadorId);
    if (jugador) {
        jugador.estado = "jugando";
        console.log(`Jugador ${jugador.id} bloqueado (está contra IA)`);
    }
    res.end();
});

app.get("/webpet/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId;
    actualizarLatido(jugadorId);

    const jugador = jugadores.find(j => j.id === jugadorId);
    if (!jugador || !jugador.oponenteId) return res.send({ ataque: null });

    const oponente = jugadores.find(j => j.id === jugador.oponenteId);
    res.send({ ataque: oponente ? oponente.ataque : null });
});

app.post("/webpet/:jugadorId/limpiar", (req, res) => {
    actualizarLatido(req.params.jugadorId);
    const jugador = jugadores.find(j => j.id === req.params.jugadorId);
    if(jugador) jugador.ataque = null;
    res.end();
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});

app.get("/webpet/:jugadorId/resultado-turno", (req, res) => {
    const jugadorId = req.params.jugadorId;
    const jugador = jugadores.find(j => j.id === jugadorId);
    
    // Si el jugador no existe o se quedó sin oponente
    if (!jugador || !jugador.oponenteId) {
        return res.send({ listo: false, oponenteDesconectado: true });
    }

    const oponente = jugadores.find(j => j.id === jugador.oponenteId);

    // Si el oponente ya no está en la lista (se desconectó)
    if (!oponente) {
        return res.send({ listo: false, oponenteDesconectado: true });
    }

    // Solo si AMBOS han atacado devolvemos "listo: true"
    if (jugador.ataque && oponente.ataque) {
        res.send({
            listo: true,
            ataqueJugador: jugador.ataque,
            ataqueRival: oponente.ataque,
            oponenteDesconectado: false
        });
    } else {
        res.send({ listo: false, oponenteDesconectado: false });
    }
});

app.delete("/jugador/:jugadorId/eliminar", (req, res) => {
    const jugadorId = req.params.jugadorId;
    const inicial = jugadores.length;
    jugadores = jugadores.filter(j => j.id !== jugadorId);
    console.log(`Jugador ${jugadorId} eliminado tras combate. Quedan: ${jugadores.length}`);
    res.end();
});