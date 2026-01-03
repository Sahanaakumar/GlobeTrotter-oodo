import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { TripProvider } from './contexts/TripContext';
import { UserProvider } from './contexts/UserContext';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import Dashboard from './screens/Dashboard';
import PlanNewTrip from './screens/PlanNewTrip';
import ItineraryBuilder from './screens/ItineraryBuilder';
import TripListing from './screens/TripListing';
import UserProfile from './screens/UserProfile';
import ActivitySearch from './screens/ActivitySearch';
import ItineraryView from './screens/ItineraryView';
import CommunityTab from './screens/CommunityTab';
import PublicTripDetail from './components/screens/PublicTripDetail';
import CalendarView from './screens/CalendarView';
import AdminPanel from './screens/AdminPanel';

export default function App() {
  return (
    <UserProvider>
      <TripProvider>
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegistrationScreen />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plan-trip" element={<PlanNewTrip />} />
            <Route path="/itinerary-builder/:tripId" element={<ItineraryBuilder />} />
            <Route path="/trips" element={<TripListing />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/search" element={<ActivitySearch />} />
            <Route path="/itinerary/:tripId" element={<ItineraryView />} />
            <Route path="/community" element={<CommunityTab />} />
            <Route path="/community/trip/:tripId" element={<PublicTripDetail />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </BrowserRouter>
      </TripProvider>
    </UserProvider>
  );
}