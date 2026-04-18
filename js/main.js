// Version: 1.0.0
// ============================================
// main.js — SearchWave
// Main logic: search & display results
// ============================================

// ===== API CONFIGURATION =====
// 👉 Replace with your own API key once chosen
const API_KEY  = 'nGLxgsGY3K1ekmEF6PZPt1D5WLeaMZfw';
const BASE_URL = 'https://api.giphy.com/v1/gifs/search';

// ===== DOM ELEMENTS =====
const searchInput  = document.getElementById('search-input');
const searchBtn    = document.getElementById('search-btn');
const resultsGrid  = document.getElementById('results-grid');
const emptyState   = document.getElementById('empty-state');
const resultsCount = document.getElementById('results-count');

// ===== MAIN FUNCTION: SEARCH =====
async function searchContent(keyword) {
  if (!keyword.trim()) return;

  showLoading();

  try {
    const url = `${BASE_URL}?api_key=${API_KEY}&q=${encodeURIComponent(keyword)}&limit=24`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    displayResults(data.data, keyword);

  } catch (error) {
    console.error('Search error:', error);
    showError();
  }
}

// ===== DISPLAY RESULTS =====
function displayResults(items, keyword) {
  resultsGrid.innerHTML = '';
  emptyState.style.display = 'none';

  if (!items || items.length === 0) {
    emptyState.textContent = `No results found for "${keyword}" 😕`;
    emptyState.style.display = 'block';
    resultsCount.textContent = '';
    return;
  }

  resultsCount.textContent = `${items.length} results for "${keyword}"`;

  // Iterate through each returned object in the array (req. 4)
  items.forEach(item => {
    // 👉 Adapt this line depending on the API you choose
    const imageUrl = item.images?.fixed_height?.url;
    if (!imageUrl) return;

    // Custom grid class (req. 10)
    const col = document.createElement('div');
    col.classList.add('col-3');

    const img = document.createElement('img');
    img.src     = imageUrl;
    img.alt     = item.title || keyword;
    img.loading = 'lazy';

    col.appendChild(img);
    resultsGrid.appendChild(col);
  });
}

// ===== LOADING STATE =====
function showLoading() {
  resultsGrid.innerHTML = '<div class="loading">Searching GIFs...</div>';
  emptyState.style.display = 'none';
  resultsCount.textContent = '';
}

// ===== ERROR STATE =====
function showError() {
  resultsGrid.innerHTML = '';
  emptyState.textContent = 'Something went wrong. Check your API key. 🔧';
  emptyState.style.display = 'block';
  resultsCount.textContent = '';
}

// ===== EVENT LISTENERS =====
searchBtn.addEventListener('click', () => {
  searchContent(searchInput.value);
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchContent(searchInput.value);
  }
});