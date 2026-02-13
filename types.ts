
export enum RadiationStatus {
  SAFE = 'SAFE',
  WARNING = 'WARNING',
  DANGER = 'DANGER'
}

export interface RadiationData {
  value: number;
  unit: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
}

export interface PredictionResult {
  nextHour: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

export interface Alert {
  id: string;
  type: RadiationStatus;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Device {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  battery: number;
  signal: number;
}
