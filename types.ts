
export interface SimulationStep {
  title: string;
  content: string;
  icon: string;
}

export interface SimulationResult {
  steps: SimulationStep[];
  rawResponse: string;
}

export enum SimulationStatus {
  IDLE = 'IDLE',
  TOKENIZING = 'TOKENIZING',
  BUILDING_CONTEXT = 'BUILDING_CONTEXT',
  REASONING = 'REASONING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
