
import React, { useState, useEffect } from 'react';
import { Property } from '@/pages/PropertyManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Omit<Property, 'id'>) => void;
  property?: Property | null;
}

const propertyTypes = ['Hotel', 'Guest House', 'Resort', 'Other'];

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  property,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    type: '' as Property['type'] | '',
    rating: 4.0,
    description: '',
    amenities: '',
    thumbnail: '',
    admin: '',
    status: 'Pending' as Property['status'],
    bookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        address: property.address,
        city: property.city,
        state: property.state,
        country: property.country,
        zipCode: property.zipCode,
        type: property.type,
        rating: property.rating,
        description: property.description,
        amenities: property.amenities.join(', '),
        thumbnail: property.thumbnail,
        admin: property.admin,
        status: property.status,
        bookings: property.bookings,
        revenue: property.revenue,
      });
    } else {
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        type: '',
        rating: 4.0,
        description: '',
        amenities: '',
        thumbnail: '',
        admin: '',
        status: 'Pending',
        bookings: 0,
        revenue: 0,
      });
    }
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city || !formData.type || !formData.admin) {
      toast.error('Please fill in all required fields');
      return;
    }

    const propertyData: Omit<Property, 'id'> = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: formData.zipCode,
      location: `${formData.city}, ${formData.state}, ${formData.country}`,
      type: formData.type as Property['type'],
      rating: formData.rating,
      description: formData.description,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      images: [formData.thumbnail || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'], // Add images property
      admin: formData.admin,
      status: formData.status,
      bookings: formData.bookings,
      revenue: formData.revenue,
    };

    onSave(propertyData);
    toast.success(property ? 'Property updated successfully!' : 'Property created successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? 'Edit Property' : 'Add New Property'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Property Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter property name"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Property Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Property['type'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter street address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Enter city"
                required
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Enter state"
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                placeholder="Enter zip code"
              />
            </div>

            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 4.0 }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="admin">Property Admin *</Label>
            <Input
              id="admin"
              value={formData.admin}
              onChange={(e) => setFormData(prev => ({ ...prev, admin: e.target.value }))}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter property description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="amenities">Amenities</Label>
            <Input
              id="amenities"
              value={formData.amenities}
              onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
              placeholder="Enter amenities separated by commas"
            />
            <p className="text-sm text-gray-500 mt-1">Example: Pool, WiFi, Gym, Restaurant</p>
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
              placeholder="Enter image URL"
            />
          </div>

          {property && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bookings">Number of Bookings</Label>
                <Input
                  id="bookings"
                  type="number"
                  value={formData.bookings}
                  onChange={(e) => setFormData(prev => ({ ...prev, bookings: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="revenue">Revenue Generated</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => setFormData(prev => ({ ...prev, revenue: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {property ? 'Update Property' : 'Create Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormModal;
