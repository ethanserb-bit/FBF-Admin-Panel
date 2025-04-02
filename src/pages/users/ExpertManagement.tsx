import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, CheckCircle, X, Shield } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  email: string;
  specialty: string[];
  bio: string;
  status: 'active' | 'pending' | 'inactive';
  verified: boolean;
  joinedDate: Date;
  totalAdvice: number;
  rating: number;
}

const ExpertManagement = () => {
  const [experts, setExperts] = useState<Expert[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.j@example.com',
      specialty: ['Relationship Counseling', 'Dating Psychology'],
      bio: 'Certified relationship counselor with 10+ years experience',
      status: 'active',
      verified: true,
      joinedDate: new Date('2023-01-15'),
      totalAdvice: 156,
      rating: 4.8
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [formData, setFormData] = useState<Omit<Expert, 'id' | 'joinedDate' | 'totalAdvice'>>({
    name: '',
    email: '',
    specialty: [],
    bio: '',
    status: 'pending',
    verified: false,
    rating: 0
  });

  const handleOpenModal = (expert?: Expert) => {
    if (expert) {
      setEditingExpert(expert);
      setFormData({
        name: expert.name,
        email: expert.email,
        specialty: [...expert.specialty],
        bio: expert.bio,
        status: expert.status,
        verified: expert.verified,
        rating: expert.rating
      });
    } else {
      setEditingExpert(null);
      setFormData({
        name: '',
        email: '',
        specialty: [],
        bio: '',
        status: 'pending',
        verified: false,
        rating: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpert(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExpert) {
      setExperts(prev =>
        prev.map(expert =>
          expert.id === editingExpert.id
            ? { ...expert, ...formData }
            : expert
        )
      );
    } else {
      const newExpert: Expert = {
        ...formData,
        id: Date.now().toString(),
        joinedDate: new Date(),
        totalAdvice: 0
      };
      setExperts(prev => [...prev, newExpert]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setExperts(prev => prev.filter(expert => expert.id !== id));
  };

  const handleSpecialtyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      specialty: prev.specialty.includes(value)
        ? prev.specialty.filter(s => s !== value)
        : [...prev.specialty, value]
    }));
  };

  const specialtyOptions = [
    'Relationship Counseling',
    'Dating Psychology',
    'Online Dating',
    'Dating Safety',
    'Communication Skills',
    'Red Flag Awareness'
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expert Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Add New Expert
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Active Experts</h2>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-4">Expert</th>
                <th className="pb-4">Specialty</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Rating</th>
                <th className="pb-4">Total Advice</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experts.map((expert) => (
                <tr key={expert.id} className="border-t">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium flex items-center gap-1">
                          {expert.name}
                          {expert.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{expert.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {expert.specialty.map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      expert.status === 'active' ? 'bg-green-100 text-green-800' :
                      expert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {expert.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-yellow-500">★</span> {expert.rating.toFixed(1)}
                  </td>
                  <td className="py-4">{expert.totalAdvice.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(expert)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(expert.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingExpert ? 'Edit Expert' : 'Add New Expert'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Specialty
                  </label>
                  <div className="space-y-2">
                    {specialtyOptions.map((specialty) => (
                      <label key={specialty} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.specialty.includes(specialty)}
                          onChange={() => handleSpecialtyChange(specialty)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Expert['status'] }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium">Verified Expert</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {editingExpert ? 'Save Changes' : 'Add Expert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertManagement;
