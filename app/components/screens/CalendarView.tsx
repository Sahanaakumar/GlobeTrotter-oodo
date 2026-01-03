import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTrips } from '../../contexts/TripContext';

/**
 * Calendar View - Always reflects the selected trip from TripSelector
 * Shows all trips if no specific trip is selected
 */
export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026
  const [view, setView] = useState<'month' | 'week'>('month');
  const { trips, activeTrip } = useTrips();

  // Filter trips - show only active trip if selected, otherwise all trips
  const displayTrips = activeTrip ? [activeTrip] : trips;

  // Color palette for trips
  const tripColors = [
    'bg-teal-600',
    'bg-blue-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-orange-600',
    'bg-green-600',
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Check if a date falls within a trip's date range
  const getTripForDate = (dateString: string) => {
    return displayTrips.filter(trip => {
      const checkDate = new Date(dateString);
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Calendar View</h1>
          <p className="text-gray-600">
            {activeTrip 
              ? `Viewing: ${activeTrip.name}` 
              : `View your trips on a calendar`
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CalendarIcon className="text-teal-600" size={32} />
                <CardTitle>{monthName}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setView('month')}
                    className={`px-4 py-2 text-sm ${view === 'month' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setView('week')}
                    className={`px-4 py-2 text-sm ${view === 'week' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'}`}
                  >
                    Week
                  </button>
                </div>
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft size={20} />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {view === 'month' && (
              <div>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center py-2">
                      <span>{day}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square"></div>
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const tripsOnDate = getTripForDate(dateString);
                    const isToday = dateString === formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

                    return (
                      <div
                        key={day}
                        className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                          isToday ? 'border-teal-600 bg-teal-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="text-sm mb-1">{day}</div>
                        <div className="space-y-1">
                          {tripsOnDate.map((trip, idx) => (
                            <div
                              key={trip.id}
                              className={`${tripColors[idx % tripColors.length]} text-white text-xs px-2 py-1 rounded truncate`}
                              title={trip.name}
                            >
                              {trip.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {view === 'week' && (
              <div className="space-y-4">
                <p className="text-center text-gray-600 py-8">
                  Weekly view would show a detailed hour-by-hour schedule with drag-and-drop functionality
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trip Legend */}
        {displayTrips.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                {activeTrip ? 'Active Trip' : 'All Trips'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayTrips.map((trip, idx) => (
                  <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${tripColors[idx % tripColors.length]}`}></div>
                      <div>
                        <p>{trip.name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {trip.cities.length} cities • ₹{trip.budget.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {displayTrips.length === 0 && (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">No trips to display</p>
              <Button 
                onClick={() => window.location.href = '/plan-trip'}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Plan Your First Trip
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
