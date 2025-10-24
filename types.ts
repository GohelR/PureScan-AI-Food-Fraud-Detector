
export interface FeatureInfluence {
  feature: string;
  influence: number; // e.g., +0.45, -0.28
  description: string;
}

export type Status = 'Safe' | 'Fraudulent' | 'Uncertain';

export interface AnalysisResult {
  status: Status;
  summary: string;
  fraudProbability: number;
  features: FeatureInfluence[];
}
