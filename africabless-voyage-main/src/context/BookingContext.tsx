import { createContext, useContext, useState, ReactNode } from 'react';
import { Trip, PassengerInfo } from '@/schemas'; // Importer les types de nos schémas

// Define the shape of the context data
interface BookingContextType {
  selectedTrip: Trip | null; // Utiliser le type Trip de nos schémas
  passengerInfo: PassengerInfo | null; // Utiliser le type PassengerInfo de nos schémas
  totalAmount: number;
  reservationId: string | null;
  ticketId: string | null;
  selectTrip: (trip: Trip) => void; // Utiliser le type Trip de nos schémas
  setPassengerInfo: (info: PassengerInfo) => void; // Utiliser le type PassengerInfo de nos schémas
  setTotalAmount: (amount: number) => void;
  setReservationId: (id: string) => void;
  setTicketId: (id: string) => void;
  resetBooking: () => void;
}

// Create the context with a default value
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Create the provider component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null); // Utiliser le type Trip de nos schémas
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo | null>(null); // Utiliser le type PassengerInfo de nos schémas
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const selectTrip = (trip: Trip) => { // Utiliser le type Trip de nos schémas
    setSelectedTrip(trip);
  };

  const resetBooking = () => {
    setSelectedTrip(null);
    setPassengerInfo(null);
    setTotalAmount(0);
    setReservationId(null);
    setTicketId(null);
  };

  const value = {
    selectedTrip,
    passengerInfo,
    totalAmount,
    reservationId,
    ticketId,
    selectTrip,
    setPassengerInfo,
    setTotalAmount,
    setReservationId,
    setTicketId,
    resetBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
