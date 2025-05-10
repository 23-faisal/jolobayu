import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { AlertTriangle, MapPin, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useReverseGeoLocationQuery,
  useWeatherQuery,
  useForecastQuery,
} from "@/hooks/useWeather";
import CurrentWeather from "@/components/common/CurrentWeather";
import HourlyTemperature from "@/components/common/HourlyTemperature";
import WeatherDetails from "@/components/common/WeatherDetails";
import WeatherForecast from "@/components/common/WeatherForecast";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading,
  } = useGeoLocation();

  const { data: locationData, refetch: refetchLocation } =
    useReverseGeoLocationQuery(coordinates);
  const { data: weatherData, refetch: refetchWeather } =
    useWeatherQuery(coordinates);
  const { data: forecastData, refetch: refetchForecast } =
    useForecastQuery(coordinates);

  const locationName = locationData?.[0];

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      refetchLocation();
      refetchWeather();
      refetchForecast();
    }
  };

  const isLoading =
    locationLoading ||
    (coordinates && !locationData && !weatherData && !forecastData);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="w-4 h-4 mr-2" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable your location access to see your local weather.</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="w-4 h-4 mr-2" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 ">
      {/* Favorite Cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={!!isLoading}
        >
          <RefreshCcw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* Current and Hourly weather */}

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-4 ">
          {/* current weather */}
          <CurrentWeather
            weatherData={weatherData}
            locationName={locationName}
          />

          {/* hourly temperature */}

          <HourlyTemperature data={forecastData} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* details */}
          {weatherData && <WeatherDetails data={weatherData} />}

          {/* forecast */}
          {forecastData && <WeatherForecast data={forecastData} />}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
