// Usa obtenerCorredores() y crearFoto() de main.js
 
cargarPerfil();
 
async function cargarPerfil() {
  const contenedor = document.getElementById("perfil");
  const id = new URLSearchParams(location.search).get("id");
 
  try {
    const corredores = await obtenerCorredores();
    const corredor = corredores.find(c => c.id === id);
 
    if (!corredor) {
      mostrarNoEncontrado(contenedor);
      return;
    }
 
    document.title = `${corredor.nombre} | Entrenamiento DZ`;
    contenedor.replaceChildren(...crearPerfil(corredor));
  } catch (error) {
    console.error("No se pudo cargar corredores.json:", error);
    contenedor.innerHTML = "<p>No se pudo cargar el perfil. Probá recargar la página.</p>";
  }
}
 
function crearPerfil(corredor) {
  const partes = [];
  const fotos = corredor.fotos ?? [];
 
  // Foto principal (o iniciales si no hay)
  const principal = crearFoto(fotos[0], corredor.nombre);
  principal.classList.add("perfil-foto");
  partes.push(principal);
 
  const nombre = document.createElement("h1");
  nombre.textContent = corredor.nombre;
  partes.push(nombre);
 
  if (corredor.descripcion) {
    const descripcion = document.createElement("p");
    descripcion.className = "perfil-descripcion";
    descripcion.textContent = corredor.descripcion;
    partes.push(descripcion);
  }
 
  const carreras = corredor.carreras ?? [];
  if (carreras.length > 0) partes.push(crearCarreras(carreras));
 
  // Galería: el resto de las fotos, si hay más de una
  if (fotos.length > 1) partes.push(crearGaleria(fotos.slice(1), corredor.nombre));
 
  return partes;
}
 
function crearCarreras(carreras) {
  const seccion = document.createElement("section");
  seccion.className = "perfil-carreras";
 
  const titulo = document.createElement("h2");
  titulo.textContent = "Carreras";
  seccion.appendChild(titulo);
 
  const lista = document.createElement("ul");
 
  // Más recientes primero
  [...carreras]
    .sort((a, b) => b.anio - a.anio)
    .forEach(carrera => {
      const item = document.createElement("li");
      item.textContent = `${carrera.nombre}, ${carrera.distancia} (${carrera.anio})`;
      lista.appendChild(item);
    });
 
  seccion.appendChild(lista);
  return seccion;
}
 
function crearGaleria(fotos, nombre) {
  const seccion = document.createElement("section");
  seccion.className = "perfil-galeria";
 
  const titulo = document.createElement("h2");
  titulo.textContent = "Fotos";
  seccion.appendChild(titulo);
 
  const grilla = document.createElement("div");
  grilla.className = "galeria";
 
  fotos.forEach((ruta, i) => {
    const foto = document.createElement("img");
    foto.src = ruta;
    foto.alt = `Foto ${i + 2} de ${nombre}`;
    foto.loading = "lazy";
    foto.onerror = () => foto.remove(); // si no carga, no deja un hueco roto
    grilla.appendChild(foto);
  });
 
  seccion.appendChild(grilla);
  return seccion;
}
 
function mostrarNoEncontrado(contenedor) {
  document.title = "Corredor no encontrado | Entrenamiento DZ";
  contenedor.innerHTML = `
    <h1>No encontramos a este corredor</h1>
    <p>Puede que el link esté mal escrito. Volvé al equipo para ver a todos.</p>
    <a class="boton" href="index.html#equipo">Ver el equipo</a>
  `;
}