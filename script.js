const apiKey = "ca1f719867c15a93c38eb3eb35122422";
const cityInput = document.getElementById("cityInput");
const suggestionList = document.getElementById("suggestionList");

document.getElementById("weatherForm").addEventListener("submit", function (e) {
  e.preventDefault();
  getWeatherByName(cityInput.value.trim());
});

cityInput.addEventListener("input", async function () {
  const query = cityInput.value.trim();

  if (query.length < 2) {
    suggestionList.innerHTML = '';
    return;
  }

  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;
  try {
    const res = await fetch(geoUrl);
    const cities = await res.json();

    suggestionList.innerHTML = '';

    cities.forEach(city => {
      const li = document.createElement("li");
      li.textContent = `${city.name}, ${city.country}`;
      li.addEventListener("click", () => {
        cityInput.value = city.name;
        suggestionList.innerHTML = '';
        getWeatherByCoords(city.lat, city.lon, city.name, city.country);
      });
      suggestionList.appendChild(li);
    });

  } catch (err) {
    console.error('Error fetching suggestions:', err);
  }
});

cityInput.addEventListener('blur', () => {
  setTimeout(() => {
    suggestionList.innerHTML = '';
  }, 150);
});

async function getWeatherByName(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

async function getWeatherByCoords(lat, lon, name, country) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    data.name = name;
    data.sys.country = country;
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

function getWeatherIconClass(main) {
  switch (main.toLowerCase()) {
    case 'clear': return 'wi-day-sunny';
    case 'clouds': return 'wi-cloudy';
    case 'rain': return 'wi-rain';
    case 'drizzle': return 'wi-sprinkle';
    case 'thunderstorm': return 'wi-thunderstorm';
    case 'snow': return 'wi-snow';
    case 'mist':
    case 'fog':
    case 'haze': return 'wi-fog';
    default: return 'wi-na';
  }
}

function displayWeather(data) {
  const resultEl = document.getElementById("weatherResult");
  const iconClass = getWeatherIconClass(data.weather[0].main);

  resultEl.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <i class="weather-icon wi ${iconClass}"></i>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Weather:</strong> ${data.weather[0].main} (${data.weather[0].description})</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
  `;
}

function showError(message) {
  document.getElementById('weatherResult').innerHTML = `<p style="color:red;">${message}</p>`;
}
