import Swal from 'sweetalert2';
import { fetchBreeds } from '../utils/api.js';
import { createBreedCard } from '../components/breedCard.js';

export async function loadHome() {
  console.log('Iniciando loadHome');
  const breedList = document.getElementById('breedList');
  const searchInput = document.getElementById('searchInput');
  const filterTemperament = document.getElementById('filterTemperament');
  const sortBreeds = document.getElementById('sortBreeds');
  const loading = document.getElementById('loading');

  // Valida elementos del DOM
  if (!breedList || !searchInput || !filterTemperament || !sortBreeds || !loading) {
    console.error('DOM no encontrado:', { breedList, searchInput, filterTemperament, sortBreeds, loading });
    Swal.fire({ title: 'Error', text: 'Configuración inválida.', icon: 'error', confirmButtonColor: '#4CAF50' });
    return;
  }

  let breeds = [];
  try {
    loading.style.display = 'block';
    breeds = await fetchBreeds();
    loading.style.display = 'none';
    console.log('Razas cargadas:', breeds.length);
    renderBreeds(breeds);
    populateTemperamentFilter(breeds);
  } catch (error) {
    loading.style.display = 'none';
    console.error('Error al cargar razas:', error);
    Swal.fire({ title: 'Error', text: 'No se pudieron cargar las razas.', icon: 'error', confirmButtonColor: '#4CAF50' });
  }

  function renderBreeds(breedsToRender) {
    console.log('Renderizando:', breedsToRender.length);
    // Renderiza las tarjetas de razas
    breedList.innerHTML = breedsToRender.length
      ? breedsToRender.map(breed => createBreedCard(breed)).join('')
      : '<p>No se encontraron razas.</p>';
  }

  function populateTemperamentFilter(breeds) {
    console.log('Poblando temperamentos');
    // Llena el select de temperamentos
    const temperaments = new Set();
    breeds.forEach(breed => {
      if (breed.temperament) breed.temperament.split(', ').forEach(temp => temperaments.add(temp));
    });
    filterTemperament.innerHTML = '<option value="">Filtrar por temperamento</option>';
    temperaments.forEach(temp => {
      const option = document.createElement('option');
      option.value = temp;
      option.textContent = temp;
      filterTemperament.appendChild(option);
    });
  }

  // Búsqueda por nombre
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    console.log('Buscando:', query);
    const filtered = breeds.filter(breed => breed.name.toLowerCase().includes(query));
    renderBreeds(filtered);
  });

  // Filtro por temperamento
  filterTemperament.addEventListener('change', () => {
    const temperament = filterTemperament.value;
    console.log('Filtrando temperamento:', temperament);
    const filtered = temperament ? breeds.filter(breed => breed.temperament?.includes(temperament)) : breeds;
    renderBreeds(filtered);
  });

  // Ordenamiento
  sortBreeds.addEventListener('change', () => {
    const sortValue = sortBreeds.value;
    console.log('Ordenando:', sortValue);
    let sortedBreeds = [...breeds];
    if (sortValue === 'name-asc') sortedBreeds.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortValue === 'name-desc') sortedBreeds.sort((a, b) => b.name.localeCompare(b.name));
    else if (sortValue === 'weight-asc') sortedBreeds.sort((a, b) => parseFloat(a.weight?.metric?.split(' - ')[1] || 0) - parseFloat(b.weight?.metric?.split(' - ')[1] || 0));
    else if (sortValue === 'weight-desc') sortedBreeds.sort((a, b) => parseFloat(b.weight?.metric?.split(' - ')[1] || 0) - parseFloat(a.weight?.metric?.split(' - ')[1] || 0));
    renderBreeds(sortedBreeds);
  });

  // Mostrar favoritos
  document.getElementById('favoritesLink').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Clic en favoritos');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.length === 0) {
      Swal.fire({ title: 'Sin favoritos', text: 'No tienes razas en favoritos.', icon: 'info', confirmButtonColor: '#4CAF50' });
      return;
    }
    const favoriteBreeds = breeds.filter(breed => favorites.some(fav => fav.id === breed.id));
    Swal.fire({
      title: 'Tus Favoritos',
      html: favoriteBreeds.map(breed => createBreedCard(breed)).join(''),
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#4CAF50',
      width: '80%'
    });
  });

  // Actualiza lista al cambiar favoritos
  document.addEventListener('favoritesUpdated', () => {
    console.log('Actualizando lista de razas por cambio en favoritos');
    renderBreeds(breeds);
  });
}
