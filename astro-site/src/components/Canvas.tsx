import React, { useState, useRef } from 'react';
import NodeCard, { type Node } from './NodeCard';
import EdgeRenderer, { type Edge } from './EdgeRenderer';
import TopControls from './TopControls';
import BottomControls from './BottomControls';

const initialNodes: Node[] = [
  { id: 'start', type: 'start', title: 'Start', x: 200, y: 300 },
  { id: 'agent1', type: 'agent', title: 'My agent', subtitle: 'Agent', x: 450, y: 300 },
];

const initialEdges: Edge[] = [
  { id: 'edge1', from: 'start', to: 'agent1' },
];

export default function Canvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    const nodeLabel = e.dataTransfer.getData('nodeLabel');

    if (nodeType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: nodeType,
        title: nodeLabel,
        x,
        y,
      };

      setNodes([...nodes, newNode]);
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNodeDragStart = (e: React.DragEvent, nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y,
      };
      setDraggedNode(nodeId);
    }
  };

  const handleNodeDrag = (e: React.DragEvent, nodeId: string) => {
    if (e.clientX === 0 && e.clientY === 0) return; // Skip ghost drag events
    
    if (canvasRef.current && draggedNode === nodeId) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.current.x;
      const y = e.clientY - rect.top - dragOffset.current.y;

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId ? { ...node, x, y } : node
        )
      );
    }
  };

  const handleNodeDragEnd = () => {
    setDraggedNode(null);
  };

  return (
    <div className="flex-1 relative bg-gray-100">
      <TopControls />
      
      <div
        ref={canvasRef}
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        className="w-full h-full relative"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      >
        <EdgeRenderer edges={edges} nodes={nodes} />
        
        {nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            selected={selectedNode === node.id}
            onSelect={setSelectedNode}
            onDragStart={handleNodeDragStart}
            onDrag={handleNodeDrag}
            onDragEnd={handleNodeDragEnd}
          />
        ))}
      </div>

      <BottomControls
        onZoomIn={() => console.log('Zoom in')}
        onZoomOut={() => console.log('Zoom out')}
        onCenter={() => console.log('Center')}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
      />
    </div>
  );
}
