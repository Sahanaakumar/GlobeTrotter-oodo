import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Edit, Trash2, Eye, CheckCircle2, Clock, Plane } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useTrips } from '../../contexts/TripContext';
import { toast } from 'sonner';

export default function TripListing() {
  const { trips, deleteTrip } = useTrips();
  const [filter, setFilter] = useState('all');

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return trip.status === 'upcoming';
    if (filter === 'ongoing') return trip.status === 'ongoing';
    if (filter === 'past') return trip.status === 'past';
    if (filter === 'public') return trip.isPublic;
    return true;
  });

  const handleDeleteTrip = (tripId: number | string, tripName: string) => {
    if (window.confirm(`Are you sure you want to delete "${tripName}"? This action cannot be undone.`)) {
      deleteTrip(tripId);
      toast.success(`"${tripName}" has been deleted`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">My Trips</h1>
          <p className="text-gray-600">Manage and view all your trips</p>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">
              All Trips ({trips.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({trips.filter(t => t.status === 'upcoming').length})
            </TabsTrigger>
            <TabsTrigger value="ongoing">
              Ongoing ({trips.filter(t => t.status === 'ongoing').length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({trips.filter(t => t.status === 'past').length})
            </TabsTrigger>
            <TabsTrigger value="public">
              Public ({trips.filter(t => t.isPublic).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <Card 
                  key={trip.id} 
                  className={`overflow-hidden hover:shadow-xl transition-all group ${
                    trip.status === 'past' ? 'border-2 border-gray-200 bg-gray-50' : 
                    trip.status === 'ongoing' ? 'border-2 border-green-200' : ''
                  }`}
                >
                  <div className="relative h-48">
                    <img 
                      src={trip.image || 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=400'} 
                      alt={trip.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        trip.status === 'past' ? 'grayscale-[30%] opacity-90' : ''
                      }`}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {trip.status === 'past' && (
                        <Badge className="bg-gray-700 text-white">
                          <CheckCircle2 size={12} className="mr-1" />
                          Completed
                        </Badge>
                      )}
                      {trip.status === 'upcoming' && (
                        <Badge className="bg-teal-600 text-white">
                          <Clock size={12} className="mr-1" />
                          Upcoming
                        </Badge>
                      )}
                      {trip.status === 'ongoing' && (
                        <Badge className="bg-green-600 text-white">
                          <Plane size={12} className="mr-1" />
                          Ongoing
                        </Badge>
                      )}
                      {trip.isPublic && (
                        <Badge className="bg-blue-600 text-white">
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className={trip.status === 'past' ? 'text-gray-700' : ''}>{trip.name}</CardTitle>
                    {trip.isCopied && trip.originalCreator && (
                      <p className="text-xs text-teal-600 mt-1">
                        📋 Copied from {trip.originalCreator}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        {trip.cities.length} cities
                        {trip.cities.length > 0 && `: ${trip.cities.slice(0, 2).map(c => c.name).join(', ')}`}
                        {trip.cities.length > 2 && ` +${trip.cities.length - 2} more`}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Budget: ₹{trip.budget.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Link to={`/itinerary/${trip.id}`}>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-colors"
                          title="View Itinerary"
                        >
                          <Eye size={14} />
                        </Button>
                      </Link>
                      <Link to={`/itinerary-builder/${trip.id}`}>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                          title="Edit Trip"
                        >
                          <Edit size={14} />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
                        onClick={() => handleDeleteTrip(trip.id, trip.name)}
                        title="Delete Trip"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTrips.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">
                  {filter === 'all' ? 'No trips found' : `No ${filter} trips found`}
                </p>
                <Link to="/plan-trip">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Create Your First Trip
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}