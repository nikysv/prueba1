const API_KEY = 'AIzaSyDx-Av-cSTDvpcwpn4UTMwMcnqj_ltBTKI'; // Reemplaza con tu clave API
const CHANNEL_ID = 'UCEloMqBOJ162UsogPPvR9Nw'; // ID del canal
const API_BASE = 'https://www.googleapis.com/youtube/v3';

async function fetchData(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos:', error.message);
  }
}

async function loadFirstVideos(containerId) {
  const endpoint = `${API_BASE}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&order=date&key=${API_KEY}`;
  const data = await fetchData(endpoint);

  if (data && data.items) {
    // Ordenamos los videos por fecha de publicación en orden ascendente (del más antiguo al más reciente)
    const sortedVideos = data.items.sort(
      (a, b) => new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt)
    );

    // Seleccionamos los primeros 6 videos
    const firstVideos = sortedVideos.slice(0, 6);

    // Renderizamos los videos en el contenedor
    const videoContainer = document.getElementById(containerId);
    videoContainer.innerHTML = firstVideos
      .map(
        (video) => `
      <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank" class="block group relative">
        <div
          class="w-full bg-gray-200 aspect-w-16 aspect-h-9 rounded-md overflow-hidden group-hover:opacity-75">
          <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" class="w-full h-full object-cover">
        </div>
        <h3 class="mt-4 text-sm text-gray-800 font-semibold group-hover:text-indigo-600">${video.snippet.title}</h3>
        <p class="text-sm text-gray-500">${new Date(
          video.snippet.publishedAt
        ).toLocaleDateString()}</p>
      </a>
    `
      )
      .join('');
  } else {
    console.warn('No se encontraron los primeros videos del canal.');
  }
}

async function loadVideos(endpoint, containerId, messageOnError) {
  const data = await fetchData(endpoint);
  const videoContainer = document.getElementById(containerId);

  if (data && data.items) {
    videoContainer.innerHTML = data.items
      .map(
        (video) => `
      <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank" class="block group relative">
        <div
          class="w-full bg-gray-200 aspect-w-16 aspect-h-9 rounded-md overflow-hidden group-hover:opacity-75">
          <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" class="w-full h-full object-cover">
        </div>
        <h3 class="mt-4 text-sm text-gray-800 font-semibold group-hover:text-indigo-600">${video.snippet.title}</h3>
      </a>
    `
      )
      .join('');
  } else {
    videoContainer.innerHTML = `<p class="text-gray-500">${messageOnError}</p>`;
    console.warn(messageOnError);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // MOST POPULAR VIDEOS
  const popularEndpoint = `${API_BASE}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=6&order=viewCount&key=${API_KEY}`;
  loadVideos(popularEndpoint, 'popular-container', 'No se encontraron videos populares.');

  // OUR FIRST VIDEOS
  loadFirstVideos('first-videos-container');

  // LATEST VIDEOS
  const latestVideosEndpoint = `${API_BASE}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=6&order=date&key=${API_KEY}`;
  loadVideos(latestVideosEndpoint, 'latest-container', 'No se encontraron videos recientes.');
});
