// import '@babel/polyfill';
import { w, n, d } from './helpers/web';
import { c, error, consoleUserWarning } from './helpers/console';
import hmr from './helpers/hrm';
import promise from './promises';
import demoFetchApi from './fetch';

const app = () => {
  if (ENV === 'production') consoleUserWarning();
  c('[App]: Start');
  promise();
  demoFetchApi();

  // Registro de las características de PWA's
  // Registrar SW
  if ('serviceWorker' in n) {
    w.addEventListener('load', () => {
      n
        .serviceWorker
        .register(`${PUBLIC_PATH.pathname}dvx-sw.js`)
        .then(registration => {
          c(`[sw]: Registered successfully`, registration);
        })
        .catch(e => error(`[sw]: Register failed ${e}`));
    });
  }

  // Activar notificaciones
  if (w.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(status => {
      c(`Notification: ${status}`);
      try {
        let n = new Notification('Title', {
          body: 'Notification',
          badge: `${PUBLIC_PATH.pathname}android-chrome-192x192.png`,
          icon: `${PUBLIC_PATH.pathname}android-chrome-192x192.png`
        });
      } catch (e) {
        c(`No es posible crear la notificación`);
      }
    });
  }

  // Estado de la conexión
  const header = d.querySelector('.header');
  const app = d.querySelector('.app');
  const metaThemeColor = d.querySelector('meta[name=theme-color]');
  const connection = d.querySelector('.connection');
  const connectionMessage = d.querySelector('.connection__message');
  const status = d.querySelector('.connection__status.far');
  // .
  let networkStatusTimer;
  function networkStatus(e) {

    if (e) {
      c(e, e.type);
    }
    if (n.onLine) {
      metaThemeColor.setAttribute('content', '#f7df1e');
      header.classList.remove('u-offline');

      app.classList.add('connection-status');

      connection.classList.remove('hide');
      connection.classList.remove('offline');
      connection.classList.add('online');

      status.classList.remove('fa-times-circle');
      status.classList.add('fa-check-circle');
      connectionMessage.innerHTML = 'Conexión recuperada';

      alert('Conexión recuperada :)');

      networkStatusTimer = setTimeout(() => {
        app.classList.remove('connection-status');
        connection.classList.add('hide');
        connection.classList.remove('online');
      }, 1950);
    } else {
      // c(networkStatusTimer);
      clearTimeout(networkStatusTimer);

      metaThemeColor.setAttribute('content', '#666');
      header.classList.add('u-offline');

      app.classList.add('connection-status');

      connection.classList.remove('hide');
      connection.classList.remove('online');
      connection.classList.add('offline');

      status.classList.add('fa-times-circle');
      status.classList.remove('fa-check-circle');
      connectionMessage.innerHTML = 'Conexión perdida';
      alert('Conexión perdida :(');
    }
  }

  d.addEventListener('DOMContentLoaded', e => {
    if (!n.onLine) {
      networkStatus();
    }
    w.addEventListener('online', networkStatus);
    w.addEventListener('offline', networkStatus);
  });

  // Background sync

  if ('serviceWorker' in n && 'SyncManager' in w) {
    function registerBGSync() {
      n
        .serviceWorker
        .ready
        .then(registration => {
          return registration
            .sync
            .register('github')
            .then(() => c('[sw]: Background sync registered'))
            .catch(err => error('[sw]: Background sync error', err));
        })
        .catch(err => error('[sw]: Background sync error', err));
    }

    registerBGSync();
  }

  // Aplicación demo interactuando con el API de github y backgroundSync
  const userInfo = d.querySelector('.github-user');
  const frmSearch = d.querySelector('.frm-github-user');

  function fetchGithubUser(username, requestFromBGSync = false) {
    const user = username || 'escueladigital';
    const url = `https://api.github.com/users/${user}`;

    fetch(url,
      {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => {

        if (!requestFromBGSync) {
          localStorage.removeItem('github');
        }

        const template = `
          <article class="github-user-info">
            <h2>${data.name}</h2>
            <img src="${data.avatar_url}" alt="${data.login}"/>
            <p>${data.bio}</p>
            <ul>
              <li>User github: ${data.login}</li>
              <li>Url github: ${data.html_url}</li>
              <li>Seguidores: ${data.followers}</li>
              <li>Siguiendo ${data.following}</li>
              <li>Ubicación ${data.location}</li>
            </ul>
          </article>
        `;

        userInfo.innerHTML = template;
      })
      .catch(err => {
        localStorage.setItem('github', user);
        error('[fetch] - error retrieving data from github api', err)
      })
  }

  fetchGithubUser(localStorage.getItem('github'));
  frmSearch.addEventListener('submit', e => {
    e.preventDefault();
    const search = e.target.search.value;
    if (!search) return;

    localStorage.setItem('github', search);
    fetchGithubUser(search);

    e.target.reset();
  });

  n.serviceWorker.addEventListener('message', e => {
    c('[sw]: message', e.data);
    fetchGithubUser(localStorage.getItem('github', true));
  });

  // Shared api

  if (navigator.share) {
    d.addEventListener('DOMContentLoaded', e => {
      const btnShare = d.getElementById('share');
      btnShare.addEventListener('click', e => {
        navigator.share({
          title: d.title,
          text: 'Hola soy un contenido para compartir',
          url: w.location.href,

        })
          .then(() => console.log('Successful share'))
          .catch(err => error('Error sharing', error));
      });

    });

  }
};

app();

hmr(module);
