const API_URL = 'http://localhost:3000/books';

async function fetchBooks() {
  try {
    const response = await fetch(API_URL);
    const books = await response.json();

    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach(book => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${book.title}</h3>
        <p><strong>Autor:</strong> ${book.author}</p>
        <button onclick="deleteBook(${book.id})">🗑️ Eliminar</button>
      `;
      bookList.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar los libros:', error);
  }
}

