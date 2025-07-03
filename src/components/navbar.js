export function loadNavbar() {
  console.log('Cargando navbar');
  return `
    <nav class="navbar">
      <a href="index.html">Inicio</a>
      <a href="#" id="favoritesLink">Favoritos</a>
    </nav>
  `;
}