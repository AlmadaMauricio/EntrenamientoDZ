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
// Pestañas del equipo: Running / Funcional
(function () {
  const tabs = document.querySelectorAll('.pestanas [role="tab"]');
  if (!tabs.length) return;

  function activar(tab, enfocar) {
    tabs.forEach(function (t) {
      const activa = t === tab;
      t.setAttribute('aria-selected', activa);
      t.tabIndex = activa ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !activa;
    });
    if (enfocar) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activar(tab); });
    // Flechas izquierda/derecha para moverse entre pestañas con teclado
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const paso = e.key === 'ArrowRight' ? 1 : -1;
      activar(tabs[(i + paso + tabs.length) % tabs.length], true);
    });
  });

  // Links directos: #equipo-running o #equipo-funcional abren esa pestaña
  function desdeHash() {
    const m = location.hash.match(/^#equipo-(running|funcional)$/);
    if (!m) return;
    activar(document.getElementById('tab-' + m[1]));
    document.getElementById('equipo').scrollIntoView();
  }
  desdeHash();
  window.addEventListener('hashchange', desdeHash);
})();