const API = 'https://youtube-v31.p.rapidapi.com/search?channelId=UCEloMqBOJ162UsogPPvR9Nw&part=snippet%2Cid&order=date&maxResults=9';

const content = document.getElementById('content');

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    'X-RapidAPI-Key': 'c68edbdba9mshc3cb6eb8038f3b2p1f444ajsna5de19fe1256' // Reemplaza con tu clave si es necesario
  }
};

async function fetchData(urlApi) {
  try {
    const response = await fetch(urlApi, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
  }
}

(async () => {
  try {
    const videos = await fetchData(API);
    let view = `
    ${videos.items.map(video => `
      <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank" class="group relative">
        <div
          class="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none">
          <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.description}" class="w-full">
        </div>
        <div class="mt-4 flex justify-between">
          <h3 class="text-sm text-gray-700">
            ${video.snippet.title}
          </h3>
        </div>
      </a>
    `).slice(0, 4).join('')}
    `;
    content.innerHTML = view;
  } catch (error) {
    console.error('Error al renderizar los videos:', error);
  }
})();
