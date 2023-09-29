import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'live_AX2Z5jVqgL19RjuTQ3itfEYHiVdpuccx2TY8sY6fC4IwG8P4xkAULfVzqWMSsEgx';

const API_URL = 'https://api.thecatapi.com/v1';

export function fetchBreeds() {
  return axios
    .get(`${API_URL}/breeds`)
    .then(response => response.data)
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      throw error;
    });
}

export function fetchCatByBreed(breedId) {
  return axios
    .get(`${API_URL}/images/search?breed_ids=${breedId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      throw error;
    });
}
