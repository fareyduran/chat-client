import { Room, RoomApiResponse, RoomsMetadata } from '@/types/room';
import { env } from './../../config/env';

export async function getRooms() {
  const response = await fetch(`${env.apiUrl}/rooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return await response.json() as RoomApiResponse<Room, RoomsMetadata>;
}

export async function getUserRooms(userId: string) {
  const response = await fetch(`${env.apiUrl}/rooms/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return await response.json() as RoomApiResponse<Room, RoomsMetadata>;
}

export async function assignParticipant(roomId: string, userId: string) {
  const response = await fetch(`${env.apiUrl}/rooms/${roomId}/participant`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ participantId: userId })
  });

  if (!response.ok) {
    throw new Error("Failed to assign participant to room");
  }

  return await response.json() as RoomApiResponse;
};

export async function createRoom(name: string, createdBy: string) {
  const response = await fetch(`${env.apiUrl}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, createdBy })
  });

  if (!response.ok) {
    throw new Error("Failed to create room");
  }

  return await response.json() as Room;
}