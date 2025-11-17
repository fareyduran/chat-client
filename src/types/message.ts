export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  message: string;
  sentAt: string;
}

export interface PageInfo {
  hasMoreMessages: boolean;
  nextCursor: string;
  count: number;
}

export interface MessagesApiResponse<T, M> {
  data: T;
  pageInfo: M;
}
