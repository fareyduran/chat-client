<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="left">
        <strong class="user-name">{{ userStore.user?.username }}</strong>
        <button class="logout-btn" @click="handleLogout">
          Cerrar sesión
        </button>
      </div>
    </header>

    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user.store";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push("/auth");
};
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 60px;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #ddd;
}

.app-content {
  padding: 16px;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 16px;
}

.logout-btn {
  padding: 6px 12px;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: fit-content;
}
</style>
