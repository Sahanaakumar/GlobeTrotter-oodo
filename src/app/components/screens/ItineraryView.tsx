import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Info, Plane, Hotel, Utensils, Activity as ActivityIcon } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTrips } from '../../contexts/TripContext';
import { Button } from '../ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';

/**
 * Itinerary View Screen
 * Displays trip-specific itinerary - never shares data across trips
 * All costs are auto-calculated and clearly labeled as "Estimated"
 */
export default function ItineraryView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { 
    getTripById, 
    getCostBreakdown, 
    getDistanceBetweenCities, 
    getTransportMode,
    activeTrip,
    setActiveTrip 
  } = useTrips();

  const trip = tripId ? getTripById(tripId) : activeTrip;

  // Set this trip as active when viewing
  useEffect(() => {
    if (trip && (!activeTrip || activeTrip.id !== trip.id)) {
      setActiveTrip(trip);
    }
  }, [trip, activeTrip, setActiveTrip]);

  // If no trip selected or found, show empty state
  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl mb-2 text-gray-700">No Trip Selected</h2>
          <p className="text-gray-600 mb-6">
            Please select a trip from the dropdown in the navigation or create a new one.
          </p>
          <Button 
            onClick={() => navigate('/plan-trip')}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Plan New Trip
          </Button>
        </div>
      </div>
    );
  }

  const costBreakdown = getCostBreakdown(trip);
  
  // Prepare data for pie chart
  const budgetChartData = [
    { name: 'Transport', value: costBreakdown.transport, color: '#14b8a6' },
    { name: 'Accommodation', value: costBreakdown.accommodation, color: '#3b82f6' },
    { name: 'Food', value: costBreakdown.food, color: '#f59e0b' },
    { name: 'Activities', value: costBreakdown.activities, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  // Calculate total days
  const totalDays = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Trip Metadata */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-3xl mb-3">{trip.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} className="text-teal-600" />
              <span>
                {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} className="text-blue-600" />
              <span>{trip.cities.length} Cities</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} className="text-purple-600" />
              <span>{totalDays} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span className="text-gray-600">
                Estimated Cost: <span className="font-semibold text-green-600">₹{costBreakdown.total.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Itinerary Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {trip.cities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No cities added yet</p>
                  <Button 
                    onClick={() => navigate(`/itinerary-builder/${trip.id}`)}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Add Cities
                  </Button>
                </CardContent>
              </Card>
            ) : (
              trip.cities.map((city, cityIndex) => {
                const nextCity = trip.cities[cityIndex + 1];
                const distance = nextCity ? getDistanceBetweenCities(city, nextCity) : 0;
                const transportMode = distance > 0 ? getTransportMode(distance) : null;
                const cityDays = Math.ceil(
                  (new Date(city.endDate).getTime() - new Date(city.startDate).getTime()) / (1000 * 60 * 60 * 24)
                ) + 1;

                return (
                  <div key={city.id}>
                    <Card>
                      <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="text-teal-600" />
                            {city.name}
                            {city.country && (
                              <span className="text-sm font-normal text-gray-600">
                                , {city.country}
                              </span>
                            )}
                          </CardTitle>
                          <span className="text-sm text-gray-600">
                            {cityDays} {cityDays === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(city.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(city.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {city.activities.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <ActivityIcon size={32} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No activities added yet</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => navigate(`/itinerary-builder/${trip.id}`)}
                            >
                              Add Activities
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {city.activities.map((activity) => (
                              <div 
                                key={activity.id}
                                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors"
                              >
                                <div className="flex-shrink-0 w-16 text-center">
                                  <p className="text-sm text-gray-600">{activity.time}</p>
                                </div>
                                <div className="flex-1">
                                  <h5 className="mb-1">{activity.name}</h5>
                                  {activity.type && (
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                      {activity.type}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-shrink-0">
                                  <span className={`px-3 py-1 rounded-full text-sm ${
                                    activity.cost === 0 
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {activity.cost === 0 ? 'Free' : `₹${activity.cost.toLocaleString()}`}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Transport Section between cities */}
                    {nextCity && transportMode && (
                      <div className="flex items-center justify-center my-4">
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
                          <ArrowRight className="text-teal-600" size={20} />
                          <div className="text-sm">
                            <span className="text-gray-600">to {nextCity.name}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-teal-600 font-medium">{distance} km</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-blue-600 font-medium">{transportMode}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Budget Summary & Cost Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            {/* Estimated Budget Card */}
            <Card className="border-2 border-teal-200">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <span>Estimated Budget</span>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info size={16} className="text-teal-600 cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold">Budget is auto-calculated based on:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Distance between cities (transport cost)</li>
                          <li>City cost index × number of days (accommodation)</li>
                          <li>City cost index × number of days (food)</li>
                          <li>Sum of all activity costs</li>
                        </ul>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <p className="text-4xl mb-1">₹{costBreakdown.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Estimated Cost</p>
                </div>

                {budgetChartData.length > 0 && (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={budgetChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={(entry) => `₹${(entry.value / 1000).toFixed(0)}K`}
                        >
                          {budgetChartData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `₹${value.toLocaleString()}`}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Breakdown Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Cost Calculation Breakdown
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info size={16} className="text-blue-600 cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold">How costs are calculated:</p>
                        <div className="space-y-2 text-gray-600">
                          <div>
                            <p className="font-medium text-teal-600">Transport:</p>
                            <p className="text-xs">
                              Bus (&lt;200km): ₹10/km<br />
                              Train (200-800km): ₹500 + ₹8/km<br />
                              Flight (&gt;800km): ₹2000 + ₹5/km
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-600">Accommodation:</p>
                            <p className="text-xs">City cost index × ₹1000 × nights</p>
                          </div>
                          <div>
                            <p className="font-medium text-orange-600">Food:</p>
                            <p className="text-xs">City cost index × ₹500 × days</p>
                          </div>
                          <div>
                            <p className="font-medium text-purple-600">Activities:</p>
                            <p className="text-xs">Sum of all activity costs</p>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Plane className="text-teal-600" size={20} />
                      <span>Transport</span>
                    </div>
                    <span className="font-semibold">₹{costBreakdown.transport.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Hotel className="text-blue-600" size={20} />
                      <span>Accommodation</span>
                    </div>
                    <span className="font-semibold">₹{costBreakdown.accommodation.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Utensils className="text-orange-600" size={20} />
                      <span>Food</span>
                    </div>
                    <span className="font-semibold">₹{costBreakdown.food.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ActivityIcon className="text-purple-600" size={20} />
                      <span>Activities</span>
                    </div>
                    <span className="font-semibold">₹{costBreakdown.activities.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{costBreakdown.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
