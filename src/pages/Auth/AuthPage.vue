<template>
  <div class="auth-container">
    <h1>Bienvenido</h1>
    <p>Ingresa tu nombre para continuar</p>

    <form @submit.prevent="onSubmit">
      <input
        v-model="name"
        type="text"
        placeholder="Tu nombre"
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? "Validando..." : "Entrar" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useRouter } from "vue-router";

const name = ref("");
const loading = ref(false);

const userStore = useUserStore();
const router = useRouter();

const onSubmit = async () => {
  loading.value = true;
  await userStore.login(name.value);
  loading.value = false;
  router.push({ name: "home" });
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 80px auto;
  text-align: center;
}

input {
  width: 100%;
  margin: 12px 0;
  padding: 10px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
}
</style>
