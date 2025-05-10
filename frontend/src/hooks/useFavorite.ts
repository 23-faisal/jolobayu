import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";

interface IFavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavorite() {
  const [favorites, setFavorites] = useLocalStorage<IFavoriteCity[]>(
    "favorites",
    []
  );

  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity,
  });

  const addFavorites = useMutation({
    mutationFn: async (city: Omit<IFavoriteCity, "id" | "addedAt">) => {
      const newFavorite: IFavoriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };

      const cityExists = favorites.some(
        (fav) => fav.lat === city.lat && fav.lon === city.lon
      );

      if (cityExists) {
        return favorites;
      }

      const updatedFavorites = [...favorites, newFavorite].slice(0, 10);
      setFavorites(updatedFavorites);
      return updatedFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter((city) => city.id !== cityId);
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  return {
    favorites: favoritesQuery.data,
    addFavorites,
    removeFavorite,
    isFavorite: (lat: number, lon: number) => {
      return (
        favoritesQuery.data?.some(
          (city) => city.lat === lat && city.lon === lon
        ) ?? false
      );
    },
  };
}
