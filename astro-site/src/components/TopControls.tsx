import React from 'react';

export default function TopControls() {
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
        Evaluate
      </button>
      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
        Code
      </button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
        Publish
      </button>
    </div>
  );
}
