import { useFavorite } from "@/hooks/useFavorite";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/useWeather";
import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

const FavoriteCities = () => {
  const { favorites, removeFavorite } = useFavorite();

  if (!favorites.length) {
    return null;
  }
  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4 items-center">
          {favorites.map((city) => (
            <FavoriteCityTablet
              key={city.id}
              {...city}
              onRemove={() => removeFavorite.mutate(city.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  const navigate = useNavigate();
  const { data: weatherData, isLoading } = useWeatherQuery({ lat, lon });

  return (
    <div
      onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
      role="button"
      tabIndex={0}
      className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md "
    >
      <Button
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100"
        variant="remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.success(`Removed ${name} from favorites`);
        }}
      >
        <X className="h-4 w-4 text-slate-50 dark:text-slate-900" />
      </Button>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weatherData ? (
        <>
          <div className="flex items-center justify-between">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt={`${weatherData.weather[0].description}`}
              className="h-10 w-10"
            />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {weatherData.sys.country}
              </p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xl font-bold">
              {Math.round(weatherData.main.temp)}°
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weatherData.weather[0].main}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default FavoriteCities;
