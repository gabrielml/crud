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

    const res = await fetch(API_URL);
    const libros = await res.json();

    libros.forEach((libro) => {
        const li = document.createElement("li");
        
        li.innerHTML = `
            <strong>${libro.nombre}</strong> | ${libro.autor}
        `;
        
        lista.appendChild(li);
    });
}

// Iniciar app
cargarLibros();


