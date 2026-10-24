// Types shared by the client and the server (API request/response shapes, case types).

export type * from './case';

export interface HealthResponse {
  status: 'ok';
  time: string;
}
