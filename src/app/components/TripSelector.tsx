import { useTrips } from '../contexts/TripContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { MapPin } from 'lucide-react';

/**
 * Trip Selector Component
 * Allows users to select which trip to view across all screens
 * Ensures trip-specific state consistency across the app
 */
export default function TripSelector() {
  const { trips, activeTrip, setActiveTrip, getTripById } = useTrips();

  const handleTripChange = (tripId: string) => {
    if (tripId === 'none') {
      setActiveTrip(null);
    } else {
      const trip = getTripById(tripId);
      if (trip) {
        setActiveTrip(trip);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <MapPin size={18} className="text-teal-600" />
      <Select 
        value={activeTrip?.id.toString() || 'none'} 
        onValueChange={handleTripChange}
      >
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Select a trip" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <span className="text-gray-500">No trip selected</span>
          </SelectItem>
          {trips.map((trip) => (
            <SelectItem key={trip.id} value={trip.id.toString()}>
              <div className="flex items-center gap-2">
                <span>{trip.name}</span>
                <span className="text-xs text-gray-500">
                  ({trip.cities.length} cities)
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
