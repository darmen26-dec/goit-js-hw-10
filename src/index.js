import './styles.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

const breedSelector = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');

function showError(errorMessage) {
  Notiflix.Notify.failure(errorMessage);
}

function showLoader() {
  Notiflix.Loading.hourglass('Loading data, please wait...', {
    overlay: breedSelector,
  });
}

function hideLoader() {
  Notiflix.Loading.remove(); // usuń komunikat o ładowaniu danych
}

function onLoad() {
  fetchBreeds()
    .then(breeds => {
      const breedSelect = document.querySelector('.breed-select');
      new SlimSelect({
        select: breedSelect,
        data: breeds.map(breed => ({
          text: breed.name,
          value: breed.id,
        })),
      });
    })
    .catch(error => {
      showError('Oops! Something went wrong! Try reloading the page!');
      hideLoader();
    });
}

document.addEventListener('DOMContentLoaded', onLoad);

breedSelector.addEventListener('change', onSelectBreed); // kiedy użytkownik wybierze rasę, zostanie wywołana funkcja onSelectBreed

function onSelectBreed(event) {
  const breedId = event.target.value;
  breedSelector.disabled = true;

  showLoader();

  fetchCatByBreed(breedId)
    .then(data => {
      const { url, breeds } = data[0];
      breedSelector.disabled = false;
      hideLoader();

      catInfo.innerHTML = `
        <img src="${url}" alt="${breeds[0].name}">
        <div class="cat-description">
          <h2>${breeds[0].name}</h2>
          <p>${breeds[0].description}</p>
          <p>${breeds[0].temperament}</p>
        </div>
      `;
    })

    .catch(error => {
      breedSelector.disabled = false;

      if (error.message === 'Network request failed') {
        showError(
          'Network request failed. Please check your internet connection.'
        );
      } else {
        showError('Oops! Something went wrong! Try reloading the page!');
      }
      hideLoader();
    });
}
