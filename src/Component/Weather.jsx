import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("imperial");

  const appid = "3d37478d757fb396c7fe12e01499576c";

  const getData = useCallback(async () => {
    if (!city) return;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}&units=${unit}`
      );
      setWeather(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [city, unit]); // <-- dependencies of the function

  useEffect(() => {
    if (!city) return;
    getData(); // only refetch if user searched once
  }, [unit, getData, city]); // <-- now this is valid & safe

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

          <div className="icon">☁</div>

          <button onClick={convertTemp} className="toggle-btn">
            Convert: {unit === "metric" ? "°C → °F" : "°F → °C"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Weather;
