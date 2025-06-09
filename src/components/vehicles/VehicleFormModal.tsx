
import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Vehicle } from '@/pages/VehicleManagement';

interface VehicleFormModalProps {
  vehicle?: Vehicle;
  onClose: () => void;
  onSubmit: (vehicleData: Omit<Vehicle, 'id'>) => void;
}

const VehicleFormModal = ({ vehicle, onClose, onSubmit }: VehicleFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    vehicleNumber: '',
    type: 'Bike' as Vehicle['type'],
    category: '2W' as Vehicle['category'],
    description: '',
    mileage: '',
    thumbnail: '',
    images: [''],
    hourlyPrice: 0,
    dailyPrice: 0,
    weeklyPrice: 0,
    availability: 'Available' as Vehicle['availability'],
    vendor: '',
    status: 'Pending' as Vehicle['status'],
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name,
        vehicleNumber: vehicle.vehicleNumber,
        type: vehicle.type,
        category: vehicle.category,
        description: vehicle.description,
        mileage: vehicle.mileage,
        thumbnail: vehicle.thumbnail,
        images: vehicle.images,
        hourlyPrice: vehicle.pricing.hourly,
        dailyPrice: vehicle.pricing.daily,
        weeklyPrice: vehicle.pricing.weekly,
        availability: vehicle.availability,
        vendor: vehicle.vendor,
        status: vehicle.status,
      });
    }
  }, [vehicle]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleTypeChange = (type: Vehicle['type']) => {
    const category = (['Bike', 'Scooter'].includes(type)) ? '2W' : '4W';
    setFormData(prev => ({ ...prev, type, category }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleData: Omit<Vehicle, 'id'> = {
      name: formData.name,
      vehicleNumber: formData.vehicleNumber,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      mileage: formData.mileage,
      images: formData.images.filter(img => img.trim() !== ''),
      thumbnail: formData.thumbnail || formData.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      pricing: {
        hourly: formData.hourlyPrice,
        daily: formData.dailyPrice,
        weekly: formData.weeklyPrice,
      },
      availability: formData.availability,
      vendor: formData.vendor,
      status: formData.status,
      dateOfListing: vehicle?.dateOfListing || new Date().toISOString().split('T')[0],
      revenue: vehicle?.revenue || 0,
    };

    onSubmit(vehicleData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Royal Enfield Classic 350"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                placeholder="e.g., KA01AB1234"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bike">Bike</SelectItem>
                  <SelectItem value="Scooter">Scooter</SelectItem>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
                placeholder="e.g., 35 kmpl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter vehicle description..."
              required
            />
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyPrice">Hourly Price (₹)</Label>
                <Input
                  id="hourlyPrice"
                  type="number"
                  value={formData.hourlyPrice}
                  onChange={(e) => handleInputChange('hourlyPrice', Number(e.target.value))}
                  placeholder="150"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyPrice">Daily Price (₹)</Label>
                <Input
                  id="dailyPrice"
                  type="number"
                  value={formData.dailyPrice}
                  onChange={(e) => handleInputChange('dailyPrice', Number(e.target.value))}
                  placeholder="800"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weeklyPrice">Weekly Price (₹)</Label>
                <Input
                  id="weeklyPrice"
                  type="number"
                  value={formData.weeklyPrice}
                  onChange={(e) => handleInputChange('weeklyPrice', Number(e.target.value))}
                  placeholder="4500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Vehicle Images</h3>
              <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                <Upload size={16} className="mr-2" />
                Add Image
              </Button>
            </div>
            
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImageField(index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select value={formData.availability} onValueChange={(value: Vehicle['availability']) => handleInputChange('availability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Not Available">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor/Partner</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                placeholder="e.g., Bike Rentals Co."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: Vehicle['status']) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleFormModal;
