import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("imperial");
  const [debouncedCity, setDebouncedCity] = useState("");

  const appid = "3d37478d757fb396c7fe12e01499576c";

  const getData = useCallback(async () => {
    if (!debouncedCity) return;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${debouncedCity}&appid=${appid}&units=${unit}`
      );
      setWeather(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [debouncedCity, unit]);

  // ---------------------------
  // 🔥 Debouncing Logic (300ms)
  // ---------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city);
    }, 300); // user stops typing for 300ms

    return () => clearTimeout(timer);
  }, [city]);

  // Fetch data when debouncedCity or unit changes
  useEffect(() => {
    if (debouncedCity) {
      getData();
    }
  }, [debouncedCity, unit, getData]);

  const convertTemp = () => {
    if (!weather) return;
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  return (
    <div className="weather-container">
      <h2 className="title">🌦 Check Weather in Your City</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />

        {/* Optional: Still keep manual button */}
        <button onClick={getData} className="btn">
          Get Weather
        </button>
      </div>

      {weather && (
        <div className="weather-card">
          <h1 className="temp">
            {weather.main.temp}
            {unit === "metric" ? "°C" : "°F"}
          </h1>

          <p className="city-name">
            {weather.name}, {weather.sys.country}
          </p>

          <p className="desc">{weather.weather[0].description}</p>

          <button onClick={convertTemp} className="toggle-btn">
            Convert: {unit === "metric" ? "°C → °F" : "°F → °C"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Weather;
