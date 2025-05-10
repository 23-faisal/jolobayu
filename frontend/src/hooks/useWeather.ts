import type { Coordinates } from "@/api/types";
import { weatherAPI } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
  weather: (coordinates: Coordinates) => ["weather", coordinates] as const,
  forecast: (coordinates: Coordinates) => ["forecast", coordinates] as const,
  location: (coordinates: Coordinates) => ["location", coordinates] as const,
  search: (query: string) => ["location-search", query] as const,
};

export const useWeatherQuery = (coordinates: Coordinates | null) => {
  return useQuery({
    queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: async () => {
      if (!coordinates) return null;
      return await weatherAPI.getCurrentWeather(coordinates);
    },
    enabled: !!coordinates,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useForecastQuery = (coordinates: Coordinates | null) => {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: async () => {
      if (!coordinates) return null;
      return await weatherAPI.getForecast(coordinates);
    },
    enabled: !!coordinates,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useReverseGeoLocationQuery = (coordinates: Coordinates | null) => {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: async () => {
      if (!coordinates) return null;
      return await weatherAPI.reverseGeocode(coordinates);
    },
    enabled: !!coordinates,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useLocationSearch = (query: string) => {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => weatherAPI.searchLocation(query),
    enabled: query.length >= 3,
  });
};
