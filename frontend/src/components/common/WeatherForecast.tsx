import type { Forecast } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastDataProps {
  data: Forecast;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;

  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const WeatherForecast = ({ data }: WeatherForecastDataProps) => {
  const dailyForecast = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy mm dd");
    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecast).slice(1, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>5 Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(day.date * 1000), "EEE, MMM, d")}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {day.weather.description}
                </p>
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <span className="flex items-center text-blue-500 ">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {Math.round(day.temp_min)}°
                </span>
                <span className="flex items-center text-red-500 ">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {Math.round(day.temp_max)}°
                </span>
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <span className="flex items-center  ">
                  <Droplets className="mr-1 h-4 w-4 text-blue-500" />
                  {Math.round(day.humidity)}%
                </span>
                <span className="flex items-center  ">
                  <Wind className="mr-1 h-4 w-4 text-blue-500" />
                  {Math.round(day.wind)} m/s
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
