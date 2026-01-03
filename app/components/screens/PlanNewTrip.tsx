import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Calendar as CalendarIcon, FileText, Info } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useTrips } from '../../contexts/TripContext';
import { toast } from 'sonner';

export default function PlanNewTrip() {
  const navigate = useNavigate();
  const { addTrip } = useTrips();
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    tripName: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tripName.trim()) {
      newErrors.tripName = 'Trip name is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setCreating(true);

    // Create trip with a slight delay to show loading state
    // Budget will be auto-calculated by TripContext
    setTimeout(() => {
      const newTrip = addTrip({
        name: formData.tripName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        status: 'upcoming',
        cities: []
      });

      setCreating(false);
      
      // Show success message
      toast.success('Trip created successfully!', {
        description: 'Budget will be calculated as you add cities and activities.'
      });

      // Navigate to itinerary builder
      navigate(`/itinerary-builder/${newTrip.id}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Plan a New Trip</h1>
          <p className="text-gray-600">Let's create your next adventure!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <CardDescription>Fill in the basic information about your trip</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Name */}
              <div>
                <Label htmlFor="tripName">Trip Name *</Label>
                <Input
                  id="tripName"
                  value={formData.tripName}
                  onChange={(e) => setFormData({ ...formData, tripName: e.target.value })}
                  placeholder="e.g., European Adventure"
                  required
                  className={`mt-2 ${errors.tripName ? 'border-red-500' : ''}`}
                />
                {errors.tripName && (
                  <p className="text-sm text-red-500 mt-1">{errors.tripName}</p>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <div className="relative mt-2">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`pl-10 ${errors.startDate ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <div className="relative mt-2">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className={`pl-10 ${errors.endDate ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Trip Description */}
              <div>
                <Label htmlFor="description">Trip Description</Label>
                <div className="relative mt-2">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us about your trip plans..."
                    className="pl-10 min-h-32"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-teal-500 transition-colors cursor-pointer">
                  <div className="space-y-2 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="coverImage"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input id="coverImage" name="coverImage" type="file" className="sr-only" accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/dashboard')}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={creating}
                >
                  {creating ? 'Creating Trip...' : 'Create Trip & Build Itinerary'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-900">
              <Info size={20} />
              How Budget Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-teal-900">
              <p className="font-medium">Your trip budget will be automatically calculated based on:</p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>Distance between cities</strong> - Transport costs calculated by km</li>
                <li>• <strong>City cost index</strong> - Each city has a cost rating (1-10)</li>
                <li>• <strong>Stay duration</strong> - Accommodation & food costs per night/day</li>
                <li>• <strong>Activities</strong> - Sum of all activity costs you add</li>
              </ul>
              <p className="text-xs bg-teal-100 p-2 rounded mt-3">
                💡 No need to enter a budget manually - it updates automatically as you plan!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}