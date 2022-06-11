<template>
  <div v-drag="onDrag" class="dial">
    <div
      class="dial-wheel"
      :style="{
        'background-image': `conic-gradient(rgb(140,239,252) ${dialValue}%, transparent ${dialValue}%)`,
      }"
    ></div>

    <div class="dial-cover">
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
.dial {
  position: relative;
  user-select: none;
  height: 74px;
  width: 74px;
  background-image: url("@/assets/dial_bg.png");
  background-size: 100%;
}

.dial-wheel {
  position: absolute;
  left: -10px;
  top: -10px;
  height: 94px;
  width: 94px;
  border-radius: 50%;
  mask: radial-gradient(transparent 40px, #000 10px);
}

.dial-cover {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px;
}

.dial-dot {
  position: absolute;
  left: 31px;
  top: 13px;
  height: 13px;
  width: 13px;
  background-image: url("@/assets/dial_dot.png");
  transform-origin: 0px 31px;
}
</style>
