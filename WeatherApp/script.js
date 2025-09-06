const apiKey = "86e5c70dc11f4d1ee69a45971e33a434"; // Replace with your OpenWeatherMap API key

document.getElementById("getWeatherBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  if (city === "") {
    alert("Please enter a city name");
    return;
  }
  getWeather(city);
});

function getWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
    });
}

function displayWeather(data) {
  const weatherDiv = document.getElementById("weatherResult");
  const icon = getWeatherIcon(data.weather[0].main);
  const bg = getBackground(data.weather[0].main);

  document.body.style.background = bg;

  weatherDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <div class="weather-icon">${icon}</div>
    <p><strong>${data.main.temp}°C</strong></p>
    <p>${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
  `;
}

function getWeatherIcon(condition) {
  switch (condition) {
    case "Clear": return '<i class="fas fa-sun" style="color:#fbc02d"></i>';
    case "Clouds": return '<i class="fas fa-cloud" style="color:#90a4ae"></i>';
    case "Rain": return '<i class="fas fa-cloud-showers-heavy" style="color:#0288d1"></i>';
    case "Snow": return '<i class="fas fa-snowflake" style="color:#00bcd4"></i>';
    case "Thunderstorm": return '<i class="fas fa-bolt" style="color:#ff9800"></i>';
    default: return '<i class="fas fa-smog" style="color:#757575"></i>';
  }
}

function getBackground(condition) {
  switch (condition) {
    case "Clear": return "linear-gradient(to right, #fceabb, #f8b500)";
    case "Clouds": return "linear-gradient(to right, #bdc3c7, #2c3e50)";
    case "Rain": return "linear-gradient(to right, #00c6fb, #005bea)";
    case "Snow": return "linear-gradient(to right, #e0eafc, #cfdef3)";
    case "Thunderstorm": return "linear-gradient(to right, #2c3e50, #fd746c)";
    default: return "linear-gradient(to right, #74ebd5, #acb6e5)";
  }
}

