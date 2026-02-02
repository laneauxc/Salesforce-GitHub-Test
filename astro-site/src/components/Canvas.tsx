import React, { useState, useRef, useEffect } from 'react';
import NodeCard, { type Node } from './NodeCard';
import EdgeRenderer, { type Edge } from './EdgeRenderer';
import TopControls from './TopControls';
import BottomControls from './BottomControls';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

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
  const [nodeCounter, setNodeCounter] = useState<number>(2);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Connection mode state
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [edgeCounter, setEdgeCounter] = useState<number>(2);
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Add current state to history
  const addToHistory = (newNodes: Node[], newEdges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: newEdges });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  };

  // Zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  // Zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Center view
  const handleCenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Delete selected node
  const handleDeleteNode = () => {
    if (selectedNode) {
      // Don't allow deleting the start node
      if (selectedNode === 'start') return;
      
      const newNodes = nodes.filter(n => n.id !== selectedNode);
      const newEdges = edges.filter(e => e.from !== selectedNode && e.to !== selectedNode);
      
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNode(null);
      addToHistory(newNodes, newEdges);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to cancel connection
      if (e.key === 'Escape' && isConnecting) {
        e.preventDefault();
        cancelConnection();
      }
      // Delete key
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode) {
        e.preventDefault();
        handleDeleteNode();
      }
      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
      if (((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, historyIndex, history, isConnecting]);

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    const nodeLabel = e.dataTransfer.getData('nodeLabel');

    if (nodeType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      const newNode: Node = {
        id: `node-${nodeCounter}`,
        type: nodeType,
        title: nodeLabel,
        x,
        y,
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      setNodeCounter(nodeCounter + 1);
      addToHistory(newNodes, edges);
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
        x: (e.clientX - rect.left - pan.x) / zoom - node.x,
        y: (e.clientY - rect.top - pan.y) / zoom - node.y,
      };
      setDraggedNode(nodeId);
    }
  };

  const handleNodeDrag = (e: React.DragEvent, nodeId: string) => {
    if (e.clientX === 0 && e.clientY === 0) return; // Skip ghost drag events
    
    if (canvasRef.current && draggedNode === nodeId) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom - dragOffset.current.x;
      const y = (e.clientY - rect.top - pan.y) / zoom - dragOffset.current.y;

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId ? { ...node, x, y } : node
        )
      );
    }
  };

  const handleNodeDragEnd = () => {
    if (draggedNode) {
      addToHistory(nodes, edges);
      setDraggedNode(null);
    }
  };

  // Handle node click for connections
  const handleNodeClick = (nodeId: string) => {
    if (isConnecting) {
      if (!connectionStart) {
        // Start connection
        setConnectionStart(nodeId);
      } else if (connectionStart !== nodeId) {
        // Complete connection
        const newEdge: Edge = {
          id: `edge-${edgeCounter}`,
          from: connectionStart,
          to: nodeId,
        };
        const newEdges = [...edges, newEdge];
        setEdges(newEdges);
        setEdgeCounter(edgeCounter + 1);
        addToHistory(nodes, newEdges);
        
        // Reset connection state
        setConnectionStart(null);
        setIsConnecting(false);
      }
    } else {
      setSelectedNode(nodeId);
    }
  };

  // Toggle connection mode
  const toggleConnectionMode = () => {
    setIsConnecting(!isConnecting);
    setConnectionStart(null);
    if (!isConnecting) {
      setSelectedNode(null); // Clear selection when entering connection mode
    }
  };

  // Cancel connection
  const cancelConnection = () => {
    setIsConnecting(false);
    setConnectionStart(null);
  };

  return (
    <div className="flex-1 relative bg-gray-100">
      <TopControls />
      
      {/* Connection Mode Control */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={toggleConnectionMode}
          className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-lg ${
            isConnecting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {isConnecting ? 'Connecting...' : 'Connect Nodes'}
        </button>
        {isConnecting && (
          <button
            onClick={cancelConnection}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
          >
            Cancel
          </button>
        )}
      </div>
      
      <div
        ref={canvasRef}
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        className="w-full h-full relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      >
        <div 
          style={{ 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          <EdgeRenderer edges={edges} nodes={nodes} />
          
          {nodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              selected={selectedNode === node.id}
              isConnecting={isConnecting}
              isConnectionStart={connectionStart === node.id}
              onSelect={handleNodeClick}
              onDragStart={handleNodeDragStart}
              onDrag={handleNodeDrag}
              onDragEnd={handleNodeDragEnd}
            />
          ))}
        </div>
      </div>

      <BottomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCenter={handleCenter}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Zoom indicator */}
      <div className="absolute bottom-8 right-4 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm text-gray-600">
        {Math.round(zoom * 100)}%
      </div>

      {/* Help text */}
      {isConnecting && connectionStart && (
        <div className="absolute top-20 right-4 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg shadow-lg text-sm text-blue-700">
          Click another node to complete connection or press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">Esc</kbd> to cancel
        </div>
      )}
      {isConnecting && !connectionStart && (
        <div className="absolute top-20 right-4 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg shadow-lg text-sm text-blue-700">
          Click a node to start connecting
        </div>
      )}
      {selectedNode && !isConnecting && (
        <div className="absolute top-20 right-4 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg shadow-lg text-sm text-blue-700">
          Press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded">Delete</kbd> to remove node
        </div>
      )}
    </div>
  );
}
