
import React, { useState } from 'react';
import { Property, Room, Booking } from '@/pages/PropertyManagement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Star, Users, Bed, Maximize, Edit, Trash2, Plus } from 'lucide-react';
import RoomFormModal from './RoomFormModal';
import ConfirmationDialog from '@/components/users/ConfirmationDialog';

interface PropertyDetailModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onEdit: (property: Property) => void;
}

// Mock room data
const mockRooms: Room[] = [
  {
    id: '1',
    propertyId: '1',
    roomType: 'Deluxe Ocean View',
    pricePerNight: 299,
    maxOccupancy: 2,
    availability: 5,
    roomSize: '45 sq m',
    bedType: 'King Size',
    roomAmenities: ['Ocean View', 'Balcony', 'Mini Bar', 'WiFi'],
    roomImages: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04']
  },
  {
    id: '2',
    propertyId: '1',
    roomType: 'Standard Room',
    pricePerNight: 199,
    maxOccupancy: 2,
    availability: 8,
    roomSize: '32 sq m',
    bedType: 'Queen Size',
    roomAmenities: ['City View', 'WiFi', 'Air Conditioning'],
    roomImages: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04']
  }
];

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: 'BK001',
    propertyId: '1',
    roomId: '1',
    userName: 'John Doe',
    roomBooked: 'Deluxe Ocean View',
    bookingDate: '2024-06-05',
    amountPaid: 897,
    status: 'Confirmed'
  },
  {
    id: 'BK002',
    propertyId: '1',
    roomId: '2',
    userName: 'Jane Smith',
    roomBooked: 'Standard Room',
    bookingDate: '2024-06-03',
    amountPaid: 597,
    status: 'Confirmed'
  }
];

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  isOpen,
  property,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings'>('rooms');
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [bookings] = useState<Booking[]>(mockBookings);
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'deleteRoom';
    room: Room;
  } | null>(null);

  if (!property) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'Confirmed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsRoomFormOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsRoomFormOpen(true);
  };

  const handleSaveRoom = (roomData: Omit<Room, 'id' | 'propertyId'>) => {
    if (editingRoom) {
      setRooms(prev => prev.map(r => 
        r.id === editingRoom.id 
          ? { ...roomData, id: editingRoom.id, propertyId: property.id }
          : r
      ));
    } else {
      const newRoom: Room = {
        ...roomData,
        id: Date.now().toString(),
        propertyId: property.id,
      };
      setRooms(prev => [...prev, newRoom]);
    }
    setIsRoomFormOpen(false);
    setEditingRoom(null);
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    setConfirmDialog(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={property.thumbnail} 
                  alt={property.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold">{property.name}</h2>
                  <p className="text-gray-600">{property.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(property.status)}
                <Button onClick={() => onEdit(property)} variant="outline" size="sm">
                  <Edit size={16} className="mr-1" />
                  Edit Property
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <Badge variant="outline">{property.type}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{property.rating}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Admin</p>
                <p className="text-gray-900">{property.admin}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-gray-900">{property.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-gray-900 font-semibold">{property.bookings}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-gray-900 font-semibold">${property.revenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t pt-6">
              <div className="flex space-x-1 mb-4">
                <Button
                  variant={activeTab === 'rooms' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('rooms')}
                >
                  Rooms ({rooms.length})
                </Button>
                <Button
                  variant={activeTab === 'bookings' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('bookings')}
                >
                  Recent Bookings ({bookings.length})
                </Button>
              </div>

              {/* Rooms Tab */}
              {activeTab === 'rooms' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Room Management</h3>
                    <Button onClick={handleAddRoom}>
                      <Plus size={16} className="mr-1" />
                      Add Room
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Price/Night</TableHead>
                        <TableHead>Occupancy</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Bed Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img 
                                src={room.roomImages[0]} 
                                alt={room.roomType}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium">{room.roomType}</p>
                                <p className="text-xs text-gray-500">
                                  {room.roomAmenities.slice(0, 2).join(', ')}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">${room.pricePerNight}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              {room.maxOccupancy}
                            </div>
                          </TableCell>
                          <TableCell>{room.availability}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Maximize size={14} />
                              {room.roomSize}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Bed size={14} />
                              {room.bedType}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRoom(room)}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setConfirmDialog({ type: 'deleteRoom', room })}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Guest Name</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Booking Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono">{booking.id}</TableCell>
                          <TableCell className="font-medium">{booking.userName}</TableCell>
                          <TableCell>{booking.roomBooked}</TableCell>
                          <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                          <TableCell className="font-semibold">${booking.amountPaid}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Form Modal */}
      <RoomFormModal
        isOpen={isRoomFormOpen}
        onClose={() => {
          setIsRoomFormOpen(false);
          setEditingRoom(null);
        }}
        onSave={handleSaveRoom}
        room={editingRoom}
      />

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmationDialog
          title="Delete Room"
          message={`Are you sure you want to delete "${confirmDialog.room.roomType}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={() => handleDeleteRoom(confirmDialog.room.id)}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </>
  );
};

export default PropertyDetailModal;
