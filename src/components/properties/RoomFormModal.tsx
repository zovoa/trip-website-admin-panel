
import React, { useState, useEffect } from 'react';
import { Room } from '@/pages/PropertyManagement';
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
import { X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Omit<Room, 'id' | 'propertyId'>) => void;
  room?: Room | null;
}

const bedTypes = ['Single', 'Twin', 'Double', 'Queen Size', 'King Size', 'Sofa Bed'];
const roomTypes = ['Standard Room', 'Deluxe Room', 'Suite', 'Presidential Suite', 'Family Room', 'Twin Room'];

const RoomFormModal: React.FC<RoomFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  room,
}) => {
  const [formData, setFormData] = useState({
    roomType: '',
    pricePerNight: 0,
    maxOccupancy: 1,
    availability: 1,
    roomSize: '',
    bedType: '',
    roomAmenities: '',
    roomImages: [] as string[],
  });

  useEffect(() => {
    if (room) {
      setFormData({
        roomType: room.roomType,
        pricePerNight: room.pricePerNight,
        maxOccupancy: room.maxOccupancy,
        availability: room.availability,
        roomSize: room.roomSize,
        bedType: room.bedType,
        roomAmenities: room.roomAmenities.join(', '),
        roomImages: room.roomImages,
      });
    } else {
      setFormData({
        roomType: '',
        pricePerNight: 0,
        maxOccupancy: 1,
        availability: 1,
        roomSize: '',
        bedType: '',
        roomAmenities: '',
        roomImages: [],
      });
    }
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.roomType || !formData.bedType || formData.pricePerNight <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const roomData: Omit<Room, 'id' | 'propertyId'> = {
      roomType: formData.roomType,
      pricePerNight: formData.pricePerNight,
      maxOccupancy: formData.maxOccupancy,
      availability: formData.availability,
      roomSize: formData.roomSize,
      bedType: formData.bedType,
      roomAmenities: formData.roomAmenities.split(',').map(a => a.trim()).filter(a => a),
      roomImages: formData.roomImages.length > 0 ? formData.roomImages : ['https://images.unsplash.com/photo-1721322800607-8c38375eef04'],
    };

    onSave(roomData);
    toast.success(room ? 'Room updated successfully!' : 'Room created successfully!');
  };

  const handleImageAdd = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        roomImages: [...prev.roomImages, imageUrl]
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roomImages: prev.roomImages.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {room ? 'Edit Room' : 'Add New Room'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomType">Room Type *</Label>
              <Select value={formData.roomType} onValueChange={(value) => setFormData(prev => ({ ...prev, roomType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pricePerNight">Price per Night *</Label>
              <Input
                id="pricePerNight"
                type="number"
                value={formData.pricePerNight}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: parseInt(e.target.value) || 0 }))}
                placeholder="Enter price"
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxOccupancy">Max Occupancy</Label>
              <Input
                id="maxOccupancy"
                type="number"
                value={formData.maxOccupancy}
                onChange={(e) => setFormData(prev => ({ ...prev, maxOccupancy: parseInt(e.target.value) || 1 }))}
                min="1"
                max="10"
              />
            </div>

            <div>
              <Label htmlFor="availability">Available Rooms</Label>
              <Input
                id="availability"
                type="number"
                value={formData.availability}
                onChange={(e) => setFormData(prev => ({ ...prev, availability: parseInt(e.target.value) || 1 }))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="roomSize">Room Size</Label>
              <Input
                id="roomSize"
                value={formData.roomSize}
                onChange={(e) => setFormData(prev => ({ ...prev, roomSize: e.target.value }))}
                placeholder="e.g., 45 sq m"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bedType">Bed Type *</Label>
            <Select value={formData.bedType} onValueChange={(value) => setFormData(prev => ({ ...prev, bedType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select bed type" />
              </SelectTrigger>
              <SelectContent>
                {bedTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="roomAmenities">Room Amenities</Label>
            <Input
              id="roomAmenities"
              value={formData.roomAmenities}
              onChange={(e) => setFormData(prev => ({ ...prev, roomAmenities: e.target.value }))}
              placeholder="Enter amenities separated by commas"
            />
            <p className="text-sm text-gray-500 mt-1">Example: Ocean View, Balcony, Mini Bar, WiFi</p>
          </div>

          <div>
            <Label>Room Images</Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleImageAdd}
                className="w-full"
              >
                Add Image URL
              </Button>
              {formData.roomImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {formData.roomImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Room ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {room ? 'Update Room' : 'Create Room'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomFormModal;
