import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, GripVertical, Calendar, Trash2, Save, ArrowLeft } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useTrips, City, Activity } from '../../contexts/TripContext';
import { toast } from 'sonner';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTripById, updateTrip } = useTrips();
  
  const trip = getTripById(tripId || '');
  
  const [cities, setCities] = useState<City[]>(trip?.cities || []);
  const [selectedCity, setSelectedCity] = useState<City | null>(cities[0] || null);
  const [newCityName, setNewCityName] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update local state when trip changes
  useEffect(() => {
    if (trip) {
      setCities(trip.cities);
      if (trip.cities.length > 0 && !selectedCity) {
        setSelectedCity(trip.cities[0]);
      }
    }
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-gray-500 mb-4">Trip not found</p>
              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const addCity = () => {
    if (newCityName.trim()) {
      const newCity: City = {
        id: Date.now(),
        name: newCityName,
        startDate: '',
        endDate: '',
        activities: []
      };
      const updatedCities = [...cities, newCity];
      setCities(updatedCities);
      setNewCityName('');
      setShowAddCity(false);
      setSelectedCity(newCity);
      
      toast.success(`${newCityName} added to your trip!`);
    }
  };

  const addActivity = (cityId: number) => {
    const newActivity: Activity = {
      id: Date.now(),
      time: '09:00',
      name: '',
      cost: 0
    };
    
    const updatedCities = cities.map(city => 
      city.id === cityId 
        ? { ...city, activities: [...city.activities, newActivity] }
        : city
    );
    setCities(updatedCities);
    
    // Update selected city
    if (selectedCity?.id === cityId) {
      setSelectedCity({
        ...selectedCity,
        activities: [...selectedCity.activities, newActivity]
      });
    }
  };

  const deleteCity = (cityId: number) => {
    const cityToDelete = cities.find(c => c.id === cityId);
    setCities(cities.filter(city => city.id !== cityId));
    if (selectedCity?.id === cityId) {
      setSelectedCity(cities[0] || null);
    }
    toast.success(`${cityToDelete?.name} removed from trip`);
  };

  const deleteActivity = (cityId: number, activityId: number) => {
    const updatedCities = cities.map(city => 
      city.id === cityId
        ? { ...city, activities: city.activities.filter(a => a.id !== activityId) }
        : city
    );
    setCities(updatedCities);
    
    // Update selected city
    if (selectedCity?.id === cityId) {
      setSelectedCity({
        ...selectedCity,
        activities: selectedCity.activities.filter(a => a.id !== activityId)
      });
    }
  };

  const updateCityDates = (cityId: number, field: 'startDate' | 'endDate', value: string) => {
    const updatedCities = cities.map(city => 
      city.id === cityId ? { ...city, [field]: value } : city
    );
    setCities(updatedCities);
    
    if (selectedCity?.id === cityId) {
      setSelectedCity({ ...selectedCity, [field]: value });
    }
  };

  const updateActivity = (cityId: number, activityId: number, field: keyof Activity, value: string | number) => {
    const updatedCities = cities.map(city => 
      city.id === cityId
        ? {
            ...city,
            activities: city.activities.map(a => 
              a.id === activityId ? { ...a, [field]: value } : a
            )
          }
        : city
    );
    setCities(updatedCities);
    
    // Update selected city
    if (selectedCity?.id === cityId) {
      setSelectedCity({
        ...selectedCity,
        activities: selectedCity.activities.map(a => 
          a.id === activityId ? { ...a, [field]: value } : a
        )
      });
    }
  };

  const handleSave = () => {
    setSaving(true);
    
    // Save to context
    setTimeout(() => {
      updateTrip(trip.id, { cities });
      setSaving(false);
      toast.success('Itinerary saved successfully!');
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-3xl mb-2">{trip.name} - Itinerary Builder</h1>
            <p className="text-gray-600">Build your perfect trip itinerary</p>
          </div>
          <Button 
            className="bg-teal-600 hover:bg-teal-700" 
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save & Exit'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Cities List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Trip Stops ({cities.length})</CardTitle>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowAddCity(true)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cities.map((city, index) => (
                    <div
                      key={city.id}
                      onClick={() => setSelectedCity(city)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedCity?.id === city.id
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{city.name}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {city.startDate && city.endDate 
                                ? `${new Date(city.startDate).toLocaleDateString()} - ${new Date(city.endDate).toLocaleDateString()}`
                                : 'Set dates →'
                              }
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {city.activities.length} activities
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCity(city.id);
                          }}
                          className="hover:bg-red-50"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {showAddCity && (
                    <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg">
                      <Input
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                        placeholder="Enter city name"
                        className="mb-2"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && addCity()}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={addCity} className="flex-1 bg-teal-600 hover:bg-teal-700">
                          Add City
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddCity(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {cities.length === 0 && !showAddCity && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-3">No cities added yet</p>
                      <Button
                        size="sm"
                        onClick={() => setShowAddCity(true)}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Your First City
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                💡 Click on a city to view and edit its details and activities.
              </p>
            </div>
          </div>

          {/* Right Panel - City Details */}
          <div className="lg:col-span-2">
            {selectedCity ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCity.name} Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <div className="relative mt-2">
                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="date"
                            value={selectedCity.startDate}
                            onChange={(e) => updateCityDates(selectedCity.id, 'startDate', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <div className="relative mt-2">
                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="date"
                            value={selectedCity.endDate}
                            onChange={(e) => updateCityDates(selectedCity.id, 'endDate', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Activities ({selectedCity.activities.length})</CardTitle>
                      <Button 
                        size="sm"
                        onClick={() => addActivity(selectedCity.id)}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCity.activities.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p className="mb-3">No activities yet. Add your first activity!</p>
                          <Button
                            size="sm"
                            onClick={() => addActivity(selectedCity.id)}
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            <Plus size={16} className="mr-2" />
                            Add Activity
                          </Button>
                        </div>
                      ) : (
                        selectedCity.activities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
                            <GripVertical size={16} className="text-gray-400 mt-3 flex-shrink-0" />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <Label className="text-xs">Time</Label>
                                <Input
                                  type="time"
                                  value={activity.time}
                                  onChange={(e) => updateActivity(selectedCity.id, activity.id, 'time', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Activity Name</Label>
                                <Input
                                  value={activity.name}
                                  onChange={(e) => updateActivity(selectedCity.id, activity.id, 'name', e.target.value)}
                                  placeholder="e.g., Visit Museum"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Cost (INR)</Label>
                                <div className="relative mt-1">
                                  <svg className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                  </svg>
                                  <Input
                                    type="number"
                                    value={activity.cost}
                                    onChange={(e) => updateActivity(selectedCity.id, activity.id, 'cost', parseFloat(e.target.value) || 0)}
                                    className="pl-7"
                                  />
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteActivity(selectedCity.id, activity.id)}
                              className="hover:bg-red-50 flex-shrink-0"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center text-gray-500">
                  <p className="mb-4">Select a city from the list to view and edit its details</p>
                  {cities.length === 0 && (
                    <Button
                      onClick={() => setShowAddCity(true)}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Your First City
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
