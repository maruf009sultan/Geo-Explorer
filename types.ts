export interface GroundingChunk {
  uri: string;
  title: string;
  type: 'web' | 'maps';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string;
  groundingChunks?: GroundingChunk[];
  mapSuggestions?: string[];
}

export type MapConfig = {
  type: 'search';
  query: string;
} | {
  type: 'directions';
  origin: string;
  destination: string;
};