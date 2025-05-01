'use client';

import { useState } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/weather?city=${city}&units=${unit}`);
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Error fetching weather');
      } else {
        const data = await res.json();
        setWeatherData(data);
      }
    } catch (err) {
      setError('Network error. Make sure the Laravel server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-yellow-600 text-white flex flex-col items-center p-6 gap-6">
      <h1 className="text-4xl font-bold text-blue-800">🌦️ Weather App</h1>

      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input input-bordered w-full"
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="flex gap-4">
        <label className="label cursor-pointer">
          <span className="label-text mr-2">Celsius</span>
          <input
            type="radio"
            name="unit"
            className="radio"
            checked={unit === 'metric'}
            onChange={() => setUnit('metric')}
          />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text mr-2">Fahrenheit</span>
          <input
            type="radio"
            name="unit"
            className="radio"
            checked={unit === 'imperial'}
            onChange={() => setUnit('imperial')}
          />
        </label>
      </div>

      {loading ? (
        <div className="card w-full max-w-md bg-base-200 shadow-xl mt-4 p-4 text-center">Loading...</div>
      ) : error ? (
        <div className="card w-full max-w-md bg-error text-error-content shadow-xl mt-4 p-4 text-center">
          {error}
        </div>
      ) : weatherData ? (
        <>
          <div className="card w-full max-w-md bg-black bg-opacity-50 backdrop-blur-sm shadow-xl mt-4 border border-yellow-500">
  <div className="card-body text-center text-white">
              <h2 className="text-2xl font-semibold text-blue-700">{city.charAt(0).toUpperCase() + city.slice(1)}</h2>
              <p className="text-gray-500">{getCurrentDate()}</p>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="mx-auto"
              />
              <p className="text-4xl font-bold">
                {Math.round(weatherData.current.temp)}°{unit === 'metric' ? 'C' : 'F'}
              </p>
              <p className="capitalize text-lg">{weatherData.current.weather[0].description}</p>
              <p>💧 Humidity: {weatherData.current.humidity}%</p>
              <p>💨 Wind: {weatherData.current.wind_speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
            </div>
          </div>

          <div className="w-full max-w-md mt-6">
            <h3 className="text-xl font-semibold mb-2 text-center text-blue-800">Next 3 Days Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {weatherData.daily.slice(1, 4).map((day: any, index: number) => {
                const date = new Date(day.dt * 1000).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <div key={index} className="card bg-yellow-600 bg-opacity-20 border border-yellow-400 text-yellow-100 shadow-md p-4 text-center">
                    <p className="font-bold">{date}</p>
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt="icon"
                      className="mx-auto w-12"
                    />
                    <p className="text-lg font-semibold">
                      {Math.round(day.temp.day)}°{unit === 'metric' ? 'C' : 'F'}
                    </p>
                    <p className="capitalize text-sm">{day.weather[0].description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="card w-full max-w-md bg-white shadow-xl mt-4 p-4 text-center">
          Enter a city to get weather info.
        </div>
      )}
    </main>
  );
}
