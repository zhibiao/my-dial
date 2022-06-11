<template>
  <div class="penel">
    <Dial />
  </div>
</template>

<script setup>
import Dial from "./components/Dial.vue";
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(43, 44, 46);
}

#app {
}

.penel {
  width: 1275px;
  height: 143px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-image: url("@/assets/penel_bg.png");
}
</style>
