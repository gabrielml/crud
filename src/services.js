const API_URL = "http://localhost:3000/libros";

// ----- SELECCIÓN DE ELEMENTOS HTML -----
const formulario = document.getElementById("formulario");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const catalogoLibros = document.getElementById("catalogoLibros"); // Contenedor de las tarjetas
const btnAgregaLibro = document.getElementById("agregaLibro");
const crud = document.getElementById("crud"); // Tu modal o formulario CRUD

// ----- ENTRADAS DEL FORMULARIO -----
const nombreInput = document.getElementById("nombre");
const autorInput = document.getElementById("autor");
// Si tienes un input para la imagen en tu formulario (descomenta si lo usas):
// const imagenInput = document.getElementById("imagen");

let modoEdicion = false;
let idEditando = null;

// ----- EVENT LISTENERS INICIALES -----
btnAgregaLibro.onclick = () => {
    crud.style.display = "block";
    // resetearFormulario();
};

btnCancelar.onclick = () => {
    crud.style.display = "none";
    // resetearFormulario();
};

formulario.onsubmit = async (e) => {
    e.preventDefault();

    const datosLibro = {
        titulo: nombreInput.value,
        autor: autorInput.value,
        // imagen: imagenInput ? imagenInput.value : undefined, // Si tienes input de imagen
    };

    try {
        if (modoEdicion) {
            ("DEBUG: Guardando edición para ID:", idEditando, "con datos:", datosLibro);
            await fetch(`${API_URL}/${idEditando}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosLibro),
            });
            alert("Libro actualizado");
        } else {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosLibro),
            });
            alert("Libro agregado");
        }

        resetearFormulario();
        crud.style.display = "none"; // Ocultar el formulario después de guardar/actualizar
       // cargarLibros(); // Recarga la lista para mostrar el cambio
    } catch (error) {
        alert("Error al guardar");
        console.error("DEBUG: Error al guardar libro:", error);
    }
};

// ----- FUNCIONES PRINCIPALES -----

async function cargarLibros() {

    catalogoLibros.innerHTML = ""; // Limpiamos el contenedor para evitar duplicados.


    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const libros = await res.json();
        if (libros.length === 0) {
            catalogoLibros.innerHTML = "<p>No hay libros disponibles en el catálogo.</p>";
            return;
        }

        libros.forEach((libro) => {
            const libroDiv = document.createElement("div");
            libroDiv.classList.add("libro");

            // Contenido HTML de la tarjeta (sin botones interactivos aquí)
            libroDiv.innerHTML = `
                <img src="${libro.portada ? libro.portada : "default.png"}" alt="Portada de ${libro.titulo}">
                <h3>${libro.titulo}</h3>
                <p>${libro.autor}</p>
            `;

            // Contenedor para acciones (editar, borrar, detalles)
            const accionesDiv = document.createElement("div");
            accionesDiv.classList.add("acciones-libro");

            // Botón "Ver Detalles"
            const btnDetalles = document.createElement("button");
            btnDetalles.classList.add("btn-detalles");
            btnDetalles.textContent = "Ver Detalles";
            btnDetalles.addEventListener("click", () => verDetalles(libro.id));
            accionesDiv.appendChild(btnDetalles);

            // Botón de Editar
            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn-editar");
            btnEditar.textContent = "✏️";
            // Usamos addEventListener, no onclick en el HTML. Pasamos el ID directamente.
            btnEditar.addEventListener("click", () => cargarLibroEnFormulario(libro.id));
            accionesDiv.appendChild(btnEditar);

            // Botón de Borrar
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn-borrar");
            btnBorrar.textContent = "🗑️";
            // Usamos addEventListener, no onclick en el HTML. Pasamos el ID directamente.
            btnBorrar.addEventListener("click", () => borrarLibro(libro.id));
            accionesDiv.appendChild(btnBorrar);

            // Añadir el div de acciones al div del libro
            libroDiv.appendChild(accionesDiv);

            // Añadir el libro al catálogo
            catalogoLibros.appendChild(libroDiv);

        });

    } catch (error) {
        console.error("DEBUG: Error en cargarLibros:", error);
        alert("Error al cargar los libros: " + error.message);
    }
}

async function cargarLibroEnFormulario(id) {

    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const libro = await res.json();

        nombreInput.value = libro.titulo;
        autorInput.value = libro.autor;
        // if (imagenInput) imagenInput.value = libro.imagen || ""; // Carga imagen si existe el input

        modoEdicion = true;
        idEditando = id;
        tituloFormulario.textContent = "Editar libro";
        crud.style.display = "block"; // Muestra el modal
    } catch (error) {
        alert("Error al cargar libro para edición");
        console.error("DEBUG: Error en cargarLibroEnFormulario:", error);
    }
}

async function borrarLibro(id) {
    if (!confirm("¿Eliminar este libro?")) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error(`Error al eliminar en la API: ${response.status} ${response.statusText}`);
        }
        alert("Libro eliminado");
       // cargarLibros(); // Recarga la lista después de eliminar
    } catch (error) {
        alert("Error al eliminar");
        console.error("DEBUG: Error al eliminar libro:", error);
    }
}

function resetearFormulario() {
    formulario.reset();
    crud.style.display = "none"; // Esconde el formulario
    modoEdicion = false;
    idEditando = null;
    tituloFormulario.textContent = "Agregar libro";
}

// 10. Botón cancelar
btnCancelar.addEventListener("click", resetearFormulario);

// 11. Función para mostrar detalles de un libro
async function verDetalles(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const libro = await res.json();

    const modal = document.getElementById("modalDetalles");
    const img = document.getElementById("modalImgAutor");
    const titulo = document.getElementById("modalTitulo");
    const sinopsis = document.getElementById("modalSinopsis");
    const links = document.getElementById("modalLinks");

    img.src = libro["img-autor"] || "./img/default-author.webp";
    img.alt = `Foto de ${libro.autor}`;
    titulo.textContent = libro.titulo;
    sinopsis.textContent = libro.sinopsis || "Sin sinopsis disponible.";

    //los paréntesis es justamente para reemplazar los espacios por otro carácter —en este caso, por un guion bajo (_)
    const autorWiki = libro.autor?.replace(/ /g, "_");
    // link que te dirige al auto Babelio
     const autorBabelio = encodeURIComponent(libro.autor);

    links.innerHTML = `
  <a href="https://es.wikipedia.org/wiki/${autorWiki}" target="_blank">Wikipedia</a><br>
  <a href="https://www.babelio.com/recherche.php?q=${autorBabelio}" target="_blank">Buscar autor/a en Babelio</a>
`;


    modal.style.display = "flex";
  } catch (error) {
    alert("⚠️ No se pudo cargar el detalle del libro"); 
    console.error(error);
  }
}
function cerrarModal() {
  document.getElementById("modalDetalles").style.display = "none";
}
// ----- INICIO DE LA APLICACIÓN -----
crud.style.display = "none"; // Asegúrate de que el modal esté oculto al inicio
cargarLibros(); // Carga los libros cuando la página se abre
