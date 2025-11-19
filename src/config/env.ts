export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000/messages',
};

if (!env.apiUrl) {
  throw new Error('VITE_API_URL is required');
}