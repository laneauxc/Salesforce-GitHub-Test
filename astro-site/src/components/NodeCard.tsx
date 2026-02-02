import React from 'react';
import Icon from './Icon';

export interface Node {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  x: number;
  y: number;
}

interface NodeCardProps {
  node: Node;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDrag?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent, id: string) => void;
}

export default function NodeCard({
  node,
  selected,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
}: NodeCardProps) {
  return (
    <div
      draggable={node.type !== 'start'}
      onDragStart={(e) => onDragStart?.(e, node.id)}
      onDrag={(e) => onDrag?.(e, node.id)}
      onDragEnd={(e) => onDragEnd?.(e, node.id)}
      onClick={() => onSelect?.(node.id)}
      className={`
        absolute cursor-move bg-white rounded-lg shadow-md border-2 p-4 min-w-[140px]
        transition-all duration-200
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
        ${node.type === 'start' ? 'cursor-default' : ''}
      `}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Icon name={node.type} className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-center">
          <div className="font-semibold text-sm text-gray-900">{node.title}</div>
          {node.subtitle && (
            <div className="text-xs text-gray-500 mt-1">{node.subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}
