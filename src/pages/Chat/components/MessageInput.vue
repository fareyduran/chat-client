<template>
  <div class="message-input-container">
    <form @submit.prevent="sendMessage" class="input-form">
      <input
        v-model="messageText"
        type="text"
        placeholder="Escribe un mensaje..."
        class="message-input"
        ref="inputRef"
      />
      <button type="submit" class="send-button" :disabled="!messageText.trim()">
        <span class="send-icon">➤</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['sendMessage']);

const messageText = ref('');
const inputRef = ref(null);

const sendMessage = () => {
  if (messageText.value.trim()) {
    emit('sendMessage', messageText.value.trim());
    messageText.value = '';
    inputRef.value?.focus();
  }
};

onMounted(() => {
  inputRef.value?.focus();
});
</script>

<style scoped>
.message-input-container {
  background-color: white;
  border-top: 1px solid #e0e0e0;
  padding: 16px 20px;
}

.input-form {
  display: flex;
  gap: 12px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #4CAF50;
}

.send-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background-color: #45a049;
  transform: scale(1.05);
}

.send-button:active:not(:disabled) {
  transform: scale(0.95);
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.send-icon {
  font-size: 18px;
  display: block;
}
</style>
