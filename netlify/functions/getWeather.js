const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const API_KEY = process.env.WEATHER_API_KEY; // keep this safe
  const { location, lat, lon } = event.queryStringParameters;

  try {
    let url;

    if (lat && lon) {
      // Forecast by coordinates
      url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`;
    } else if (location) {
      // Current weather by location name
      url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing location or coordinates" })
      };
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: data.error || "API request failed" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
