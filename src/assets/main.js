const API_KEY = 'AIzaSyDx-Av-cSTDvpcwpn4UTMwMcnqj_ltBTKI'; // Tu clave API
const CHANNEL_ID = 'UCEloMqBOJ162UsogPPvR9Nw'; // ID del canal
const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=9&order=date&key=${API_KEY}`;

const content = document.getElementById('content');

async function fetchData(urlApi) {
  try {
    const response = await fetch(urlApi);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error.message);
    content.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    return null;
  }
}

(async () => {
  try {
    const videos = await fetchData(API_URL);
    if (!videos || !videos.items) {
      content.innerHTML = `<p class="text-red-500">No se pudieron cargar los videos.</p>`;
      return;
    }
    let view = `
    ${videos.items
      .map(
        video => `
      <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank" class="group relative">
        <div
          class="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none">
          <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" class="w-full">
        </div>
        <div class="mt-4 flex justify-between">
          <h3 class="text-sm text-gray-700">
            ${video.snippet.title}
          </h3>
        </div>
      </a>
    `
      )
      .join('')}
    `;
    content.innerHTML = view;
  } catch (error) {
    console.error('Error al renderizar los videos:', error);
  }
})();
