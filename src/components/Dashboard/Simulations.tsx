import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

// ==================== ACO ENGINE ====================
class Config {
  static NUM_WAGONS = 50;
  static NUM_ITERATIONS = 200;
  static ALPHA = 1.0;
  static BETA = 2.5;
  static EVAPORATION_RATE = 0.15;
  static Q = 100;
}

class Wagon {
  startNode: number;
  endNode: number;
  currentNode: number;
  pathTaken: number[];
  pathCost: number;
  nodes: string[];

  constructor(startNode: number, endNode: number, nodes: string[]) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.currentNode = startNode;
    this.pathTaken = [startNode];
    this.pathCost = 0;
    this.nodes = nodes;
  }

  chooseNextNode(pheromoneMap, costMap) {
    const visited = new Set(this.pathTaken);
    const neighbors = [];
    
    for (let i = 0; i < this.nodes.length; i++) {
      if (!visited.has(i) && costMap[this.currentNode][i] !== Infinity) {
        neighbors.push(i);
      }
    }

    if (neighbors.length === 0) return null;

    const probabilities = neighbors.map(neighbor => {
      const pheromone = Math.pow(pheromoneMap[this.currentNode][neighbor], Config.ALPHA);
      const heuristic = Math.pow(1 / costMap[this.currentNode][neighbor], Config.BETA);
      return pheromone * heuristic;
    });

    const sum = probabilities.reduce((a, b) => a + b, 0);
    const normalizedProbs = probabilities.map(p => p / sum);

    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < neighbors.length; i++) {
      cumulative += normalizedProbs[i];
      if (rand <= cumulative) {
        return neighbors[i];
      }
    }
    return neighbors[neighbors.length - 1];
  }

  findPath(pheromoneMap, costMap) {
    while (this.currentNode !== this.endNode) {
      const nextNode = this.chooseNextNode(pheromoneMap, costMap);
      if (nextNode === null) return false;
      
      this.pathCost += costMap[this.currentNode][nextNode];
      this.currentNode = nextNode;
      this.pathTaken.push(nextNode);
    }
    return true;
  }
}

class LogisticsNetwork {
  nodes: string[];
  costMap: number[][];
  originalCostMap: number[][];
  pheromoneMap: number[][];
  bestPath: number[] | null;
  bestCost: number;

  constructor() {
    this.nodes = [
      'Bokaro Steel', 'Main Yard', 'Junction Alpha', 'Coal Feeder',
      'Maintenance', 'Junction Bravo', 'Customer A', 'Stockyard Gamma',
      'Scrapyard', 'Customer B'
    ];
    
    this.costMap = this.initializeCostMap();
    this.originalCostMap = JSON.parse(JSON.stringify(this.costMap));
    this.pheromoneMap = this.initializePheromoneMap();
    this.bestPath = null;
    this.bestCost = Infinity;
  }

  initializeCostMap() {
    const n = this.nodes.length;
    const costs = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    
    const edges = [
      [0, 1, 15], [1, 2, 20], [1, 3, 18], [2, 3, 12], [2, 5, 22],
      [3, 4, 25], [4, 5, 15], [5, 6, 18], [1, 7, 30], [7, 8, 20],
      [8, 6, 25], [5, 9, 28], [3, 5, 20], [7, 6, 35], [4, 8, 22],
      [2, 4, 30], [0, 7, 40], [3, 7, 28], [4, 9, 30], [6, 9, 20]
    ];
    
    edges.forEach(([i, j, cost]) => {
      costs[i][j] = cost;
      costs[j][i] = cost;
    });
    
    for (let i = 0; i < n; i++) costs[i][i] = 0;
    return costs;
  }

  initializePheromoneMap() {
    const n = this.nodes.length;
    return Array(n).fill(null).map(() => Array(n).fill(1.0));
  }

  updatePheromones(paths) {
    const n = this.nodes.length;
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        this.pheromoneMap[i][j] *= (1 - Config.EVAPORATION_RATE);
        if (this.pheromoneMap[i][j] < 0.01) this.pheromoneMap[i][j] = 0.01;
      }
    }
    
    paths.forEach(({ path, cost }) => {
      const deposit = Config.Q / cost;
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        this.pheromoneMap[from][to] += deposit;
        this.pheromoneMap[to][from] += deposit;
      }
    });
  }

  runIteration(startNode, endNode) {
    const wagons = [];
    for (let i = 0; i < Config.NUM_WAGONS; i++) {
      wagons.push(new Wagon(startNode, endNode, this.nodes));
    }

    const completedPaths = [];
    wagons.forEach(wagon => {
      if (wagon.findPath(this.pheromoneMap, this.costMap)) {
        completedPaths.push({ path: wagon.pathTaken, cost: wagon.pathCost });
        
        if (wagon.pathCost < this.bestCost) {
          this.bestCost = wagon.pathCost;
          this.bestPath = wagon.pathTaken;
        }
      }
    });

    this.updatePheromones(completedPaths);
    return { bestPath: this.bestPath, bestCost: this.bestCost };
  }

  introduceDisruption(node1Idx, node2Idx, multiplier) {
    this.costMap[node1Idx][node2Idx] *= multiplier;
    this.costMap[node2Idx][node1Idx] *= multiplier;
  }

  reset() {
    this.costMap = JSON.parse(JSON.stringify(this.originalCostMap));
    this.pheromoneMap = this.initializePheromoneMap();
    this.bestPath = null;
    this.bestCost = Infinity;
  }
}

// ==================== NETWORK GRAPH ====================
const NetworkGraph = ({ network, iteration, bestPath, startNode, endNode, isRunning }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 650 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const aspectRatio = 900 / 650;
        let newWidth = containerWidth - 48; // Subtract padding
        let newHeight = newWidth / aspectRatio;
        if (newHeight > containerHeight - 48) {
          newHeight = containerHeight - 48;
          newWidth = newHeight * aspectRatio;
        }
        newWidth = Math.min(newWidth, 900);
        newHeight = Math.min(newHeight, 650);
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const positions = {
    0: { x: 150, y: 350 },
    1: { x: 300, y: 380 },
    2: { x: 400, y: 250 },
    3: { x: 380, y: 480 },
    4: { x: 520, y: 200 },
    5: { x: 600, y: 380 },
    6: { x: 780, y: 280 },
    7: { x: 580, y: 100 },
    8: { x: 700, y: 520 },
    9: { x: 780, y: 480 }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    const scale = dimensions.width / 900;
    ctx.scale(scale, scale);

    let maxPheromone = 0;
    for (let i = 0; i < network.nodes.length; i++) {
      for (let j = i + 1; j < network.nodes.length; j++) {
        if (network.costMap[i][j] !== Infinity) {
          maxPheromone = Math.max(maxPheromone, network.pheromoneMap[i][j]);
        }
      }
    }

    for (let i = 0; i < network.nodes.length; i++) {
      for (let j = i + 1; j < network.nodes.length; j++) {
        if (network.costMap[i][j] !== Infinity) {
          const pheromone = network.pheromoneMap[i][j];
          const intensity = maxPheromone > 0 ? pheromone / maxPheromone : 0;

          const isOnBestPath = bestPath && 
            ((bestPath.includes(i) && bestPath.includes(j) && 
              Math.abs(bestPath.indexOf(i) - bestPath.indexOf(j)) === 1));

          ctx.beginPath();
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[j].x, positions[j].y);

          if (isOnBestPath && (isRunning || iteration > 0)) {
            const gradient = ctx.createLinearGradient(
              positions[i].x, positions[i].y,
              positions[j].x, positions[j].y
            );
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#34d399');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 6 / scale;
            ctx.setLineDash([]);
          } else if (isRunning || iteration > 0) {
            const width = 1 + intensity * 4;
            const alpha = 0.2 + intensity * 0.5;
            ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
            ctx.lineWidth = width / scale;
            ctx.setLineDash([5 / scale, 5 / scale]);
          } else {
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
            ctx.lineWidth = 2 / scale;
            ctx.setLineDash([]);
          }

          ctx.stroke();
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;
        }
      }
    }

    network.nodes.forEach((node, idx) => {
      const pos = positions[idx];
      const isSource = idx === startNode;
      const isDestination = idx === endNode;
      const isHovered = hoveredNode === idx;
      const isOnPath = bestPath && bestPath.includes(idx);

      if (isSource || isDestination || isOnPath) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, (isHovered ? 28 : 26) / scale, 0, Math.PI * 2);
        ctx.fillStyle = isSource ? 'rgba(16, 185, 129, 0.15)' : 
                        isDestination ? 'rgba(244, 63, 94, 0.15)' : 
                        'rgba(100, 116, 139, 0.15)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, (isHovered ? 22 : 20) / scale, 0, Math.PI * 2);

      if (isSource) {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 20 / scale);
        gradient.addColorStop(0, '#34d399');
        gradient.addColorStop(1, '#10b981');
        ctx.fillStyle = gradient;
      } else if (isDestination) {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 20 / scale);
        gradient.addColorStop(0, '#fb7185');
        gradient.addColorStop(1, '#f43f5e');
        ctx.fillStyle = gradient;
      } else if (isOnPath) {
        ctx.fillStyle = '#64748b';
      } else {
        ctx.fillStyle = isHovered ? '#475569' : '#64748b';
      }

      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3 / scale;
      ctx.stroke();

      // Label box
      ctx.font = `bold ${11 / scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      const metrics = ctx.measureText(node);
      const textWidth = metrics.width;
      const padding = 10 / scale;
      const boxWidth = textWidth + padding * 2;
      const boxHeight = 28 / scale;
      const boxX = pos.x - boxWidth / 2;

      let boxY;
      if (idx === 0 || idx === 1 || idx === 3) {
        boxY = pos.y + (38 / scale);
      } else {
        boxY = pos.y - (52 / scale);
      }

      ctx.fillStyle = isSource ? '#10b981' : isDestination ? '#f43f5e' : '#374151';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6 / scale);
      ctx.fill();

      // Arrow
      ctx.fillStyle = isSource ? '#10b981' : isDestination ? '#f43f5e' : '#374151';
      ctx.beginPath();
      if (pos.y > 400) {
        ctx.moveTo(pos.x, pos.y + (35 / scale));
        ctx.lineTo(pos.x - (6 / scale), pos.y + (28 / scale));
        ctx.lineTo(pos.x + (6 / scale), pos.y + (28 / scale));
      } else {
        ctx.moveTo(pos.x, pos.y - (28 / scale));
        ctx.lineTo(pos.x - (6 / scale), pos.y - (35 / scale));
        ctx.lineTo(pos.x + (6 / scale), pos.y - (35 / scale));
      }
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node, pos.x, boxY + boxHeight / 2);
    });

  }, [network, iteration, bestPath, hoveredNode, startNode, endNode, isRunning, dimensions]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = dimensions.width / rect.width;
    const scaleY = dimensions.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    let found = null;
    for (let idx in positions) {
      const pos = positions[idx];
      const dist = Math.sqrt((x * (900 / dimensions.width) - pos.x) ** 2 + (y * (650 / dimensions.height) - pos.y) ** 2);
      if (dist < 25) {
        found = parseInt(idx);
        break;
      }
    }
    setHoveredNode(found);
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fafafa', borderRadius: '8px', padding: '24px' }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        style={{ 
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          cursor: 'crosshair',
          display: 'block'
        }}
      />
    </div>
  );
};

// ==================== MAIN APP ====================
const Simulations = () => {
  const [network] = useState(() => new LogisticsNetwork());
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [bestPath, setBestPath] = useState(null);
  const [bestCost, setBestCost] = useState(Infinity);
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(6);
  const [disruptNode1, setDisruptNode1] = useState(2);
  const [disruptNode2, setDisruptNode2] = useState(5);
  const [alpha, setAlpha] = useState(1.0);
  const [beta, setBeta] = useState(2.5);
  const [evaporation, setEvaporation] = useState(0.15);
  
  const intervalRef = useRef(null);

  const runSimulation = useCallback(() => {
    if (iteration >= Config.NUM_ITERATIONS) {
      setIsRunning(false);
      return;
    }

    Config.ALPHA = alpha;
    Config.BETA = beta;
    Config.EVAPORATION_RATE = evaporation;

    const result = network.runIteration(startNode, endNode);
    setBestPath(result.bestPath);
    setBestCost(result.bestCost);
    setIteration(prev => prev + 1);
  }, [network, iteration, startNode, endNode, alpha, beta, evaporation]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(runSimulation, 40);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, runSimulation]);

  const handleStart = () => {
    network.reset();
    setBestPath(null);
    setBestCost(Infinity);
    setIteration(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIteration(0);
    network.reset();
    setBestPath(null);
    setBestCost(Infinity);
  };

  const handleDisrupt = () => {
    network.introduceDisruption(disruptNode1, disruptNode2, 4.0);
  };

  const progress = (iteration / Config.NUM_ITERATIONS) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflowX: 'hidden',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '20px 16px'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: window.innerWidth > 768 ? '24px' : '20px',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.5px'
            }}>
              Bio-Signaling Logistics Network
            </h1>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '14px',
              color: '#64748b',
              display: window.innerWidth > 768 ? 'block' : 'none'
            }}>
              Ant Colony Optimization • Digital Pheromones • Emergent Intelligence
            </p>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button 
              onClick={isRunning ? () => setIsRunning(false) : handleStart}
              style={{
                padding: '10px 24px',
                background: isRunning ? '#f1f5f9' : '#3b82f6',
                color: isRunning ? '#475569' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
            </button>
            <button 
              onClick={handleReset}
              style={{
                padding: '10px 24px',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '32px 16px',
        display: 'grid',
        gridTemplateColumns: '300px 1fr', // Reduced controls width to 300px
        gap: '24px',
        minHeight: 'calc(100vh - 120px)' // Adjust based on header height
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px' // Reduced padding
          }}>
            <h3 style={{
              margin: '0 0 12px 0', // Reduced margin
              fontSize: '14px',
              fontWeight: 600,
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Route Configuration</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#64748b',
                marginBottom: '6px' // Reduced margin
              }}>Start Node</label>
              <select
                value={startNode}
                onChange={(e) => setStartNode(Number(e.target.value))}
                disabled={isRunning}
                style={{
                  width: '100%',
                  padding: '8px 10px', // Reduced padding
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px', // Slightly smaller radius
                  fontSize: '13px', // Reduced font size
                  color: '#0f172a',
                  background: '#ffffff',
                  cursor: isRunning ? 'not-allowed' : 'pointer'
                }}
              >
                {network.nodes.map((node, idx) => (
                  <option key={idx} value={idx}>{node}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#64748b',
                marginBottom: '6px' // Reduced margin
              }}>End Node</label>
              <select
                value={endNode}
                onChange={(e) => setEndNode(Number(e.target.value))}
                disabled={isRunning}
                style={{
                  width: '100%',
                  padding: '8px 10px', // Reduced padding
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px', // Slightly smaller radius
                  fontSize: '13px', // Reduced font size
                  color: '#0f172a',
                  background: '#ffffff',
                  cursor: isRunning ? 'not-allowed' : 'pointer'
                }}
              >
                {network.nodes.map((node, idx) => (
                  <option key={idx} value={idx}>{node}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px' // Reduced padding
          }}>
            <h3 style={{
              margin: '0 0 12px 0', // Reduced margin
              fontSize: '14px',
              fontWeight: 600,
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Algorithm Parameters</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                  Alpha (Pheromone)
                </label>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                  {alpha.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                disabled={isRunning}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}> 
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                  Beta (Heuristic)
                </label>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                  {beta.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={beta}
                onChange={(e) => setBeta(Number(e.target.value))}
                disabled={isRunning}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}> 
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}> 
                  Evaporation Rate
                </label>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                  {evaporation.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={evaporation}
                onChange={(e) => setEvaporation(Number(e.target.value))}
                disabled={isRunning}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '16px' // Reduced padding
          }}>
            <h3 style={{
              margin: '0 0 8px 0', // Reduced margin
              fontSize: '14px',
              fontWeight: 600,
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Network Disruption</h3>
            <p style={{
              margin: '0 0 12px 0', // Reduced margin
              fontSize: '12px', // Reduced font size
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              Introduce congestion to test adaptive routing
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}> 
              <select
                value={disruptNode1}
                onChange={(e) => setDisruptNode1(Number(e.target.value))}
                style={{
                  padding: '6px 8px', // Reduced padding
                  border: '1px solid #fde68a',
                  borderRadius: '6px',
                  fontSize: '12px', // Reduced font size
                  background: '#ffffff'
                }}
              >
                {network.nodes.map((node, idx) => (
                  <option key={idx} value={idx}>{node}</option>
                ))}
              </select>
              
              <select
                value={disruptNode2}
                onChange={(e) => setDisruptNode2(Number(e.target.value))}
                style={{
                  padding: '6px 8px', // Reduced padding
                  border: '1px solid #fde68a',
                  borderRadius: '6px',
                  fontSize: '12px', // Reduced font size
                  background: '#ffffff'
                }}
              >
                {network.nodes.map((node, idx) => (
                  <option key={idx} value={idx}>{node}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDisrupt}
              disabled={!isRunning}
              style={{
                width: '100%',
                padding: '8px', // Reduced padding
                background: isRunning ? '#fbbf24' : '#f3f4f6',
                color: isRunning ? '#78350f' : '#9ca3af',
                border: 'none',
                borderRadius: '6px', // Slightly smaller radius
                fontSize: '13px', // Reduced font size
                fontWeight: 600,
                cursor: isRunning ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px' // Reduced gap
              }}
            >
              <Zap size={14} /> Apply Disruption (4x Cost)
            </button>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px' // Reduced padding
          }}>
            <h3 style={{
              margin: '0 0 12px 0', // Reduced margin
              fontSize: '14px',
              fontWeight: 600,
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Simulation Status</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}> 
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}> 
                  Iteration
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}> 
                  {iteration}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}> 
                  Best Cost
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}> 
                  {bestCost === Infinity ? '—' : bestCost.toFixed(1)}
                </div>
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              borderRadius: '6px', // Slightly smaller radius
              padding: '2px',
              marginBottom: '12px' // Reduced margin
            }}>
              <div style={{
                height: '6px', // Reduced height
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                borderRadius: '4px', // Slightly smaller radius
                width: `${progress}%`,
                transition: 'width 0.3s'
              }} />
            </div>

            {bestPath && (
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                  Optimal Route ({bestPath.length} nodes)
                </div>
                <div style={{
                  padding: '10px', // Reduced padding
                  background: '#f8fafc',
                  borderRadius: '6px', // Slightly smaller radius
                  fontSize: '11px', // Reduced font size
                  color: '#475569',
                  lineHeight: '1.4', // Reduced line height
                  fontWeight: 500
                }}>
                  {bestPath.map((nodeIdx, i) => (
                    <span key={i}>
                      {network.nodes[nodeIdx]}
                      {i < bestPath.length - 1 && ' → '}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '650px',
          height: '100%'
        }}>
          <NetworkGraph 
            network={network}
            iteration={iteration}
            bestPath={bestPath}
            startNode={startNode}
            endNode={endNode}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default Simulations;