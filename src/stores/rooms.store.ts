import { getRooms, getUserRooms, createRoom as createRoomApi, assignParticipant } from "@/services/api/rooms.api";
import { Room, RoomsMetadata } from "@/types/room";
import { defineStore } from "pinia";

interface Rooms {
  rooms: Room[];
  myRooms: Room[];
  roomsMetadata: RoomsMetadata;
  myRoomsMetadata: RoomsMetadata;
}

export const useRoomStore = defineStore('rooms', {
  state: (): Rooms => ({
    rooms: [],
    myRooms: [],
    roomsMetadata: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    myRoomsMetadata: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  }),
  actions: {
    async setRooms() {
      const response = await getRooms();
      this.rooms = Array.isArray(response.data) ? response.data : [response.data];
      this.roomsMetadata = response.metadata;
    },
    async setMyRooms(userId: string) {
      const response = await getUserRooms(userId);
      this.myRooms = Array.isArray(response.data) ? response.data : [response.data];
      this.myRoomsMetadata = response.metadata;
    },
    async createRoom(name: string, createdBy: string) {
      const newRoom = await createRoomApi(name, createdBy);
      this.myRooms.push(newRoom);
      return newRoom;
    },
    async assignParticipant(roomId: string, userId: string) {
      await assignParticipant(roomId, userId);
      await this.setMyRooms(userId);
      await this.setRooms();
    }
  }
});