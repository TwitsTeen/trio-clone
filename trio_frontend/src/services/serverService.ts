const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
export const serverUrl = VITE_API_BASE_URL || "http://localhost:3000";
