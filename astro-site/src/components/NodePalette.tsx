import React from 'react';

interface NodeType {
  type: string;
  label: string;
  icon: string;
}

interface NodeGroup {
  title: string;
  nodes: NodeType[];
}

const nodeGroups: NodeGroup[] = [
  {
    title: 'Core',
    nodes: [
      { type: 'agent', label: 'Agent', icon: '🤖' },
      { type: 'classify', label: 'Classify', icon: '🔍' },
      { type: 'end', label: 'End', icon: '🏁' },
      { type: 'note', label: 'Note', icon: '📝' },
    ],
  },
  {
    title: 'Tools',
    nodes: [
      { type: 'file-search', label: 'File Search', icon: '📄' },
      { type: 'guardrails', label: 'Guardrails', icon: '🛡️' },
      { type: 'mcp', label: 'MCP', icon: '🔌' },
    ],
  },
  {
    title: 'Logic',
    nodes: [
      { type: 'if-else', label: 'If / else', icon: '🔀' },
      { type: 'while', label: 'While', icon: '🔄' },
      { type: 'user-approval', label: 'User approval', icon: '✋' },
    ],
  },
  {
    title: 'Data',
    nodes: [
      { type: 'transform', label: 'Transform', icon: '🔧' },
      { type: 'set-state', label: 'Set state', icon: '💾' },
    ],
  },
];

interface NodePaletteProps {
  onNodeDragStart?: (type: string, label: string) => void;
}

export default function NodePalette({ onNodeDragStart }: NodePaletteProps) {
  const handleDragStart = (e: React.DragEvent, nodeType: string, label: string) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.setData('nodeLabel', label);
    if (onNodeDragStart) {
      onNodeDragStart(nodeType, label);
    }
  };

  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {nodeGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.nodes.map((node, nodeIdx) => (
                <div
                  key={nodeIdx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node.type, node.label)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-base">{node.icon}</span>
                  <span className="text-gray-700">{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
