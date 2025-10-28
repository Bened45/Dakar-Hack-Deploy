import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Clock, Bus } from "lucide-react";
import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { format } from "date-fns";
import routeDakar from "@/assets/route-dakar.jpg";
import routeBamako from "@/assets/route-bamako.jpg";
import routeAbidjan from "@/assets/route-abidjan.jpg";
import { Trip } from "@/schemas"; // Importer le type Trip de nos schémas
import { useFavorites } from "@/hooks/useFavorites";
import ShareButton from "@/components/ShareButton";

interface Schedule extends Trip {} // Étendre notre interface avec le type du schéma

interface RouteCardProps {
  schedule: Schedule;
}

const RouteCard = ({ schedule }: RouteCardProps) => {
  const { selectTrip } = useBooking();
  const [favorites, addFavorite, removeFavorite, isFavorite] = useFavorites();
  
  const handleClick = () => {
    console.log("Selecting trip:", schedule);
    selectTrip(schedule);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(schedule.id)) {
      removeFavorite(schedule.id);
    } else {
      addFavorite(schedule);
    }
  };

  // Extraire les propriétés avec des valeurs par défaut
  const { 
    origin = "Origine inconnue", 
    destination = "Destination inconnue", 
    duration = 0,
    price = 0, 
    departure_time = new Date().toISOString(), 
    agency_name: agencyName = "Agence inconnue",
    agency_rating: agencyRating
  } = schedule || {};
  
  // Placeholder for rating, as it's not in the schedule object yet
  const rating = agencyRating || 4.5; 
  
  // Select image based on route
  let image = routeDakar; // Default image
  if (origin?.toLowerCase().includes('dakar') && destination?.toLowerCase().includes('bamako')) {
    image = routeBamako;
  } else if (origin?.toLowerCase().includes('bamako') && destination?.toLowerCase().includes('abidjan')) {
    image = routeAbidjan;
  } else if (origin?.toLowerCase().includes('abidjan') && destination?.toLowerCase().includes('dakar')) {
    image = routeDakar;
  }

  // Format accessibility labels
  const departureTime = departure_time ? format(new Date(departure_time), "HH:mm") : "Heure non disponible";
  const departureDate = departure_time ? format(new Date(departure_time), "MMM dd, yyyy") : "Date non disponible";
  const priceLabel = price ? `${price.toLocaleString()} CFA` : "Prix non disponible";
  const durationLabel = `${duration} minutes`;
  const ratingLabel = `${rating.toFixed(1)} sur 5 étoiles`;

  return (
    <div 
      className="group bg-gradient-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-scale-in"
      role="article"
      aria-label={`Trajet de ${origin} à ${destination}, départ à ${departureTime}, prix ${priceLabel}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={`Paysage du trajet de ${origin} à ${destination}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={handleFavoriteClick}
            aria-label={isFavorite(schedule.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Star 
              className={`h-4 w-4 ${isFavorite(schedule.id) ? "fill-yellow-400 text-yellow-400" : "text-white"}`} 
              aria-hidden="true"
            />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-lg">{origin}</p>
              <div className="flex items-center gap-2 text-white/90">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                <p className="text-lg">{destination}</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-white font-bold text-lg">{price ? price.toLocaleString() : "Prix non disponible"}</p>
              <p className="text-white/80 text-xs">CFA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-medium">{agencyName}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" aria-label={`Note de l'agence: ${ratingLabel}`}>
              <Star className="h-4 w-4 fill-secondary text-secondary" aria-hidden="true" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
              <span className="sr-only">{ratingLabel}</span>
            </div>
            <ShareButton 
              url={`${window.location.origin}/search?origin=${origin}&destination=${destination}`}
              title={`Trajet de ${origin} à ${destination} sur bitTravel`}
              className="h-8 w-8 p-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{departureTime}</span>
          </div>
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
          <span>{departureDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm">{durationLabel}</span>
          </div>
          <Link to="/trip-details" onClick={handleClick}>
            <Button 
              size="sm" 
              className="bg-gradient-hero hover:opacity-90"
              aria-label={`Réserver maintenant le trajet de ${origin} à ${destination}`}
            >
              Réserver maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
