import type {
  Clouds,
  Coordinates,
  MainWeatherData,
  Precipitation,
  WeatherCondition,
  Wind,
} from "@/api/types";
import CurrentWeather from "@/components/common/CurrentWeather";
import FavoriteButton from "@/components/common/FavoriteButton";
import HourlyTemperature from "@/components/common/HourlyTemperature";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import WeatherDetails from "@/components/common/WeatherDetails";
import WeatherForecast from "@/components/common/WeatherForecast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForecastQuery, useWeatherQuery } from "@/hooks/useWeather";
import { AlertTriangle } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

interface SystemDataWithState {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
  state?: string;
  [key: string]: unknown;
}

interface WeatherDataWithState {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: Wind;
  rain?: Precipitation;
  snow?: Precipitation;
  clouds: Clouds;
  dt: number;
  sys: SystemDataWithState;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const { data: weatherData, isLoading: isWeatherLoading } =
    useWeatherQuery(coordinates);
  const { data: forecastData, isLoading: isForecastLoading } =
    useForecastQuery(coordinates);

  if (isWeatherLoading || isForecastLoading) {
    return <LoadingSkeleton />;
  }

  if (!weatherData || !forecastData) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Could not get the data. Please try again later</p>
          <Link to="/">Go to Home</Link>
        </AlertDescription>
      </Alert>
    );
  }

  // Prepare favorite data with proper typing
  const favoriteData: WeatherDataWithState = {
    ...weatherData,
    name: params.cityName || "Unknown City",
    sys: {
      ...weatherData.sys,
      state:
        weatherData.sys.country === "US"
          ? params.cityName?.split(",")[1]?.trim() || ""
          : "",
    },
  };

  return (
    <div className="space-y-4">
      {/* City Header with Favorite Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {params.cityName}
          </h1>
          <span className="text-muted-foreground font-bold tracking-tighter text-lg">
            {forecastData.city.country}
          </span>
          <img
            src={`https://flagcdn.com/h20/${forecastData.city.country.toLowerCase()}.png`}
            srcSet={`
              https://flagcdn.com/h40/${forecastData.city.country.toLowerCase()}.png 2x,
              https://flagcdn.com/h60/${forecastData.city.country.toLowerCase()}.png 3x
            `}
            height="20"
            alt={`${forecastData.city.name} flag`}
          />
        </div>
        <FavoriteButton data={favoriteData} />
      </div>

      {/* Weather Display Sections */}
      <div className="grid gap-6">
        {/* Current Weather and Hourly Forecast */}
        <div className="flex flex-col gap-4">
          <CurrentWeather weatherData={weatherData} />
          <HourlyTemperature data={forecastData} />
        </div>

        {/* Weather Details and Forecast */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherData} />
          <WeatherForecast data={forecastData} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;
