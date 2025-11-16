<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Crear Nueva Sala</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="roomName">Nombre de la sala</label>
          <input
            id="roomName"
            v-model="roomName"
            type="text"
            placeholder="Ingresa el nombre de la sala"
            @keyup.enter="handleCreateRoom"
            ref="inputRef"
          />
        </div>
        
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">Cancelar</button>
        <button class="create-button" @click="handleCreateRoom">Crear</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'create']);

const roomName = ref('');
const errorMessage = ref('');
const inputRef = ref(null);

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    roomName.value = '';
    errorMessage.value = '';
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

const closeModal = () => {
  emit('close');
};

const handleCreateRoom = () => {
  if (!roomName.value.trim()) {
    errorMessage.value = 'Por favor ingresa un nombre para la sala';
    return;
  }
  
  emit('create', roomName.value.trim());
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 32px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #4CAF50;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
}

.cancel-button,
.create-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.create-button {
  background-color: #4CAF50;
  color: white;
}

.create-button:hover {
  background-color: #45a049;
}

.create-button:active,
.cancel-button:active {
  transform: scale(0.98);
}
</style>
