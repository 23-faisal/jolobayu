import { API_CONFIG } from "./config";
import type {
  Coordinates,
  Forecast,
  GeoCodingResponse,
  WeatherData,
} from "./types";

class WeatherAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }
    return response.json();
  }

  async getCurrentWeather(coords: Coordinates): Promise<WeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      lat: coords.lat.toString(),
      lon: coords.lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    return this.fetchData<WeatherData>(url);
  }

  async getForecast(coords: Coordinates): Promise<Forecast> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: coords.lat.toString(),
      lon: coords.lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    return this.fetchData<Forecast>(url);
  }

  async reverseGeocode(coords: Coordinates): Promise<GeoCodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO_CODING}/reverse`, {
      lat: coords.lat.toString(),
      lon: coords.lon.toString(),
      limit: "1",
    });
    return this.fetchData<GeoCodingResponse[]>(url);
  }

  async searchLocation(query: string): Promise<GeoCodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO_CODING}/direct`, {
      q: query,
      limit: 5,
    });
    return this.fetchData<GeoCodingResponse[]>(url);
  }
}

export const weatherAPI = new WeatherAPI();
