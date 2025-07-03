// src/components/breedCard.js
import Swal from 'sweetalert2';

export function createBreedCard(breed) {
  const weight = breed.weight?.metric || 'No disponible';
  const image = breed.image?.url || '/public/dog-placeholder.jpg';
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const isFavorite = favorites.some(fav => fav.id === breed.id);
  const buttonText = isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos';
  const buttonAction = isFavorite ? `removeFromFavorites(${breed.id}, '${breed.name}')` : `addToFavorites(${breed.id}, '${breed.name}')`;
  // Crea tarjeta de raza con botón dinámico para agregar/quitar favoritos
  return `
    <div class="breed-card">
      <img src="${image}" alt="${breed.name}" />
      <h3>${breed.name}</h3>
      <p>Peso: ${weight} kg</p>
      <button onclick="${buttonAction}">${buttonText}</button>
      <button onclick="showBreedModal(${breed.id})">Ver Detalles</button>
    </div>
  `;
}

window.addToFavorites = (id, name) => {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (!favorites.some(fav => fav.id === id)) {
    favorites.push({ id, name });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    Swal.fire({
      title: '¡Agregado!',
      text: `${name} ha sido añadido a favoritos.`,
      icon: 'success',
      timer: 1500
    });
    // Dispara evento para actualizar lista de razas
    document.dispatchEvent(new Event('favoritesUpdated'));
  } else {
    Swal.fire({
      title: '¡Ya está en favoritos!',
      text: `${name} ya está en tu lista de favoritos.`,
      icon: 'info',
      timer: 1500
    });
  }
};

window.removeFromFavorites = (id, name) => {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (favorites.some(fav => fav.id === id)) {
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    Swal.fire({
      title: '¡Eliminado!',
      text: `${name} ha sido quitado de favoritos.`,
      icon: 'success',
      timer: 1500
    });
    // Dispara evento para actualizar lista de razas
    document.dispatchEvent(new Event('favoritesUpdated'));
  }
};

window.showBreedModal = async (id) => {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'x-api-key': 'live_cENCPUggo0RPDG46T8zPlavsnOGNXMVn0OgwAjjJVJVzaPJUlk3h6WOobOyE1ovo'
    });
    const response = await fetch(`https://api.thedogapi.com/v1/breeds/${id}`, { method: 'GET', headers });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const breed = await response.json();
    console.log('Modal - Raza:', breed);
    // Muestra modal con detalles de la raza
    Swal.fire({
      title: breed.name,
      html: `
        <img src="${breed.image?.url || '/public/dog-placeholder.jpg'}" style="max-width: 100%; height: 200px; object-fit: cover;" />
        <p><strong>Temperamento:</strong> ${breed.temperament || 'No disponible'}</p>
        <p><strong>Peso:</strong> ${breed.weight?.metric || 'No disponible'} kg</p>
        <p><strong>Altura:</strong> ${breed.height?.metric || 'No disponible'} cm</p>
        <p><strong>Esperanza de vida:</strong> ${breed.life_span || 'No disponible'}</p>
        <p><strong>Origen:</strong> ${breed.origin || 'No disponible'}</p>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#4CAF50'
    });
  } catch (error) {
    console.error('Error showBreedModal:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudieron cargar los detalles.',
      icon: 'error',
      confirmButtonColor: '#4CAF50'
    });
  }
};