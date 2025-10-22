// Gudgekin | weather app for freeCodeCamp project 
const temperature = document.getElementById("temperature");
const degreesUnit = document.getElementById("degrees-unit");
const place = document.getElementById("place");
const today = document.getElementById("today");
const now = document.getElementById("time-now");
const conditions = document.getElementById("conditions-span");
const conditionsText = document.getElementById("conditions-text");
const searchForm = document.getElementById("search-form");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const locationButton = document.getElementById("current-location-button");
const day1 = document.getElementById("d1");
const day2 = document.getElementById("d2");
const day3 = document.getElementById("d3");
const forecast1 = document.getElementById("forecast-1");
const forecast2 = document.getElementById("forecast-2");
const forecast3 = document.getElementById("forecast-3");
//const f1 = document.getElementById("f1");
//const f2 = document.getElementById("f2");
//const f3 = document.getElementById("f3");

let area = "San Francisco";
let isFahrenheit = true;
let degreesF = 0;
let degreesC = 0;

// FETCH Current Weather
async function fetchWeather(area) {

    // send request
    let url = `/.netlify/functions/getWeather?location=${area}`;

  try {
    // receive data
    const res = await fetch(url);

    // check response
    if (!res.ok) {
        throw new Error(`Weather data not found for ${area}. Status: ${res.status}`);
    }
    // --------------

    const data = await res.json();
    console.log("in fetchWeather: ", data)
   
    let lat = data.location.lat;
    let lon = data.location.lon;
    
    fetchForecast(lat, lon)

    return data;

  } catch (error) {
        console.error("Fetch error:", error.message);
        place.innerText = "Error: Not found or network issue.";
  }

}
// END FETCH Current Weather

// FETCH Forecast 
async function fetchForecast(lat, lon) {
    
    // send request
    let url = `/.netlify/functions/getWeather?lat=${lat}&lon=${lon}`;

  try {
    // receive data
    const res = await fetch(url);

    // check response
    if (!res.ok) {       
        throw new Error(`Forecast data not found. Status: ${res.status}`);
    }
    // --------------

    const data = await res.json();

    console.log("In fetchForecast: ", data)

    processDate(data)
    updateWeather(data)
  
    return data;

  } catch (error) {
    console.error("Fetch error:", error.message);
    place.innerText = "Error: Not found or network issue.";
  }
}
// END FETCH Forecasat

// BEGIN Geolocation
if (!navigator.geolocation) {
    throw new Error("No geolocation available");
}
function success(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    fetchForecast(lat, lon)
}
function error(err) {
    if (err.code === 1) {
        alert("Please allow access to geolocation");
    } else {
        alert("Position unavailable");
    }
}
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

// END Geolocation

// DATES AND TIME Process and Format
function processDate(data) {
    // current time and date
    let dateString = data.location.localtime.replace(" ", "T");
    let dateObject = new Date(dateString);
    // options 
    let dateOptions = { month: "long", day: "numeric", year: "numeric" };
    let timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };
    let dayOptions = { weekday: "long" };
    // format day names from forecast dates
    let days = data.forecast.forecastday.map(forecast => {
        let d = new Date(forecast.date + "T12:00:00");
        return d.toLocaleDateString("en-US", dayOptions);
    });
    return {
        date: dateObject.toLocaleDateString("en-US", dateOptions),
        time: dateObject.toLocaleTimeString("en-US", timeOptions),
        day: dateObject.toLocaleDateString("en-US", dayOptions),
        day1Name: days[0],
        day2Name: days[1],
        day3Name: days[2]
    };
}
// END DATES AND TIME

// UPDATE WEATHER INFORMATION 
function updateWeather(data) {
    degreesF = data.current.temp_f; 
    degreesC = data.current.temp_c;
    let dateTime = processDate(data);
    // store the gotten info in an object    
    let weather = {
        date: dateTime.date,
        time: dateTime.time,
        tempC: data.current.temp_c,
        tempF: data.current.temp_f,
        city: data.location.name,
        icon: data.current.condition.icon,
        text: data.current.condition.text,
        day1Icon: data.forecast.forecastday[0].day.condition.icon,
        //day1Text: data.forecast.forecastday[0].day.condition.text,
        day2Icon: data.forecast.forecastday[1].day.condition.icon,
        //day2Text: data.forecast.forecastday[1].day.condition.text,
        day3Icon: data.forecast.forecastday[2].day.condition.icon,
       // day3Text: data.forecast.forecastday[2].day.condition.text,
        day1Name: data.forecast.forecastday[0].date,
        day2Name: data.forecast.forecastday[1].date,
        day3Name: data.forecast.forecastday[2].date,
        day1Name: dateTime.day1Name,
        day2Name: dateTime.day2Name,
        day3Name: dateTime.day3Name
    }
    updatePage(weather)
}
// END UPDATE WEATHER

// OUTPUT UPDATES TO PAGE
function updatePage(weather) {
    temperature.innerText = weather.tempF;
    degreesUnit.innerText = "F";
    place.innerText = weather.city;
    today.innerText = weather.date;
    now.innerText = weather.time;
    conditions.innerHTML = `<img src="https:${weather.icon}" alt="weather icon">`;
    conditionsText.innerText = weather.text;
    day1.innerText = weather.day1Name.slice(0, 3).toUpperCase();
    day2.innerText = weather.day2Name.slice(0, 3).toUpperCase();
    day3.innerText = weather.day3Name.slice(0, 3).toUpperCase();
    forecast1.innerHTML = `<img src="http:${weather.day1Icon}" alt="weather icon">`;
    //f1.innerHTML = `${weather.day1Text}`
    forecast2.innerHTML = `<img src="http:${weather.day2Icon}" alt="weather icon">`;
    //f2.innerHTML = `${weather.day2Text}`;
    forecast3.innerHTML = `<img src="http:${weather.day3Icon}" alt="weather icon">`;
    //f3.innerHTML = `${weather.day3Text}`;  
}
// END UPDATE PAGE

// TOGGLE DEGREES
function toggleDegrees() {
    isFahrenheit = !isFahrenheit;
    let tempValue = isFahrenheit ? degreesF : degreesC;
    let unit = isFahrenheit ? "F" : "C";
    temperature.innerText = tempValue;
    degreesUnit.innerText = unit;
}

// SEARCH
function search(e) {
    e.preventDefault();
    area = searchInput.value;  
    fetchWeather(area)
}

// Event Listeners
locationButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(success, error, options);
})
degreesUnit.addEventListener("click", toggleDegrees);
searchBtn.addEventListener("click", search);
searchForm.addEventListener("submit", () => {
    search();
});

// Call function for Current Weather
fetchWeather(area)