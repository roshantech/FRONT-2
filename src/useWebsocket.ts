import { useContext } from 'react';
//
import { WebSocketContext } from './WebSocketService';

// ----------------------------------------------------------------------

export const useWebsocket = () => {
  const context = useContext(WebSocketContext);

  if (!context) throw new Error('Websocket connection failed');

  return context;
};
