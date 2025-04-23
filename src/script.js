const input = document.querySelector('input');
const button = document.getElementById('getWeather');
const weatherDiv = document.getElementById('weather');
const cityName = document.getElementById('city-name');
const weatherDetails = document.getElementById('weather-details');
const apiKey = process.env.APIKEY;

// Запрет на ввод пробелов первыми символами
input.addEventListener('input', function() {
    this.value = this.value.replace(/^\s+/, '');
    if (this.value === ' ') {
        this.value = '';
    }
});

button.addEventListener('click', getWeather);

async function getWeather() {
    const city = input.value.trim();
    if (!city) return;

    weatherDiv.style.display = 'none';
    cityName.textContent = '';
    weatherDetails.innerHTML = '';

    try {
        // 1. Сначала получаем список всех городов с таким названием
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${apiKey}`;
        const geocodingResponse = await fetch(geocodingUrl);
        
        if (!geocodingResponse.ok) {
            throw new Error('Ошибка при поиске городов');
        }

        const cities = await geocodingResponse.json();
        
        if (!cities.length) {
            throw new Error('Города не найдены');
        }

        // 2. Для каждого города получаем погоду
        const weatherPromises = cities.map(cityData => {
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityData.lat}&lon=${cityData.lon}&units=metric&appid=${apiKey}&lang=ru`;
            return fetch(weatherUrl).then(res => res.json());
        });

        const weatherDataList = await Promise.all(weatherPromises);
        displayAllWeather(cities, weatherDataList);

    } catch (error) {
        cityName.textContent = '';
        weatherDetails.innerHTML = `<p class="error-message">Ошибка: ${error.message}</p>`;
        weatherDiv.style.display = 'block';
    }
}

function displayAllWeather(cities, weatherDataList) {
    cityName.textContent = `Найдено городов: ${weatherDataList.length}`;
    
    let weatherHTML = '';
    
    weatherDataList.forEach((weatherData, index) => {
        const city = cities[index];
        weatherHTML += `
            <div class="city-weather">
                <h3>${city.name}, ${city.country} (${city.state || '—'})</h3>
                <p>Температура: ${Math.round(weatherData.main.temp)}°C</p>
                <p>Ощущается как: ${Math.round(weatherData.main.feels_like)}°C</p>
                <p>Погода: ${weatherData.weather[0].description}</p>
                <p>Влажность: ${weatherData.main.humidity}%</p>
                <p>Ветер: ${Math.round(weatherData.wind.speed)} м/с</p>
                <p>Давление: ${Math.round(weatherData.main.pressure * 0.75)} мм рт.ст.</p>
                <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].main}">
                <hr>
            </div>
        `;
    });

    weatherDetails.innerHTML = weatherHTML;
    weatherDiv.style.display = 'block';
}