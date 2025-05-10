import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { Button } from "../ui/button";
import { useState } from "react";
import { Clock, Loader2, Search, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { format } from "date-fns";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    setOpen(false);

    addToHistory.mutate({
      query,
      name,
      country,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    });

    // add to search history
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 "
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search Cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 3 && !isLoading && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {/* <CommandGroup heading="Favorites"></CommandGroup> */}

          <CommandSeparator />

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2 my-2">
                  <p className="text-xs text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear
                  </Button>
                </div>

                {history.map((location) => (
                  <CommandItem
                    className="flex items-center justify-between"
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}| ${location.lon} | ${location.name} | ${location.country}`}
                    onSelect={handleSelect}
                  >
                    <div className="flex items-center gap-2 ">
                      <Clock className="mr-2 w-4 h-4 text-muted-foreground" />
                      <span> {location.name}  </span>
                      {location.state && (
                        <span className="text-sm text-muted-foreground">
                          {location.state} 
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {location.country}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(location.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4 ">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}

              {locations.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}| ${location.lon} | ${location.name} | ${location.country}`}
                  onSelect={handleSelect}
                >
                  <Search className="mr-2 w-4 h-4" />
                  <span> {location.name}, </span>
                  {location.state && (
                    <span className="text-sm text-muted-foreground">
                      {location.state},{" "}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
