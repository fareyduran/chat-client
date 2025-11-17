import { getRoomMessages, sendMessage } from "@/services/api/messages.api";
import { Message, PageInfo } from "@/types/message";
import { defineStore } from "pinia";

interface Messages {
  messages: Message[],
  pageInfo: PageInfo,
}

export const useMessageStore = defineStore('messages', {
  state: (): Messages => ({
    messages: [],
    pageInfo: {
      hasMoreMessages: false,
      nextCursor: "",
      count: 0
    }
  }),
  actions: {
    async getMessagesFromRoom(roomId: string) {
      const response = await getRoomMessages(roomId);
      this.messages = response.data;
      this.pageInfo = response.pageInfo;
    },
    async loadMoreMessages(roomId: string, cursor: string) {
      const response = await getRoomMessages(roomId, cursor);
      this.messages = [...response.data, ...this.messages];
      this.pageInfo = response.pageInfo;
    },
    async sendMessage(roomId: string, senderId: string, message: string) {
      await sendMessage(roomId, senderId, message);
      this.getMessagesFromRoom(roomId);
    }
  }
});