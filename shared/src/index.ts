// Types shared by the client and the server (API request/response shapes, case types).

export type * from './case';

export interface InterrogateRequest {
  characterId: string;
  question: string;
  /** Evidence the player is confronting the character with. */
  shownEvidenceIds?: string[];
}

export interface InterrogateResponse {
  characterId: string;
  reply: string;
}

/** Body of any non-2xx API response. */
export interface ApiError {
  error: string;
}

export interface HealthResponse {
  status: 'ok';
  time: string;
}
