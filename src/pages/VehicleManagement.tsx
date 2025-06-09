
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppSidebar from '@/components/ui/AppSidebar';
import Navbar from '@/components/ui/Navbar';
import VehicleTable from '@/components/vehicles/VehicleTable';
import VehicleFormModal from '@/components/vehicles/VehicleFormModal';
import VehicleViewModal from '@/components/vehicles/VehicleViewModal';
import ConfirmationDialog from '@/components/users/ConfirmationDialog';

export interface Vehicle {
  id: string;
  name: string;
  vehicleNumber: string;
  type: 'Bike' | 'Scooter' | 'Car' | 'SUV' | 'Other';
  category: '2W' | '4W';
  description: string;
  mileage: string;
  images: string[];
  thumbnail: string;
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  availability: 'Available' | 'Not Available';
  vendor: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateOfListing: string;
  revenue: number;
}

export interface VehicleBooking {
  id: string;
  vehicleId: string;
  userName: string;
  startDate: string;
  endDate: string;
  amountPaid: number;
  status: 'Confirmed' | 'Cancelled' | 'Completed';
}

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      name: 'Royal Enfield Classic 350',
      vehicleNumber: 'KA01AB1234',
      type: 'Bike',
      category: '2W',
      description: 'Classic touring bike with excellent performance',
      mileage: '35 kmpl',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      pricing: { hourly: 150, daily: 800, weekly: 4500 },
      availability: 'Available',
      vendor: 'Bike Rentals Co.',
      status: 'Approved',
      dateOfListing: '2024-01-15',
      revenue: 25600
    },
    {
      id: '2',
      name: 'Honda Activa 6G',
      vehicleNumber: 'KA02CD5678',
      type: 'Scooter',
      category: '2W',
      description: 'Fuel efficient scooter perfect for city rides',
      mileage: '60 kmpl',
      images: [
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890',
      pricing: { hourly: 80, daily: 400, weekly: 2200 },
      availability: 'Available',
      vendor: 'City Scooters',
      status: 'Pending',
      dateOfListing: '2024-02-20',
      revenue: 15200
    },
    {
      id: '3',
      name: 'Maruti Swift Dzire',
      vehicleNumber: 'KA03EF9012',
      type: 'Car',
      category: '4W',
      description: 'Comfortable sedan for family trips',
      mileage: '23 kmpl',
      images: [
        'https://images.unsplash.com/photo-1502877338535-766e1452684a',
        'https://images.unsplash.com/photo-1494905998402-395d579af36f'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1502877338535-766e1452684a',
      pricing: { hourly: 300, daily: 1800, weekly: 10500 },
      availability: 'Available',
      vendor: 'Premium Cars',
      status: 'Approved',
      dateOfListing: '2024-01-10',
      revenue: 45800
    },
    {
      id: '4',
      name: 'Mahindra Thar',
      vehicleNumber: 'KA04GH3456',
      type: 'SUV',
      category: '4W',
      description: 'Adventure ready SUV for off-road experiences',
      mileage: '15 kmpl',
      images: [
        'https://images.unsplash.com/photo-1494905998402-395d579af36f',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1494905998402-395d579af36f',
      pricing: { hourly: 500, daily: 3000, weekly: 18000 },
      availability: 'Not Available',
      vendor: 'Adventure Rentals',
      status: 'Approved',
      dateOfListing: '2024-02-01',
      revenue: 72000
    }
  ]);

  const [bookings] = useState<VehicleBooking[]>([
    {
      id: 'B001',
      vehicleId: '1',
      userName: 'John Doe',
      startDate: '2024-03-01',
      endDate: '2024-03-03',
      amountPaid: 2400,
      status: 'Completed'
    },
    {
      id: 'B002',
      vehicleId: '3',
      userName: 'Jane Smith',
      startDate: '2024-03-05',
      endDate: '2024-03-07',
      amountPaid: 5400,
      status: 'Confirmed'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ show: false, title: '', message: '', onConfirm: () => {} });

  const handleAddVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `${vehicles.length + 1}`,
    };
    setVehicles([...vehicles, newVehicle]);
    setShowAddModal(false);
  };

  const handleEditVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    if (selectedVehicle) {
      const updatedVehicles = vehicles.map(vehicle =>
        vehicle.id === selectedVehicle.id ? { ...vehicleData, id: selectedVehicle.id } : vehicle
      );
      setVehicles(updatedVehicles);
      setShowEditModal(false);
      setSelectedVehicle(null);
    }
  };

  const handleStatusChange = (vehicleId: string, newStatus: 'Approved' | 'Rejected') => {
    const updatedVehicles = vehicles.map(vehicle =>
      vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
    );
    setVehicles(updatedVehicles);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
    setVehicles(updatedVehicles);
  };

  const showConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ show: true, title, message, onConfirm });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
  };

  const twoWheelers = vehicles.filter(v => v.category === '2W');
  const fourWheelers = vehicles.filter(v => v.category === '4W');

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vehicle Partners Management</h1>
                <p className="text-gray-600 mt-2">Manage 2-wheelers and 4-wheelers for your travel booking platform</p>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
                <Plus size={20} />
                Add Vehicle
              </Button>
            </div>
          </div>

          <Tabs defaultValue="2W" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="2W" className="flex items-center gap-2">
                2-Wheelers ({twoWheelers.length})
              </TabsTrigger>
              <TabsTrigger value="4W" className="flex items-center gap-2">
                4-Wheelers ({fourWheelers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="2W" className="mt-6">
              <VehicleTable
                vehicles={twoWheelers}
                onView={(vehicle) => {
                  setSelectedVehicle(vehicle);
                  setShowViewModal(true);
                }}
                onEdit={(vehicle) => {
                  setSelectedVehicle(vehicle);
                  setShowEditModal(true);
                }}
                onApprove={(vehicleId) => {
                  showConfirmDialog(
                    'Approve Vehicle',
                    'Are you sure you want to approve this vehicle?',
                    () => {
                      handleStatusChange(vehicleId, 'Approved');
                      hideConfirmDialog();
                    }
                  );
                }}
                onReject={(vehicleId) => {
                  showConfirmDialog(
                    'Reject Vehicle',
                    'Are you sure you want to reject this vehicle?',
                    () => {
                      handleStatusChange(vehicleId, 'Rejected');
                      hideConfirmDialog();
                    }
                  );
                }}
                onDelete={(vehicleId) => {
                  showConfirmDialog(
                    'Delete Vehicle',
                    'Are you sure you want to delete this vehicle? This action cannot be undone.',
                    () => {
                      handleDeleteVehicle(vehicleId);
                      hideConfirmDialog();
                    }
                  );
                }}
              />
            </TabsContent>

            <TabsContent value="4W" className="mt-6">
              <VehicleTable
                vehicles={fourWheelers}
                onView={(vehicle) => {
                  setSelectedVehicle(vehicle);
                  setShowViewModal(true);
                }}
                onEdit={(vehicle) => {
                  setSelectedVehicle(vehicle);
                  setShowEditModal(true);
                }}
                onApprove={(vehicleId) => {
                  showConfirmDialog(
                    'Approve Vehicle',
                    'Are you sure you want to approve this vehicle?',
                    () => {
                      handleStatusChange(vehicleId, 'Approved');
                      hideConfirmDialog();
                    }
                  );
                }}
                onReject={(vehicleId) => {
                  showConfirmDialog(
                    'Reject Vehicle',
                    'Are you sure you want to reject this vehicle?',
                    () => {
                      handleStatusChange(vehicleId, 'Rejected');
                      hideConfirmDialog();
                    }
                  );
                }}
                onDelete={(vehicleId) => {
                  showConfirmDialog(
                    'Delete Vehicle',
                    'Are you sure you want to delete this vehicle? This action cannot be undone.',
                    () => {
                      handleDeleteVehicle(vehicleId);
                      hideConfirmDialog();
                    }
                  );
                }}
              />
            </TabsContent>
          </Tabs>

          {/* Modals */}
          {showAddModal && (
            <VehicleFormModal
              onClose={() => setShowAddModal(false)}
              onSubmit={handleAddVehicle}
            />
          )}

          {showEditModal && selectedVehicle && (
            <VehicleFormModal
              vehicle={selectedVehicle}
              onClose={() => {
                setShowEditModal(false);
                setSelectedVehicle(null);
              }}
              onSubmit={handleEditVehicle}
            />
          )}

          {showViewModal && selectedVehicle && (
            <VehicleViewModal
              vehicle={selectedVehicle}
              bookings={bookings.filter(b => b.vehicleId === selectedVehicle.id)}
              onClose={() => {
                setShowViewModal(false);
                setSelectedVehicle(null);
              }}
            />
          )}

          {confirmDialog.show && (
            <ConfirmationDialog
              title={confirmDialog.title}
              message={confirmDialog.message}
              confirmText="Confirm"
              onConfirm={confirmDialog.onConfirm}
              onCancel={hideConfirmDialog}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default VehicleManagement;
