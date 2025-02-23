import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '48859157-4179ddf5331f3749a3f2c3141',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: null,
    per_page: 40,
    totalHits: null,
  },
});

export async function getAllPhotos(inputValue) {
  instance.defaults.params.page = 1;
  instance.defaults.params.q = inputValue;
  try {
    const resnonse = await instance.get();
    instance.defaults.params.totalHits = resnonse.data.totalHits;
    return resnonse.data.hits;
  } catch (error) {
    console.error('Error fetching data from Pixabay API');
  }
}

export async function getMorePhotos(inputValue) {
  instance.defaults.params.page += 1;
  instance.defaults.params.q = inputValue;
  try {
    const resnonse = await instance.get();
    return resnonse.data.hits;
  } catch (error) {
    console.error('Error fetching data from Pixabay API');
  }
}
