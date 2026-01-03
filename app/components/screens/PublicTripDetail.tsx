import { useNavigate, useParams } from 'react-router-dom';
import { Copy, Heart, MapPin, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { useTrips } from '../../contexts/TripContext';
import { toast } from 'sonner';
import { useState } from 'react';

// Comprehensive public trips data - matches CommunityTab trips
const publicTrips = [
  {
    id: 'public-1',
    name: 'Asian Odyssey',
    creator: 'Sarah Johnson',
    creatorInitials: 'SJ',
    cities: ['Tokyo', 'Seoul', 'Bangkok', 'Singapore'],
    duration: '14 days',
    startDate: '2026-07-01',
    endDate: '2026-07-14',
    budget: 337500,
    likes: 234,
    views: 1250,
    description: 'An incredible journey through Asia\'s most vibrant cities. Experience the perfect blend of tradition and modernity, amazing food, and unforgettable cultural experiences.',
    image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=800',
    isLiked: false,
    detailedItinerary: [
      {
        city: 'Tokyo',
        country: 'Japan',
        days: 4,
        activities: [
          { name: 'Visit Senso-ji Temple', cost: 0, duration: '2 hours', type: 'Culture' },
          { name: 'Tokyo Tower Observatory', cost: 2250, duration: '1.5 hours', type: 'Sightseeing' },
          { name: 'Tsukiji Fish Market', cost: 0, duration: '2 hours', type: 'Food' },
          { name: 'Shopping in Shibuya', cost: 3750, duration: '3 hours', type: 'Leisure' }
        ]
      },
      {
        city: 'Seoul',
        country: 'South Korea',
        days: 3,
        activities: [
          { name: 'Gyeongbokgung Palace', cost: 375, duration: '2 hours', type: 'Culture' },
          { name: 'N Seoul Tower', cost: 1125, duration: '2 hours', type: 'Sightseeing' },
          { name: 'Korean BBQ Experience', cost: 2250, duration: '2 hours', type: 'Food' }
        ]
      },
      {
        city: 'Bangkok',
        country: 'Thailand',
        days: 4,
        activities: [
          { name: 'Grand Palace Visit', cost: 750, duration: '3 hours', type: 'Culture' },
          { name: 'Floating Market Tour', cost: 1500, duration: '4 hours', type: 'Culture' },
          { name: 'Thai Cooking Class', cost: 3000, duration: '3 hours', type: 'Food' }
        ]
      },
      {
        city: 'Singapore',
        country: 'Singapore',
        days: 3,
        activities: [
          { name: 'Gardens by the Bay', cost: 2250, duration: '3 hours', type: 'Sightseeing' },
          { name: 'Marina Bay Sands SkyPark', cost: 3750, duration: '2 hours', type: 'Sightseeing' },
          { name: 'Hawker Center Food Tour', cost: 1500, duration: '3 hours', type: 'Food' }
        ]
      }
    ]
  },
  {
    id: 'public-2',
    name: 'South American Adventure',
    creator: 'Mike Rodriguez',
    creatorInitials: 'MR',
    cities: ['Rio de Janeiro', 'Buenos Aires', 'Lima', 'Santiago'],
    duration: '18 days',
    startDate: '2026-05-10',
    endDate: '2026-05-27',
    budget: 285000,
    likes: 189,
    views: 980,
    description: 'Explore the diverse cultures and landscapes of South America. From the beaches of Rio to the tango halls of Buenos Aires, this journey offers authentic experiences.',
    image: 'https://images.unsplash.com/photo-1550399504-8953e1a6ac87?w=800',
    isLiked: true,
    detailedItinerary: [
      {
        city: 'Rio de Janeiro',
        country: 'Brazil',
        days: 5,
        activities: [
          { name: 'Christ the Redeemer', cost: 1500, duration: '3 hours', type: 'Sightseeing' },
          { name: 'Copacabana Beach', cost: 0, duration: '4 hours', type: 'Leisure' },
          { name: 'Samba Show', cost: 3500, duration: '3 hours', type: 'Culture' }
        ]
      },
      {
        city: 'Buenos Aires',
        country: 'Argentina',
        days: 5,
        activities: [
          { name: 'Tango Classes', cost: 2500, duration: '2 hours', type: 'Culture' },
          { name: 'La Boca Neighborhood Tour', cost: 1000, duration: '3 hours', type: 'Sightseeing' },
          { name: 'Argentinian Steakhouse', cost: 3000, duration: '2 hours', type: 'Food' }
        ]
      },
      {
        city: 'Lima',
        country: 'Peru',
        days: 4,
        activities: [
          { name: 'Historic Center Walking Tour', cost: 800, duration: '3 hours', type: 'Culture' },
          { name: 'Peruvian Cooking Class', cost: 2200, duration: '3 hours', type: 'Food' }
        ]
      },
      {
        city: 'Santiago',
        country: 'Chile',
        days: 4,
        activities: [
          { name: 'Wine Valley Tour', cost: 4500, duration: '6 hours', type: 'Leisure' },
          { name: 'San Cristobal Hill', cost: 500, duration: '2 hours', type: 'Sightseeing' }
        ]
      }
    ]
  },
  {
    id: 'public-3',
    name: 'Northern Europe Explorer',
    creator: 'Emma Larsson',
    creatorInitials: 'EL',
    cities: ['Stockholm', 'Copenhagen', 'Oslo', 'Helsinki'],
    duration: '12 days',
    startDate: '2026-08-15',
    endDate: '2026-08-26',
    budget: 390000,
    likes: 156,
    views: 750,
    description: 'Discover the beauty of Scandinavia with its stunning architecture, rich Viking history, and modern design. Perfect for culture enthusiasts.',
    image: 'https://images.unsplash.com/photo-1663524962768-ef47bbdb11ef?w=800',
    isLiked: false,
    detailedItinerary: [
      {
        city: 'Stockholm',
        country: 'Sweden',
        days: 3,
        activities: [
          { name: 'Vasa Museum', cost: 2000, duration: '2 hours', type: 'Culture' },
          { name: 'Old Town Walking Tour', cost: 1500, duration: '3 hours', type: 'Sightseeing' },
          { name: 'Archipelago Boat Tour', cost: 4000, duration: '4 hours', type: 'Leisure' }
        ]
      },
      {
        city: 'Copenhagen',
        country: 'Denmark',
        days: 3,
        activities: [
          { name: 'Tivoli Gardens', cost: 2500, duration: '4 hours', type: 'Leisure' },
          { name: 'Nyhavn Canal Tour', cost: 1800, duration: '1.5 hours', type: 'Sightseeing' }
        ]
      },
      {
        city: 'Oslo',
        country: 'Norway',
        days: 3,
        activities: [
          { name: 'Viking Ship Museum', cost: 1600, duration: '2 hours', type: 'Culture' },
          { name: 'Fjord Cruise', cost: 5500, duration: '5 hours', type: 'Sightseeing' }
        ]
      },
      {
        city: 'Helsinki',
        country: 'Finland',
        days: 3,
        activities: [
          { name: 'Design District Tour', cost: 1200, duration: '3 hours', type: 'Culture' },
          { name: 'Suomenlinna Fortress', cost: 800, duration: '3 hours', type: 'Sightseeing' }
        ]
      }
    ]
  },
  {
    id: 'public-4',
    name: 'Mediterranean Cruise',
    creator: 'David Chen',
    creatorInitials: 'DC',
    cities: ['Athens', 'Santorini', 'Istanbul', 'Venice'],
    duration: '10 days',
    startDate: '2026-06-05',
    endDate: '2026-06-14',
    budget: 360000,
    likes: 298,
    views: 1580,
    description: 'Sail through the Mediterranean and explore ancient civilizations, stunning islands, and romantic cities. A perfect blend of history and relaxation.',
    image: 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=800',
    isLiked: false,
    detailedItinerary: [
      {
        city: 'Athens',
        country: 'Greece',
        days: 3,
        activities: [
          { name: 'Acropolis Tour', cost: 2500, duration: '3 hours', type: 'Culture' },
          { name: 'Ancient Agora', cost: 1200, duration: '2 hours', type: 'Sightseeing' },
          { name: 'Greek Taverna Dinner', cost: 2000, duration: '2 hours', type: 'Food' }
        ]
      },
      {
        city: 'Santorini',
        country: 'Greece',
        days: 2,
        activities: [
          { name: 'Sunset Sailing', cost: 4500, duration: '3 hours', type: 'Leisure' },
          { name: 'Wine Tasting Tour', cost: 3000, duration: '4 hours', type: 'Food' }
        ]
      },
      {
        city: 'Istanbul',
        country: 'Turkey',
        days: 3,
        activities: [
          { name: 'Hagia Sophia', cost: 1500, duration: '2 hours', type: 'Culture' },
          { name: 'Turkish Bath Experience', cost: 2500, duration: '2 hours', type: 'Leisure' },
          { name: 'Bosphorus Cruise', cost: 2000, duration: '2 hours', type: 'Sightseeing' }
        ]
      },
      {
        city: 'Venice',
        country: 'Italy',
        days: 2,
        activities: [
          { name: 'Gondola Ride', cost: 6000, duration: '1 hour', type: 'Leisure' },
          { name: 'St. Mark\'s Basilica', cost: 1000, duration: '1.5 hours', type: 'Culture' }
        ]
      }
    ]
  },
  {
    id: 'public-5',
    name: 'Himalayan Expedition',
    creator: 'Priya Sharma',
    creatorInitials: 'PS',
    cities: ['Kathmandu', 'Pokhara', 'Lumbini', 'Chitwan'],
    duration: '16 days',
    startDate: '2026-09-10',
    endDate: '2026-09-25',
    budget: 185000,
    likes: 421,
    views: 2340,
    description: 'Trek through the majestic Himalayas and experience spiritual Nepal. From mountain peaks to jungle safaris, this trip has it all.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    isLiked: false,
    detailedItinerary: [
      {
        city: 'Kathmandu',
        country: 'Nepal',
        days: 3,
        activities: [
          { name: 'Swayambhunath Temple', cost: 500, duration: '2 hours', type: 'Culture' },
          { name: 'Durbar Square Tour', cost: 800, duration: '3 hours', type: 'Sightseeing' }
        ]
      },
      {
        city: 'Pokhara',
        country: 'Nepal',
        days: 7,
        activities: [
          { name: 'Annapurna Base Camp Trek', cost: 25000, duration: '5 days', type: 'Adventure' },
          { name: 'Paragliding', cost: 4500, duration: '1 hour', type: 'Adventure' }
        ]
      },
      {
        city: 'Lumbini',
        country: 'Nepal',
        days: 2,
        activities: [
          { name: 'Maya Devi Temple', cost: 0, duration: '2 hours', type: 'Culture' },
          { name: 'Monastery Visits', cost: 0, duration: '3 hours', type: 'Culture' }
        ]
      },
      {
        city: 'Chitwan',
        country: 'Nepal',
        days: 4,
        activities: [
          { name: 'Wildlife Safari', cost: 8000, duration: '4 hours', type: 'Adventure' },
          { name: 'Elephant Bathing', cost: 2000, duration: '2 hours', type: 'Adventure' }
        ]
      }
    ]
  },
  {
    id: 'public-6',
    name: 'African Safari Dreams',
    creator: 'James Okoye',
    creatorInitials: 'JO',
    cities: ['Nairobi', 'Serengeti', 'Zanzibar', 'Cape Town'],
    duration: '21 days',
    startDate: '2026-07-20',
    endDate: '2026-08-09',
    budget: 525000,
    likes: 567,
    views: 3120,
    description: 'The ultimate African adventure featuring the Big Five, pristine beaches, and vibrant cultures. A once-in-a-lifetime experience.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    isLiked: true,
    detailedItinerary: [
      {
        city: 'Nairobi',
        country: 'Kenya',
        days: 3,
        activities: [
          { name: 'Giraffe Centre', cost: 1500, duration: '2 hours', type: 'Wildlife' },
          { name: 'David Sheldrick Elephant Orphanage', cost: 2000, duration: '2 hours', type: 'Wildlife' }
        ]
      },
      {
        city: 'Serengeti',
        country: 'Tanzania',
        days: 7,
        activities: [
          { name: 'Big Five Safari', cost: 45000, duration: '3 days', type: 'Wildlife' },
          { name: 'Hot Air Balloon Safari', cost: 25000, duration: '3 hours', type: 'Adventure' }
        ]
      },
      {
        city: 'Zanzibar',
        country: 'Tanzania',
        days: 6,
        activities: [
          { name: 'Beach Relaxation', cost: 0, duration: 'Full day', type: 'Leisure' },
          { name: 'Spice Tour', cost: 3000, duration: '4 hours', type: 'Culture' },
          { name: 'Snorkeling', cost: 4500, duration: '3 hours', type: 'Adventure' }
        ]
      },
      {
        city: 'Cape Town',
        country: 'South Africa',
        days: 5,
        activities: [
          { name: 'Table Mountain Cable Car', cost: 2500, duration: '3 hours', type: 'Sightseeing' },
          { name: 'Cape Peninsula Tour', cost: 5000, duration: '6 hours', type: 'Sightseeing' }
        ]
      }
    ]
  },
  {
    id: 'public-7',
    name: 'Japan Cherry Blossom Tour',
    creator: 'Yuki Tanaka',
    creatorInitials: 'YT',
    cities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Nara'],
    duration: '10 days',
    startDate: '2026-04-01',
    endDate: '2026-04-10',
    budget: 295000,
    likes: 789,
    views: 4230,
    description: 'Experience Japan during the magical cherry blossom season. Traditional temples, modern cities, and stunning natural beauty.',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800',
    isLiked: false,
    detailedItinerary: [
      {
        city: 'Tokyo',
        country: 'Japan',
        days: 3,
        activities: [
          { name: 'Hanami Picnic in Ueno Park', cost: 0, duration: '3 hours', type: 'Leisure' },
          { name: 'TeamLab Borderless', cost: 2500, duration: '2 hours', type: 'Culture' },
          { name: 'Sushi Making Class', cost: 4500, duration: '3 hours', type: 'Food' }
        ]
      },
      {
        city: 'Kyoto',
        country: 'Japan',
        days: 3,
        activities: [
          { name: 'Fushimi Inari Shrine', cost: 0, duration: '3 hours', type: 'Culture' },
          { name: 'Tea Ceremony', cost: 3500, duration: '1.5 hours', type: 'Culture' },
          { name: 'Arashiyama Bamboo Grove', cost: 0, duration: '2 hours', type: 'Sightseeing' }
        ]
      },
      {
        city: 'Osaka',
        country: 'Japan',
        days: 1,
        activities: [
          { name: 'Osaka Castle', cost: 1000, duration: '2 hours', type: 'Sightseeing' },
          { name: 'Dotonbori Food Street', cost: 3000, duration: '3 hours', type: 'Food' }
        ]
      },
      {
        city: 'Hiroshima',
        country: 'Japan',
        days: 2,
        activities: [
          { name: 'Peace Memorial Park', cost: 0, duration: '2 hours', type: 'Culture' },
          { name: 'Miyajima Island', cost: 1500, duration: '4 hours', type: 'Sightseeing' }
        ]
      },
      {
        city: 'Nara',
        country: 'Japan',
        days: 1,
        activities: [
          { name: 'Nara Deer Park', cost: 500, duration: '3 hours', type: 'Wildlife' },
          { name: 'Todai-ji Temple', cost: 800, duration: '1.5 hours', type: 'Culture' }
        ]
      }
    ]
  },
  {
    id: 'public-8',
    name: 'Australian Coastal Journey',
    creator: 'Sophie Anderson',
    creatorInitials: 'SA',
    cities: ['Sydney', 'Melbourne', 'Great Barrier Reef', 'Gold Coast'],
    duration: '15 days',
    startDate: '2026-11-01',
    endDate: '2026-11-15',
    budget: 425000,
    likes: 345,
    views: 1890,
    description: 'Explore Australia\'s stunning coastline from iconic cities to the world\'s largest coral reef. Perfect for adventure and relaxation.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    isLiked: false,
    detailedItinerary: [
      {
        city: 'Sydney',
        country: 'Australia',
        days: 4,
        activities: [
          { name: 'Sydney Opera House Tour', cost: 2800, duration: '2 hours', type: 'Culture' },
          { name: 'Harbour Bridge Climb', cost: 15000, duration: '3 hours', type: 'Adventure' },
          { name: 'Bondi Beach', cost: 0, duration: '4 hours', type: 'Leisure' }
        ]
      },
      {
        city: 'Melbourne',
        country: 'Australia',
        days: 3,
        activities: [
          { name: 'Great Ocean Road', cost: 8000, duration: '8 hours', type: 'Sightseeing' },
          { name: 'Coffee Culture Tour', cost: 2500, duration: '3 hours', type: 'Food' }
        ]
      },
      {
        city: 'Great Barrier Reef',
        country: 'Australia',
        days: 5,
        activities: [
          { name: 'Scuba Diving', cost: 18000, duration: '4 hours', type: 'Adventure' },
          { name: 'Glass Bottom Boat', cost: 5500, duration: '2 hours', type: 'Leisure' }
        ]
      },
      {
        city: 'Gold Coast',
        country: 'Australia',
        days: 3,
        activities: [
          { name: 'Surf Lessons', cost: 4000, duration: '2 hours', type: 'Adventure' },
          { name: 'Theme Parks', cost: 6000, duration: 'Full day', type: 'Leisure' }
        ]
      }
    ]
  },
  {
    id: 'public-9',
    name: 'Historic Central Europe',
    creator: 'Franz Mueller',
    creatorInitials: 'FM',
    cities: ['Prague', 'Vienna', 'Budapest', 'Krakow'],
    duration: '9 days',
    startDate: '2026-05-15',
    endDate: '2026-05-23',
    budget: 215000,
    likes: 276,
    views: 1450,
    description: 'Journey through Central Europe\'s most beautiful historic cities. Castles, classical music, and rich culture await.',
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800',
    isLiked: false,
    detailedItinerary: [
      {
        city: 'Prague',
        country: 'Czech Republic',
        days: 3,
        activities: [
          { name: 'Prague Castle', cost: 1500, duration: '3 hours', type: 'Sightseeing' },
          { name: 'Charles Bridge Walk', cost: 0, duration: '1 hour', type: 'Sightseeing' },
          { name: 'Medieval Dinner', cost: 3500, duration: '2 hours', type: 'Food' }
        ]
      },
      {
        city: 'Vienna',
        country: 'Austria',
        days: 2,
        activities: [
          { name: 'Schönbrunn Palace', cost: 2000, duration: '3 hours', type: 'Culture' },
          { name: 'Classical Concert', cost: 4500, duration: '2 hours', type: 'Culture' }
        ]
      },
      {
        city: 'Budapest',
        country: 'Hungary',
        days: 2,
        activities: [
          { name: 'Thermal Spa Experience', cost: 2500, duration: '3 hours', type: 'Leisure' },
          { name: 'Danube River Cruise', cost: 3000, duration: '2 hours', type: 'Sightseeing' }
        ]
      },
      {
        city: 'Krakow',
        country: 'Poland',
        days: 2,
        activities: [
          { name: 'Wawel Castle', cost: 1200, duration: '2 hours', type: 'Culture' },
          { name: 'Old Town Market', cost: 0, duration: '2 hours', type: 'Sightseeing' }
        ]
      }
    ]
  },
  {
    id: 'public-10',
    name: 'Southeast Asia Backpacking',
    creator: 'Alex Kim',
    creatorInitials: 'AK',
    cities: ['Hanoi', 'Siem Reap', 'Chiang Mai', 'Luang Prabang', 'Ho Chi Minh'],
    duration: '20 days',
    startDate: '2026-10-01',
    endDate: '2026-10-20',
    budget: 165000,
    likes: 512,
    views: 2890,
    description: 'Budget-friendly backpacking through Southeast Asia. Ancient temples, lush jungles, and vibrant street food culture.',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    isLiked: true,
    detailedItinerary: [
      {
        city: 'Hanoi',
        country: 'Vietnam',
        days: 3,
        activities: [
          { name: 'Old Quarter Walking Tour', cost: 500, duration: '3 hours', type: 'Culture' },
          { name: 'Street Food Tour', cost: 1500, duration: '3 hours', type: 'Food' }
        ]
      },
      {
        city: 'Siem Reap',
        country: 'Cambodia',
        days: 5,
        activities: [
          { name: 'Angkor Wat Sunrise', cost: 2500, duration: '5 hours', type: 'Culture' },
          { name: 'Temple Complex Tour', cost: 3000, duration: 'Full day', type: 'Sightseeing' }
        ]
      },
      {
        city: 'Chiang Mai',
        country: 'Thailand',
        days: 5,
        activities: [
          { name: 'Elephant Sanctuary', cost: 4500, duration: '6 hours', type: 'Wildlife' },
          { name: 'Thai Cooking Class', cost: 2000, duration: '4 hours', type: 'Food' }
        ]
      },
      {
        city: 'Luang Prabang',
        country: 'Laos',
        days: 3,
        activities: [
          { name: 'Kuang Si Waterfall', cost: 1000, duration: '4 hours', type: 'Sightseeing' },
          { name: 'Alms Giving Ceremony', cost: 0, duration: '1 hour', type: 'Culture' }
        ]
      },
      {
        city: 'Ho Chi Minh',
        country: 'Vietnam',
        days: 4,
        activities: [
          { name: 'Mekong Delta Tour', cost: 3500, duration: '8 hours', type: 'Sightseeing' },
          { name: 'War Museum', cost: 500, duration: '2 hours', type: 'Culture' }
        ]
      }
    ]
  },
  {
    id: 'public-11',
    name: 'New Zealand Adventure',
    creator: 'Liam Cooper',
    creatorInitials: 'LC',
    cities: ['Auckland', 'Queenstown', 'Wellington', 'Christchurch'],
    duration: '13 days',
    startDate: '2026-12-05',
    endDate: '2026-12-17',
    budget: 380000,
    likes: 445,
    views: 2150,
    description: 'Experience New Zealand\'s breathtaking landscapes from glaciers to beaches. Perfect for thrill-seekers and nature lovers.',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800',
    isLiked: false,
    detailedItinerary: [
      {
        city: 'Auckland',
        country: 'New Zealand',
        days: 2,
        activities: [
          { name: 'Sky Tower', cost: 2000, duration: '2 hours', type: 'Sightseeing' },
          { name: 'Waiheke Island Wine Tour', cost: 6500, duration: '6 hours', type: 'Leisure' }
        ]
      },
      {
        city: 'Queenstown',
        country: 'New Zealand',
        days: 5,
        activities: [
          { name: 'Bungee Jumping', cost: 12000, duration: '2 hours', type: 'Adventure' },
          { name: 'Milford Sound Cruise', cost: 8500, duration: '8 hours', type: 'Sightseeing' },
          { name: 'Hobbiton Tour', cost: 6000, duration: '4 hours', type: 'Culture' }
        ]
      },
      {
        city: 'Wellington',
        country: 'New Zealand',
        days: 3,
        activities: [
          { name: 'Te Papa Museum', cost: 0, duration: '3 hours', type: 'Culture' },
          { name: 'Cable Car & Botanic Gardens', cost: 500, duration: '2 hours', type: 'Sightseeing' }
        ]
      },
      {
        city: 'Christchurch',
        country: 'New Zealand',
        days: 3,
        activities: [
          { name: 'Glacier Hiking', cost: 15000, duration: '6 hours', type: 'Adventure' },
          { name: 'Punting on Avon River', cost: 2500, duration: '1 hour', type: 'Leisure' }
        ]
      }
    ]
  },
  {
    id: 'public-12',
    name: 'Caribbean Island Paradise',
    creator: 'Maria Santos',
    creatorInitials: 'MS',
    cities: ['Barbados', 'St. Lucia', 'Aruba', 'Bahamas'],
    duration: '11 days',
    startDate: '2026-02-14',
    endDate: '2026-02-24',
    budget: 395000,
    likes: 621,
    views: 3450,
    description: 'Island hopping through the Caribbean\'s most beautiful destinations. Crystal clear waters, white sand beaches, and tropical vibes.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    isLiked: false,
    detailedItinerary: [
      {
        city: 'Barbados',
        country: 'Caribbean',
        days: 3,
        activities: [
          { name: 'Catamaran Cruise', cost: 5500, duration: '4 hours', type: 'Leisure' },
          { name: 'Harrison\'s Cave', cost: 3500, duration: '2 hours', type: 'Sightseeing' }
        ]
      },
      {
        city: 'St. Lucia',
        country: 'Caribbean',
        days: 3,
        activities: [
          { name: 'Piton Hiking', cost: 4000, duration: '4 hours', type: 'Adventure' },
          { name: 'Sulphur Springs', cost: 2500, duration: '2 hours', type: 'Leisure' }
        ]
      },
      {
        city: 'Aruba',
        country: 'Caribbean',
        days: 3,
        activities: [
          { name: 'Snorkeling', cost: 4500, duration: '3 hours', type: 'Adventure' },
          { name: 'Beach Parties', cost: 3000, duration: '4 hours', type: 'Leisure' }
        ]
      },
      {
        city: 'Bahamas',
        country: 'Caribbean',
        days: 2,
        activities: [
          { name: 'Swimming with Pigs', cost: 8000, duration: '3 hours', type: 'Wildlife' },
          { name: 'Rum Distillery Tour', cost: 2500, duration: '2 hours', type: 'Culture' }
        ]
      }
    ]
  }
];

export default function PublicTripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { copyTrip, addTrip } = useTrips();
  const [copying, setCopying] = useState(false);

  // Find the specific public trip by ID - NO DEFAULT FALLBACK
  const trip = publicTrips.find(t => t.id === tripId);
  
  // Initialize likes state from the found trip
  const [isLiked, setIsLiked] = useState(trip?.isLiked || false);
  const [likes, setLikes] = useState(trip?.likes || 0);

  // If trip not found, show error state
  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl mb-4">Trip Not Found</h1>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/community')} className="bg-teal-600 hover:bg-teal-700">
            <ArrowLeft size={20} className="mr-2" />
            Back to Community
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyTrip = () => {
    setCopying(true);
    
    // Convert public trip to our Trip format
    const newTrip = addTrip({
      name: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
      description: trip.description,
      budget: trip.budget,
      status: 'upcoming',
      image: trip.image,
      isCopied: true,
      originalCreator: trip.creator,
      cities: trip.detailedItinerary.map((cityData, index) => ({
        id: Date.now() + index,
        name: cityData.city,
        country: cityData.country,
        startDate: '',
        endDate: '',
        activities: cityData.activities.map((act, actIndex) => ({
          id: Date.now() + index + actIndex + 1000,
          time: '09:00',
          name: act.name,
          cost: act.cost,
          type: act.type,
          duration: act.duration
        }))
      }))
    });

    setTimeout(() => {
      setCopying(false);
      toast.success('Trip copied to your trips!', {
        description: 'You can now edit and customize it in the Itinerary Builder.'
      });
      // Navigate to itinerary builder with the new trip
      navigate(`/itinerary-builder/${newTrip.id}`);
    }, 1000);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/community')}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Community
        </Button>

        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img 
            src={trip.image} 
            alt={trip.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl mb-2">{trip.name}</h1>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-teal-600 to-blue-600 text-white">
                  {trip.creatorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">Created by {trip.creator}</p>
                <p className="text-xs text-gray-300">{trip.views.toLocaleString()} views</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Trip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{trip.description}</p>
              </CardContent>
            </Card>

            {/* Detailed Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {trip.detailedItinerary.map((cityStop, index) => (
                  <div key={index}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl mb-1">{cityStop.city}, {cityStop.country}</h3>
                        <p className="text-sm text-gray-600">{cityStop.days} days</p>
                      </div>
                    </div>

                    <div className="ml-13 space-y-3">
                      {cityStop.activities.map((activity, actIndex) => (
                        <div 
                          key={actIndex}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-2">{activity.name}</h4>
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Clock size={14} className="mr-1" />
                                  {activity.duration}
                                </div>
                                <div className="flex items-center">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                  </svg>
                                  {activity.cost === 0 ? 'Free' : `₹${activity.cost.toLocaleString()}`}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {activity.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {index < trip.detailedItinerary.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trip Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-teal-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p>{trip.duration}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <MapPin className="text-teal-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Destinations</p>
                    <p>{trip.cities.length} cities</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <svg className="text-teal-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Budget</p>
                    <p className="text-lg">₹{trip.budget.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Estimated cost in INR</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-2">Cities</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.cities.map((city, index) => (
                      <Badge key={index} variant="outline">
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 h-12"
                  onClick={handleCopyTrip}
                  disabled={copying}
                >
                  <Copy size={20} className="mr-2" />
                  {copying ? 'Copying...' : 'Copy Trip to My Trips'}
                </Button>

                <Button
                  variant="outline"
                  className={`w-full h-12 ${isLiked ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}`}
                  onClick={handleLike}
                >
                  <Heart size={20} className={`mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'} ({likes})
                </Button>

                <p className="text-xs text-center text-gray-500 pt-2">
                  💡 Copy this trip to customize it for your own adventure!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}