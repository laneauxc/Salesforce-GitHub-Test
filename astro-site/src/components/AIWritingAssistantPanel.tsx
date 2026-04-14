import React, { useState } from 'react';

interface AIWritingAssistantPanelProps {
  hasText: boolean;
  onDismiss: () => void;
  onRewrite: () => void;
  onProofread: () => void;
  onAdjust: (tone: string) => void;
}

const adjustTones = [
  'More formal',
  'More casual',
  'More concise',
  'More detailed',
  'Friendlier',
  'More professional',
];

export default function AIWritingAssistantPanel({
  hasText,
  onDismiss,
  onRewrite,
  onProofread,
  onAdjust,
}: AIWritingAssistantPanelProps) {
  const [adjustOpen, setAdjustOpen] = useState(false);

  const buttonBase =
    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  const enabledBtn =
    'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600';
  const disabledBtn =
    'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed';

  return (
    <div className="relative border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 rounded-xl px-4 py-3 mb-3 shadow-sm">
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        aria-label="Dismiss AI writing assistant"
        className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">AI Writing Assistant</span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
        Enhance your message with AI-powered writing tools.{' '}
        {!hasText && (
          <span className="font-medium text-blue-600 dark:text-blue-400">
            Type a message below to unlock these actions.
          </span>
        )}
      </p>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Rewrite */}
        <button
          onClick={hasText ? onRewrite : undefined}
          disabled={!hasText}
          title={hasText ? 'Rewrite your message' : 'Type a message to enable Rewrite'}
          className={`${buttonBase} ${hasText ? enabledBtn : disabledBtn}`}
        >
          <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rewrite
        </button>

        {/* Proofread */}
        <button
          onClick={hasText ? onProofread : undefined}
          disabled={!hasText}
          title={hasText ? 'Proofread your message' : 'Type a message to enable Proofread'}
          className={`${buttonBase} ${hasText ? enabledBtn : disabledBtn}`}
        >
          <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Proofread
        </button>

        {/* Adjust dropdown */}
        <div className="relative">
          <button
            onClick={hasText ? () => setAdjustOpen((o) => !o) : undefined}
            disabled={!hasText}
            aria-haspopup="menu"
            aria-expanded={adjustOpen}
            title={hasText ? 'Adjust tone or style' : 'Type a message to enable Adjust'}
            className={`${buttonBase} ${hasText ? enabledBtn : disabledBtn}`}
          >
            <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Adjust
            <svg className={`w-3 h-3 transition-transform ${adjustOpen ? 'rotate-180' : ''}`} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {adjustOpen && hasText && (
            <div role="menu" className="absolute left-0 bottom-full mb-1 z-20 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
              {adjustTones.map((tone) => (
                <button
                  key={tone}
                  role="menuitem"
                  onClick={() => {
                    onAdjust(tone);
                    setAdjustOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {tone}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hint badge when no text */}
        {!hasText && (
          <span className="ml-1 text-xs text-gray-400 dark:text-gray-500 italic">
            — disabled until you type
          </span>
        )}
      </div>
    </div>
  );
}
