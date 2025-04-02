// src/pages/community/DatingTips.tsx
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, BarChart2, X } from 'lucide-react';

interface Tip {
  id: string;
  title: string;
  description: string;
  category: 'Red Flags' | 'Green Flags' | 'Communication' | 'Featured';
  content: string;
  status: 'active' | 'draft' | 'archived';
  reads: number;
  createdAt: Date;
}

const DatingTips = () => {
  const [tips, setTips] = useState<Tip[]>([
    {
      id: '1',
      title: 'Love Bombing Warning Signs',
      description: 'Must-read guide for modern dating',
      category: 'Featured',
      content: 'Full guide content here...',
      status: 'active',
      reads: 15000,
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Red Flags 101',
      description: 'Essential red flags to watch out for',
      category: 'Red Flags',
      content: 'Full guide content here...',
      status: 'active',
      reads: 12000,
      createdAt: new Date()
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [formData, setFormData] = useState<Omit<Tip, 'id' | 'reads' | 'createdAt'>>({
    title: '',
    description: '',
    category: 'Red Flags',
    content: '',
    status: 'draft'
  });

  const handleOpenModal = (tip?: Tip) => {
    if (tip) {
      setEditingTip(tip);
      setFormData({
        title: tip.title,
        description: tip.description,
        category: tip.category,
        content: tip.content,
        status: tip.status
      });
    } else {
      setEditingTip(null);
      setFormData({
        title: '',
        description: '',
        category: 'Red Flags',
        content: '',
        status: 'draft'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTip(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTip) {
      setTips(prev =>
        prev.map(tip =>
          tip.id === editingTip.id
            ? { ...tip, ...formData }
            : tip
        )
      );
    } else {
      const newTip: Tip = {
        ...formData,
        id: Date.now().toString(),
        reads: 0,
        createdAt: new Date()
      };
      setTips(prev => [...prev, newTip]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setTips(prev => prev.filter(tip => tip.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dating Tips Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Create New Tip
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Active Tips</h2>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-4">Title</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Total Reads</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Created</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tips.map((tip) => (
                <tr key={tip.id} className="border-t">
                  <td className="py-4">
                    <div>
                      <h3 className="font-medium">{tip.title}</h3>
                      <p className="text-sm text-gray-500">{tip.description}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tip.category === 'Featured' ? 'bg-purple-100 text-purple-800' :
                      tip.category === 'Red Flags' ? 'bg-red-100 text-red-800' :
                      tip.category === 'Green Flags' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {tip.category}
                    </span>
                  </td>
                  <td className="py-4">{tip.reads.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {tip.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500">
                    {tip.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(tip)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <BarChart2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(tip.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingTip ? 'Edit Dating Tip' : 'Create New Dating Tip'}
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
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Tip['category'] }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Featured">Featured</option>
                    <option value="Red Flags">Red Flags</option>
                    <option value="Green Flags">Green Flags</option>
                    <option value="Communication">Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Tip['status'] }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px]"
                    required
                  />
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
                  {editingTip ? 'Save Changes' : 'Create Tip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatingTips;