import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, BarChart2, X } from 'lucide-react';

interface Poll {
  id: string;
  question: string;
  description: string;
  totalVotes: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  options: string[];
}

const Polls = () => {
  // Sample data - replace with actual API calls later
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      question: 'What are the red flags in dating?',
      description: '5 options • 10k+ votes',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
      totalVotes: 10000,
      status: 'active',
      createdAt: new Date()
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [formData, setFormData] = useState<Omit<Poll, 'id' | 'totalVotes' | 'createdAt'>>({
    question: '',
    description: '',
    options: ['', ''], // Start with 2 empty options
    status: 'draft'
  });

  const handleOpenModal = (poll?: Poll) => {
    if (poll) {
      setEditingPoll(poll);
      setFormData({
        question: poll.question,
        description: poll.description,
        options: [...poll.options],
        status: poll.status
      });
    } else {
      setEditingPoll(null);
      setFormData({
        question: '',
        description: '',
        options: ['', ''],
        status: 'draft'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPoll(null);
  };

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validOptions = formData.options.filter(opt => opt.trim() !== '');
    
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    if (editingPoll) {
      setPolls(prev =>
        prev.map(poll =>
          poll.id === editingPoll.id
            ? {
                ...poll,
                ...formData,
                options: validOptions
              }
            : poll
        )
      );
    } else {
      const newPoll: Poll = {
        ...formData,
        options: validOptions,
        id: Date.now().toString(),
        totalVotes: 0,
        createdAt: new Date()
      };
      setPolls(prev => [...prev, newPoll]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setPolls(prev => prev.filter(poll => poll.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Poll Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Create New Poll
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Active Polls</h2>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-4">Poll Question</th>
                <th className="pb-4">Total Votes</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Created</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll.id} className="border-t">
                  <td className="py-4">
                    <div>
                      <h3 className="font-medium">{poll.question}</h3>
                      <p className="text-sm text-gray-500">
                        {poll.options.length} options • {poll.totalVotes} votes
                      </p>
                    </div>
                  </td>
                  <td className="py-4">{poll.totalVotes.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {poll.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500">
                    {poll.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(poll)}
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
                        onClick={() => handleDelete(poll.id)}
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
                {editingPoll ? 'Edit Poll' : 'Create New Poll'}
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
                    Question
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
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
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Poll['status'] }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      Options
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-purple-600 text-sm font-medium hover:text-purple-700"
                    >
                      + Add Option
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index] = e.target.value;
                            setFormData(prev => ({ ...prev, options: newOptions }));
                          }}
                          placeholder={`Option ${index + 1}`}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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
                  {editingPoll ? 'Save Changes' : 'Create Poll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Polls; 