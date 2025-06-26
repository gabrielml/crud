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
    resetearFormulario();
};

btnCancelar.onclick = () => {
    resetearFormulario();
    crud.style.display = "none";
};

formulario.onsubmit = async (e) => {
    e.preventDefault();

    const datosLibro = {
        nombre: nombreInput.value,
        autor: autorInput.value,
        // imagen: imagenInput ? imagenInput.value : undefined, // Si tienes input de imagen
    };

    try {
        if (modoEdicion) {
            console.log("DEBUG: Guardando edición para ID:", idEditando, "con datos:", datosLibro);
            await fetch(`${API_URL}/${idEditando}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosLibro),
            });
            alert("Libro actualizado");
        } else {
            console.log("DEBUG: Añadiendo nuevo libro con datos:", datosLibro);
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosLibro),
            });
            alert("Libro agregado");
        }

        resetearFormulario();
        crud.style.display = "none"; // Ocultar el formulario después de guardar/actualizar
        cargarLibros(); // Recarga la lista para mostrar el cambio
    } catch (error) {
        alert("Error al guardar");
        console.error("DEBUG: Error al guardar libro:", error);
    }
};

// ----- FUNCIONES PRINCIPALES -----

async function cargarLibros() {
    console.log("DEBUG: Iniciando cargarLibros()");
    catalogoLibros.innerHTML = ""; // Limpiamos el contenedor para evitar duplicados.
    console.log("DEBUG: Contenedor 'catalogoLibros' limpiado.");

    try {
        console.log("DEBUG: Haciendo fetch a:", API_URL);
        const res = await fetch(API_URL);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const libros = await res.json();
        console.log("DEBUG: Libros obtenidos de la API:", libros);

        if (libros.length === 0) {
            console.log("DEBUG: No hay libros para mostrar.");
            catalogoLibros.innerHTML = "<p>No hay libros disponibles en el catálogo.</p>";
            return;
        }

        libros.forEach((libro) => {
            console.log("DEBUG: Procesando libro:", libro.nombre, "ID:", libro.id);
            const libroDiv = document.createElement("div");
            libroDiv.classList.add("libro");

            // Contenido HTML de la tarjeta (sin botones interactivos aquí)
            libroDiv.innerHTML = `
                <img src="./img/${libro.imagen ? libro.imagen : "default.png"}" alt="Portada de ${libro.nombre}">
                <h3>${libro.nombre}</h3>
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
            console.log("DEBUG: Libro", libro.id, "añadido al DOM.");
        });
        console.log("DEBUG: Finalizando cargarLibros() - Todos los libros procesados.");
    } catch (error) {
        console.error("DEBUG: Error en cargarLibros:", error);
        alert("Error al cargar los libros: " + error.message);
    }
}

async function cargarLibroEnFormulario(id) {
    console.log("DEBUG: Cargando libro en formulario con ID:", id);
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const libro = await res.json();

        nombreInput.value = libro.nombre;
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
        console.log("DEBUG: Intentando borrar libro con ID:", id);
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error(`Error al eliminar en la API: ${response.status} ${response.statusText}`);
        }
        alert("Libro eliminado");
        console.log("DEBUG: Libro eliminado en la API. Llamando a cargarLibros() para refrescar.");
        cargarLibros(); // Recarga la lista después de eliminar
    } catch (error) {
        alert("Error al eliminar");
        console.error("DEBUG: Error al eliminar libro:", error);
    }
}

function resetearFormulario() {
    formulario.reset();
    modoEdicion = false;
    idEditando = null;
    tituloFormulario.textContent = "Agregar libros";
}

function verDetalles(id) {
    console.log("DEBUG: Ver detalles de libro con ID:", id);
    alert(`Mostrar detalles del libro con ID ${id}`);
    // Aquí puedes implementar una lógica más avanzada para mostrar los detalles en un modal o sección aparte.
}

// ----- INICIO DE LA APLICACIÓN -----
crud.style.display = "none"; // Asegúrate de que el modal esté oculto al inicio
cargarLibros(); // Carga los libros cuando la página se abre
