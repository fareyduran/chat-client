import { Message, MessagesApiResponse, PageInfo } from '@/types/message';
import { env } from './../../config/env';

export async function getRoomMessages(roomId: string, cursor?: string) {
  console.log('Fetching messages for room:', roomId, 'with cursor:', cursor);
  const response = await fetch(`${env.apiUrl}/messages/rooms/${roomId}${cursor ? `?cursor=${cursor}` : ''}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return await response.json() as MessagesApiResponse<Message[], PageInfo>;
}

export async function sendMessage(roomId: string, senderId: string, message: string) {
  const response = await fetch(`${env.apiUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomId, senderId, message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return await response.json() as Message;
}
