import { Link } from 'react-router-dom';
import { PlusCircle, MapPin, Calendar, TrendingUp, Users, Plane, CheckCircle2, Clock } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useTrips } from '../../contexts/TripContext';
import { useUser } from '../../contexts/UserContext';
import { useMemo } from 'react';

const popularDestinations = [
  { name: 'Tokyo', country: 'Japan', travelers: '15K+' },
  { name: 'Paris', country: 'France', travelers: '20K+' },
  { name: 'New York', country: 'USA', travelers: '18K+' },
  { name: 'Dubai', country: 'UAE', travelers: '12K+' }
];

const communityHighlights = [
  { user: 'Sarah J.', trip: 'Asian Odyssey', likes: 234, cities: 8 },
  { user: 'Mike R.', trip: 'South American Tour', likes: 189, cities: 6 },
  { user: 'Emma L.', trip: 'Northern Europe', likes: 156, cities: 5 }
];

export default function Dashboard() {
  const { trips } = useTrips();
  const { user } = useUser();

  // Categorize trips by status
  const categorizedTrips = useMemo(() => {
    const today = new Date();
    return {
      upcoming: trips.filter(trip => {
        const startDate = new Date(trip.startDate);
        return startDate > today;
      }),
      ongoing: trips.filter(trip => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        return startDate <= today && endDate >= today;
      }),
      past: trips.filter(trip => {
        const endDate = new Date(trip.endDate);
        return endDate < today;
      })
    };
  }, [trips]);

  // Calculate total stats
  const totalCities = trips.reduce((sum, trip) => sum + trip.cities.length, 0);
  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Welcome back, {user?.fullName || 'Traveler'}!</h1>
          <p className="text-gray-600">Ready to plan your next adventure?</p>
        </div>

        {/* CTA Button */}
        <Link to="/plan-trip">
          <Button className="mb-8 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-6 text-lg">
            <PlusCircle className="mr-2" size={24} />
            Plan New Trip
          </Button>
        </Link>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Trips</p>
                  <p className="text-2xl mt-1">{categorizedTrips.upcoming.length}</p>
                </div>
                <MapPin className="text-teal-600" size={32} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Cities</p>
                  <p className="text-2xl mt-1">{totalCities}</p>
                </div>
                <Calendar className="text-blue-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl mt-1">₹{(totalBudget / 1000).toFixed(1)}K</p>
                </div>
                <svg className="text-green-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Trip Followers</p>
                  <p className="text-2xl mt-1">248</p>
                </div>
                <TrendingUp className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trips I'm Going On - with Tabs */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">Trips I'm Going On</h2>
            <Link to="/trips" className="text-teal-600 hover:text-teal-700 transition-colors">
              View all →
            </Link>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">
                Upcoming ({categorizedTrips.upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="ongoing">
                Ongoing ({categorizedTrips.ongoing.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({categorizedTrips.past.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categorizedTrips.upcoming.map((trip) => (
                  <Card key={trip.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={trip.image || 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=400'} 
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{trip.name}</CardTitle>
                      <CardDescription>
                        {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </CardDescription>
                      {trip.isCopied && trip.originalCreator && (
                        <p className="text-xs text-teal-600 mt-1">
                          📋 Copied from {trip.originalCreator}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          {trip.cities.length} cities: {trip.cities.slice(0, 2).map(c => c.name).join(', ')}
                          {trip.cities.length > 2 && ` +${trip.cities.length - 2} more`}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                          Budget: ₹{trip.budget.toLocaleString()}
                        </div>
                      </div>
                      <Link to={`/itinerary/${trip.id}`}>
                        <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 transition-colors">
                          View Itinerary
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
                {categorizedTrips.upcoming.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-500">
                    <p className="mb-4">No upcoming trips yet</p>
                    <Link to="/plan-trip">
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        Plan Your First Trip
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ongoing">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categorizedTrips.ongoing.map((trip) => (
                  <Card key={trip.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border-2 border-green-500">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={trip.image || 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=400'} 
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          🎯 Ongoing
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{trip.name}</CardTitle>
                      <CardDescription>
                        {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          {trip.cities.length} cities
                        </div>
                      </div>
                      <Link to={`/itinerary/${trip.id}`}>
                        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 transition-colors">
                          View Current Trip
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
                {categorizedTrips.ongoing.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-500">
                    <p>No ongoing trips</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categorizedTrips.past.map((trip) => (
                  <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-gray-200 bg-gray-50">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={trip.image || 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=400'} 
                        alt={trip.name}
                        className="w-full h-full object-cover grayscale-[30%] opacity-90"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gray-700 text-white">
                          <CheckCircle2 size={12} className="mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-gray-700">{trip.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin size={14} className="mr-2" />
                        {trip.cities.length} {trip.cities.length === 1 ? 'city' : 'cities'}
                      </div>
                      <Link to={`/itinerary/${trip.id}`}>
                        <Button variant="outline" className="w-full hover:bg-gray-100">
                          View Memories
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
                {categorizedTrips.past.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-500">
                    <p>No past trips</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Popular Destinations */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Popular Destinations</CardTitle>
              <CardDescription>Trending among GlobeTrotter community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularDestinations.map((dest, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p>{dest.name}</p>
                      <p className="text-sm text-gray-600">{dest.country}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-1" />
                      {dest.travelers}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Highlights */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Community Highlights</CardTitle>
              <CardDescription>Popular trips from our community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p>{highlight.trip}</p>
                      <p className="text-sm text-gray-600">by {highlight.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">❤️ {highlight.likes}</p>
                      <p className="text-xs text-gray-600">{highlight.cities} cities</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/community">
                <Button className="w-full mt-4" variant="outline">
                  Explore Community
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}