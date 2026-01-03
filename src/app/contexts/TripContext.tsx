import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Activity {
  id: number;
  time: string;
  name: string;
  cost: number; // System-calculated or predefined activity cost
  type?: string;
  duration?: string;
}

export interface City {
  id: number;
  name: string;
  country?: string;
  startDate: string;
  endDate: string;
  activities: Activity[];
  latitude?: number; // For distance calculation
  longitude?: number;
  costIndex?: number; // City cost index (1-10, higher = more expensive)
}

/**
 * Trip interface - Budget auto-calculated from city distance + activities
 * Trip-specific state — do not reuse globally
 */
export interface Trip {
  id: number | string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  budget: number; // AUTO-CALCULATED - Do not allow manual input
  cities: City[];
  image?: string;
  status: 'upcoming' | 'ongoing' | 'past';
  isPublic?: boolean;
  isCopied?: boolean;
  originalCreator?: string;
}

export interface CostBreakdown {
  transport: number; // Based on inter-city distances
  accommodation: number; // Based on city cost index × days
  food: number; // Based on city cost index × days
  activities: number; // Sum of all activity costs
  total: number;
}

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip | null; // Currently selected trip
  setActiveTrip: (trip: Trip | null) => void;
  addTrip: (trip: Omit<Trip, 'id' | 'budget'>) => Trip;
  updateTrip: (id: number | string, updates: Partial<Trip>) => void;
  deleteTrip: (id: number | string) => void;
  getTripById: (id: number | string) => Trip | undefined;
  copyTrip: (trip: Trip) => Trip;
  addCityToTrip: (tripId: number | string, city: Omit<City, 'id'>) => void;
  addActivityToCity: (tripId: number | string, cityId: number, activity: Omit<Activity, 'id'>) => void;
  calculateTripBudget: (trip: Trip) => number;
  getCostBreakdown: (trip: Trip) => CostBreakdown;
  getDistanceBetweenCities: (city1: City, city2: City) => number;
  getTransportMode: (distance: number) => 'Train' | 'Flight' | 'Bus';
}

const TripContext = createContext<TripContextType | undefined>(undefined);

// City location database for distance calculation
const CITY_LOCATIONS: Record<string, { lat: number; lng: number; costIndex: number }> = {
  'Paris': { lat: 48.8566, lng: 2.3522, costIndex: 8 },
  'Rome': { lat: 41.9028, lng: 12.4964, costIndex: 7 },
  'Barcelona': { lat: 41.3851, lng: 2.1734, costIndex: 7 },
  'Maldives': { lat: 3.2028, lng: 73.2207, costIndex: 9 },
  'Bali': { lat: -8.3405, lng: 115.0920, costIndex: 5 },
  'Swiss Alps': { lat: 46.8182, lng: 8.2275, costIndex: 10 },
  'Austrian Mountains': { lat: 47.2692, lng: 11.4041, costIndex: 8 },
  'Delhi': { lat: 28.6139, lng: 77.2090, costIndex: 4 },
  'Mumbai': { lat: 19.0760, lng: 72.8777, costIndex: 5 },
  'Goa': { lat: 15.2993, lng: 74.1240, costIndex: 5 },
  'Jaipur': { lat: 26.9124, lng: 75.7873, costIndex: 4 },
  'Agra': { lat: 27.1767, lng: 78.0081, costIndex: 3 },
  'Varanasi': { lat: 25.3176, lng: 82.9739, costIndex: 3 },
  'Udaipur': { lat: 24.5854, lng: 73.7125, costIndex: 4 },
  'Manali': { lat: 32.2432, lng: 77.1892, costIndex: 5 },
  'Leh': { lat: 34.1526, lng: 77.5771, costIndex: 6 },
  'Shimla': { lat: 31.1048, lng: 77.1734, costIndex: 5 },
  'Rishikesh': { lat: 30.0869, lng: 78.2676, costIndex: 4 },
  'Amritsar': { lat: 31.6340, lng: 74.8723, costIndex: 4 },
  'Kolkata': { lat: 22.5726, lng: 88.3639, costIndex: 4 },
  'Darjeeling': { lat: 27.0410, lng: 88.2663, costIndex: 5 },
  'London': { lat: 51.5074, lng: -0.1278, costIndex: 9 },
  'Amsterdam': { lat: 52.3676, lng: 4.9041, costIndex: 8 },
  'Prague': { lat: 50.0755, lng: 14.4378, costIndex: 6 },
  'Vienna': { lat: 48.2082, lng: 16.3738, costIndex: 7 },
  'Kyoto': { lat: 35.0116, lng: 135.7681, costIndex: 7 },
  'Tokyo': { lat: 35.6762, lng: 139.6503, costIndex: 8 },
  'Dubai': { lat: 25.2048, lng: 55.2708, costIndex: 9 },
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate transport cost based on distance
 * Formula: Base cost + (distance × per km rate)
 */
function calculateTransportCost(distance: number): number {
  if (distance < 200) {
    // Bus: ₹10/km
    return Math.round(distance * 10);
  } else if (distance < 800) {
    // Train: ₹8/km + ₹500 base
    return Math.round(500 + distance * 8);
  } else {
    // Flight: ₹5/km + ₹2000 base
    return Math.round(2000 + distance * 5);
  }
}

/**
 * Calculate accommodation cost
 * Formula: City cost index × 1000 × number of nights
 */
function calculateAccommodationCost(city: City): number {
  const location = CITY_LOCATIONS[city.name];
  const costIndex = location?.costIndex || 5;
  const nights = Math.ceil((new Date(city.endDate).getTime() - new Date(city.startDate).getTime()) / (1000 * 60 * 60 * 24));
  return Math.round(costIndex * 1000 * Math.max(nights, 1));
}

/**
 * Calculate food cost
 * Formula: City cost index × 500 × number of days
 */
function calculateFoodCost(city: City): number {
  const location = CITY_LOCATIONS[city.name];
  const costIndex = location?.costIndex || 5;
  const days = Math.ceil((new Date(city.endDate).getTime() - new Date(city.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.round(costIndex * 500 * Math.max(days, 1));
}

// Helper function to enrich cities with location data
function enrichCityWithLocation(city: City): City {
  const location = CITY_LOCATIONS[city.name];
  return {
    ...city,
    latitude: location?.lat || city.latitude || 0,
    longitude: location?.lng || city.longitude || 0,
    costIndex: location?.costIndex || city.costIndex || 5,
  };
}

// Mock initial trips
const mockTrips: Trip[] = [
  {
    id: 1,
    name: 'European Adventure',
    startDate: '2026-06-15',
    endDate: '2026-06-30',
    description: 'Exploring the best of Europe',
    budget: 262500,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    cities: [
      {
        id: 1,
        name: 'Paris',
        country: 'France',
        startDate: '2026-06-15',
        endDate: '2026-06-20',
        activities: [
          { id: 1, time: '09:00', name: 'Visit Eiffel Tower', cost: 3750, type: 'Sightseeing' },
          { id: 2, time: '14:00', name: 'Louvre Museum', cost: 3375, type: 'Culture' }
        ]
      },
      {
        id: 2,
        name: 'Rome',
        country: 'Italy',
        startDate: '2026-06-21',
        endDate: '2026-06-25',
        activities: [
          { id: 3, time: '10:00', name: 'Colosseum Tour', cost: 4500, type: 'Sightseeing' }
        ]
      },
      {
        id: 3,
        name: 'Barcelona',
        country: 'Spain',
        startDate: '2026-06-26',
        endDate: '2026-06-30',
        activities: []
      }
    ]
  },
  {
    id: 2,
    name: 'Beach Paradise',
    startDate: '2026-08-10',
    endDate: '2026-08-20',
    description: 'Relaxing beach vacation',
    budget: 210000,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    cities: [
      {
        id: 4,
        name: 'Maldives',
        startDate: '2026-08-10',
        endDate: '2026-08-15',
        activities: []
      },
      {
        id: 5,
        name: 'Bali',
        country: 'Indonesia',
        startDate: '2026-08-16',
        endDate: '2026-08-20',
        activities: []
      }
    ]
  },
  {
    id: 3,
    name: 'Mountain Trek',
    startDate: '2026-09-05',
    endDate: '2026-09-15',
    description: 'Adventure in the mountains',
    budget: 315000,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    cities: [
      {
        id: 6,
        name: 'Swiss Alps',
        country: 'Switzerland',
        startDate: '2026-09-05',
        endDate: '2026-09-10',
        activities: []
      },
      {
        id: 7,
        name: 'Austrian Mountains',
        country: 'Austria',
        startDate: '2026-09-11',
        endDate: '2026-09-15',
        activities: []
      }
    ]
  },
  {
    id: 4,
    name: 'Golden Triangle Explorer',
    startDate: '2026-03-20',
    endDate: '2026-03-28',
    description: 'Historic journey through India',
    budget: 85000,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
    cities: [
      {
        id: 8,
        name: 'Delhi',
        country: 'India',
        startDate: '2026-03-20',
        endDate: '2026-03-22',
        activities: []
      },
      {
        id: 9,
        name: 'Agra',
        country: 'India',
        startDate: '2026-03-23',
        endDate: '2026-03-25',
        activities: []
      },
      {
        id: 10,
        name: 'Jaipur',
        country: 'India',
        startDate: '2026-03-26',
        endDate: '2026-03-28',
        activities: []
      }
    ]
  },
  {
    id: 5,
    name: 'Japan Culture Tour',
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    description: 'Cherry blossom season in Japan',
    budget: 285000,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400',
    cities: [
      {
        id: 11,
        name: 'Tokyo',
        country: 'Japan',
        startDate: '2026-04-10',
        endDate: '2026-04-14',
        activities: []
      },
      {
        id: 12,
        name: 'Kyoto',
        country: 'Japan',
        startDate: '2026-04-15',
        endDate: '2026-04-20',
        activities: []
      }
    ]
  },
  {
    id: 6,
    name: 'Goa Beach Getaway',
    startDate: '2025-12-15',
    endDate: '2025-12-22',
    description: 'Relaxation by the Arabian Sea',
    budget: 45000,
    status: 'past',
    image: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=400',
    cities: [
      {
        id: 13,
        name: 'Goa',
        country: 'India',
        startDate: '2025-12-15',
        endDate: '2025-12-22',
        activities: []
      }
    ]
  },
  {
    id: 7,
    name: 'Rajasthan Heritage Trail',
    startDate: '2025-10-05',
    endDate: '2025-10-15',
    description: 'Royal palaces and desert landscapes',
    budget: 95000,
    status: 'past',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400',
    cities: [
      {
        id: 14,
        name: 'Jaipur',
        country: 'India',
        startDate: '2025-10-05',
        endDate: '2025-10-08',
        activities: []
      },
      {
        id: 15,
        name: 'Udaipur',
        country: 'India',
        startDate: '2025-10-09',
        endDate: '2025-10-12',
        activities: []
      },
      {
        id: 16,
        name: 'Jaipur',
        country: 'India',
        startDate: '2025-10-13',
        endDate: '2025-10-15',
        activities: []
      }
    ]
  },
  {
    id: 8,
    name: 'London Weekend',
    startDate: '2025-08-20',
    endDate: '2025-08-23',
    description: 'Quick city break in London',
    budget: 125000,
    status: 'past',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
    cities: [
      {
        id: 17,
        name: 'London',
        country: 'UK',
        startDate: '2025-08-20',
        endDate: '2025-08-23',
        activities: []
      }
    ]
  }
];

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(
    mockTrips.map(trip => ({
      ...trip,
      cities: trip.cities.map(enrichCityWithLocation)
    }))
  );
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  // Auto-calculate budgets when trips change
  useEffect(() => {
    setTrips(prevTrips => prevTrips.map(trip => ({
      ...trip,
      budget: calculateTripBudget(trip)
    })));
  }, []);

  const addTrip = (tripData: Omit<Trip, 'id' | 'budget'>): Trip => {
    const enrichedCities = tripData.cities.map(enrichCityWithLocation);
    const tempTrip: Trip = {
      ...tripData,
      id: Date.now(),
      budget: 0,
      cities: enrichedCities
    };
    const budget = calculateTripBudget(tempTrip);
    const newTrip: Trip = {
      ...tempTrip,
      budget
    };
    setTrips(prev => [...prev, newTrip]);
    return newTrip;
  };

  const updateTrip = (id: number | string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === id) {
        const updatedTrip = { ...trip, ...updates };
        // Enrich cities with location data if cities were updated
        if (updates.cities) {
          updatedTrip.cities = updates.cities.map(enrichCityWithLocation);
        }
        // Recalculate budget
        updatedTrip.budget = calculateTripBudget(updatedTrip);
        return updatedTrip;
      }
      return trip;
    }));
  };

  const deleteTrip = (id: number | string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
    if (activeTrip?.id === id) {
      setActiveTrip(null);
    }
  };

  const getTripById = (id: number | string): Trip | undefined => {
    return trips.find(trip => trip.id.toString() === id.toString());
  };

  const copyTrip = (sourceTripData: Trip): Trip => {
    const copiedTrip: Trip = {
      ...sourceTripData,
      id: Date.now(),
      name: `${sourceTripData.name} (Copy)`,
      isCopied: true,
      cities: sourceTripData.cities.map(city => ({
        ...city,
        id: Date.now() + Math.random(),
        activities: city.activities.map(activity => ({
          ...activity,
          id: Date.now() + Math.random()
        }))
      }))
    };
    copiedTrip.budget = calculateTripBudget(copiedTrip);
    setTrips(prev => [...prev, copiedTrip]);
    return copiedTrip;
  };

  const addCityToTrip = (tripId: number | string, cityData: Omit<City, 'id'>) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        const enrichedCity = enrichCityWithLocation({
          ...cityData,
          id: Date.now(),
          activities: []
        });
        const updatedTrip = { ...trip, cities: [...trip.cities, enrichedCity] };
        updatedTrip.budget = calculateTripBudget(updatedTrip);
        return updatedTrip;
      }
      return trip;
    }));
  };

  const addActivityToCity = (tripId: number | string, cityId: number, activityData: Omit<Activity, 'id'>) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        const updatedTrip = {
          ...trip,
          cities: trip.cities.map(city => {
            if (city.id === cityId) {
              const newActivity: Activity = {
                ...activityData,
                id: Date.now()
              };
              return { ...city, activities: [...city.activities, newActivity] };
            }
            return city;
          })
        };
        updatedTrip.budget = calculateTripBudget(updatedTrip);
        return updatedTrip;
      }
      return trip;
    }));
  };

  /**
   * Calculate total budget for a trip
   * Formula: Sum of transport, accommodation, food, and activity costs
   */
  const calculateTripBudget = (trip: Trip): number => {
    const breakdown = getCostBreakdown(trip);
    return breakdown.total;
  };

  /**
   * Get cost breakdown for a trip
   */
  const getCostBreakdown = (trip: Trip): CostBreakdown => {
    let totalTransportCost = 0;
    let totalAccommodationCost = 0;
    let totalFoodCost = 0;
    let totalActivityCost = 0;

    for (let i = 0; i < trip.cities.length; i++) {
      const city = trip.cities[i];
      totalAccommodationCost += calculateAccommodationCost(city);
      totalFoodCost += calculateFoodCost(city);
      totalActivityCost += city.activities.reduce((sum, activity) => sum + activity.cost, 0);

      // Calculate transport to next city
      if (i < trip.cities.length - 1) {
        const nextCity = trip.cities[i + 1];
        const distance = haversineDistance(
          city.latitude || 0, 
          city.longitude || 0, 
          nextCity.latitude || 0, 
          nextCity.longitude || 0
        );
        totalTransportCost += calculateTransportCost(distance);
      }
    }

    return {
      transport: totalTransportCost,
      accommodation: totalAccommodationCost,
      food: totalFoodCost,
      activities: totalActivityCost,
      total: totalTransportCost + totalAccommodationCost + totalFoodCost + totalActivityCost
    };
  };

  /**
   * Get distance between two cities in kilometers
   */
  const getDistanceBetweenCities = (city1: City, city2: City): number => {
    return Math.round(haversineDistance(
      city1.latitude || 0, 
      city1.longitude || 0, 
      city2.latitude || 0, 
      city2.longitude || 0
    ));
  };

  /**
   * Get suggested transport mode based on distance
   */
  const getTransportMode = (distance: number): 'Train' | 'Flight' | 'Bus' => {
    if (distance < 200) {
      return 'Bus';
    } else if (distance < 800) {
      return 'Train';
    } else {
      return 'Flight';
    }
  };

  return (
    <TripContext.Provider value={{
      trips,
      activeTrip,
      setActiveTrip,
      addTrip,
      updateTrip,
      deleteTrip,
      getTripById,
      copyTrip,
      addCityToTrip,
      addActivityToCity,
      calculateTripBudget,
      getCostBreakdown,
      getDistanceBetweenCities,
      getTransportMode
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}