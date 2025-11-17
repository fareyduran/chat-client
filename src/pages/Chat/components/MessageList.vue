<template>
  <div class="message-list-container">
    <div class="load-more-container" v-if="hasMore">
      <button @click="handleLoadMore" :disabled="isLoading" class="load-more-button">
        <span v-if="isLoading" class="spinner"></span>
        {{ isLoading ? 'Cargando...' : 'Cargar más mensajes' }}
      </button>
    </div>
    
    <div class="message-list" ref="messageContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <p class="empty-message">No existen mensajes en esta sala, envía uno para comenzar</p>
      </div>
      
      <div 
        v-for="message in messages" 
        :key="message.id" 
        :class="['message-wrapper', { 'own-message': isOwnMessage(message) }]"
      >
        <div class="message-bubble">
          <div class="message-header">
            <span class="sender-name">{{ message.senderName }}</span>
            <span class="message-time">{{ formatTime(message.sentAt) }}</span>
          </div>
          <p class="message-text">{{ message.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useUserStore } from '@/stores/user.store';

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  hasMore: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['loadMore']);

const messageContainer = ref(null);
const userStore = useUserStore();
const isLoading = ref(false);
const isInitialLoad = ref(true);

const isOwnMessage = (message) => {
  return message.senderId === userStore.user?.id;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleLoadMore = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  const previousScrollHeight = messageContainer.value?.scrollHeight || 0;
  
  try {
    await emit('loadMore');
    
    nextTick(() => {
      if (messageContainer.value) {
        const newScrollHeight = messageContainer.value.scrollHeight;
        messageContainer.value.scrollTop = newScrollHeight - previousScrollHeight;
      }
      isLoading.value = false;
    });
  } catch (error) {
    isLoading.value = false;
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value && isInitialLoad.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
      isInitialLoad.value = false;
    }
  });
};

watch(() => props.messages.length, (newLength, oldLength) => {
  if (isInitialLoad.value || newLength > oldLength) {
    scrollToBottom();
  }
});

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.message-list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.load-more-container {
  padding: 16px;
  text-align: center;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.load-more-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 0 auto;
  min-width: 160px;
}

.load-more-button:hover:not(:disabled) {
  background-color: #1976D2;
}

.load-more-button:disabled {
  background-color: #90CAF9;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-message {
  margin: 0;
  font-size: 16px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-wrapper {
  display: flex;
  justify-content: flex-start;
}

.message-wrapper.own-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.own-message .message-bubble {
  background-color: #4CAF50;
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.sender-name {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.own-message .sender-name {
  color: rgba(255, 255, 255, 0.9);
}

.message-time {
  font-size: 11px;
  color: #999;
}

.own-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.message-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

/* Scrollbar styling */
.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.message-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
