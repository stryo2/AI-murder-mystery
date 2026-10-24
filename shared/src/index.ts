// Types shared by the client and the server (API request/response shapes, case types).

export type * from './case';

/** What the client may know about a character: public info only, never secrets. */
export interface CharacterSummary {
  id: string;
  name: string;
  role: string;
  type: 'suspect' | 'witness';
  age: number | null;
  /** What they told the guard when the body was found. Suspects only. */
  statement?: string;
  /** Image URL. */
  portrait?: string;
}

/** GET /api/case: what the player is told at the start. Public info only. */
export interface CaseBriefing {
  title: string;
  setting: string;
  synopsis: string;
  /** Who the player is and why they are investigating. */
  playerRole: string;
  briefing: string;
  /** Image URL for the opening screen. */
  coverImage?: string;
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

/** One line of the POST /api/interrogate/stream response. */
export type InterrogateStreamEvent =
  | { type: 'text'; text: string } // the next piece of the reply
  | { type: 'done'; reply: string } // the full, final reply
  | { type: 'error'; error: string };

export interface ConversationMessage {
  from: 'player' | 'suspect';
  text: string;
}

export interface HistoryResponse {
  characterId: string;
  messages: ConversationMessage[];
}

/** An evidence item as the player sees it once found. No proves / redHerring / fact ids. */
export interface EvidenceView {
  id: string;
  name: string;
  foundIn: string;
  contents: string[];
  /** Image URL. */
  icon?: string;
}

export interface SceneItemView {
  id: string;
  name: string;
  searched: boolean;
  /** What searching it turned up. Empty until searched. */
  evidence: EvidenceView[];
}

/** GET /api/scene: every searchable spot, grouped by place, with this game's progress. */
export interface SceneResponse {
  /** Image URL for the top of the search screen. */
  bannerImage?: string;
  locations: {
    id: string;
    name: string;
    image?: string;
    imageFocus?: 'top' | 'bottom';
    items: SceneItemView[];
  }[];
}

export interface SearchRequest {
  sessionId: string;
  itemId: string;
}

/** POST /api/scene/search: the item, now searched, with what it revealed. */
export type SearchResponse = SceneItemView;

/** Body of any non-2xx API response. */
export interface ApiError {
  error: string;
}

export interface HealthResponse {
  status: 'ok';
  time: string;
}
