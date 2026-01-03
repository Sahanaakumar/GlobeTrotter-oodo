import { Users, Map, Globe, TrendingUp, Search } from 'lucide-react';
import Navigation from '../Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const statistics = [
  { title: 'Total Users', value: '12,458', change: '+12.5%', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Total Trips', value: '8,234', change: '+18.2%', icon: Map, color: 'text-teal-600', bgColor: 'bg-teal-100' },
  { title: 'Popular Cities', value: '156', change: '+8.1%', icon: Globe, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Active Now', value: '1,248', change: '+5.3%', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' },
];

const recentUsers = [
  { id: 1, name: 'Alice Cooper', email: 'alice@example.com', trips: 3, status: 'Active', joined: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', trips: 5, status: 'Active', joined: '2024-01-12' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', trips: 2, status: 'Inactive', joined: '2024-01-10' },
  { id: 4, name: 'David Lee', email: 'david@example.com', trips: 7, status: 'Active', joined: '2024-01-08' },
  { id: 5, name: 'Emma Davis', email: 'emma@example.com', trips: 4, status: 'Active', joined: '2024-01-05' },
];

const popularCities = [
  { rank: 1, city: 'Paris', country: 'France', trips: 1245 },
  { rank: 2, city: 'Tokyo', country: 'Japan', trips: 1089 },
  { rank: 3, city: 'New York', country: 'USA', trips: 987 },
  { rank: 4, city: 'London', country: 'UK', trips: 856 },
  { rank: 5, city: 'Barcelona', country: 'Spain', trips: 743 },
];

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, trips, and platform analytics</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl mb-1">{stat.value}</p>
                      <p className="text-xs text-green-600">{stat.change} from last month</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={stat.color} size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Users Management */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Users Management</CardTitle>
                  <CardDescription>Manage and monitor user accounts</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input placeholder="Search users..." className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>{user.trips}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.joined}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Cities */}
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Cities</CardTitle>
              <CardDescription>Top destinations by trip count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularCities.map((city) => (
                  <div key={city.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center">
                        {city.rank}
                      </div>
                      <div>
                        <p>{city.city}</p>
                        <p className="text-sm text-gray-600">{city.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p>{city.trips}</p>
                      <p className="text-xs text-gray-600">trips</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: 'Alice Cooper', action: 'created a new trip to Paris', time: '5 min ago' },
                  { user: 'Bob Smith', action: 'shared their trip publicly', time: '12 min ago' },
                  { user: 'Carol White', action: 'liked a community trip', time: '18 min ago' },
                  { user: 'David Lee', action: 'added 5 activities to Tokyo trip', time: '25 min ago' },
                  { user: 'Emma Davis', action: 'completed their trip to London', time: '32 min ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border-l-4 border-teal-600 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm">
                        <span>{activity.user}</span>
                        <span className="text-gray-600"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
