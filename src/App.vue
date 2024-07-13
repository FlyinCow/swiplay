<script setup lang="ts">
import { reactive, ref } from 'vue';

// 卡片信息
const cardRefs = ref();
const shownCard = ref(0);
const nextCard = ref(1);
const hiddenCard = ref(2);
const bgColors = ref(["#3F5C4F", "#794E8A", "#DBA22A"]);

// 卡片状态
const swiping = ref(false);
const rotation = ref(0)
const scale = ref(0.5);

const MAXWIDTH = 600;

const startPos = reactive<{ x: number | null, y: number | null }>({ x: null, y: null });

const isMouseEvent = (e: Event) => {
  return e.type.startsWith("mouse")
}

const getPageXY = (e: MouseEvent | TouchEvent | TransitionEvent) => {
  return [isMouseEvent(e) ? (e as MouseEvent).pageX : (e as TouchEvent).touches[0].pageX, isMouseEvent(e) ? (e as MouseEvent).pageY : (e as TouchEvent).touches[0].pageY]
}

// event handlers
const onSwipeStart = (e: MouseEvent | TouchEvent) => {
  [startPos.x, startPos.y] = getPageXY(e);
  console.log(`start at {${startPos.x}, ${startPos.y}}`)
  swiping.value = true;
}

const onSwipeMove = (e: MouseEvent | TouchEvent) => {
  // 1. 计算位置
  // 2. 更新卡片
  //    1. shownCard: 旋转角度
  //    2. nextCard: 缩放
  if (!swiping.value) return;
  let delta = {
    x: isMouseEvent(e) ? (e as MouseEvent).pageX - startPos.x! : (e as TouchEvent).touches[0].pageX - startPos.x!
  };
  rotation.value = delta.x;
  scale.value = 0.5 + Math.abs(delta.x / MAXWIDTH)
}


const onSwipeEnd = (e: MouseEvent | TouchEvent) => {
  // TODO: 更新卡片
  // TODO: cancle
  // 2. 预加载下一曲
  shownCard.value = (shownCard.value + 1) % 3;
  nextCard.value = (nextCard.value + 1) % 3;
  hiddenCard.value = (hiddenCard.value + 1) % 3;
  rotation.value = 0;
  swiping.value = false;
}

</script>

<template>
  <div class="wrapper" @mousedown="onSwipeStart" @touchstart="onSwipeStart" @mousemove.preventDefault="onSwipeMove"
    @touchmove.preventDefault="onSwipeMove" @mouseup="onSwipeEnd" @touchend="onSwipeEnd">
    <div v-for="card in [0, 1, 2]" class="card" ref="cardRefs" :class="{
      shownCard: card == shownCard,
      nextCard: card == nextCard,
      hiddenCard: card == hiddenCard
    }" :style="{ background: bgColors[card] }"></div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  z-index: 0;
  width: 200px;
  height: 300px;
  border: solid 1px #000;
  overflow: hidden;
}

.card {
  position: absolute;
  left: 50%;
  top: 50%;
  /* padding: 2rem; */
  border-radius: 1rem;
  width: 200px;
  height: 300px;
  margin-left: -100px;
  margin-top: -150px;
}

/* TODO: 向左滑动 */
.shownCard {
  z-index: 1000;
  transform: v-bind('`rotate(${rotation}deg)`');
  transform-origin: center 350px;
  transition-duration: v-bind("swiping ? ' 0ms' : '500ms'");
}

.nextCard {
  z-index: 0;
  transform: v-bind('`scale(${scale})`');
}

.hiddenCard {
  z-index: -1000;
  transform-origin: center 350px;
  transform: rotate(180deg);
  /* transition-duration: v-bind("swiping ? ' 0ms' : '200ms'"); */
  transition-duration: 500ms;
  /* display: none; */
}

p {
  padding: 0;
  margin: 0;
  user-select: none;
}
</style>
