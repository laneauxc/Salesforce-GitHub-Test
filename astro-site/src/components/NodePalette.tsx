import React from 'react';
import Icon from './Icon';
import { Card, CardBody } from '@heroui/react';

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
    <div className="w-64 h-full bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto">
      <div className="p-4 space-y-6">
        {nodeGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.nodes.map((node, nodeIdx) => (
                <Card
                  key={nodeIdx}
                  isPressable
                  className="cursor-move hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, node.type, node.label)}
                  draggable
                >
                  <CardBody className="flex-row items-center gap-2 px-3 py-2">
                    <Icon name={node.icon} className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{node.label}</span>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
