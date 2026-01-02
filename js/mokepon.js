const seleccionarAtaque = document.getElementById("seleccion-ataque");

const botonMascota = document.getElementById("boton-mascota");
const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");
const reinicio = document.getElementById("boton-reiniciar");
const botonReinicio = document.getElementById("reiniciar-juego");

const mascotaRival = document.getElementById("mascota-rival");

const spanMascotaJugador = document.getElementById("mascota-jugador");
const seleccionMascota = document.getElementById("seleccion-mascota");

const listaAtaques = document.querySelectorAll("#contenedor-ataques button");

const contenedorAtaques = document.querySelector("#contenedor-ataques");
const mensajes = document.getElementById("mensajes");
const mensajeTurno = document.getElementById("mensaje-turno");
const imgMascotaJugador = document.getElementById("img-mascota-jugador");
const imgMascotaPC = document.getElementById("img-mascota-rival");

const contenedorMascotas = document.getElementById("contenedor-mascotas");
const reglas = {
    "Fuego": {
      gana_a: ["Planta", "Hielo"],
      pierde_con: ["Agua", "Tierra"],
    },
    "Agua": {
      gana_a: ["Fuego", "Tierra"],
      pierde_con: ["Planta", "Hielo"],
    },
    "Planta": {
      gana_a: ["Agua", "Tierra"],
      pierde_con: ["Fuego", "Hielo"],
    },
    "Tierra": {
      gana_a: ["Hielo", "Fuego"],
      pierde_con: ["Agua", "Planta"],
    },
    "Hielo": {
      gana_a: ["Planta", "Agua"],
      pierde_con: ["Fuego", "Tierra"],
    },
    "Normal": {
      gana_a: [],
      pierde_con: [],
    },
  };
  const baseDamage = 20;


//Player and enemy pet variable
let mascotaJugador;
let mascotaPC;
let webPets = [];
let opcionDeWebPets;
let listaMascotas;
//Player and enemy lives
let vidasJugador;
let vidasEnemigo;

class WebPet {
  constructor(nombre, img, vida, tipo){
    this.nombre = nombre;
    this.img = img;
    this.vida = vida;
    this.tipo = tipo;
  }
}

let wispy = new WebPet('Wispy', 'Img/wispy.png', 200, 'Fuego');
let bubbles = new WebPet('Bubbles', 'Img/bubbles.png', 200, 'Agua');
let lizzy = new WebPet('Lizzy', 'Img/lizzy.png', 200, 'Planta');
let dusty = new WebPet('Dusty', 'Img/dusty.png', 200, 'Tierra');
let frostiling = new WebPet('Frostiling', 'Img/frostiling.png', 200, 'Hielo');
let purrly = new WebPet('Purrly', 'Img/purrly.png', 200, 'Normal');

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
        <p class="btn-atq" id="boton-${webPet.tipo.toLowerCase()}" >${webPet.tipo}</p>
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
  
  let aleatorioIndex = aleatorio(0, webPets.length - 1);

  mascotaPC = webPets[aleatorioIndex];
  mascotaRival.textContent = mascotaPC.nombre;
}
//function to player's pet selection
function seleccionarMascotaJugador() {
  let mascota = document.querySelector('input[name="mascota"]:checked');

  if (mascota == null) {
    alert("Selecciona una mascota");
  } else {
    spanMascotaJugador.textContent = mascota.value;

    mascotaJugador = webPets.find(pet => pet.nombre === mascota.value);
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
  vidasJugador = mascotaJugador.vida;
  vidasEnemigo = mascotaPC.vida;
  spanVidasJugador.textContent = vidasJugador;
  spanVidasEnemigo.textContent = vidasEnemigo;
  imgMascotaJugador.src = mascotaJugador.img;
  imgMascotaPC.src = mascotaPC.img;
  imgMascotaJugador.alt = mascotaJugador.nombre;
  imgMascotaPC.alt = mascotaPC.nombre;
  contenedorAtaques.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      let ataqueSeleccionado = event.target.value;
      let ataqueAleatorio = ataquePC();
      mensajes.style.border = "2px solid white";
      // Usamos \n para el salto de línea
      mensajeTurno.textContent = `Tu ${mascotaJugador.nombre} atacó con ${ataqueSeleccionado}La mascota ${mascotaPC.nombre} de tu rival atacó con ${ataqueAleatorio}.\n` + determinarGanador(ataqueSeleccionado, ataqueAleatorio);
      if (vidasEnemigo <= 0) {
        mensajeTurno.textContent =
          "Felicitaciones!!! Tu " +
          mascotaJugador.nombre +
          " derrotó a la mascota " +
          mascotaPC.nombre +
          " de tu enemigo.";
        contenedorAtaques.querySelectorAll("button").forEach(button => {
          button.disabled = true;
          botonReinicio.style.display = "block";
        });
      } else if (vidasJugador <= 0) {
        mensajeTurno.textContent =
          "Ohhhh lo siento... Tu mascota " +
          mascotaJugador.nombre +
          " fue derrotada por la mascota " +
          mascotaPC.nombre +
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
  
  
  if (reglas[ataqueSeleccionado].gana_a.includes(ataqueAleatorio)) {
    vidasEnemigo-=resolucionDeTipos(mascotaJugador.tipo, ataqueSeleccionado, mascotaPC.tipo);
    spanVidasEnemigo.textContent = Math.max(0, vidasEnemigo);
    return `${mascotaPC.nombre} enemigo recibe ${resolucionDeTipos(mascotaJugador.tipo, ataqueSeleccionado, mascotaPC.tipo)} de daño.`;
  } else if (reglas[ataqueSeleccionado].pierde_con.includes(ataqueAleatorio)) {
    vidasJugador-=resolucionDeTipos(mascotaPC.tipo, ataqueAleatorio, mascotaJugador.tipo);
    spanVidasJugador.textContent = Math.max(0, vidasJugador);
    return `Tu ${mascotaJugador.nombre} recibe ${resolucionDeTipos(mascotaPC.tipo, ataqueAleatorio, mascotaJugador.tipo)} de daño.`;
  } else {
    return "Empate, nadie recibe daño.";
  }
}
function resolucionDeTipos(tipo, ataque, tipo2) {
  let multiplier = 1;
  if (tipo === ataque) {
    multiplier *= 1.5;
  }
  if (tipo !== "Normal" && tipo2 !== "Normal") {
    if (reglas[ataque].gana_a.includes(tipo2)) {
      multiplier *= 2;
    } else if (reglas[ataque].pierde_con.includes(tipo2)) {
      multiplier *= 0.5;
    }
  }
  return baseDamage * multiplier;
}
window.addEventListener("load", cargaDelJuego);
