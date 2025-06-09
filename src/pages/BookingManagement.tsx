
import React, { useState } from 'react';
import { Search, Filter, Calendar, Download, Eye, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import BookingViewModal from '@/components/bookings/BookingViewModal';
import ConfirmationDialog from '@/components/users/ConfirmationDialog';
import Navbar from '@/components/ui/Navbar';
import AppSidebar from '@/components/ui/AppSidebar';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookingDate: string;
  amountPaid: number;
  status: 'Confirmed' | 'Cancelled' | 'Completed' | 'Pending';
  bookingType: 'Room' | 'Vehicle';
  // Room booking fields
  room?: {
    id: string;
    type: string;
    propertyName: string;
    image: string;
  };
  // Vehicle booking fields
  vehicle?: {
    id: string;
    name: string;
    type: string;
    image: string;
  };
  startDate?: string;
  endDate?: string;
}

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingTypeFilter, setBookingTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [sortBy, setSortBy] = useState('bookingDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [actionBooking, setActionBooking] = useState<Booking | null>(null);

  const itemsPerPage = 10;

  // Mock data
  const mockBookings: Booking[] = [
    {
      id: 'BK001',
      userId: 'U001',
      userName: 'John Doe',
      userEmail: 'john.doe@email.com',
      bookingDate: '2024-01-15',
      amountPaid: 15000,
      status: 'Confirmed',
      bookingType: 'Room',
      room: {
        id: 'R001',
        type: 'Deluxe Suite',
        propertyName: 'Luxury Resort Goa',
        image: '/placeholder.svg'
      }
    },
    {
      id: 'BK002',
      userId: 'U002',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@email.com',
      bookingDate: '2024-01-20',
      amountPaid: 3500,
      status: 'Pending',
      bookingType: 'Vehicle',
      vehicle: {
        id: 'V001',
        name: 'Honda Activa 6G',
        type: 'Scooter',
        image: '/placeholder.svg'
      },
      startDate: '2024-01-25',
      endDate: '2024-01-27'
    },
    {
      id: 'BK003',
      userId: 'U003',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@email.com',
      bookingDate: '2024-01-10',
      amountPaid: 25000,
      status: 'Completed',
      bookingType: 'Room',
      room: {
        id: 'R002',
        type: 'Presidential Suite',
        propertyName: 'Grand Hotel Mumbai',
        image: '/placeholder.svg'
      }
    },
    {
      id: 'BK004',
      userId: 'U004',
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@email.com',
      bookingDate: '2024-01-18',
      amountPaid: 8500,
      status: 'Confirmed',
      bookingType: 'Vehicle',
      vehicle: {
        id: 'V002',
        name: 'Maruti Swift',
        type: 'Car',
        image: '/placeholder.svg'
      },
      startDate: '2024-01-22',
      endDate: '2024-01-24'
    },
    {
      id: 'BK005',
      userId: 'U005',
      userName: 'David Brown',
      userEmail: 'david.brown@email.com',
      bookingDate: '2024-01-12',
      amountPaid: 12000,
      status: 'Cancelled',
      bookingType: 'Room',
      room: {
        id: 'R003',
        type: 'Standard Room',
        propertyName: 'Beach Resort Kerala',
        image: '/placeholder.svg'
      }
    }
  ];

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

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBookingType = bookingTypeFilter === 'All' || booking.bookingType === bookingTypeFilter;
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    
    let matchesDateRange = true;
    if (dateFromFilter && dateToFilter) {
      const bookingDate = new Date(booking.bookingDate);
      const fromDate = new Date(dateFromFilter);
      const toDate = new Date(dateToFilter);
      matchesDateRange = bookingDate >= fromDate && bookingDate <= toDate;
    }

    return matchesSearch && matchesBookingType && matchesStatus && matchesDateRange;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let aValue, bValue;
    
    if (sortBy === 'bookingDate') {
      aValue = new Date(a.bookingDate);
      bValue = new Date(b.bookingDate);
    } else if (sortBy === 'amountPaid') {
      aValue = a.amountPaid;
      bValue = b.amountPaid;
    } else {
      return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = sortedBookings.slice(startIndex, startIndex + itemsPerPage);

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const handleCancelBooking = (booking: Booking) => {
    setActionBooking(booking);
    setShowCancelDialog(true);
  };

  const handleRefundBooking = (booking: Booking) => {
    setActionBooking(booking);
    setShowRefundDialog(true);
  };

  const confirmCancelBooking = () => {
    console.log('Cancelling booking:', actionBooking?.id);
    setShowCancelDialog(false);
    setActionBooking(null);
  };

  const confirmRefundBooking = () => {
    console.log('Refunding booking:', actionBooking?.id);
    setShowRefundDialog(false);
    setActionBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
              <p className="text-gray-600">Manage all room and vehicle bookings</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Bookings</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search by name or booking ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={bookingTypeFilter} onValueChange={setBookingTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Booking Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="Room">Room</SelectItem>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    placeholder="From Date"
                    value={dateFromFilter}
                    onChange={(e) => setDateFromFilter(e.target.value)}
                  />

                  <Input
                    type="date"
                    placeholder="To Date"
                    value={dateToFilter}
                    onChange={(e) => setDateToFilter(e.target.value)}
                  />

                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [field, order] = value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bookingDate-desc">Date (Latest)</SelectItem>
                      <SelectItem value="bookingDate-asc">Date (Oldest)</SelectItem>
                      <SelectItem value="amountPaid-desc">Amount (High to Low)</SelectItem>
                      <SelectItem value="amountPaid-asc">Amount (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Property/Vehicle</TableHead>
                        <TableHead>Booking Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.userName}</div>
                              <div className="text-sm text-gray-500">{booking.userEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={booking.bookingType === 'Room' ? 'default' : 'secondary'}>
                              {booking.bookingType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={booking.bookingType === 'Room' ? booking.room?.image : booking.vehicle?.image}
                                alt="Thumbnail"
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">
                                  {booking.bookingType === 'Room' 
                                    ? `${booking.room?.propertyName} - ${booking.room?.type}`
                                    : `${booking.vehicle?.name} (${booking.vehicle?.type})`
                                  }
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {booking.bookingType === 'Room' 
                              ? formatDate(booking.bookingDate)
                              : `${formatDate(booking.startDate!)} - ${formatDate(booking.endDate!)}`
                            }
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(booking.amountPaid)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewBooking(booking)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRefundBooking(booking)}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedBookings.length)} of {sortedBookings.length} bookings
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showViewModal && selectedBooking && (
        <BookingViewModal
          booking={selectedBooking}
          onClose={() => {
            setShowViewModal(false);
            setSelectedBooking(null);
          }}
          onCancel={() => handleCancelBooking(selectedBooking)}
          onRefund={() => handleRefundBooking(selectedBooking)}
        />
      )}

      {showCancelDialog && (
        <ConfirmationDialog
          title="Cancel Booking"
          message={`Are you sure you want to cancel booking ${actionBooking?.id}? This action cannot be undone.`}
          confirmText="Cancel Booking"
          onConfirm={confirmCancelBooking}
          onCancel={() => {
            setShowCancelDialog(false);
            setActionBooking(null);
          }}
        />
      )}

      {showRefundDialog && (
        <ConfirmationDialog
          title="Refund Booking"
          message={`Are you sure you want to process a refund for booking ${actionBooking?.id}? Amount: ${actionBooking ? formatCurrency(actionBooking.amountPaid) : ''}`}
          confirmText="Process Refund"
          onConfirm={confirmRefundBooking}
          onCancel={() => {
            setShowRefundDialog(false);
            setActionBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default BookingManagement;
