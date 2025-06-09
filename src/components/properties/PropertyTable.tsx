
import React, { useState } from 'react';
import { Property } from '@/pages/PropertyManagement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Edit, Check, X, Trash2, Search, Star } from 'lucide-react';
import ConfirmationDialog from '@/components/users/ConfirmationDialog';

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onView: (property: Property) => void;
  onUpdateStatus: (propertyId: string, status: Property['status']) => void;
  onDelete: (propertyId: string) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  onEdit,
  onView,
  onUpdateStatus,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('revenue');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'approve' | 'reject' | 'delete';
    property: Property;
  } | null>(null);

  const itemsPerPage = 10;

  // Filter and search properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'revenue') return b.revenue - a.revenue;
    if (sortBy === 'bookings') return b.bookings - a.bookings;
    return 0;
  });

  // Paginate properties
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = sortedProperties.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleConfirmAction = () => {
    if (!confirmDialog) return;

    const { type, property } = confirmDialog;
    
    if (type === 'approve') {
      onUpdateStatus(property.id, 'Approved');
    } else if (type === 'reject') {
      onUpdateStatus(property.id, 'Rejected');
    } else if (type === 'delete') {
      onDelete(property.id);
    }

    setConfirmDialog(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search by property name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="bookings">Bookings</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProperties.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <img 
                    src={property.thumbnail} 
                    alt={property.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="font-semibold">{property.name}</span>
                </div>
              </TableCell>
              <TableCell>{property.location}</TableCell>
              <TableCell>
                <Badge variant="outline">{property.type}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{property.rating}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(property.status)}</TableCell>
              <TableCell>{property.bookings}</TableCell>
              <TableCell>${property.revenue.toLocaleString()}</TableCell>
              <TableCell className="text-sm text-gray-600">{property.admin}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(property)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(property)}
                  >
                    <Edit size={16} />
                  </Button>
                  {property.status === 'Pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDialog({ type: 'approve', property })}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDialog({ type: 'reject', property })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={16} />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDialog({ type: 'delete', property })}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="p-6 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedProperties.length)} of {sortedProperties.length} properties
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmationDialog
          title={
            confirmDialog.type === 'approve' ? 'Approve Property' :
            confirmDialog.type === 'reject' ? 'Reject Property' :
            'Delete Property'
          }
          message={
            confirmDialog.type === 'approve' 
              ? `Are you sure you want to approve "${confirmDialog.property.name}"?`
              : confirmDialog.type === 'reject'
              ? `Are you sure you want to reject "${confirmDialog.property.name}"?`
              : `Are you sure you want to delete "${confirmDialog.property.name}"? This action cannot be undone.`
          }
          confirmText={
            confirmDialog.type === 'approve' ? 'Approve' :
            confirmDialog.type === 'reject' ? 'Reject' :
            'Delete'
          }
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
};

export default PropertyTable;
