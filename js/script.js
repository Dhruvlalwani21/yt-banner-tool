document.getElementById('fetchButton').addEventListener('click', fetchBanner);
document.getElementById('downloadLinks').addEventListener('click', handleDownload);

async function fetchBanner() {
  const input = document.getElementById('channelInput').value;
  const channelId = extractChannelId(input);
  const apiKey = 'AIzaSyBsilY0ycGI7z-xQK9y8Hh9Rd1Gg3cqJfE';  // Replace with your actual YouTube Data API key
  const url = `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channelId}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const bannerUrl = data.items[0].brandingSettings.image.bannerExternalUrl;
    
    displayBanner(bannerUrl);
    showDownloadLinks();
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function extractChannelId(input) {
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:c\/|channel\/|user\/)?([a-zA-Z0-9-_]+)|(?:youtu\.be\/|youtube\.com\/(?:v\/|embed\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9-_]+))/;
  const match = input.match(urlPattern);
  if (match) {
    return match[1] || match[2];
  }
  return input;
}

function displayBanner(bannerUrl) {
  const bannerContainer = document.getElementById('bannerContainer');
  bannerContainer.innerHTML = `
    <img src="${bannerUrl}" alt="YouTube Channel Banner">
  
  `;
}

function showDownloadLinks() {
  document.getElementById('downloadLinks').style.display = 'block';
}

function handleDownload(event) {
  if (event.target.tagName !== 'BUTTON') return;
  
  const bannerUrl = document.querySelector('#bannerContainer img').src;
  const width = parseInt(event.target.getAttribute('data-width'));
  const height = parseInt(event.target.getAttribute('data-height'));
  
  resizeAndDownloadImage(bannerUrl, width, height);
}

function resizeAndDownloadImage(url, width, height) {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const image = new Image();
  
  image.crossOrigin = 'Anonymous';
  image.src = url;
  image.onload = () => {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `banner-${width}x${height}.jpg`;
    link.click();
  };
}
