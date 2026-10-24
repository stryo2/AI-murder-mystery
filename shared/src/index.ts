// Types shared by the client and the server (API request/response shapes, case types).

export type * from './case';

/** What the client may know about a character: public info only, never secrets. */
export interface CharacterSummary {
  id: string;
  name: string;
  role: string;
  type: 'suspect' | 'witness';
}

export interface InterrogateRequest {
  /** One per playthrough, made by the client. Keys the conversation history. */
  sessionId: string;
  characterId: string;
  question: string;
  /** Evidence the player is confronting the character with. */
  shownEvidenceIds?: string[];
}

export interface InterrogateResponse {
  characterId: string;
  reply: string;
}

export interface ConversationMessage {
  from: 'player' | 'suspect';
  text: string;
}

export interface HistoryResponse {
  characterId: string;
  messages: ConversationMessage[];
}

/** Body of any non-2xx API response. */
export interface ApiError {
  error: string;
}

export interface HealthResponse {
  status: 'ok';
  time: string;
}
