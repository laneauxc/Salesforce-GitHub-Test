import React from 'react';

export interface Edge {
  id: string;
  from: string;
  to: string;
}

interface EdgeRendererProps {
  edges: Edge[];
  nodes: Array<{ id: string; x: number; y: number }>;
}

export default function EdgeRenderer({ edges, nodes }: EdgeRendererProps) {
  const getNodePosition = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {edges.map((edge) => {
        const from = getNodePosition(edge.from);
        const to = getNodePosition(edge.to);

        return (
          <line
            key={edge.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#9CA3AF"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
        </marker>
      </defs>
    </svg>
  );
}
