export interface Room {
  id: string;
  name: string;
  createdBy: string;
  participants: string[];
  createdAt: string;
}

export interface RoomsMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoomApiResponse<T = any, M = any> {
  data?: T;
  metadata?: M;
  message?: string;
}