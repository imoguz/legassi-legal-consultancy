import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.MAX_RECONNECT_ATTEMPTS = 3;
    this.eventCallbacks = new Map();
    this.tokenRefreshCallback = null;
    this.isRefreshing = false;
    this.pendingReconnect = false;
  }

  setTokenRefreshCallback(callback) {
    this.tokenRefreshCallback = callback;
  }

  async connect(token) {
    if (this.isRefreshing) {
      this.pendingReconnect = true;
      return;
    }

    if (this.socket?.connected && this.currentToken === token) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.currentToken = token;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    this.socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: { token },
      reconnection: true,
      reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.pendingReconnect = false;
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', async (error) => {
      if (
        error.message.includes('expired') ||
        error.message.includes('TokenExpiredError') ||
        error.message.includes('Authentication error') ||
        error.message.includes('Invalid token')
      ) {
        await this.handleTokenExpired();
        return;
      }
      this.reconnectAttempts++;
    });

    this.socket.on('reconnect', () => {
      this.isConnected = true;
    });

    this.socket.on('new-notification', (data) => {
      this.triggerEventCallbacks('new-notification', data);
    });

    this.socket.on('notification-read', (data) => {
      this.triggerEventCallbacks('notification-read', data);
    });

    this.socket.on('all-notifications-read', (data) => {
      this.triggerEventCallbacks('all-notifications-read', data);
    });

    this.socket.on('notification-deleted', (data) => {
      this.triggerEventCallbacks('notification-deleted', data);
    });
  }

  async handleTokenExpired() {
    if (this.isRefreshing) return;

    this.isRefreshing = true;

    try {
      if (!this.tokenRefreshCallback) {
        throw new Error('No token refresh callback provided');
      }

      const newToken = await this.tokenRefreshCallback();

      if (newToken) {
        await this.connect(newToken);

        await new Promise((resolve) => {
          const checkConnection = () => {
            if (this.isConnected) resolve();
            else setTimeout(checkConnection, 100);
          };
          checkConnection();
        });
      } else {
        throw new Error('Token refresh returned no token');
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-logout'));
      }
    } finally {
      this.isRefreshing = false;

      if (this.pendingReconnect) {
        this.pendingReconnect = false;
        const currentToken = Cookies.get('icaAccessToken');
        if (currentToken) {
          this.connect(currentToken);
        }
      }
    }
  }

  triggerEventCallbacks(event, data) {
    const callbacks = this.eventCallbacks.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }

  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }

    return () => this.off(event, callback);
  }

  off(event, callback) {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data, callback) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected, cannot emit event:', event);
      return false;
    }

    return this.socket.emit(event, data, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventCallbacks.clear();
      this.currentToken = null;
    }
  }

  get connected() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();

export const initSocket = (userId, token) => {
  return socketService.connect(token);
};

export const getSocket = () => {
  return socketService.socket;
};

export const disconnectSocket = () => {
  socketService.disconnect();
};

export const isSocketConnected = () => {
  return socketService.connected;
};

export const onSocketEvent = (event, callback) => {
  return socketService.on(event, callback);
};

export const emitSocketEvent = (event, data, callback) => {
  return socketService.emit(event, data, callback);
};
