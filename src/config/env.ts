export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
};

// Validación opcional
if (!env.apiUrl) {
  throw new Error('VITE_API_URL is required');
}