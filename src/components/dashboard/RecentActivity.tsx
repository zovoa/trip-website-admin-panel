
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User, Building, Car, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'booking',
      user: 'Sarah Johnson',
      action: 'booked Ocean View Suite at Paradise Resort',
      time: '2 minutes ago',
      icon: Building,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      type: 'user',
      user: 'Mike Chen',
      action: 'completed profile verification',
      time: '15 minutes ago',
      icon: User,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      type: 'vehicle',
      user: 'Emma Davis',
      action: 'booked luxury sedan for airport transfer',
      time: '32 minutes ago',
      icon: Car,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 4,
      type: 'payment',
      user: 'David Wilson',
      action: 'payment of $2,450 processed successfully',
      time: '1 hour ago',
      icon: DollarSign,
      color: 'text-amber-600 bg-amber-100'
    },
    {
      id: 5,
      type: 'booking',
      user: 'Lisa Anderson',
      action: 'cancelled booking at Mountain Lodge',
      time: '2 hours ago',
      icon: Building,
      color: 'text-red-600 bg-red-100'
    },
    {
      id: 6,
      type: 'user',
      user: 'James Brown',
      action: 'created new account and verified email',
      time: '3 hours ago',
      icon: User,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 7,
      type: 'vehicle',
      user: 'Anna Taylor',
      action: 'booked SUV rental for weekend trip',
      time: '4 hours ago',
      icon: Car,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={20} />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={cn("p-2 rounded-full", activity.color)}>
                <activity.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
