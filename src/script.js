const input = document.querySelector('input');
const button = document.getElementById('getWeather');
const weatherDiv = document.getElementById('weather');
const cityName = document.getElementById('city-name');
const weatherDetails = document.getElementById('weather-details');
const apiKey = process.env.APIKEY;
button.addEventListener('click', getWeather);
async function getWeather() {
    const city = input.value.trim();
    if(!city) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}&lang=ru`;
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error('Город не найден');
        }
        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        weatherDiv.innerHTML = `<p>Ошибка при получении данных</p>`;
        alert(error.message);
      }
}
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherDetails.innerHTML = `
        <p>Температура: ${Math.round(data.main.temp)}°C (ощущается как ${Math.round(data.main.feels_like)}°C)</p>
        <p>Погода: ${data.weather[0].description}</p>
        <p>Влажность: ${data.main.humidity}%</p>
        <p>Ветер: ${Math.round(data.wind.speed)} м/с</p>
        <p>Давление: ${Math.round(data.main.pressure * 0.75)} мм рт.ст.</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}">
    `;
    weatherDiv.style.display = 'block';
}

