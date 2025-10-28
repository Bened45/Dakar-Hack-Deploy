import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { User, Menu, PanelLeft, LogOut, Ticket, UserCircle, Bitcoin, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth(); // Get user object
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        // Using CoinGecko API to get Bitcoin price in USD
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        setBitcoinPrice(data.bitcoin.usd);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        setLoading(false);
      }
    };

    // Fetch immediately on component mount
    fetchBitcoinPrice();

    // Set up interval to fetch every 60 seconds
    const interval = setInterval(fetchBitcoinPrice, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Changer le style de la navbar quand l'utilisateur scroll
    setIsScrolled(scrollPosition.scrollY > 10);
  }, [scrollPosition.scrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b-border/40' : 'bg-transparent border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105" aria-label="Accueil bitTravel">
            <img src={logo} alt="bitTravel Logo" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Navigation principale">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary" aria-current="page">
              Accueil
            </Link>
            <Link to="/search" className="text-sm font-medium transition-colors hover:text-primary">
              Rechercher des voyages
            </Link>
            {isLoggedIn && user?.role === 'client' && ( // Only show for logged-in clients
              <Link to="/my-bookings" className="text-sm font-medium transition-colors hover:text-primary">
                Mes Réservations
              </Link>
            )}
            {!isLoggedIn && ( // Only show if not logged in
              <Link to="/agency/login" className="text-sm font-medium transition-colors hover:text-primary">
                Agence
              </Link>
            )}
            {isLoggedIn && user?.role === 'agency' && ( // Show agency dashboard link for logged-in agencies
              <Link to="/agency/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Tableau de Bord Agence
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {/* Bitcoin price display */}
            <div className="hidden md:flex items-center gap-1 bg-muted px-3 py-1 rounded-full" role="status" aria-label="Prix du Bitcoin">
              <Bitcoin className="h-4 w-4 text-orange-500" aria-hidden="true" />
              {loading ? (
                <span className="text-xs text-muted-foreground">Chargement...</span>
              ) : bitcoinPrice ? (
                <span className="text-xs font-medium">${bitcoinPrice.toLocaleString()}</span>
              ) : (
                <span className="text-xs text-muted-foreground">Indisponible</span>
              )}
            </div>

            {/* Conditional rendering based on login state */}
            {isLoggedIn ? (
              <>
                {user?.role === 'client' ? (
                  <>
                    <Link to="/my-bookings" className="hidden md:flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                      <Ticket className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden lg:inline">Mes Réservations</span>
                    </Link>
                    <Link to="/profile" className="hidden md:flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                      <UserCircle className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden lg:inline">Profil</span>
                    </Link>
                    <Link to="/my-bookings">
                      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Mes Réservations">
                        <Ticket className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Profil">
                        <UserCircle className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/profile">
                    <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Profil">
                      <User className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </Link>
                )}
                <Button 
                  size="sm" 
                  className="bg-gradient-hero hover:opacity-90" 
                  onClick={logout}
                  aria-label="Déconnexion"
                >
                  <LogOut className="h-4 w-4 mr-2" aria-hidden="true" /> 
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Connexion">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-hero hover:opacity-90">
                    <span className="hidden sm:inline">S'inscrire</span>
                    <span className="sm:hidden">Inscription</span>
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
                  {isMenuOpen ? (
                    <X className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <PanelLeft className="h-6 w-6" aria-hidden="true" />
                    <span className="text-lg font-semibold">Menu</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeMenu} aria-label="Fermer le menu">
                    <X className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-4" role="navigation" aria-label="Navigation mobile">
                  <SheetClose asChild>
                    <Link to="/" className="text-lg font-medium transition-colors hover:text-primary" onClick={closeMenu}>
                      Accueil
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/search" className="text-lg font-medium transition-colors hover:text-primary" onClick={closeMenu}>
                      Rechercher des voyages
                    </Link>
                  </SheetClose>
                  {isLoggedIn && user?.role === 'client' && (
                    <>
                      <SheetClose asChild>
                        <Link to="/my-bookings" className="text-lg font-medium transition-colors hover:text-primary flex items-center gap-2" onClick={closeMenu}>
                          <Ticket className="h-5 w-5" aria-hidden="true" />
                          Mes Réservations
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/profile" className="text-lg font-medium transition-colors hover:text-primary flex items-center gap-2" onClick={closeMenu}>
                          <UserCircle className="h-5 w-5" aria-hidden="true" />
                          Profil
                        </Link>
                      </SheetClose>
                    </>
                  )}
                  {!isLoggedIn && (
                    <SheetClose asChild>
                      <Link to="/agency/login" className="text-lg font-medium transition-colors hover:text-primary" onClick={closeMenu}>
                        Agence
                      </Link>
                    </SheetClose>
                  )}
                  {isLoggedIn && user?.role === 'agency' && (
                    <SheetClose asChild>
                      <Link to="/agency/dashboard" className="text-lg font-medium transition-colors hover:text-primary" onClick={closeMenu}>
                        Tableau de Bord Agence
                      </Link>
                    </SheetClose>
                  )}
                  {isLoggedIn && (
                    <SheetClose asChild>
                      <Button 
                        variant="outline" 
                        className="justify-start mt-4"
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        aria-label="Déconnexion"
                      >
                        <LogOut className="h-4 w-4 mr-2" aria-hidden="true" /> Déconnexion
                      </Button>
                    </SheetClose>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;