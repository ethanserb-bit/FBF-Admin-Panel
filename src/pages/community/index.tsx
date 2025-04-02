import React from 'react';
import { Users } from 'lucide-react';

const Community = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Community</h1>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Add community overview cards */}
      </div>
    </div>
  );
};

export default Community;