import { ref, onUnmounted, Ref } from 'vue';
import { io, Socket } from 'socket.io-client';
import type { Message } from '@/types/message';
import { env } from '@/config/env';

interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  joinedRoom: (data: { roomId: string }) => void;
  leftRoom: (data: { roomId: string }) => void;
  newMessage: (message: Message) => void;
}

interface ClientToServerEvents {
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useMessageSocket(roomId?: string) {
  const socket: Ref<TypedSocket | null> = ref(null);
  const isConnected = ref(false);
  const messages: Ref<Message[]> = ref([]);
  const currentRoomId = ref<string | null>(roomId || null);

  const connect = () => {
    if (socket.value?.connected) {
      console.log('[WebSocket] Ya existe una conexión activa');
      return;
    }

    console.log('[WebSocket] Iniciando conexión a', env.wsUrl);

    socket.value = io(env.wsUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    }) as TypedSocket;

    setupEventListeners();
  };

  const setupEventListeners = () => {
    if (!socket.value) return;

    socket.value.on('connect', () => {
      console.log('[WebSocket] Conectado con ID:', socket.value?.id);
      isConnected.value = true;

      if (currentRoomId.value) {
        joinRoom(currentRoomId.value);
      }
    });

    socket.value.on('disconnect', () => {
      console.log('[WebSocket] Desconectado');
      isConnected.value = false;
    });

    socket.value.on('joinedRoom', (data) => {
      console.log('[WebSocket] Unido a la sala:', data.roomId);
      currentRoomId.value = data.roomId;
    });

    socket.value.on('leftRoom', (data) => {
      console.log('[WebSocket] Saliste de la sala:', data.roomId);
      if (currentRoomId.value === data.roomId) {
        currentRoomId.value = null;
      }
    });

    socket.value.on('newMessage', (message) => {
      console.log('[WebSocket] Nuevo mensaje recibido:', message);
      const exists = messages.value.some(msg => msg.id === message.id);
      if (!exists) {
        messages.value.push(message);
      }
    });

    socket.value.on('connect_error', (error) => {
      console.error('[WebSocket] Error de conexión:', error.message);
      isConnected.value = false;
    });
  };

  const joinRoom = (roomId: string) => {
    if (!socket.value) {
      console.warn('[WebSocket] No hay conexión. Conectando primero...');
      connect();
      currentRoomId.value = roomId;
      return;
    }

    if (!socket.value.connected) {
      console.warn('[WebSocket] Socket no conectado. Esperando conexión...');
      currentRoomId.value = roomId;
      return;
    }

    console.log('[WebSocket] Uniéndose a la sala:', roomId);
    socket.value.emit('joinRoom', roomId);
    currentRoomId.value = roomId;
  };

  const leaveRoom = (roomId: string) => {
    if (!socket.value?.connected) {
      console.warn('[WebSocket] No hay conexión activa');
      return;
    }

    console.log('[WebSocket] Saliendo de la sala:', roomId);
    socket.value.emit('leaveRoom', roomId);

    if (currentRoomId.value === roomId) {
      currentRoomId.value = null;
    }
  };

  const disconnect = () => {
    if (!socket.value) {
      console.warn('[WebSocket] No hay socket para desconectar');
      return;
    }

    console.log('[WebSocket] Desconectando...');

    if (currentRoomId.value) {
      leaveRoom(currentRoomId.value);
    }

    socket.value.removeAllListeners();

    socket.value.disconnect();
    socket.value = null;
    isConnected.value = false;
    messages.value = [];
    currentRoomId.value = null;
  };

  const clearMessages = () => {
    messages.value = [];
  };

  onUnmounted(() => {
    console.log('[WebSocket] Componente desmontado, limpiando recursos...');
    disconnect();
  });

  connect();

  return {
    isConnected,
    messages,
    currentRoomId,
    joinRoom,
    leaveRoom,
    disconnect,
    clearMessages,
    connect,
  };
}
