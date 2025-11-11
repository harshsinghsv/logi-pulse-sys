// AI/ML API Endpoints Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface OptimizeOrderRequest {
  order_id: string;
  userId: string;
}

export interface GeneratePlanRequest {
  plant?: string;
  userId: string;
}

export interface SimulationStartRequest {
  startNode: number;
  endNode: number;
  alpha: number;
  beta: number;
  evaporation: number;
}

export interface SimulationDisruptRequest {
  node1: number;
  node2: number;
  multiplier: number;
}

// Optimization Engine API
export const optimizationAPI = {
  reassignOrder: async (request: OptimizeOrderRequest) => {
    const response = await fetch(`${API_BASE_URL}/optimize/reassign-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Optimization failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  generateDailyPlan: async (request: GeneratePlanRequest) => {
    const response = await fetch(`${API_BASE_URL}/optimize/generate-daily-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Plan generation failed: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// Simulation API
export const simulationAPI = {
  start: async (request: SimulationStartRequest) => {
    const response = await fetch(`${API_BASE_URL}/simulations/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Simulation start failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  disrupt: async (request: SimulationDisruptRequest) => {
    const response = await fetch(`${API_BASE_URL}/simulations/disrupt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Disruption failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  pause: async () => {
    const response = await fetch(`${API_BASE_URL}/simulations/pause`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Pause failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  reset: async () => {
    const response = await fetch(`${API_BASE_URL}/simulations/reset`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Reset failed: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// WebSocket connection for real-time updates
export const createWebSocketConnection = (userId: string, channel: string): WebSocket => {
  const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000/ws';
  const ws = new WebSocket(`${WS_BASE_URL}/${channel}?userId=${userId}`);
  
  ws.onopen = () => {
    console.log(`WebSocket connected to ${channel}`);
  };
  
  ws.onerror = (error) => {
    console.error(`WebSocket error on ${channel}:`, error);
  };
  
  ws.onclose = () => {
    console.log(`WebSocket disconnected from ${channel}`);
  };
  
  return ws;
};
