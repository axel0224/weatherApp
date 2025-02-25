// Function to fetch weather data from Open Meteo API
async function fetchWeatherData(latitude, longitude) {
    try {
        // Fetch weather data from Open Meteo API using the provided latitude and longitude
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Error fetching weather data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to fetch coordinates for a city from Nominatim API
async function getCoordinates(city) {
    try {
        // Fetch coordinates from Nominatim API using the provided city name
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
        const data = await response.json();
        // Check if the response is ok
        if (data.length === 0) {
            throw new Error('City not found');
        }
        // Return latitude and longitude
        return { latitude:data[0].lat, longitude:data[0].lon };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}

// Function to display weather data on the webpage
function displayWeatherData(data, city) {
    if(!data) {
        alert('No data available');
        return;
    }

    // Updates the card title and temperature with the fetched data
    document.querySelector(".card-title").innerText = `Weather in ${city}`;
    document.getElementById("temp").innerText = `Temperature: ${data.current.temperature_2m}°C`;

    // Update the other data that is displayed on the webpage
    const listItems = document.querySelectorAll(".list-group-item");
    listItems[0].innerHTML = `<p>Humidity: ${data.current.relative_humidity_2m}%</p>`;
    listItems[1].innerHTML = `<p>Wind Speed: ${data.current.wind_speed_10m} m/s</p>`;

    // Update the weather condition based on the weather code
    const weatherDescription = {
        0: "Clear",
        1: "Partly Cloudy",
        2: "Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Drizzle",
        53: "Light Rain",
        55: "Moderate Rain",
        56: "Light Rain Showers",
        57: "Moderate Rain Showers",
        61: "Light Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        66: "Light Rain Showers",
        67: "Heavy Rain Showers",
        71: "Light Snow",
        73: "Moderate Snow",
        75: "Heavy Snow",
        77: "Snow Grains",
        80: "Light Rain Showers",
        81: "Moderate Rain Showers",
        82: "Heavy Rain Showers"
    }
    // Get the weather code from the data and map it to a description
    const weatherCode = data.current.weather_code;
    const weatherCondition = weatherDescription[weatherCode] || "Unknown";
    listItems[2].innerHTML = `<p>Condition: ${weatherCondition}</p>`;
}

// Event listener for the search button
document.getElementById("btnSearch").addEventListener("click", async (event) => {
    event.preventDefault();
    // Get the city name from the input field
    const city = document.getElementById("txtSearchCity").value.trim();
    // Input validation
    if(!city) {
        alert("Please enter a city name.");
        return;
    }

    // Fetch coordinates for the city
    const coordinates = await getCoordinates(city);
    if (!coordinates) {
        alert("City not found. Please try again.");
        return;
    }

    // Fetch weather data using the coordinates
    const weatherData = await fetchWeatherData(coordinates.latitude, coordinates.longitude);
    if (weatherData) {
        displayWeatherData(weatherData, city);
    } else {
        alert("Unable to fetch weather data. Please try again.");
    }
})


