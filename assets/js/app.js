const apiKey = '2e841daa7a31233f19f9a43af9845f75';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast');
const searchHistoryContainer = document.getElementById('search-history');

const getWeatherData = async (city) => {
    const geoResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const geoData = await geoResponse.json();

    const lat = geoData.coord.lat;
    const lon = geoData.coord.lon;

    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const weatherData = await weatherResponse.json();

    return weatherData;
};

const renderCurrentWeather = (data) => {
    const currentWeatherHTML = `
        <h2>Current Weather for ${data.city.name}</h2>
        <p>Temperature: ${data.list[0].main.temp}°</p>
        <p>Humidity: ${data.list[0].main.humidity}%</p>
        <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
        <img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="Weather Icon">
    `;
    currentWeatherContainer.innerHTML = currentWeatherHTML;
};

const renderForecast = (data) => {
    let forecastHTML = '<h2>5-Day Forecast</h2>';
    data.list.forEach((entry) => {
        if (entry.dt_txt.includes('12:00:00')) { 
            forecastHTML += `
                <div>
                    <p>${entry.dt_txt}</p>
                    <p>Temp: ${entry.main.temp}°</p>
                    <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="Weather Icon">
                </div>
            `;
        }
    });
    forecastContainer.innerHTML = forecastHTML;
};

const updateSearchHistory = (city) => {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    renderSearchHistory();
};

const renderSearchHistory = () => {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryContainer.innerHTML = history.map(city => `<li>${city}</li>`).join('');
};

searchBtn.addEventListener('click', async () => {
    const city = cityInput.value;
    const weatherData = await getWeatherData(city);
    renderCurrentWeather(weatherData);
    renderForecast(weatherData);
    updateSearchHistory(city);
});

document.addEventListener('DOMContentLoaded', renderSearchHistory);