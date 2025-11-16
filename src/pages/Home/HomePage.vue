<template>
  <div>
    <h1> Home page </h1>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user.store";
import { useRouter } from "vue-router";

const userStore = useUserStore();

const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push({ name: "auth" });
};
</script>
