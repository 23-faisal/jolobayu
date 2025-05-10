import type { WeatherData } from "@/api/types";
import { useFavorite } from "@/hooks/useFavorite";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface SystemDataWithState {
  country: string;
  state?: string;
  [key: string]: unknown; // For other potential sys properties
}

interface WeatherDataWithState extends Omit<WeatherData, "sys"> {
  sys: SystemDataWithState;
  name: string;
}

interface IFavoriteButtonData {
  data?: WeatherDataWithState;
}

const FavoriteButton = ({ data }: IFavoriteButtonData) => {
  const { addFavorites, isFavorite, removeFavorite, favorites } = useFavorite();

  const isCurrentlyFavorite = isFavorite(
    data?.coord?.lat ?? 0,
    data?.coord?.lon ?? 0
  );

  const handleToggleFavorite = async () => {
    if (!data) return;

    const action = isCurrentlyFavorite ? "remove" : "add";
    const successMessage = `${data.name}${
      action === "add" ? "added" : "removed"
    }  ${action === "add" ? "to" : "from"} favorites`;
    const errorMessage = `Failed to ${action} ${data.name} to favorites`;

    try {
      if (isCurrentlyFavorite) {
        const cityToRemove = favorites?.find(
          (city) => city.lat === data.coord.lat && city.lon === data.coord.lon
        );

        if (cityToRemove) {
          await removeFavorite.mutateAsync(cityToRemove.id);
        }
      } else {
        await addFavorites.mutateAsync({
          name: data.name,
          lat: data.coord.lat,
          lon: data.coord.lon,
          country: data.sys.country,
          state: data.sys.state,
        });
      }
      toast.success(successMessage);
    } catch {
      toast.error(errorMessage);
    }
  };

  if (!data) return null;

  return (
    <Button
      onClick={handleToggleFavorite}
      variant={isCurrentlyFavorite ? "default" : "outline"}
      className={isCurrentlyFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
      aria-label={
        isCurrentlyFavorite ? "Remove from favorites" : "Add to favorites"
      }
      disabled={addFavorites.isPending || removeFavorite.isPending}
    >
      <Star
        className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`}
      />
    </Button>
  );
};

export default FavoriteButton;
