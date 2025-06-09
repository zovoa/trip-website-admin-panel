
import React, { useState } from 'react';
import AppSidebar from '@/components/ui/AppSidebar';
import Navbar from '@/components/ui/Navbar';
import PropertyTable from '@/components/properties/PropertyTable';
import PropertyFormModal from '@/components/properties/PropertyFormModal';
import PropertyDetailModal from '@/components/properties/PropertyDetailModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  location: string; // Combined for display
  type: 'Hotel' | 'Guest House' | 'Resort' | 'Other';
  status: 'Pending' | 'Approved' | 'Rejected';
  rating: number;
  description: string;
  amenities: string[];
  thumbnail: string;
  images: string[]; // Added images property
  bookings: number;
  revenue: number;
  admin: string;
  rooms?: Room[];
  recentBookings?: Booking[];
}

export interface Room {
  id: string;
  propertyId: string;
  roomType: string;
  pricePerNight: number;
  maxOccupancy: number;
  availability: number;
  roomSize: string;
  bedType: string;
  roomAmenities: string[];
  roomImages: string[];
}

export interface Booking {
  id: string;
  propertyId: string;
  roomId: string;
  userName: string;
  roomBooked: string;
  bookingDate: string;
  amountPaid: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

// Mock data
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Grand Ocean Resort',
    address: '123 Beach Boulevard',
    city: 'Miami Beach',
    state: 'Florida',
    country: 'USA',
    zipCode: '33139',
    location: 'Miami Beach, FL, USA',
    type: 'Resort',
    status: 'Approved',
    rating: 4.8,
    description: 'Luxury beachfront resort with stunning ocean views and world-class amenities',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Beach Access', 'Gym', 'WiFi'],
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    ],
    bookings: 156,
    revenue: 89500,
    admin: 'john.admin@resort.com'
  },
  {
    id: '2',
    name: 'Downtown Business Hotel',
    address: '456 Broadway Street',
    city: 'New York',
    state: 'New York',
    country: 'USA',
    zipCode: '10001',
    location: 'New York, NY, USA',
    type: 'Hotel',
    status: 'Pending',
    rating: 4.2,
    description: 'Modern business hotel in the heart of downtown Manhattan',
    amenities: ['WiFi', 'Business Center', 'Gym', 'Conference Rooms', 'Restaurant'],
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    images: [
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1'
    ],
    bookings: 89,
    revenue: 45200,
    admin: 'sarah.manager@hotel.com'
  },
  {
    id: '3',
    name: 'Cozy Mountain Lodge',
    address: '789 Alpine Way',
    city: 'Aspen',
    state: 'Colorado',
    country: 'USA',
    zipCode: '81611',
    location: 'Aspen, CO, USA',
    type: 'Guest House',
    status: 'Approved',
    rating: 4.5,
    description: 'Rustic mountain lodge with breathtaking views and cozy atmosphere',
    amenities: ['Fireplace', 'Hiking Trails', 'Ski Access', 'Hot Tub', 'Mountain Views'],
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
    ],
    bookings: 67,
    revenue: 34800,
    admin: 'mike.owner@lodge.com'
  }
];

const PropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsFormModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsFormModalOpen(true);
  };

  const handleViewProperty = (property: Property) => {
    setViewingProperty(property);
    setIsDetailModalOpen(true);
  };

  const handleSaveProperty = (propertyData: Omit<Property, 'id'>) => {
    if (editingProperty) {
      // Update existing property
      setProperties(prev => prev.map(p => 
        p.id === editingProperty.id 
          ? { ...propertyData, id: editingProperty.id }
          : p
      ));
    } else {
      // Add new property
      const newProperty: Property = {
        ...propertyData,
        id: Date.now().toString(),
      };
      setProperties(prev => [...prev, newProperty]);
    }
    setIsFormModalOpen(false);
    setEditingProperty(null);
  };

  const handleUpdateStatus = (propertyId: string, status: Property['status']) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status } : p
    ));
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
                <p className="text-gray-600 mt-1">Manage hotels, resorts, and guest houses</p>
              </div>
              <Button onClick={handleAddProperty} className="flex items-center gap-2">
                <Plus size={20} />
                Add Property
              </Button>
            </div>

            <PropertyTable
              properties={properties}
              onEdit={handleEditProperty}
              onView={handleViewProperty}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteProperty}
            />

            <PropertyFormModal
              isOpen={isFormModalOpen}
              onClose={() => {
                setIsFormModalOpen(false);
                setEditingProperty(null);
              }}
              onSave={handleSaveProperty}
              property={editingProperty}
            />

            <PropertyDetailModal
              isOpen={isDetailModalOpen}
              property={viewingProperty}
              onClose={() => {
                setIsDetailModalOpen(false);
                setViewingProperty(null);
              }}
              onEdit={handleEditProperty}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PropertyManagement;
