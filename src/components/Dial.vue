<template>
  <div v-drag="onDrag" class="dial">
    <div
      class="dial-wheel"
      :style="{
        'background-image': `conic-gradient(rgb(140,239,252) ${dialValue}%, rgba(200,200,200,0.5) ${dialValue}%)`,
      }"
    ></div>

    <div class="dial-label">
      {{ parseInt(dialValue) }}
    </div>

    <div
      class="dial-dot"
      :style="{ transform: `rotate(${(360 * dialValue) / 100}deg)` }"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["change"]);

const props = defineProps({
  value: { type: Number, default: 0 },
});

const dialValue = ref(props.value);

watch(dialValue, (val) => {
  emit("change", val);
});

const pointC = { x: 0, y: 0 },
  pointA = { x: 0, y: 0 },
  pointB = { x: 0, y: 0 };

function onDrag(event) {
  if (event.type == "drag:start") {
    const { left, top, width, height } = event.target.getBoundingClientRect();
    pointC.x = left + width / 2;
    pointC.y = -(top + height / 2);

    pointA.x = event.startX;
    pointA.y = -event.startY;
  } else if (event.type == "drag:move") {
    pointB.x = event.startX + event.deltaX;
    pointB.y = -(event.startY + event.deltaY);

    const edgeAC = Math.sqrt(
        Math.pow(pointA.x - pointC.x, 2) + Math.pow(pointA.y - pointC.y, 2)
      ),
      edgeBC = Math.sqrt(
        Math.pow(pointB.x - pointC.x, 2) + Math.pow(pointB.y - pointC.y, 2)
      ),
      edgeAB = Math.sqrt(
        Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
      );

    const angle = Math.acos(
      (edgeBC * edgeBC + edgeAC * edgeAC - edgeAB * edgeAB) /
        (2 * edgeBC * edgeAC)
    );

    const direction =
      (pointA.x - pointC.x) * (pointB.y - pointC.y) -
      (pointB.x - pointC.x) * (pointA.y - pointC.y);

    pointA.x = pointB.x;
    pointA.y = pointB.y;

    dialValue.value +=
      ((direction > 0 ? -1 : 1) * (angle * 100)) / (2 * Math.PI);

    if (dialValue.value < 0) {
      dialValue.value = 0;
    } else if (dialValue.value > 100) {
      dialValue.value = 100;
    }
  }
}
</script>

<style scoped>
.dial {
  --dial-radius: 60px;
  position: relative;
  user-select: none;
  height: calc(var(--dial-radius) * 2);
  width: calc(var(--dial-radius) * 2);
}

.dial-wheel {
  --dial-wheel-slot-radius: 10px;
  position: absolute;
  left: calc(-1 * var(--dial-wheel-slot-radius));
  top: calc(-1 * var(--dial-wheel-slot-radius));
  width: calc(var(--dial-radius) * 2 + 2 * var(--dial-wheel-slot-radius));
  height: calc(var(--dial-radius) * 2 + 2 * var(--dial-wheel-slot-radius));
  border-radius: 50%;
  mask: radial-gradient(transparent 40px, #000 10px);
}

.dial-label {
  position: absolute;
  height: calc(var(--dial-radius) * 2);
  width: calc(var(--dial-radius) * 2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  background-color: blueviolet;
}

.dial-dot {
  --dial-dot-radius: 10px;
  position: absolute;
  left: calc(var(--dial-radius) - var(--dial-dot-radius));
  top: 0;
  height: calc(var(--dial-dot-radius) * 2);
  width: calc(var(--dial-dot-radius) * 2);
  border-radius: 50%;
  transform-origin: var(--dial-dot-radius) var(--dial-radius);
  background-color: rgb(222, 58, 172);
  cursor: pointer;
}
</style>
