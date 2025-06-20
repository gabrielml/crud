// 1. Configuración inicial: URL de la API.
const API_URL = "http://localhost:3000/libros";

// 2. Selección de elementos del HTML (DOM)
const lista = document.getElementById("listaLibros");
const formulario = document.getElementById("formulario");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

// 3. Inputs del formulario
const nombre = document.getElementById("nombre");
const autor = document.getElementById("autor");

// 4. Estado de edición
let modoEdicion = false;
let idEditando = null;

/**
 * 5. Función para cargar y mostrar los libros (GET)
 * Hace una petición GET a la API y convierte la respuesta en JSON (una lista de libros).
 * Es una función asíncrona porque la tarea de consultar una base de datos puede tardar.
 */
async function cargarLibros() {
  lista.innerHTML = "";

  try { // Estructura "try-catch" que sirve para manejar errores.
    const res = await fetch(API_URL);
    const libros = await res.json();

    libros.forEach((libro) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${libro.nombre}</strong> | ${libro.autor} 
      `;

      // 5.1.Crea un botón para EDITAR y le pone un evento que carga ese libro en el formulario.
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "✏️";
      btnEditar.addEventListener("click", () =>
        cargarLibroEnFormulario(libro.id)
      );

      // 5.2. Crea un botón para BORRAR el libro, con un evento para eliminarlo.
      const btnBorrar = document.createElement("button");
      btnBorrar.textContent = "🗑️";
      btnBorrar.addEventListener("click", () => borrarLibro(libro.id));

      li.appendChild(btnEditar);
      li.appendChild(btnBorrar);
      lista.appendChild(li);
    });
  } catch (error) {
    alert("Error al cargar los libros 😢");
    console.error(error);
  }
}

// 6. Enviar formulario (crear o actualizar libro) POST o PUT
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datosLibro = {
    nombre: nombre.value,
    autor: autor.value,
  };

  try {
    if (modoEdicion) {
      //Llama a la API para actualizar un libro existente
      await fetch(`${API_URL}/${idEditando}`, {
        //PUT significa: “actualiza por completo este recurso”
        method: "PUT",
        //Le dice al servidor que vamos a enviar los datos en formato JSON
        headers: { "Content-Type": "application/json" },
        //Convierte el objeto datosLibro en texto JSON antes de enviarlo
        body: JSON.stringify(datosLibro),
      });

      alert("Libro actualizado con éxito");

    } else {
      await fetch(API_URL, {
        //POST nos crea un nuevo registro
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosLibro),
      });
      alert("Libro agregado con éxito");
    }

    resetearFormulario();
    //cargarLibros();
    
  } catch (error) {
    alert("❌ Error al guardar los datos");
    console.error(error);
  }
});

/**
 * 7. Función que carga el libro en el formulario
 * para poder editarlo.
 * 
 * @param {string} id - Es el identificador del libro que
 * queremos editar.
 */
async function cargarLibroEnFormulario(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const libro = await res.json();

    nombre.value = libro.nombre;
    autor.value = libro.autor;

    // "modoEdicion" la llamamos arriba cuando guardemos los cambios, para saber qué libro enviar al servidor con el método PUT.
    modoEdicion = true;
    idEditando = id;
    tituloFormulario.textContent = "Editar libro";
  } catch (error) {
    alert("⚠️ Error al cargar el libro");
    console.error(error);
  }
}

/**
 * 8. Función asíncrona para borrar un libro (DELETE).
 * Es async porque va a usar await para comunicarse con el servidor.
 * Hace una petición HTTP DELETE al servidor para eliminar el libro con ese ID.
 * 
 * @param {string} id - Es el identificador del libro que
 * queremos borrar.
 */
async function borrarLibro(id) {
    //Pide confirmación antes de eliminar. Muestra un alert y si el usuario da aceptar se vuelve true
    const confirmacion = confirm("¿Estás segura de que quieres eliminar este libro?");

    if (!confirmacion) return; //return sin nada significa: “salir de la función”.

    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        alert("Libro eliminado");

        //Llama a la función cargarLibros() para recargar la lista actualizada de libros
        //cargarLibros();

    } catch (error) {
        alert("❌ No se pudo eliminar");
        console.error(error);
  }
}

/**
 * 9. Función Resetear formulario.
 * Limpia todos los campos del formulario (nombre y autor) 
 * y lo deja en modo "agregar nuevo".
 */
function resetearFormulario() {
  formulario.reset();
  modoEdicion = false;
  idEditando = null;
  tituloFormulario.textContent = "Agregar libro"; //TODO: Esto no parece funcionar correctamente!!!
}

// 10. Botón cancelar
btnCancelar.addEventListener("click", resetearFormulario);

//11. Inicia la aplicación
cargarLibros();




