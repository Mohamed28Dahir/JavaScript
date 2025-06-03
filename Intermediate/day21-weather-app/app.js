// Weather App using OpenWeatherMap API
const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const recentList = document.getElementById('recent-list');

// Weather Elements
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const feelsLike = document.getElementById('feels-like');

// Constants
const MAX_RECENT_SEARCHES = 5;

// Helper Functions
function toggleElements(isLoading = false, hasError = false) {
    loading.style.display = isLoading ? 'block' : 'none';
    weatherInfo.style.display = (!isLoading && !hasError) ? 'block' : 'none';
    errorMessage.style.display = hasError ? 'block' : 'none';
}

function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

function formatWindSpeed(speed) {
    return `${Math.round(speed * 3.6)} km/h`; // Convert m/s to km/h
}

function handleError(error) {
    console.error('Error:', error);
    errorMessage.textContent = error.message === 'City not found' 
        ? 'City not found. Please check the spelling and try again.'
        : 'Failed to fetch weather data. Please try again later.';
    toggleElements(false, true);
}

// Recent Searches Management
function loadRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    return searches;
}

function saveRecentSearch(city) {
    let searches = loadRecentSearches();
    // Remove if already exists
    searches = searches.filter(item => item.toLowerCase() !== city.toLowerCase());
    // Add to beginning
    searches.unshift(city);
    // Keep only MAX_RECENT_SEARCHES items
    searches = searches.slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    updateRecentSearchesUI();
}

function updateRecentSearchesUI() {
    const searches = loadRecentSearches();
    recentList.innerHTML = searches.map(city => `
        <div class="recent-item" onclick="searchWeather('${city}')">${city}</div>
    `).join('');
}

// Weather Data Management
function updateWeatherUI(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = kelvinToCelsius(data.main.temp);
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = formatWindSpeed(data.wind.speed);
    pressure.textContent = `${data.main.pressure} hPa`;
    feelsLike.textContent = `${kelvinToCelsius(data.main.feels_like)}°C`;
    
    toggleElements(false, false);
}

// API Calls
async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found');
            }
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        updateWeatherUI(data);
        saveRecentSearch(city);
    } catch (error) {
        handleError(error);
    }
}

// Event Handlers
async function searchWeather(cityOverride) {
    const city = cityOverride || cityInput.value.trim();
    
    if (!city) {
        errorMessage.textContent = 'Please enter a city name';
        toggleElements(false, true);
        return;
    }
    
    toggleElements(true, false);
    await fetchWeatherData(city);
    
    if (!cityOverride) {
        cityInput.value = ''; // Clear input only if it was a manual search
    }
}

// Event Listeners
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchWeather();
    }
});

// Initialize
function initialize() {
    updateRecentSearchesUI();
    errorMessage.textContent = 'Enter a city name to get weather information';
    toggleElements(false, true);
}

// Start the app
initialize(); 