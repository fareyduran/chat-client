<template>
  <div class="chat-page">
    <div class="chat-header">
      <button @click="goBack" class="back-button">
        <span class="arrow">←</span>
        Regresar
      </button>
      <h1>Room id: {{ roomId.slice(-6) }}</h1>
    </div>

    <div class="chat-container">
      <MessageList 
        :messages="messages" 
        :hasMore="hasMoreMessages"
        @loadMore="loadMoreMessages"
      />
      <MessageInput @sendMessage="handleSendMessage" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MessageList from './components/MessageList.vue';
import MessageInput from './components/MessageInput.vue';
import { useMessageStore } from '@/stores/messages.store';
import { useUserStore } from '@/stores/user.store';

const router = useRouter();
const route = useRoute();
const messageStore = useMessageStore();
const userStore = useUserStore();

const roomId = computed(() => route.params.roomId);
const messages = computed(() => messageStore.messages || []);
const hasMoreMessages = computed(() => messageStore.pageInfo.hasMoreMessages);

const goBack = () => {
  router.push({ name: 'home' });
};

const loadMoreMessages = async () => {
  await messageStore.loadMoreMessages(roomId.value, messageStore.pageInfo.nextCursor);
};

const handleSendMessage = (messageText) => {
  const userId = userStore.user?.id;
  messageStore.sendMessage(roomId.value, userId, messageText);
};

onMounted(async () => {
  await messageStore.getMessagesFromRoom(roomId.value);
});
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px - 32px);
  max-width: 1200px;
  margin: -16px auto 0;
  background-color: #f5f5f5;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: #e8e8e8;
  border-color: #ccc;
}

.back-button:active {
  transform: scale(0.98);
}

.arrow {
  font-size: 18px;
}

.chat-header h1 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}
</style>
