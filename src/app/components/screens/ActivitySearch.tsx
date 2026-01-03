import { useState } from 'react';
import { Search, MapPin, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTrips } from '../../contexts/TripContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

const citiesByRegion: Record<string, Array<{ name: string; country: string; avgCost: number; image: string; region: string }>> = {
  all: [
    { name: 'Paris', country: 'France', avgCost: 11250, image: 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=300', region: 'europe' },
    { name: 'Tokyo', country: 'Japan', avgCost: 13500, image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=300', region: 'asia' },
    { name: 'New York', country: 'USA', avgCost: 15000, image: 'https://images.unsplash.com/photo-1550399504-8953e1a6ac87?w=300', region: 'americas' },
    { name: 'Barcelona', country: 'Spain', avgCost: 9750, image: 'https://images.unsplash.com/photo-1663524962768-ef47bbdb11ef?w=300', region: 'europe' },
    { name: 'Bangkok', country: 'Thailand', avgCost: 6750, image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=300', region: 'asia' },
    { name: 'Dubai', country: 'UAE', avgCost: 12000, image: 'https://images.unsplash.com/photo-1550399504-8953e1a6ac87?w=300', region: 'asia' },
    { name: 'London', country: 'UK', avgCost: 13500, image: 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=300', region: 'europe' },
    { name: 'Sydney', country: 'Australia', avgCost: 14250, image: 'https://images.unsplash.com/photo-1550399504-8953e1a6ac87?w=300', region: 'oceania' }
  ],
  europe: [],
  asia: [],
  americas: [],
  africa: [],
  oceania: []
};

// Initialize regional arrays
citiesByRegion.europe = citiesByRegion.all.filter(c => c.region === 'europe');
citiesByRegion.asia = citiesByRegion.all.filter(c => c.region === 'asia');
citiesByRegion.americas = citiesByRegion.all.filter(c => c.region === 'americas');
citiesByRegion.africa = citiesByRegion.all.filter(c => c.region === 'africa');
citiesByRegion.oceania = citiesByRegion.all.filter(c => c.region === 'oceania');

const activities = [
  { name: 'Eiffel Tower Visit', city: 'Paris', cost: 3750, duration: '2-3 hours', type: 'Sightseeing', region: 'europe' },
  { name: 'Louvre Museum', city: 'Paris', cost: 3375, duration: '3-4 hours', type: 'Culture', region: 'europe' },
  { name: 'Seine River Cruise', city: 'Paris', cost: 4500, duration: '1-2 hours', type: 'Leisure', region: 'europe' },
  { name: 'Tokyo Tower', city: 'Tokyo', cost: 2250, duration: '1-2 hours', type: 'Sightseeing', region: 'asia' },
  { name: 'Tsukiji Fish Market', city: 'Tokyo', cost: 0, duration: '2-3 hours', type: 'Food', region: 'asia' },
  { name: 'Central Park', city: 'New York', cost: 0, duration: '2-4 hours', type: 'Leisure', region: 'americas' },
  { name: 'Grand Palace Visit', city: 'Bangkok', cost: 750, duration: '3 hours', type: 'Culture', region: 'asia' },
  { name: 'Sagrada Familia Tour', city: 'Barcelona', cost: 2625, duration: '2 hours', type: 'Culture', region: 'europe' }
];

export default function ActivitySearch() {
  const navigate = useNavigate();
  const { trips, addCityToTrip, addActivityToCity } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');
  const [costRange, setCostRange] = useState([0, 20000]);
  const [activityType, setActivityType] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [selectedItemToAdd, setSelectedItemToAdd] = useState<any>(null);
  const [addingType, setAddingType] = useState<'city' | 'activity'>('city');
  const [isAdding, setIsAdding] = useState(false);

  const filteredCities = (selectedRegion === 'all' ? citiesByRegion.all : citiesByRegion[selectedRegion] || [])
    .filter(city => 
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCost = activity.cost >= costRange[0] && activity.cost <= costRange[1];
    const matchesType = activityType === 'all' || activity.type === activityType;
    const matchesRegion = selectedRegion === 'all' || activity.region === selectedRegion;
    return matchesSearch && matchesCost && matchesType && matchesRegion;
  });

  const handleAddCity = (city: typeof filteredCities[0]) => {
    setSelectedItemToAdd(city);
    setAddingType('city');
  };

  const handleAddActivity = (activity: typeof activities[0]) => {
    setSelectedItemToAdd(activity);
    setAddingType('activity');
  };

  const confirmAdd = () => {
    if (!selectedTripId || !selectedItemToAdd) {
      toast.error('Please select a trip');
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      if (addingType === 'city') {
        addCityToTrip(selectedTripId, {
          name: selectedItemToAdd.name,
          country: selectedItemToAdd.country,
          startDate: '',
          endDate: '',
          activities: []
        });
        toast.success(`${selectedItemToAdd.name} added to your trip!`, {
          description: 'You can now add dates and activities in the Itinerary Builder.',
          action: {
            label: 'Edit Trip',
            onClick: () => navigate(`/itinerary-builder/${selectedTripId}`)
          }
        });
      } else {
        // For activities, we need to add to a city - for now, add to the first city
        const trip = trips.find(t => t.id.toString() === selectedTripId);
        if (trip && trip.cities.length > 0) {
          addActivityToCity(selectedTripId, trip.cities[0].id, {
            time: '09:00',
            name: selectedItemToAdd.name,
            cost: selectedItemToAdd.cost,
            type: selectedItemToAdd.type,
            duration: selectedItemToAdd.duration
          });
          toast.success(`${selectedItemToAdd.name} added to ${trip.cities[0].name}!`, {
            description: 'View it in the Itinerary Builder.',
            action: {
              label: 'Edit Trip',
              onClick: () => navigate(`/itinerary-builder/${selectedTripId}`)
            }
          });
        } else {
          toast.error('Please add a city to this trip first');
        }
      }

      setIsAdding(false);
      setSelectedItemToAdd(null);
      setSelectedTripId('');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Search & Discover</h1>
          <p className="text-gray-600">Find cities and activities for your next trip</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cities or activities..."
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="mb-3 block">Country/Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="americas">Americas</SelectItem>
                      <SelectItem value="africa">Africa</SelectItem>
                      <SelectItem value="oceania">Oceania</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedRegion === 'all' ? 'Showing all regions' : `Filtered by ${selectedRegion}`}
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">Cost Range (INR)</Label>
                  <Slider
                    value={costRange}
                    onValueChange={setCostRange}
                    max={20000}
                    step={500}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{costRange[0].toLocaleString()}</span>
                    <span>₹{costRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <Label>Activity Type</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Sightseeing">Sightseeing</SelectItem>
                      <SelectItem value="Culture">Culture</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Leisure">Leisure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-900">
                💡 Use filters to narrow down your search and find the perfect destinations!
              </p>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="cities">
              <TabsList className="mb-6">
                <TabsTrigger value="cities">Cities ({filteredCities.length})</TabsTrigger>
                <TabsTrigger value="activities">Activities ({filteredActivities.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="cities">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCities.map((city, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-all group">
                      <div className="h-48 overflow-hidden">
                        <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="text-xl mb-1">{city.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{city.country}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            Avg: ₹{city.avgCost.toLocaleString()}/day
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-teal-600 hover:bg-teal-700 transition-colors"
                                onClick={() => handleAddCity(city)}
                              >
                                <Plus size={16} className="mr-1" />
                                Add to Trip
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add {selectedItemToAdd?.name} to Trip</DialogTitle>
                                <DialogDescription>
                                  Select which trip you want to add this {addingType} to.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <Label>Select Trip</Label>
                                  <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                                    <SelectTrigger className="mt-2">
                                      <SelectValue placeholder="Choose a trip..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {trips.map(trip => (
                                        <SelectItem key={trip.id} value={trip.id.toString()}>
                                          {trip.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {trips.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                      No trips found. <button onClick={() => navigate('/plan-trip')} className="text-teal-600 hover:underline">Create one first</button>
                                    </p>
                                  )}
                                </div>
                                <Button 
                                  onClick={confirmAdd} 
                                  className="w-full bg-teal-600 hover:bg-teal-700"
                                  disabled={!selectedTripId || isAdding}
                                >
                                  {isAdding ? 'Adding...' : `Add to Trip`}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredCities.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <p>No cities found matching your criteria</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activities">
                <div className="space-y-4">
                  {filteredActivities.map((activity, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg mb-2">{activity.name}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin size={16} className="mr-1" />
                                {activity.city}
                              </div>
                              <div className="flex items-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                {activity.cost === 0 ? 'Free' : `₹${activity.cost.toLocaleString()}`}
                              </div>
                              <div className="flex items-center">
                                <Clock size={16} className="mr-1" />
                                {activity.duration}
                              </div>
                              <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                                {activity.type}
                              </span>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-teal-600 hover:bg-teal-700 ml-4"
                                onClick={() => handleAddActivity(activity)}
                              >
                                <Plus size={16} className="mr-1" />
                                Add
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add {selectedItemToAdd?.name}</DialogTitle>
                                <DialogDescription>
                                  Select which trip you want to add this activity to.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <Label>Select Trip</Label>
                                  <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                                    <SelectTrigger className="mt-2">
                                      <SelectValue placeholder="Choose a trip..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {trips.filter(t => t.cities.length > 0).map(trip => (
                                        <SelectItem key={trip.id} value={trip.id.toString()}>
                                          {trip.name} ({trip.cities.length} cities)
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {trips.filter(t => t.cities.length > 0).length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                      No trips with cities found. Please add cities to your trips first.
                                    </p>
                                  )}
                                </div>
                                <Button 
                                  onClick={confirmAdd} 
                                  className="w-full bg-teal-600 hover:bg-teal-700"
                                  disabled={!selectedTripId || isAdding}
                                >
                                  {isAdding ? 'Adding...' : 'Add to Trip'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredActivities.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <p>No activities found matching your criteria</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
