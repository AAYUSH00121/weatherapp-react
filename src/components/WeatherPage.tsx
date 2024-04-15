import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const weatherApi =
  "http://api.openweathermap.org/data/2.5/weather";
const forecastApi =
  "http://api.openweathermap.org/data/2.5/forecast";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
}

interface ForecastData {
  list: {
    dt_txt: string;
    main: {
      temp: number;
      feels_like: number;
    };
    weather: {
      main: string;
      description: string;
    }[];
  }[];
}

const WeatherPage: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res = await fetch(`${weatherApi}?q=${cityId}&appid=${"6fbb41936ebf142979b5aa62db0f07e9"}&units=metric`);
        if (!res.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data: WeatherData = await res.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    const fetchForecastData = async () => {
      try {
        const res = await fetch(`${forecastApi}?q=${cityId}&appid=${"6fbb41936ebf142979b5aa62db0f07e9"}&units=metric`);
        if (!res.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        const data: ForecastData = await res.json();
        setForecastData(data);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchWeatherData();
    fetchForecastData();
  }, [cityId]);

  return (
    <div className=" min-h-screen bg-gradient-to-r from-indigo-200 to-yellow-100">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">Weather for {cityId}</h2>
      {weatherData && forecastData ? (
        <div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex justify-center">Current Weather</h3>
            <div className="flex justify-center p-4">
              <div className="flex items-center mb-4 p-5">
              <img src="https://img.icons8.com/ios/50/000000/thermometer.png" alt="Temperature icon" className="w-6 h-6 mr-2" />
              <p className="mb-1">Temperature: {weatherData.main.temp} °C</p>
              </div>
              <div className="flex items-center mb-4 p-5" >
              <img  src="https://img.icons8.com/hands/100/experimental-thumb-up-hands.png" alt="experimental-thumb-up-hands" className="w-6 h-6 mr-2"/>
              <p className="mb-1">Feels like: {weatherData.main.feels_like} °C</p>
              </div>
              <div className="flex items-center mb-4 p-5 ">
              <img src="https://img.icons8.com/ios/50/000000/partly-cloudy-day.png" alt="Description icon" className="w-6 h-6 mr-2" />
              <p className="mb-1">Description: {weatherData.weather[0].description}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold my-4">5-Day Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
              {forecastData.list.map((forecast, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md bg-opacity-50 backdrop-blur-md">
                  <p className="font-semibold mb-1">Date & Time: {forecast.dt_txt}</p>
                  <p className="mb-1">Temperature: {forecast.main.temp} °C</p>
                  <p className="mb-1">Feels like: {forecast.main.feels_like} °C</p>
                  <p className="mb-1">Description: {forecast.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default WeatherPage;
