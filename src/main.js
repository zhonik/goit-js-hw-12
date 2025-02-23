import { getAllPhotos, getMorePhotos, instance } from './js/pixabay-api';
import {
  photosTamplate,
  photosTamplateFromLoadMore,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// =================== Constants ===================

const lightbox = new SimpleLightbox('.image-container a', {
  captionDelay: 250,
});

let searchQuery = '';

// =================== DOM Elements ===================

const refs = {
  searchForm: document.querySelector('#search-form'),
  loader: document.querySelector('.loader-wrap'),
  gallery: document.querySelector('#gallery'),
  loaderToLoadMore: document.querySelector('.loader-for-loadmore'),
  loadMoreBtn: document.querySelector('#load-more-btn'),
};

// =================== Event Listeners ===================

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

// =================== Functions ===================

// ===================== Function onSearchFormSubmit ==================

async function onSearchFormSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.loader.classList.remove('disabled');

  searchQuery = e.target.elements.search.value;

  if (searchQuery.trim() === '') {
    refs.loader.classList.add('disabled');
    refs.loadMoreBtn.classList.add('hidden');
    return iziToast.error({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      position: 'topRight',
      maxWidth: '432px',
    });
  }

  try {
    const photos = await getAllPhotos(searchQuery);

    if (photos.length === 0) {
      refs.loader.classList.add('disabled');
      return iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        maxWidth: '432px',
      });
    }

    refs.loader.classList.add('disabled');

    photosTamplate(photos);
    lightbox.refresh();

    refs.loadMoreBtn.classList.remove('hidden');
  } catch (error) {
    console.error('Error fetching data from Pixabay API');
  }

  refs.searchForm.reset();
}

// ========================= Function onLoadMoreBtnClick =========================

async function onLoadMoreBtnClick(e) {
  refs.loaderToLoadMore.classList.remove('disabled');

  try {
    const photos = await getMorePhotos(searchQuery);
    refs.loaderToLoadMore.classList.add('disabled');
    const totalPage = Math.ceil(
      instance.defaults.params.totalHits / instance.defaults.params.per_page
    );

    photosTamplateFromLoadMore(photos);
    lightbox.refresh();
    scrollAfterLoadMore();

    if (instance.defaults.params.page >= totalPage) {
      refs.loadMoreBtn.classList.add('hidden');
      return iziToast.info({
        message: 'We`re sorry, but you`ve reached the end of search results.',
        position: 'topRight',
        maxWidth: '432px',
      });
    }
  } catch (error) {
    console.error('Error fetching data from Pixabay API');
  }
}

// ========================== Function scrollAfterLoadMore =======================

function scrollAfterLoadMore() {
  const elem = document.querySelector('.image-container');
  const cardHeight = elem.getBoundingClientRect().height;
  if (elem) {
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
