//Player and enemy pet variable
let mascotaJugador;
let mascotaPC;
//Player and enemy lives
let vidasJugador = 5;
let vidasEnemigo = 5;
//function to run the game when the whole HTML is loaded
function cargaDelJuego() {
  let botonMascota = document.getElementById("boton-mascota");
  let spanVidasJugador = document.getElementById("vidas-jugador");
  let spanVidasEnemigo = document.getElementById("vidas-enemigo");
  spanVidasEnemigo.textContent = vidasEnemigo;
  spanVidasJugador.textContent = vidasJugador;
  botonMascota.addEventListener("click", seleccionarMascotaJugador);
  pelea();
}
//function to select a random number in a range
function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//function to select an automatic pet for the enemy
function seleccionarMascotaPC() {
  let mascotaMascotaRival = document.getElementById("mascota-rival");
  let listaMascotas = document.querySelectorAll('input[name="mascota"]');
  let mascotaAleatoria =
    listaMascotas[aleatorio(1, listaMascotas.length) - 1].value;
  mascotaPC = mascotaAleatoria;
  mascotaMascotaRival.textContent = mascotaAleatoria;
}
//function to player's pet selection
function seleccionarMascotaJugador() {
  let mascota = document.querySelector('input[name="mascota"]:checked');
  let spanMascotaJugador = document.getElementById("mascota-jugador");
  if (mascota == null) {
    alert("Selecciona una mascota");
  } else if (mascota != null) {
    spanMascotaJugador.textContent = mascota.value;
    mascotaJugador = mascota.value;
    seleccionarMascotaPC();
  }
}
//function to enemy automatic attack selection
function ataquePC() {
  let listaAtaques = document.querySelectorAll(".contenedor-ataques button");
  let ataqueAleatorio =
    listaAtaques[aleatorio(1, listaAtaques.length) - 1].value;
  return ataqueAleatorio;
}
//main function to run the fight
function pelea() {
  let contenedorAtaques = document.querySelector(".contenedor-ataques");
  
  let sectionMensajes = document.getElementById("mensajes");
  let mensajeTurno = document.createElement("p");
  sectionMensajes.appendChild(mensajeTurno);
  contenedorAtaques.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      let ataqueSeleccionado = event.target.value;
      let ataqueAleatorio = ataquePC();
      mensajeTurno.textContent =
        "Tu " +
        mascotaJugador +
        " atacó con " +
        ataqueSeleccionado +
        ", la mascota " +
        mascotaPC +
        " de tu rival atacó con " +
        ataqueAleatorio +
        ". " +
        determinarGanador(ataqueSeleccionado, ataqueAleatorio);
      if (vidasEnemigo === 0) {
        mensajeTurno.textContent =
          "Felicitaciones!!! Tu " +
          mascotaJugador +
          " derrotó a la mascota " +
          mascotaPC +
          " de tu enemigo 🎉🎉🎉";
        contenedorAtaques.querySelectorAll("button").forEach(button => {
          button.disabled = true;
        });
      } else if (vidasJugador === 0) {
        mensajeTurno.textContent =
          "Ohhhh lo siento... Tu mascota " +
          mascotaJugador +
          " fue derrotada por la mascota " +
          mascotaPC +
          " del enemigo...";
          contenedorAtaques.querySelectorAll("button").forEach(button => {
          button.disabled = true;
        });
      }
    }
  });
}
//fight result function
function determinarGanador(ataqueSeleccionado, ataqueAleatorio) {
  let spanVidasJugador = document.getElementById("vidas-jugador");
  let spanVidasEnemigo = document.getElementById("vidas-enemigo");
  let reglas = {
    "FUEGO 🔥": {
      gana_a: ["PLANTA 🌿", "HIELO ❄️"],
      pierde_con: ["AGUA 💧", "TIERRA 🌄"],
    },
    "AGUA 💧": {
      gana_a: ["FUEGO 🔥", "TIERRA 🌄"],
      pierde_con: ["PLANTA 🌿", "HIELO ❄️"],
    },
    "PLANTA 🌿": {
      gana_a: ["AGUA 💧", "TIERRA 🌄"],
      pierde_con: ["FUEGO 🔥", "HIELO ❄️"],
    },
    "TIERRA 🌄": {
      gana_a: ["AGUA 💧", "FUEGO 🔥"],
      pierde_con: ["HIELO ❄️", "PLANTA 🌿"],
    },
    "HIELO ❄️": {
      gana_a: ["PLANTA 🌿", "AGUA 💧"],
      pierde_con: ["FUEGO 🔥", "TIERRA 🌄"],
    },
  };
  if (reglas[ataqueSeleccionado].gana_a.includes(ataqueAleatorio)) {
    vidasEnemigo--;
    spanVidasEnemigo.textContent = vidasEnemigo;
    return "GANASTE 🎉";
  } else if (reglas[ataqueSeleccionado].pierde_con.includes(ataqueAleatorio)) {
    vidasJugador--;
    spanVidasJugador.textContent = vidasJugador;
    return "PERDISTE 💀";
  } else {
    return "EMPATE 🤝";
  }
}
window.addEventListener("load", cargaDelJuego);
