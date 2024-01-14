import { Ticker24hData } from '../../../utils/queries';

/** Websocket Input types */
export interface Channel extends Record<string, unknown> {
  name: string;
}

interface InputAction {
  action: 'subscribe';
}

/** WebSocket input types */
export interface ChannelTicker24h extends Record<string, unknown> {
  name: 'ticker24h';
  markets: string[];
}
export interface InputTicker24h extends InputAction {
  channels: ChannelTicker24h[];
}
export type WebSocketInput = InputTicker24h;

/** WebSocket event types */

export type EventTicker24h = {
  event: 'ticker24h';
  data: Ticker24hData[];
};
export type WebSocketEvent = EventTicker24h;
