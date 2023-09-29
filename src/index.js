import './styles.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

const breedSelector = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
// const pageLoader = document.querySelector('.loader');
// const pageError = document.querySelector('.error');

function showError(errorMessage) {
  Notiflix.Notify.failure(errorMessage);
}

function showLoader() {
  Notiflix.Loading.standard('Loading data, please wait...', {
    overlay: breedSelector,
  });
}

function hideLoader() {
  Notiflix.Notify.remove(breedSelector); // usuń komunikat o ładowaniu danych
}

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
  });

breedSelector.addEventListener('change', onSelectBreed); // kiedy użytkownik wybierze rasę, zostanie wywołana funkcja onSelectBreed

function onSelectBreed(event) {
  const breedId = event.target.value;
  breedSelector.disabled = true;

  hideLoader();

  fetchCatByBreed(breedId)
    .then(data => {
      const { url, breeds } = data[0];
      breedSelector.disabled = false;

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
    });
}
