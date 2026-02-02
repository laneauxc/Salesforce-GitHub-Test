import React, { useState } from 'react';

export default function TopControls() {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);

  const handlePublish = () => {
    alert('Workflow published successfully! ✓\n\nYour agent workflow is now live and ready to use.');
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button 
          onClick={() => setShowEvalModal(true)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          Evaluate
        </button>
        <button 
          onClick={() => setShowCodeModal(true)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          Code
        </button>
        <button 
          onClick={handlePublish}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          Publish
        </button>
      </div>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCodeModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Workflow Code</h2>
              <button 
                onClick={() => setShowCodeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`{
  "workflow": {
    "id": "wf_${Date.now()}",
    "name": "My Agent Workflow",
    "nodes": [
      {
        "id": "start",
        "type": "trigger",
        "config": {
          "event": "manual"
        }
      },
      {
        "id": "agent1",
        "type": "agent",
        "config": {
          "model": "gpt-4",
          "instructions": "You are a helpful assistant"
        }
      }
    ],
    "edges": [
      {
        "from": "start",
        "to": "agent1"
      }
    ]
  }
}`}
              </pre>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Copy to Clipboard
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                  Download JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluate Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEvalModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Evaluate Workflow</h2>
              <button 
                onClick={() => setShowEvalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Run test cases through your workflow to evaluate its performance.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Dataset
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Sample Dataset (10 items)</option>
                    <option>Full Dataset (100 items)</option>
                    <option>Custom Dataset</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evaluation Metrics
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" checked className="mr-2" />
                      <span className="text-sm text-gray-700">Response Quality</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" checked className="mr-2" />
                      <span className="text-sm text-gray-700">Latency</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Cost Analysis</span>
                    </label>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Start Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
