const RUTA_DATOS = "data/corredores.json";
 
// Año del footer
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();
 
// La grilla solo existe en index.html
cargarGrilla();
 
async function obtenerCorredores() {
  const respuesta = await fetch(RUTA_DATOS);
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  return respuesta.json();
}
 
async function cargarGrilla() {
  const grilla = document.getElementById("grilla");
  if (!grilla) return;
 
  try {
    const corredores = await obtenerCorredores();
 
    if (corredores.length === 0) {
      grilla.innerHTML = "<p>Pronto vas a poder conocer al equipo acá.</p>";
      return;
    }
 
    corredores.forEach(corredor => grilla.appendChild(crearTarjeta(corredor)));
  } catch (error) {
    console.error("No se pudo cargar corredores.json:", error);
    grilla.innerHTML = "<p>No se pudo cargar el equipo. Probá recargar la página.</p>";
  }
}
 
function crearTarjeta(corredor) {
  const tarjeta = document.createElement("a");
  tarjeta.className = "tarjeta";
  tarjeta.href = `perfil.html?id=${encodeURIComponent(corredor.id)}`;
 
  tarjeta.appendChild(crearFoto(corredor.fotos?.[0], corredor.nombre));
 
  const nombre = document.createElement("span");
  nombre.className = "tarjeta-nombre";
  nombre.textContent = corredor.nombre;
  tarjeta.appendChild(nombre);
 
  return tarjeta;
}
 
// Devuelve la foto; si no hay o no carga, muestra las iniciales
function crearFoto(ruta, nombre) {
  if (!ruta) return crearIniciales(nombre);
 
  const foto = document.createElement("img");
  foto.src = ruta;
  foto.alt = `Foto de ${nombre}`;
  foto.loading = "lazy";
  foto.onerror = () => foto.replaceWith(crearIniciales(nombre));
  return foto;
}
 
function crearIniciales(nombre) {
  const iniciales = document.createElement("span");
  iniciales.className = "iniciales";
  iniciales.setAttribute("role", "img");
  iniciales.setAttribute("aria-label", `Foto de ${nombre}`);
  iniciales.textContent = nombre
    .split(" ")
    .map(palabra => palabra[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return iniciales;
}