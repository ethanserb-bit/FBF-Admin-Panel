import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, XCircle, AlertCircle, Shield, Eye, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import firebaseService, { Request } from '../../services/firebaseService';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Queue = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Request[]>([]);
  const [filteredItems, setFilteredItems] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    highPriority: 0,
    pendingReview: 0,
    expertContent: 0,
    approvedToday: 0
  });
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    category: 'all'
  });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Add function to create admin user document
  const createAdminUser = async (userId: string) => {
    try {
      console.log('Starting admin user creation for userId:', userId);
      const db = firebaseService.getFirestore();
      console.log('Got Firestore instance:', !!db);
      
      const userData = {
        role: 'admin',
        email: firebaseService.getCurrentUser()?.email,
        createdAt: serverTimestamp()
      };
      console.log('Preparing user data:', userData);

      await setDoc(doc(db, 'users', userId), userData);
      console.log('Admin user document created successfully');
      toast.success('Admin user document created');
      setIsAdmin(true);
      return true;
    } catch (error: any) {
      console.error('Detailed error creating admin user:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        userId: userId,
        userEmail: firebaseService.getCurrentUser()?.email
      });
      toast.error(`Failed to create admin user: ${error.message}`);
      return false;
    }
  };

  // Check auth and admin status
  useEffect(() => {
    const user = firebaseService.getCurrentUser();
    const auth = firebaseService.getAuth();
    
    console.log('Current auth state:', {
      user: user ? {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      } : null,
      isAuthenticated: !!user,
      authInstance: !!auth,
    });

    if (user) {
      setCurrentUserId(user.uid);
      console.log('Your Firebase User ID:', user.uid);
      
      // Check if user document exists
      const checkUserDoc = async () => {
        try {
          const userDoc = await firebaseService.getUserDocument(user.uid);
          console.log('User document result:', userDoc);
          
          if (userDoc.data) {
            console.log('User role:', userDoc.data.role);
            setIsAdmin(userDoc.data.role === 'admin');
            if (userDoc.data.role !== 'admin') {
              console.log('User is not an admin, creating admin role...');
              await createAdminUser(user.uid);
            }
          } else {
            console.log('No user document found - creating admin user');
            await createAdminUser(user.uid);
          }
        } catch (error) {
          console.error('Error checking user document:', error);
        }
      };
      
      checkUserDoc();
    } else {
      console.log('No user logged in');
      toast.error('No user logged in');
    }
  }, []);

  // Test permissions only after admin status is confirmed
  useEffect(() => {
    if (isAdmin) {
      console.log('Testing permissions as admin...');
      testPermissions();
    }
  }, [isAdmin]);

  // Add test functions
  const testPermissions = async () => {
    console.log('Testing permissions...');
    try {
      // Test reading requests
      console.log('Testing read permissions...');
      const readResult = await firebaseService.getPendingRequests();
      if (readResult.error) {
        console.error('Read test failed:', readResult.error);
        toast.error('Read permission test failed');
      } else {
        console.log('Read test passed!');
        toast.success('Read permission test passed');
      }

      // Test creating a request
      console.log('Testing create permissions...');
      const createResult = await firebaseService.createRequest({
        question: 'Test Question',
        content: 'Test Content',
        status: 'pending',
        isUrgent: false,
        category: 'test',
        type: 'regular',
        userId: firebaseService.getCurrentUser()?.uid || ''
      });
      if (createResult.error) {
        console.error('Create test failed:', createResult.error);
        toast.error('Create permission test failed');
      } else {
        console.log('Create test passed!');
        toast.success('Create permission test passed');
        
        // Test updating the request (should only work for admin)
        console.log('Testing update permissions...');
        const updateResult = await firebaseService.updateRequest(createResult.id!, {
          status: 'approved'
        });
        if (updateResult.error) {
          console.error('Update test failed:', updateResult.error);
          toast.error('Update permission test failed (expected for non-admin)');
        } else {
          console.log('Update test passed!');
          toast.success('Update permission test passed (you are admin)');
        }
      }
    } catch (error) {
      console.error('Permission test error:', error);
      toast.error('Permission tests failed');
    }
  };

  useEffect(() => {
    console.log('Queue component mounted');
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    console.log('Fetching requests...');
    try {
      const response = await firebaseService.getPendingRequests();
      console.log('Firebase response:', response);
      
      if (response.error?.includes('index is currently building')) {
        toast.loading('Setting up database indexes (this may take a few minutes)...');
        setItems([]);
        setStats({
          highPriority: 0,
          pendingReview: 0,
          expertContent: 0,
          approvedToday: 0
        });
      } else if (response.data) {
        // Validate and clean the data
        const validatedData = response.data.map(item => ({
          ...item,
          type: item.type || 'regular', // Set default type if undefined
          category: item.category || 'uncategorized', // Set default category if undefined
          isUrgent: !!item.isUrgent, // Ensure boolean
          status: item.status || 'pending', // Set default status if undefined
        }));
        
        console.log('Got requests:', validatedData);
        setItems(validatedData);
        
        // Update stats with validated data
        const newStats = {
          highPriority: validatedData.filter(item => item.isUrgent).length,
          pendingReview: validatedData.filter(item => item.status === 'pending').length,
          expertContent: validatedData.filter(item => item.type === 'expert').length,
          approvedToday: validatedData.filter(item => 
            item.status === 'approved' && 
            new Date(item.createdAt.toDate()).toDateString() === new Date().toDateString()
          ).length
        };
        console.log('Updated stats:', newStats);
        setStats(newStats);
      }
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      if (error.message?.includes('index is currently building')) {
        toast.loading('Setting up database indexes (this may take a few minutes)...');
      } else {
        toast.error('Failed to load requests');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add auto-refresh while index is building
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;
    
    if (loading) {
      refreshInterval = setInterval(() => {
        fetchRequests();
      }, 5000); // Try every 5 seconds
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [loading]);

  const handleApprove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const response = await firebaseService.updateRequest(id, {
        status: 'approved',
        updatedAt: new Date() as any
      });

      if (response.success) {
        toast.success('Request approved successfully');
        fetchRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const response = await firebaseService.updateRequest(id, {
        status: 'denied',
        updatedAt: new Date() as any
      });

      if (response.success) {
        toast.success('Request denied successfully');
        fetchRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error denying request:', error);
      toast.error('Failed to deny request');
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/requests/${id}`);
  };

  // Apply filters and search
  useEffect(() => {
    let result = [...items];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.type !== 'all') {
      result = result.filter(item => item.type === filters.type);
    }
    if (filters.priority !== 'all') {
      result = result.filter(item => 
        filters.priority === 'high' ? item.isUrgent : !item.isUrgent
      );
    }
    if (filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
    }
    
    setFilteredItems(result);
  }, [items, searchTerm, filters]);

  // Get unique categories from items
  const categories = ['all', ...new Set(items
    .map(item => item.category)
    .filter(category => category) // Remove null/undefined values
  )];

  // Bulk selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(new Set(filteredItems.map(item => item.id!)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Bulk action handlers
  const handleBulkApprove = async () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    setLoading(true);
    try {
      const promises = Array.from(selectedItems).map(id =>
        firebaseService.updateRequest(id, {
          status: 'approved',
          updatedAt: new Date() as any
        })
      );

      await Promise.all(promises);
      toast.success(`${selectedItems.size} items approved successfully`);
      setSelectedItems(new Set());
      fetchRequests();
    } catch (error) {
      console.error('Error in bulk approve:', error);
      toast.error('Failed to approve some items');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    setLoading(true);
    try {
      const promises = Array.from(selectedItems).map(id =>
        firebaseService.updateRequest(id, {
          status: 'denied',
          updatedAt: new Date() as any
        })
      );

      await Promise.all(promises);
      toast.success(`${selectedItems.size} items rejected successfully`);
      setSelectedItems(new Set());
      fetchRequests();
    } catch (error) {
      console.error('Error in bulk reject:', error);
      toast.error('Failed to reject some items');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Moderation Queue</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">High Priority</h3>
          </div>
          <p className="text-2xl font-bold">{stats.highPriority}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold">Pending Review</h3>
          </div>
          <p className="text-2xl font-bold">{stats.pendingReview}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Shield className="w-5 h-5" />
            <h3 className="font-semibold">Expert Content</h3>
          </div>
          <p className="text-2xl font-bold">{stats.expertContent}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-semibold">Approved Today</h3>
          </div>
          <p className="text-2xl font-bold">{stats.approvedToday}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="regular">Regular</option>
              <option value="expert">Expert</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="normal">Normal Priority</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : 
                   (category?.charAt(0).toUpperCase() + category?.slice(1)) || 'Uncategorized'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg shadow mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-medium">
              {selectedItems.size} items selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve Selected
            </button>
            <button
              onClick={handleBulkReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject Selected
            </button>
          </div>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => handleViewDetails(item.id!)}
                className={`${item.isUrgent ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'} cursor-pointer transition-colors`}
              >
                <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id!)}
                    onChange={() => handleSelectItem(item.id!)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.type === 'regular' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'expert' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.type ? (item.type.charAt(0).toUpperCase() + item.type.slice(1)) : 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900 line-clamp-2">{item.question}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.userId}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.isUrgent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.isUrgent ? 'High' : 'Normal'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.category || 'Uncategorized'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleApprove(e, item.id!)}
                      className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleReject(e, item.id!)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(item.id!);
                      }}
                      className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Queue; 