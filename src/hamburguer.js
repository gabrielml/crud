function toggleMenu() {
  const navMenu = document.getElementById('nav-menu');
  if (navMenu.style.display === 'flex') {
    navMenu.style.display = 'none';
  } else {
    navMenu.style.display = 'flex';
  }
}

// Asegurar que el menú esté visible por defecto en dispositivos de escritorio
window.onload = function() {
  if (window.innerWidth > 768) {
    document.getElementById('nav-menu').style.display = 'flex';
  } else {
    document.getElementById('nav-menu').style.display = 'none';
  }
};

// Manejar el cambio de tamaño de la ventana
window.onresize = function() {
  if (window.innerWidth > 768) {
    document.getElementById('nav-menu').style.display = 'flex';
  } else {
    document.getElementById('nav-menu').style.display = 'none';
  }
};