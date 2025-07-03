import { loadNavbar } from './components/navbar.js';
import { loadHome } from './pages/home.js';
import { loadBreedDetails } from './pages/breedDetails.js';

console.log('Iniciando main.js');
document.getElementById('navbar').innerHTML = loadNavbar();

if (window.location.pathname.includes('details.html')) {
  console.log('Cargando página de detalles');
  loadBreedDetails();
} else {
  console.log('Cargando página principal');
  loadHome();
}