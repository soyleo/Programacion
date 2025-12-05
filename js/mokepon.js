const seleccionarAtaque = document.getElementById("seleccion-ataque");

const botonMascota = document.getElementById("boton-mascota");
const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");
const reinicio = document.getElementById("boton-reiniciar");
const botonReinicio = document.getElementById("reiniciar-juego");

const mascotaMascotaRival = document.getElementById("mascota-rival");

const spanMascotaJugador = document.getElementById("mascota-jugador");
const seleccionMascota = document.getElementById("seleccion-mascota");

const listaAtaques = document.querySelectorAll("#contenedor-ataques button");

const contenedorAtaques = document.querySelector("#contenedor-ataques");
const mensajes = document.getElementById("mensajes");
const mensajeTurno = document.getElementById("mensaje-turno");
const imgMascotaJugador = document.getElementById("img-mascota-jugador");
const imgMascotaPC = document.getElementById("img-mascota-rival");

const contenedorMascotas = document.getElementById("contenedor-mascotas");


//Player and enemy pet variable
let mascotaJugador;
let mascotaPC;
let webPets = [];
let opcionDeWebPets;
let listaMascotas;
//Player and enemy lives
let vidasJugador = 5;
let vidasEnemigo = 5;

class WebPet {
  constructor(nombre, img, vida, tipo){
    this.nombre = nombre;
    this.img = img;
    this.vida = vida;
    this.tipo = tipo;
  }
}

let wispy = new WebPet('Wispy', 'Img/wispy.png', 5, 'Fuego');
let bubbles = new WebPet('Bubbles', 'Img/bubbles.png', 5, 'Agua');
let lizzy = new WebPet('Lizzy', 'Img/lizzy.png', 5, 'Planta');
let dusty = new WebPet('Dusty', 'Img/dusty.png', 5, 'Tierra');
let frostiling = new WebPet('Frostiling', 'Img/frostiling.png', 5, 'Hielo');
let purrly = new WebPet('Purrly', 'Img/purrly.png', 5, 'Normal');

webPets.push(wispy, bubbles, lizzy, dusty, frostiling, purrly);

//function to run the game when the whole HTML is loaded
function cargaDelJuego() {
  
  seleccionarAtaque.style.display = "none";
  webPets.forEach((webPet) => {
    opcionDeWebPets = `
      <input type="radio" name="mascota" id=${webPet.nombre.toLowerCase()} value=${webPet.nombre} />
      <label class="nombre-pet tarjeta-de-mokepon" for=${webPet.nombre.toLowerCase()}>
        <img class="img-card" src=${webPet.img} alt=${webPet.nombre}>
        ${webPet.nombre}
        <button class="btn-atq" id="boton-${webPet.tipo.toLowerCase()}" >${webPet.tipo}</button>
      </label>
    `
    contenedorMascotas.innerHTML += opcionDeWebPets;
  });
  listaMascotas = document.querySelectorAll('input[name="mascota"]');
  botonReinicio.style.display = "none";
  spanVidasEnemigo.textContent = vidasEnemigo;
  spanVidasJugador.textContent = vidasJugador;
  botonMascota.addEventListener("click", seleccionarMascotaJugador);
  reinicio.addEventListener("click", function(){
    location.reload(true);
  });
}
//function to select a random number in a range
function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//function to select an automatic pet for the enemy
function seleccionarMascotaPC() {
  
  let mascotaAleatoria =
    listaMascotas[aleatorio(1, listaMascotas.length) - 1].value;
  mascotaPC = mascotaAleatoria;
  mascotaMascotaRival.textContent = mascotaAleatoria;
}
//function to player's pet selection
function seleccionarMascotaJugador() {
  let mascota = document.querySelector('input[name="mascota"]:checked');

  if (mascota == null) {
    alert("Selecciona una mascota");
  } else if (mascota != null) {
    spanMascotaJugador.textContent = mascota.value;
    mascotaJugador = mascota.value;
    seleccionarMascotaPC();
    seleccionMascota.style.display = "none";
    seleccionarAtaque.style.display = "flex";

  }
  pelea();
}
//function to enemy automatic attack selection
function ataquePC() {

  let ataqueAleatorio =
    listaAtaques[aleatorio(1, listaAtaques.length) - 1].value;
  return ataqueAleatorio;
}
//main function to run the fight
function pelea() {
  
  let srcJugador ="Img/" + mascotaJugador.toLowerCase() + ".png";
  let srcPC ="Img/" + mascotaPC.toLowerCase() + ".png";
  imgMascotaJugador.src = srcJugador;
  imgMascotaPC.src = srcPC;
  imgMascotaJugador.alt = mascotaJugador;
  imgMascotaPC.alt = mascotaPC;
  contenedorAtaques.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      let ataqueSeleccionado = event.target.value;
      let ataqueAleatorio = ataquePC();
      mensajes.style.border = "2px solid white";
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
      if (vidasEnemigo <= 0) {
        mensajeTurno.textContent =
          "Felicitaciones!!! Tu " +
          mascotaJugador +
          " derrotó a la mascota " +
          mascotaPC +
          " de tu enemigo.";
        contenedorAtaques.querySelectorAll("button").forEach(button => {
          button.disabled = true;
          botonReinicio.style.display = "block";
        });
      } else if (vidasJugador <= 0) {
        mensajeTurno.textContent =
          "Ohhhh lo siento... Tu mascota " +
          mascotaJugador +
          " fue derrotada por la mascota " +
          mascotaPC +
          " del enemigo...";
          contenedorAtaques.querySelectorAll("button").forEach(button => {
          button.disabled = true;
          botonReinicio.style.display = "block";
        });
      }
    }
  });
}
//fight result function
function determinarGanador(ataqueSeleccionado, ataqueAleatorio) {
  
  let reglas = {
    "FUEGO": {
      gana_a: ["PLANTA", "HIELO"],
      pierde_con: ["AGUA", "TIERRA"],
    },
    "AGUA": {
      gana_a: ["FUEGO", "TIERRA"],
      pierde_con: ["PLANTA", "HIELO"],
    },
    "PLANTA": {
      gana_a: ["AGUA", "TIERRA"],
      pierde_con: ["FUEGO", "HIELO"],
    },
    "TIERRA": {
      gana_a: ["AGUA", "FUEGO"],
      pierde_con: ["HIELO", "PLANTA"],
    },
    "HIELO": {
      gana_a: ["PLANTA", "AGUA"],
      pierde_con: ["FUEGO", "TIERRA"],
    },
  };
  if (reglas[ataqueSeleccionado].gana_a.includes(ataqueAleatorio)) {
    vidasEnemigo--;
    spanVidasEnemigo.textContent = vidasEnemigo;
    return mascotaPC + "  enemigo recibe 1 de daño.";
  } else if (reglas[ataqueSeleccionado].pierde_con.includes(ataqueAleatorio)) {
    vidasJugador--;
    spanVidasJugador.textContent = vidasJugador;
    return "Tu " + mascotaJugador + "  recibe 1 de daño.";
  } else {
    return "Empate, nadie recibe daño.";
  }
}
window.addEventListener("load", cargaDelJuego);
