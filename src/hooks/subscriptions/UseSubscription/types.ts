import { Ticker24hData } from '../../../utils/queries';

/** Websocket Input types */
export interface Channel extends Record<string, unknown> {
  name: string;
}

interface InputAction {
  action: 'subscribe';
}

/** WebSocket input types */
export interface Channel extends Record<string, unknown> {
  name: string;
}
export interface ChannelTicker24h extends Channel {
  name: 'ticker24h';
  markets: string[];
}
export type InputChannels = ChannelTicker24h;
export interface InputTicker24h extends InputAction {
  channels: InputChannels[];
}
export type WebSocketInput = InputTicker24h;

/** WebSocket event types */

export type EventTicker24h = {
  event: 'ticker24h';
  data: Ticker24hData[];
};
export type WebSocketEvent = EventTicker24h;
