import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, CalendarIcon, Clock, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { useRecentSearches } from "@/hooks/useRecentSearches";

interface SearchBarProps {
  variant?: "hero" | "compact";
}

const SearchBar = ({ variant = "hero" }: SearchBarProps) => {
  const [date, setDate] = useState<Date>();
  const [origin, setOrigin] = useState(""); // Renamed from 'from'
  const [destination, setDestination] = useState(""); // Renamed from 'to'
  const [minPrice, setMinPrice] = useState<string>(""); // New state for min price
  const [maxPrice, setMaxPrice] = useState<string>(""); // New state for max price
  const navigate = useNavigate();
  const { toast } = useToast();
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const minPriceRef = useRef<HTMLInputElement>(null);
  const maxPriceRef = useRef<HTMLInputElement>(null);
  const [recentSearches, addSearch, clearSearches] = useRecentSearches();
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  const handleSearch = () => {
    if (!origin || !destination) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir les champs de départ et de destination.",
        variant: "destructive",
      });
      return;
    }
    
    // Ajouter la recherche à l'historique
    addSearch(origin, destination, date ? format(date, "yyyy-MM-dd") : "");
    
    const params = new URLSearchParams();
    params.append("origin", origin);
    params.append("destination", destination);
    if (date) {
      params.append("date", format(date, "yyyy-MM-dd")); // Format date for backend
    }
    if (minPrice) {
      params.append("min_price", minPrice);
    }
    if (maxPrice) {
      params.append("max_price", maxPrice);
    }
    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRecentSearchClick = (search: { origin: string; destination: string; date: string }) => {
    setOrigin(search.origin);
    setDestination(search.destination);
    if (search.date) {
      setDate(new Date(search.date));
    }
    setShowRecentSearches(false);
  };

  const isHero = variant === "hero";

  return (
    <div
      className={`w-full ${
        isHero ? "bg-card shadow-elevated rounded-2xl p-6" : "bg-card shadow-card rounded-xl p-4"
      } animate-fade-in`}
      onKeyDown={handleKeyPress}
      role="search"
      aria-label="Recherche de trajets"
    >
      <div className={`grid gap-4 ${isHero ? "md:grid-cols-4" : "md:grid-cols-6"}`}> {/* Adjusted grid columns */}
        <div className="relative">
          <label htmlFor="origin" className="text-xs font-medium text-muted-foreground mb-1.5 block">De</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="origin"
              ref={originRef}
              placeholder="Ville de départ"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              onFocus={() => setShowRecentSearches(true)}
              className="pl-10"
              aria-required="true"
              aria-describedby="origin-help"
            />
            {recentSearches.length > 0 && showRecentSearches && (
              <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg">
                <div className="p-2 border-b flex justify-between items-center">
                  <span className="text-sm font-medium">Recherches récentes</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearSearches}
                    aria-label="Effacer l'historique des recherches"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {recentSearches.map((search) => (
                    <div
                      key={search.id}
                      className="p-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => handleRecentSearchClick(search)}
                      aria-label={`Rechercher ${search.origin} vers ${search.destination}`}
                    >
                      <div className="font-medium">{search.origin} → {search.destination}</div>
                      {search.date && (
                        <div className="text-muted-foreground text-xs">
                          {format(new Date(search.date), "PPP", { locale: fr })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div id="origin-help" className="sr-only">Entrez la ville de départ</div>
        </div>

        <div className="relative">
          <label htmlFor="destination" className="text-xs font-medium text-muted-foreground mb-1.5 block">À</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="destination"
              ref={destinationRef}
              placeholder="Ville de destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
              aria-required="true"
              aria-describedby="destination-help"
            />
          </div>
          <div id="destination-help" className="sr-only">Entrez la ville de destination</div>
        </div>

        <div className="relative">
          <label htmlFor="date" className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button id="date" variant="outline" className="w-full justify-start text-left font-normal" aria-describedby="date-help">
                <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={fr} />
            </PopoverContent>
          </Popover>
          <div id="date-help" className="sr-only">Sélectionnez la date de voyage</div>
        </div>

        <div className="relative">
          <label htmlFor="minPrice" className="text-xs font-medium text-muted-foreground mb-1.5 block">Prix Min</label>
          <Input
            id="minPrice"
            ref={minPriceRef}
            type="number"
            placeholder="Prix minimum"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            aria-describedby="minPrice-help"
          />
          <div id="minPrice-help" className="sr-only">Entrez le prix minimum (optionnel)</div>
        </div>

        <div className="relative">
          <label htmlFor="maxPrice" className="text-xs font-medium text-muted-foreground mb-1.5 block">Prix Max</label>
          <Input
            id="maxPrice"
            ref={maxPriceRef}
            type="number"
            placeholder="Prix maximum"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-describedby="maxPrice-help"
          />
          <div id="maxPrice-help" className="sr-only">Entrez le prix maximum (optionnel)</div>
        </div>

        <Button
          className="bg-gradient-hero hover:opacity-90 mt-auto h-10"
          onClick={handleSearch}
          aria-label="Rechercher des trajets"
        >
          <Search className="h-4 w-4 mr-2" aria-hidden="true" />
          Rechercher
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
