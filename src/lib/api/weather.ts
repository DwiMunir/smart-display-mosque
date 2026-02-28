interface WeatherData {
  location: string;
  tempC: number;
  tempF: number;
  condition: string;
  icon: string;
  humidity: number;
  windKph: number;
  feelsLikeC: number;
  feelsLikeF: number;
}

interface WeatherApiResponse {
  current: {
    temp_c: number;
    temp_f: number;
    condition: { text: string; icon: string };
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
    feelslike_f: number;
  };
  location: {
    name: string;
    country: string;
  };
}

export async function fetchWeather(
  location: string,
  apiKey: string,
): Promise<WeatherData> {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`;

  const response = await fetch(url, { next: { revalidate: 600 } });

  if (!response.ok) {
    throw new Error(`WeatherAPI error: ${response.status}`);
  }

  const json: WeatherApiResponse = await response.json();

  return {
    location: `${json.location.name}, ${json.location.country}`,
    tempC: json.current.temp_c,
    tempF: json.current.temp_f,
    condition: json.current.condition.text,
    icon: json.current.condition.icon.startsWith("//")
      ? `https:${json.current.condition.icon}`
      : json.current.condition.icon,
    humidity: json.current.humidity,
    windKph: json.current.wind_kph,
    feelsLikeC: json.current.feelslike_c,
    feelsLikeF: json.current.feelslike_f,
  };
}

export function getMockWeather(): WeatherData {
  return {
    location: "Mecca, Saudi Arabia",
    tempC: 35,
    tempF: 95,
    condition: "Sunny",
    icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png",
    humidity: 20,
    windKph: 12,
    feelsLikeC: 38,
    feelsLikeF: 100,
  };
}

export type { WeatherData };
