<template>
  <div class="home-page">
    <div class="header">
      <h1>Salas de Chat</h1>
      <button @click="showModal = true" class="create-button">
        <span class="plus-icon">+</span>
        Crear Sala
      </button>
    </div>

    <div class="tabs-container">
      <div class="tabs">
        <button 
          :class="['tab', { active: activeTab === 'myRooms' }]"
          @click="activeTab = 'myRooms'"
        >
          Tus Salas
        </button>
        <button 
          :class="['tab', { active: activeTab === 'otherRooms' }]"
          @click="activeTab = 'otherRooms'"
        >
          Salas
        </button>
      </div>
    </div>

    <div class="tab-content">
      <RoomList 
        v-if="activeTab === 'myRooms'" 
        :rooms="myRooms"
        title="Tus Salas"
        :isSelectable="true"
      />
      <RoomList 
        v-if="activeTab === 'otherRooms'" 
        :rooms="otherRooms"
        title="Salas"
        :showJoinButton="true"
        @joinRoom="handleJoinRoom"
      />
    </div>

    <CreateRoom 
      :isVisible="showModal" 
      @close="showModal = false" 
      @create="handleCreateRoom"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import RoomList from "@/pages/Home/components/RoomList.vue";
import CreateRoom from "@/pages/Home/components/CreateRoom.vue";
import { useRoomStore } from '@/stores/rooms.store';
import { useUserStore } from '@/stores/user.store';

const activeTab = ref('myRooms');
const showModal = ref(false);

const roomStore = useRoomStore();

const myRooms = computed(() => roomStore.myRooms || []);
const otherRooms = computed(() => roomStore.rooms || []);

onMounted(async () => {
  try {
    const currentUser = useUserStore().user;
    await roomStore.setMyRooms(currentUser?.id || '');
    await roomStore.setRooms();
  } catch (error) {
    console.error('Error al cargar las salas:', error);
  }
});

const handleCreateRoom = async (roomName) => {
  try {
    const userStore = useUserStore();
    const userId = userStore.user?.id;
    
    if (!userId) {
      console.error('No hay usuario autenticado');
      return;
    }
    
    await roomStore.createRoom(roomName, userId);
    
    activeTab.value = 'myRooms';
  } catch (error) {
    console.error('Error al crear la sala:', error);
  }
};

const handleJoinRoom = async (room) => {
 try {
   const userStore = useUserStore();
   const userId = userStore.user?.id;
   if (!userId) {
      console.error('No hay usuario autenticado');
      return;
    }
    
    await roomStore.assignParticipant(room.id, userId);
    activeTab.value = 'myRooms';
  } catch (error) {
    console.error('Error al unirse a la sala:', error);
  }
};
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.create-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-button:hover {
  background-color: #45a049;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.create-button:active {
  transform: scale(0.98);
}

.plus-icon {
  font-size: 20px;
  font-weight: bold;
}

.tabs-container {
  background-color: white;
  border-bottom: 2px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tabs {
  display: flex;
  gap: 8px;
  padding: 16px 20px 0;
}

.tab {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  position: relative;
  bottom: -2px;
}

.tab:hover {
  color: #333;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
}

.tab.active {
  color: #4CAF50;
  border-bottom-color: #4CAF50;
}

.tab-content {
  padding: 0;
}
</style>
