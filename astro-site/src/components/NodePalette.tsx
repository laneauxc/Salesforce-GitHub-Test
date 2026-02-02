import React from 'react';
import Icon from './Icon';

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
      { type: 'agent', label: 'Agent', icon: 'agent' },
      { type: 'classify', label: 'Classify', icon: 'classify' },
      { type: 'end', label: 'End', icon: 'end' },
      { type: 'note', label: 'Note', icon: 'note' },
    ],
  },
  {
    title: 'Tools',
    nodes: [
      { type: 'file-search', label: 'File Search', icon: 'file-search' },
      { type: 'guardrails', label: 'Guardrails', icon: 'guardrails' },
      { type: 'mcp', label: 'MCP', icon: 'mcp' },
    ],
  },
  {
    title: 'Logic',
    nodes: [
      { type: 'if-else', label: 'If / else', icon: 'if-else' },
      { type: 'while', label: 'While', icon: 'while' },
      { type: 'user-approval', label: 'User approval', icon: 'user-approval' },
    ],
  },
  {
    title: 'Data',
    nodes: [
      { type: 'transform', label: 'Transform', icon: 'transform' },
      { type: 'set-state', label: 'Set state', icon: 'set-state' },
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
                  <Icon name={node.icon} className="w-4 h-4 text-gray-600" />
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
