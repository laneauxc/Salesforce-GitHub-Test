import React, { useState } from 'react';

interface SuggestionChip {
  label: string;
}

const suggestions: SuggestionChip[] = [
  { label: 'Trip planner' },
  { label: 'Image generator' },
  { label: 'Code debugger' },
  { label: 'Research assistant' },
  { label: 'Decision helper' },
];

interface PromptCreateCardProps {
  onCreateClick?: () => void;
}

export default function PromptCreateCard({ onCreateClick }: PromptCreateCardProps) {
  const [inputValue, setInputValue] = useState('');

  const handleChipClick = (label: string) => {
    setInputValue(label);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log('Submitting:', inputValue);
      // Handle submission
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900">Create a chat prompt</h2>

      {/* Input row */}
      <div className="w-full flex gap-3">
        <button
          onClick={onCreateClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>+</span>
          <span>Create</span>
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Generate..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-12"
          />
          <button
            onClick={handleSubmit}
            className="absolute right-2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(suggestion.label)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
