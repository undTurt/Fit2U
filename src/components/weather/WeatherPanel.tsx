import React, { useState, useEffect } from 'react';
import { WiDaySunny, WiSnow, WiCloudy } from 'react-icons/wi'; // Import weather icons

interface WeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

interface WeatherPanelProps {
  onWeatherSelect: (condition: string, temperature: number) => void;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ onWeatherSelect }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=33.4255&longitude=-111.9400&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America/Phoenix`;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data: WeatherData = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeatherData();
  }, []);

  const celsiusToFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  const getWeatherDescription = (maxTemp: number): string => {
    const fahrenheitTemp = celsiusToFahrenheit(maxTemp);
    if (fahrenheitTemp < 60) return 'Cold';
    if (fahrenheitTemp >= 60 && fahrenheitTemp <= 80) return 'Temperate';
    return 'Hot';
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Cold':
        return <WiSnow className="text-cyan-500 text-4xl" />;
      case 'Temperate':
        return <WiCloudy className="text-gray-500 text-4xl" />;
      case 'Hot':
        return <WiDaySunny className="text-yellow-500 text-4xl" />;
      default:
        return null;
    }
  };

  const handleDateChange = (index: number) => {
    setSelectedDateIndex(index);
    if (weatherData) {
      const maxTemp = weatherData.daily.temperature_2m_max[index];
      const condition = getWeatherDescription(maxTemp);
      onWeatherSelect(condition, celsiusToFahrenheit(maxTemp)); // Update the parent component with the correct condition and temperature
    }
  };

  if (!weatherData) {
    return <p>Loading weather data...</p>;
  }

  const selectedCondition = getWeatherDescription(
    weatherData.daily.temperature_2m_max[selectedDateIndex]
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Select a Date</h2>
      <select
        value={selectedDateIndex}
        onChange={(e) => handleDateChange(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
      >
        {weatherData.daily.time.map((date, index) => (
          <option key={date} value={index}>
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </option>
        ))}
      </select>
      <div className="flex items-center space-x-4">
        {getWeatherIcon(selectedCondition)}
        <div>
          <p>
            <strong>Condition:</strong> {selectedCondition}
          </p>
          <p>
            <strong>Max Temp:</strong> {celsiusToFahrenheit(weatherData.daily.temperature_2m_max[selectedDateIndex])}°F
          </p>
          <p>
            <strong>Min Temp:</strong> {celsiusToFahrenheit(weatherData.daily.temperature_2m_min[selectedDateIndex])}°F
          </p>
          <p>
            <strong>Precipitation:</strong> {weatherData.daily.precipitation_sum[selectedDateIndex]} mm
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;