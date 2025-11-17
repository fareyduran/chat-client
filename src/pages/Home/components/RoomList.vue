<template>
  <div class="room-list">
    <h2>{{ title }}</h2>
    
    <div v-if="rooms.length === 0" class="empty-state">
      <p class="empty-message">No existen salas, crea una para comenzar</p>
    </div>

    <ul v-else class="list">
      <li v-for="room in rooms" :key="room.id" class="room-item" :class="{ selectable: isSelectable }">
        <div class="room-info">
          <div class="room-header">
            <h3>{{ room.name }}</h3>
            <span v-if="isMember(room)" class="member-badge">Miembro</span>
          </div>
          <p class="participants-count">{{ room.participants.length }} participantes</p>
          <p class="created-at">{{ formatDate(room.createdAt) }}</p>
        </div>
        <button 
          v-if="showJoinButton && !isMember(room)" 
          @click.stop="handleJoinRoom(room)"
          class="join-button"
        >
          Unirse
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user.store';

const props = defineProps({
  rooms: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Rooms'
  },
  showJoinButton: {
    type: Boolean,
    default: false
  },
  isSelectable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['joinRoom']);

const userStore = useUserStore();

const currentUserId = computed(() => userStore.user?.id || '');

const isMember = (room) => {
  return room.participants.includes(currentUserId.value);
};

const handleJoinRoom = (room) => {
  emit('joinRoom', room);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.room-list {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.empty-message {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.selectable:hover {
  background-color: #e8e8e8;
  cursor: pointer;
}

.room-info {
  flex: 1;
}

.room-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.room-info h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.member-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: #4CAF50;
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
}

.participants-count {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.created-at {
  margin: 4px 0 0 0;
  color: #999;
  font-size: 12px;
}

.join-button {
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.join-button:hover {
  background-color: #1976D2;
}

.join-button:active {
  transform: scale(0.98);
}
</style>
