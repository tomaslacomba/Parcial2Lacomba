export async function fetchBreeds() {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'x-api-key': 'live_cENCPUggo0RPDG46T8zPlavsnOGNXMVn0OgwAjjJVJVzaPJUlk3h6WOobOyE1ovo'
    });
    const response = await fetch('https://api.thedogapi.com/v1/breeds', { method: 'GET', headers });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    console.log('Razas:', data.length, data[0]); // Depuración
    return data;
  } catch (error) {
    console.error('Error fetchBreeds:', error);
    throw error;
  }
}

export async function fetchBreedById(id) {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'x-api-key': 'live_cENCPUggo0RPDG46T8zPlavsnOGNXMVn0OgwAjjJVJVzaPJUlk3h6WOobOyE1ovo'
    });
    const response = await fetch(`https://api.thedogapi.com/v1/breeds/${id}`, { method: 'GET', headers });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    console.log('Raza:', data);
    return data;
  } catch (error) {
    console.error('Error fetchBreedById:', error);
    throw error;
  }
}