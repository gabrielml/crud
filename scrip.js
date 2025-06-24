// Mostrar y ocultar secciones
function mostrarSeccion(id) {
  document.querySelectorAll("main section").forEach(sec => {
    sec.style.display = sec.id === id ? "block" : "none";
  });
}

// Selección de elementos
const catalogo = document.getElementById("catalogoLibros");
const detalles = document.getElementById("detalles");
const detalleTitulo = document.getElementById("detalleTitulo");
const detalleAutor = document.getElementById("detalleAutor");
const detalleAnio = document.getElementById("detalleAnio");
const formularioActualizar = document.getElementById("formularioActualizar");

// Variables para guardar el libro actual seleccionado
let libroSeleccionado = null;

// Función para cargar datos del libro en la sección de detalles
function mostrarDetalles(libroDiv) {
  const titulo = libroDiv.querySelector("h3").textContent;
  const autor = libroDiv.querySelector("p").textContent;

  detalleTitulo.textContent = titulo;
  detalleAutor.textContent = autor;
  detalleAnio.textContent = libroDiv.dataset.anio || "Desconocido";

  libroSeleccionado = libroDiv;

  mostrarSeccion("detalles");
}

// Agregar eventos a botones "Ver Detalles"
document.querySelectorAll(".libro button").forEach(boton => {
  boton.addEventListener("click", (e) => {
    const libroDiv = e.target.closest(".libro");
    mostrarDetalles(libroDiv);
  });
});

// Botón Leer
detalles.querySelector("button:nth-of-type(1)").addEventListener("click", () => {
  alert(`Leyendo "${detalleTitulo.textContent}" de ${detalleAutor.textContent}`);
});

// Botón Actualizar
detalles.querySelector("button:nth-of-type(2)").addEventListener("click", () => {
  // Mostrar formulario
  formularioActualizar.style.display = "block";

  // Prellenar con datos actuales
  document.getElementById("nuevoTitulo").value = detalleTitulo.textContent;
  document.getElementById("nuevoAutor").value = detalleAutor.textContent;
  document.getElementById("nuevoAnio").value = detalleAnio.textContent;
});

// Botón Eliminar
detalles.querySelector("button:nth-of-type(3)").addEventListener("click", () => {
  if (libroSeleccionado) {
    libroSeleccionado.remove();
    alert("Libro eliminado.");
    mostrarSeccion("catalogos");
  }
});

// Botón Guardar Cambios
formularioActualizar.querySelector("button").addEventListener("click", () => {
  const nuevoTitulo = document.getElementById("nuevoTitulo").value;
  const nuevoAutor = document.getElementById("nuevoAutor").value;
  const nuevoAnio = document.getElementById("nuevoAnio").value;

  if (libroSeleccionado) {
    libroSeleccionado.querySelector("h3").textContent = nuevoTitulo;
    libroSeleccionado.querySelector("p").textContent = nuevoAutor;
    libroSeleccionado.dataset.anio = nuevoAnio;

    detalleTitulo.textContent = nuevoTitulo;
    detalleAutor.textContent = nuevoAutor;
    detalleAnio.textContent = nuevoAnio;

    alert("Libro actualizado correctamente.");
    formularioActualizar.style.display = "none";
  }
});
