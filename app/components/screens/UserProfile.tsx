import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Globe, MapPin, Camera, LogOut, Save } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { useUser } from '../../contexts/UserContext';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useUser();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const savedDestinations = [
    'Tokyo, Japan',
    'Paris, France',
    'Santorini, Greece',
    'New York, USA'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateUser({ profileImage: reader.result as string });
          setUploadingImage(false);
          toast.success('Profile photo updated!');
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile logic
    updateUser(formData);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Picture Card */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  {user?.profileImage ? (
                    <AvatarImage src={user.profileImage} alt={formData.fullName} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-teal-600 to-blue-600 text-white text-4xl">
                      {getInitials(formData.fullName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label 
                  htmlFor="profile-image-upload"
                  className={`absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors cursor-pointer ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Camera size={20} />
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Click the camera icon to upload a profile photo
              </p>
              <h3 className="mt-4 text-xl">{formData.fullName}</h3>
              <p className="text-gray-600 text-sm">{formData.email}</p>
              
              <Separator className="my-4 w-full" />
              
              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span>{formData.location || 'Location not set'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe size={16} className="mr-2" />
                  <span>Member since {user?.memberSince || 'January 2024'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  <Save className="mr-2" size={20} />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Saved Destinations */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Saved Destinations</CardTitle>
            <CardDescription>Places you want to visit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {savedDestinations.map((destination, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer"
                >
                  <MapPin className="mx-auto text-teal-600 mb-2" size={24} />
                  <p className="text-sm">{destination}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p>Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates about your trips</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p>Public Profile</p>
                <p className="text-sm text-gray-600">Make your trips visible to community</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>

            <Separator />

            <Button 
              variant="outline" 
              className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={20} />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}