import { useReducer, useEffect, useCallback, useMemo, useState, createContext, ReactNode, FC } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';

export interface WebSocketContextType {
    socket: WebSocket | null;
   }
   
export const WebSocketContext = createContext<WebSocketContextType>({ socket: null });
interface WebSocketProviderProps {
    children: ReactNode;
   }
export const WebSocketProvider: FC<WebSocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const { user } = useAuthContext();

    useEffect(() => {
       const ws = new WebSocket(`ws://localhost:3001/core/ws?ID=${user?.ID}`);
       setSocket(ws);
   
       return () => {
         ws.close();
       };
    }, [user?.ID]);
    const value = useMemo(() => ({ socket }), [socket]);

    return (
       <WebSocketContext.Provider value={value}>
         {children}
       </WebSocketContext.Provider>
    );
};