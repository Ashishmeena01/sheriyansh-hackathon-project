/**
 * Socket.IO service stub - reserved for teammate's backend websocket integration.
 */
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const socketService = {
  connect(url: string = 'http://localhost:5000'): Socket | null {
    try {
      if (!socket) {
        socket = io(url, { autoConnect: false, reconnectionAttempts: 3 });
      }
      return socket;
    } catch {
      return null;
    }
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket(): Socket | null {
    return socket;
  }
};
