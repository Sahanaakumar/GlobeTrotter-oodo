import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Map, Search, Users, Calendar, Settings, User } from 'lucide-react';
import Logo from './Logo';
import { Avatar, AvatarFallback } from './ui/avatar';
import TripSelector from './TripSelector';
import { useTrips } from '../contexts/TripContext';

export default function Navigation() {
  const location = useLocation();
  const { activeTrip } = useTrips();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/trips', label: 'My Trips', icon: Map },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard">
            <Logo size="sm" />
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Trip Selector - shows active trip context */}
            <div className="hidden lg:block">
              <TripSelector />
            </div>

            <Link to="/plan-trip">
              <button className="hidden sm:flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                <PlusCircle size={20} />
                <span>New Trip</span>
              </button>
            </Link>

            <Link to="/profile">
              <Avatar className="cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-teal-600 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-teal-600 to-blue-600 text-white">
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
        
        {/* Active Trip Indicator - shows which trip is currently selected */}
        {activeTrip && (
          <div className="pb-2 text-xs text-gray-600">
            <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
              📍 Active: {activeTrip.name}
            </span>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                  isActive(item.path)
                    ? 'text-teal-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}