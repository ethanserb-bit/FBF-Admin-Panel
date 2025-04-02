import React, { useState, useEffect } from 'react';
import { XCircle, Search } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  rating: number;
  specialties: string[];
  responseRate: number;
}

interface AssignExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (expertId: string) => void;
}

const AssignExpertModal: React.FC<AssignExpertModalProps> = ({ isOpen, onClose, onAssign }) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/experts');
        const data = await response.json();
        setExperts(data);
      } catch (error) {
        console.error('Error fetching experts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchExperts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Assign Expert</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search experts by name or specialty..."
              className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4">Loading experts...</div>
          ) : (
            <div className="grid gap-4">
              {filteredExperts.map(expert => (
                <div
                  key={expert.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    onAssign(expert.id);
                    onClose();
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{expert.name}</h3>
                      <div className="flex gap-2 mt-1">
                        {expert.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {expert.rating.toFixed(1)} ★
                      </div>
                      <div className="text-sm text-gray-500">
                        {expert.responseRate}% response rate
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignExpertModal; 