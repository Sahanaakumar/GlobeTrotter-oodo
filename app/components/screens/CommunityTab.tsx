import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Copy, Eye, Users, MapPin, Search, Calendar, DollarSign, Plane, Compass, Globe } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useTrips } from '../../contexts/TripContext';
import { toast } from 'sonner';

const publicTrips = [
  {
    id: 'public-1',
    name: 'Asian Odyssey',
    creator: 'Sarah Johnson',
    creatorInitials: 'SJ',
    cities: ['Tokyo', 'Seoul', 'Bangkok', 'Singapore'],
    duration: '14 days',
    budget: 337500,
    likes: 234,
    views: 1250,
    activities: ['Street Food Tours', 'Temple Visits', 'Night Markets', 'Island Hopping'],
    image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400',
    isLiked: false
  },
  {
    id: 'public-2',
    name: 'South American Adventure',
    creator: 'Mike Rodriguez',
    creatorInitials: 'MR',
    cities: ['Rio de Janeiro', 'Buenos Aires', 'Lima', 'Santiago'],
    duration: '18 days',
    budget: 285000,
    likes: 189,
    views: 980,
    activities: ['Machu Picchu Trek', 'Tango Classes', 'Wine Tasting', 'Beach Volleyball'],
    image: 'https://images.unsplash.com/photo-1550399504-8953e1a6ac87?w=400',
    isLiked: true
  },
  {
    id: 'public-3',
    name: 'Northern Europe Explorer',
    creator: 'Emma Larsson',
    creatorInitials: 'EL',
    cities: ['Stockholm', 'Copenhagen', 'Oslo', 'Helsinki'],
    duration: '12 days',
    budget: 390000,
    likes: 156,
    views: 750,
    activities: ['Northern Lights', 'Viking Museums', 'Fjord Cruises', 'Design Tours'],
    image: 'https://images.unsplash.com/photo-1663524962768-ef47bbdb11ef?w=400',
    isLiked: false
  },
  {
    id: 'public-4',
    name: 'Mediterranean Cruise',
    creator: 'David Chen',
    creatorInitials: 'DC',
    cities: ['Athens', 'Santorini', 'Istanbul', 'Venice'],
    duration: '10 days',
    budget: 360000,
    likes: 298,
    views: 1580,
    activities: ['Ancient Ruins', 'Sunset Sailing', 'Gondola Rides', 'Turkish Baths'],
    image: 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=400',
    isLiked: false
  },
  {
    id: 'public-5',
    name: 'Himalayan Expedition',
    creator: 'Priya Sharma',
    creatorInitials: 'PS',
    cities: ['Kathmandu', 'Pokhara', 'Lumbini', 'Chitwan'],
    duration: '16 days',
    budget: 185000,
    likes: 421,
    views: 2340,
    activities: ['Base Camp Trek', 'Paragliding', 'Wildlife Safari', 'Monastery Visits'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    isLiked: false
  },
  {
    id: 'public-6',
    name: 'African Safari Dreams',
    creator: 'James Okoye',
    creatorInitials: 'JO',
    cities: ['Nairobi', 'Serengeti', 'Zanzibar', 'Cape Town'],
    duration: '21 days',
    budget: 525000,
    likes: 567,
    views: 3120,
    activities: ['Big Five Safari', 'Hot Air Balloon', 'Beach Relaxation', 'Table Mountain Hike'],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400',
    isLiked: true
  },
  {
    id: 'public-7',
    name: 'Japan Cherry Blossom Tour',
    creator: 'Yuki Tanaka',
    creatorInitials: 'YT',
    cities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Nara'],
    duration: '10 days',
    budget: 295000,
    likes: 789,
    views: 4230,
    activities: ['Hanami Picnics', 'Tea Ceremony', 'Sushi Making', 'Temple Gardens'],
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400',
    isLiked: false
  },
  {
    id: 'public-8',
    name: 'Australian Coastal Journey',
    creator: 'Sophie Anderson',
    creatorInitials: 'SA',
    cities: ['Sydney', 'Melbourne', 'Great Barrier Reef', 'Gold Coast'],
    duration: '15 days',
    budget: 425000,
    likes: 345,
    views: 1890,
    activities: ['Scuba Diving', 'Surf Lessons', 'Wine Tours', 'Wildlife Encounters'],
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400',
    isLiked: false
  },
  {
    id: 'public-9',
    name: 'Historic Central Europe',
    creator: 'Franz Mueller',
    creatorInitials: 'FM',
    cities: ['Prague', 'Vienna', 'Budapest', 'Krakow'],
    duration: '9 days',
    budget: 215000,
    likes: 276,
    views: 1450,
    activities: ['Castle Tours', 'Classical Concerts', 'Spa Treatments', 'River Cruises'],
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400',
    isLiked: false
  },
  {
    id: 'public-10',
    name: 'Southeast Asia Backpacking',
    creator: 'Alex Kim',
    creatorInitials: 'AK',
    cities: ['Hanoi', 'Siem Reap', 'Chiang Mai', 'Luang Prabang', 'Ho Chi Minh'],
    duration: '20 days',
    budget: 165000,
    likes: 512,
    views: 2890,
    activities: ['Angkor Wat Sunrise', 'Cooking Classes', 'Elephant Sanctuary', 'Mekong Delta'],
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
    isLiked: true
  },
  {
    id: 'public-11',
    name: 'New Zealand Adventure',
    creator: 'Liam Cooper',
    creatorInitials: 'LC',
    cities: ['Auckland', 'Queenstown', 'Wellington', 'Christchurch'],
    duration: '13 days',
    budget: 380000,
    likes: 445,
    views: 2150,
    activities: ['Bungee Jumping', 'Milford Sound', 'Hobbiton Tour', 'Glacier Hiking'],
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400',
    isLiked: false
  },
  {
    id: 'public-12',
    name: 'Caribbean Island Paradise',
    creator: 'Maria Santos',
    creatorInitials: 'MS',
    cities: ['Barbados', 'St. Lucia', 'Aruba', 'Bahamas'],
    duration: '11 days',
    budget: 395000,
    likes: 621,
    views: 3450,
    activities: ['Snorkeling', 'Catamaran Cruises', 'Beach Parties', 'Rum Distilleries'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    isLiked: false
  }
];

export default function CommunityTab() {
  const navigate = useNavigate();
  const { addTrip } = useTrips();
  const [trips, setTrips] = useState(publicTrips);
  const [searchQuery, setSearchQuery] = useState('');
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const toggleLike = (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setTrips(trips.map(trip => 
      trip.id === tripId 
        ? { ...trip, likes: trip.isLiked ? trip.likes - 1 : trip.likes + 1, isLiked: !trip.isLiked }
        : trip
    ));
  };

  const handleViewTrip = (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/community/trip/${tripId}`);
  };

  const handleCopyTrip = (trip: typeof publicTrips[0], e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setCopyingId(trip.id);

    // Simulate copying with a delay
    setTimeout(() => {
      const newTrip = addTrip({
        name: trip.name,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: `Copied from ${trip.creator}'s amazing itinerary`,
        budget: trip.budget,
        status: 'upcoming',
        isCopied: true,
        originalCreator: trip.creator,
        cities: trip.cities.map((cityName, index) => ({
          id: Date.now() + index,
          name: cityName,
          startDate: '',
          endDate: '',
          activities: []
        }))
      });

      setCopyingId(null);
      toast.success('Trip copied to your trips!', {
        description: 'You can now customize it in the Itinerary Builder.',
        action: {
          label: 'Edit Now',
          onClick: () => navigate(`/itinerary-builder/${newTrip.id}`)
        }
      });
    }, 1000);
  };

  const handleCardClick = (tripId: string) => {
    navigate(`/community/trip/${tripId}`);
  };

  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.cities.some(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl shadow-lg">
              <Globe className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Community Trips</h1>
              <p className="text-gray-600 mt-1">Discover and get inspired by trips from our global community</p>
            </div>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trips, creators, or destinations..."
              className="pl-12 h-14 border-2 border-gray-200 focus:border-teal-500 rounded-xl shadow-sm hover:shadow-md transition-all"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur border-teal-100 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Plane className="text-teal-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl text-teal-600">{publicTrips.length}</p>
                  <p className="text-xs text-gray-600">Total Trips</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-blue-100 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl text-blue-600">{publicTrips.reduce((sum, t) => sum + t.cities.length, 0)}</p>
                  <p className="text-xs text-gray-600">Destinations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-purple-100 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Heart className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl text-purple-600">{publicTrips.reduce((sum, t) => sum + t.likes, 0)}</p>
                  <p className="text-xs text-gray-600">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-orange-100 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Eye className="text-orange-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl text-orange-600">{(publicTrips.reduce((sum, t) => sum + t.views, 0) / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-gray-600">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Public Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card 
              key={trip.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white border-2 border-gray-100 hover:border-teal-200"
              onClick={() => handleCardClick(trip.id)}
            >
              {/* Trip Image */}
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={trip.image} 
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-white/95 text-gray-900 backdrop-blur shadow-lg">
                    <Users size={12} className="mr-1" />
                    Public
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl drop-shadow-lg">{trip.name}</h3>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/90 to-blue-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="mx-auto mb-2 text-white" size={32} />
                    <span className="text-white">Click to view details</span>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Avatar className="w-8 h-8 border-2 border-teal-100">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-teal-600 to-blue-600 text-white">
                      {trip.creatorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-700">by <span className="font-medium text-teal-700">{trip.creator}</span></span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Destinations */}
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin size={16} className="mr-2 text-teal-600" />
                    <span className="font-medium">{trip.cities.length} destinations</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trip.cities.slice(0, 3).map((city, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-teal-200 text-teal-700 bg-teal-50">
                        {city}
                      </Badge>
                    ))}
                    {trip.cities.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                        +{trip.cities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Compass size={16} className="mr-2 text-blue-600" />
                    <span className="font-medium">Top Activities</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trip.activities.slice(0, 2).map((activity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Trip Stats */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar size={14} className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{trip.duration}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign size={14} className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-sm font-medium text-gray-900">₹{(trip.budget / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Eye size={14} className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="text-sm font-medium text-gray-900">{trip.views}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex-1 transition-all ${trip.isLiked ? 'text-red-500 border-red-300 bg-red-50 hover:bg-red-100' : 'hover:border-red-300 hover:text-red-500 hover:bg-red-50'}`}
                    onClick={(e) => toggleLike(trip.id, e)}
                  >
                    <Heart size={16} className={`mr-1 ${trip.isLiked ? 'fill-current' : ''}`} />
                    {trip.likes}
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                    onClick={(e) => handleCopyTrip(trip, e)}
                    disabled={copyingId === trip.id}
                  >
                    <Copy size={16} className="mr-1" />
                    {copyingId === trip.id ? 'Copying...' : 'Copy Trip'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <Search className="text-gray-400" size={48} />
            </div>
            <p className="text-gray-500 mb-2 text-lg">No trips found matching your search</p>
            <p className="text-gray-400 text-sm">Try different keywords or browse all trips</p>
          </div>
        )}
      </div>
    </div>
  );
}