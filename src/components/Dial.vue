<template>
  <div
    v-drag="onDrag"
    class="box"
    :style="{
      'background-image': `conic-gradient(blue ${dialValue}%, gray ${dialValue}%)`,
    }"
  >
    <div class="box-1">
      {{ parseInt(dialValue) }}
    </div>

    <div
      class="box-2"
      :style="{ transform: `rotate(${(360 * dialValue) / 100}deg)` }"
    ></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const dialValue = ref(0);

const pC = { x: 0, y: 0 },
  pA = { x: 0, y: 0 },
  pB = { x: 0, y: 0 };

function onDrag(event) {
  if (event.type == "drag:start") {
    const { left, top, width, height } = event.target.getBoundingClientRect();
    pC.x = left + width / 2;
    pC.y = -(top + height / 2);
    pA.x = event.startX;
    pA.y = -event.startY;
  } else if (event.type == "drag:move") {
    pB.x = event.startX + event.deltaX;
    pB.y = -(event.startY + event.deltaY);

    const lB = Math.sqrt(Math.pow(pA.x - pC.x, 2) + Math.pow(pA.y - pC.y, 2)),
      lA = Math.sqrt(Math.pow(pB.x - pC.x, 2) + Math.pow(pB.y - pC.y, 2)),
      lC = Math.sqrt(Math.pow(pA.x - pB.x, 2) + Math.pow(pA.y - pB.y, 2));

    const deltaAngle = Math.acos((lA * lA + lB * lB - lC * lC) / (2 * lA * lB));
    const direction =
      (pA.x - pC.x) * (pB.y - pC.y) - (pB.x - pC.x) * (pA.y - pC.y);

    pA.x = pB.x;
    pA.y = pB.y;

    dialValue.value +=
      ((direction > 0 ? -1 : 1) * (deltaAngle * 100)) / (2 * Math.PI);

    if (dialValue.value < 0) {
      dialValue.value = 0;
    } else if (dialValue.value > 100) {
      dialValue.value = 100;
    }
  }
}
</script>

<style scoped>
.box {
  position: relative;
  height: 120px;
  width: 120px;
  border-radius: 50%;
  user-select: none;
}

.box-1 {
  position: absolute;
  left: 10px;
  top: 10px;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background-color: rgb(42, 44, 45);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
}

.box-2 {
  position: absolute;
  left: 50px;
  top: 10px;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: rgb(239, 11, 144);
  transform-origin: 10px 50px;
  cursor: pointer;
  border: 1px solid #fff;
}

@keyframes A {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
