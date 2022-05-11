import { useState, useEffect } from 'react'
import axios from 'axios'
const api_key = process.env.REACT_APP_API_KEY


const Weather = ({country}) => {
  const [weather,setWeather] = useState([]);
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${api_key}`;

  useEffect(() => {
    axios
      .get(weather_url)
      .then(response => {
        setWeather(response.data);
      });
  },[]);
  
  return (
    <>
      {weather.main ? (
        <div>
          <h2>Weather in {country.capital}</h2>
          <div>Temperature {(weather.main.temp-272.15).toFixed(2)}°C</div>
          <img
            alt="weather icon"
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          />
          <div>Wind {weather.wind.speed} m/s</div>
        </div>
      ) : null}
  </>
  )
}


export default Weather;
