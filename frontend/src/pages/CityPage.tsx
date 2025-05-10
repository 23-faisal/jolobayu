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

  // Show error if no data after loading
  if (!weatherData && !forecastData) {
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

  return (
    <div className="space-y-4 ">
      {/* Favorite Cities */}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center  gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {params.cityName}
          </h1>
          <span className="text-muted-foreground font-bold tracking-tighter text-lg">
            {forecastData?.city.country}
          </span>
          <img
            src={`https://flagcdn.com/h20/${forecastData?.city.country.toLowerCase()}.png`}
            srcSet={`
    https://flagcdn.com/h40/${forecastData?.city.country.toLowerCase()}.png 2x,
    https://flagcdn.com/h60/${forecastData?.city.country.toLowerCase()}.png 3x
  `}
            height="20"
            alt={
              forecastData?.city.name
                ? `${forecastData.city.name} flag`
                : "Country flag"
            }
          />
        </div>
        <FavoriteButton data={{ ...weatherData, name: params.cityName }} />
      </div>

      {/* Current and Hourly weather */}

      <div className="grid gap-6">
        <div className="flex flex-col  gap-4 ">
          {/* current weather */}
          <CurrentWeather weatherData={weatherData} />

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

export default CityPage;
