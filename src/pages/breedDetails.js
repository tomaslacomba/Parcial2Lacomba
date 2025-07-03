import Swal from 'sweetalert2';
import { fetchBreedById } from '../utils/api.js';

export async function loadBreedDetails() {
  console.log('Iniciando loadBreedDetails');
  const urlParams = new URLSearchParams(window.location.search);
  const breedId = urlParams.get('id');
  const breedName = document.getElementById('breedName');
  const breedDetails = document.getElementById('breedDetails');
  const backButton = document.getElementById('backButton');

  if (!breedId) {
    console.error('No se proporcionó ID');
    Swal.fire({ title: 'Error', text: 'No se especificó una raza.', icon: 'error', confirmButtonColor: '#4CAF50' });
    return;
  }

  try {
    const breed = await fetchBreedById(breedId);
    console.log('Raza obtenida:', breed);
    breedName.textContent = breed.name;
    breedDetails.innerHTML = `
      <img src="${breed.image?.url || '/public/dog-placeholder.jpg'}" alt="${breed.name}" />
      <p><strong>Temperamento:</strong> ${breed.temperament || 'No disponible'}</p>
      <p><strong>Peso:</strong> ${breed.weight?.metric || 'No disponible'} kg</p>
      <p><strong>Altura:</strong> ${breed.height?.metric || 'No disponible'} cm</p>
      <p><strong>Esperanza de vida:</strong> ${breed.life_span || 'No disponible'}</p>
      <p><strong>Origen:</strong> ${breed.origin || 'No disponible'}</p>
      <p><strong>Cuidados:</strong> ${getBreedCare(breed)}</p>
    `;
  } catch (error) {
    console.error('Error detalles:', error);
    Swal.fire({ title: 'Error', text: 'No se pudieron cargar los detalles.', icon: 'error', confirmButtonColor: '#4CAF50' });
  }

  backButton.addEventListener('click', () => {
    console.log('Clic en Volver');
    window.location.href = 'index.html';
  });
}

function getBreedCare(breed) {
  const cares = {
    'Galgo': 'Necesita mucho ejercicio diario, ideal para correr en espacios abiertos. Cepillado ocasional debido a su pelo corto.',
    'Yorkshire Terrier': 'Requiere cepillado diario para evitar enredos en su pelo largo. Ejercicio moderado y socialización temprana.',
    'Caniche': 'Necesita cortes de pelo regulares y cepillado frecuente. Ejercicio diario y estimulación mental.',
    'Boyero de Berna': 'Ejercicio moderado, cepillado regular por su pelaje denso. Sensible al calor, necesita sombra y agua.',
    'Braco Alemán': 'Alta energía, necesita ejercicio intenso y entrenamiento. Cepillado ocasional.',
    'Labrador Retriever': 'Ejercicio diario, cepillado semanal. Propenso a la obesidad, controlar la dieta.',
    'Bulldog': 'Ejercicio moderado, evitar el calor extremo. Limpieza regular de arrugas en la piel.'
  };
  return cares[breed.name] || 'Cepillado regular, ejercicio moderado y visitas periódicas al veterinario.';
}