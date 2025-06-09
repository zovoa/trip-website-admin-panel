
import React from 'react';
import { X, Calendar, User, CreditCard, MapPin, Car, Building, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookingDate: string;
  amountPaid: number;
  status: 'Confirmed' | 'Cancelled' | 'Completed' | 'Pending';
  bookingType: 'Room' | 'Vehicle';
  room?: {
    id: string;
    type: string;
    propertyName: string;
    image: string;
  };
  vehicle?: {
    id: string;
    name: string;
    type: string;
    image: string;
  };
  startDate?: string;
  endDate?: string;
}

interface RecentBooking {
  id: string;
  userName: string;
  startDate: string;
  endDate: string;
  amountPaid: number;
  status: string;
}

interface BookingViewModalProps {
  booking: Booking;
  onClose: () => void;
  onCancel: () => void;
  onRefund: () => void;
}

const BookingViewModal: React.FC<BookingViewModalProps> = ({
  booking,
  onClose,
  onCancel,
  onRefund
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Mock recent bookings data for this user
  const recentBookings: RecentBooking[] = [
    {
      id: 'BK001',
      userName: booking.userName,
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      amountPaid: 8500,
      status: 'Completed'
    },
    {
      id: 'BK002',
      userName: booking.userName,
      startDate: '2024-01-05',
      endDate: '2024-01-07',
      amountPaid: 5200,
      status: 'Completed'
    }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Details - {booking.id}</span>
            <Badge className={getStatusBadgeColor(booking.status)}>
              {booking.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-lg font-medium">{booking.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p>{booking.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-sm text-gray-600">{booking.userId}</p>
                </div>
              </CardContent>
            </Card>

            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking Type</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={booking.bookingType === 'Room' ? 'default' : 'secondary'}>
                      {booking.bookingType}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking Date</label>
                  <p>{formatDate(booking.bookingDate)}</p>
                </div>
                {booking.bookingType === 'Vehicle' && booking.startDate && booking.endDate && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Start Date</label>
                      <p>{formatDate(booking.startDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">End Date</label>
                      <p>{formatDate(booking.endDate)}</p>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount Paid</label>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(booking.amountPaid)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Property/Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {booking.bookingType === 'Room' ? (
                    <Building className="h-5 w-5" />
                  ) : (
                    <Car className="h-5 w-5" />
                  )}
                  {booking.bookingType === 'Room' ? 'Property Details' : 'Vehicle Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {booking.bookingType === 'Room' && booking.room ? (
                  <div className="space-y-4">
                    <img
                      src={booking.room.image}
                      alt={booking.room.type}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Property Name</label>
                      <p className="font-medium">{booking.room.propertyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Room Type</label>
                      <p>{booking.room.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Room ID</label>
                      <p className="text-sm text-gray-600">{booking.room.id}</p>
                    </div>
                  </div>
                ) : booking.vehicle ? (
                  <div className="space-y-4">
                    <img
                      src={booking.vehicle.image}
                      alt={booking.vehicle.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vehicle Name</label>
                      <p className="font-medium">{booking.vehicle.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vehicle Type</label>
                      <p>{booking.vehicle.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vehicle ID</label>
                      <p className="text-sm text-gray-600">{booking.vehicle.id}</p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Bookings by User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBookings.map((recentBooking) => (
                    <div key={recentBooking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{recentBooking.id}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(recentBooking.startDate)} - {formatDate(recentBooking.endDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatCurrency(recentBooking.amountPaid)}</p>
                        <Badge className={getStatusBadgeColor(recentBooking.status)} variant="outline">
                          {recentBooking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="destructive"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel Booking
            </Button>
            <Button
              variant="outline"
              onClick={onRefund}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Process Refund
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingViewModal;
