import { c, error, log } from './helpers/console';
import { d } from './helpers/web';
import moviesURL from '../../data/upload/movies';
log(PUBLIC_PATH);
const demoFetchApi = () => {
  fetch(`${PUBLIC_PATH.pathname}index.html`)
    .then(response => {
      c(response);
      return response.text()
    })
    .then(data => c(data));

  const moviesContainer = d.getElementById('movies');
  fetch(moviesURL)
    .then(response => response.json())
    .then(({ movies } = data) => {
      let template = '';

      movies.forEach(movie => {
        template += `
          <h2>${movie.title}</h2>
          <p><b><time datetime=${movie.year}>${movie.year}</time></b></p>
          <p><i>${movie.genres}</i></p>
          <img src="${movie.poster}" alt="${movie.title}"/>
        `;
      });

      moviesContainer.innerHTML = template;
    })
    .catch(err => error(err));

  fetch(`${PUBLIC_PATH.pathname}android-chrome-512x512.png`)
    .then(response => response.blob())
    .then(blob => {
      const objectURL = URL.createObjectURL(blob);
      const img = d.createElement('img');
      img.src = objectURL;
      d.body.appendChild(img);
      c(blob);
    })
    .catch(err => error(err));;
};

export default demoFetchApi;
