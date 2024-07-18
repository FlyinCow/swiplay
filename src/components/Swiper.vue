<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const emit = defineEmits<{
  (e: 'swipeStart'): void,
  (e: 'swiping'): void,
  (e: 'swipeEnd', direction: 'left' | 'right'): void,
  (e: 'swipeCancel'): void
}>()

export interface SwiperProps {
  data: any[],
  startIndex?: number
}

const { data, startIndex } = withDefaults(defineProps<SwiperProps>(), {
  startIndex: 0
})

// 卡片信息
const shownItem = ref(startIndex)
const nextItem = ref(startIndex + 1)
const hiddenItem = ref(startIndex + 2)

// 卡片状态
const swiping = ref(false)
const rotation = ref(0)
const scale = ref(0.5)
const cancel = ref(false)
const direction = ref<'left' | 'right'>('left')
const hiddenRotation = computed(() => { direction.value == 'left' ? -180 : 180 })

const MAXWIDTH = 600

const startPos = reactive<{ x: number | null, y: number | null }>({ x: null, y: null })
const currentPos = reactive<{ x: number | null, y: number | null }>({ x: null, y: null })

const isMouseEvent = (e: Event) => {
  return e.type.startsWith("mouse")
}

const getPageXY = (e: MouseEvent | TouchEvent | TransitionEvent) => {
  return [isMouseEvent(e) ? (e as MouseEvent).pageX : (e as TouchEvent).touches[0].pageX, isMouseEvent(e) ? (e as MouseEvent).pageY : (e as TouchEvent).touches[0].pageY]
}

// event handlers
const onSwipeStart = (e: MouseEvent | TouchEvent) => {
  [startPos.x, startPos.y] = getPageXY(e)
  console.log(`start at {${startPos.x}, ${startPos.y}}`)
  swiping.value = true
  cancel.value = false
  emit('swipeStart')
}

const onSwipeMove = (e: MouseEvent | TouchEvent) => {
  // 1. 计算位置
  // 2. 更新卡片
  //    1. shownCard: 旋转角度
  //    2. nextCard: 缩放
  if (!swiping.value) return

  const lastPos = {
    x: currentPos.x,
    y: currentPos.y
  };

  [currentPos.x, currentPos.y] = getPageXY(e)
  let delta = {
    x: currentPos.x - startPos.x!,
    y: currentPos.y - startPos.y!
  }
  rotation.value = delta.x
  scale.value = 0.5 + Math.abs(delta.x / MAXWIDTH)
  // TODO: cancel
}


const onSwipeEnd = (_: MouseEvent | TouchEvent) => {
  // 2. 预加载下一曲
  rotation.value = 0
  swiping.value = false
  if (!cancel.value) {
    if (Math.abs(currentPos.x! - startPos.x!) > 35) {
      direction.value = currentPos.x! < startPos.x! ? 'left' : 'right'
      shownItem.value = (shownItem.value + 1) % 3
      nextItem.value = (nextItem.value + 1) % 3
      hiddenItem.value = (hiddenItem.value + 1) % 3
      emit('swipeEnd', direction.value)
    }
    else
      emit('swipeCancel')
  }
  else {
    emit('swipeCancel')
  }
}
</script>

<template>
  <div class="swiper-wrapper" @mousedown="onSwipeStart" @touchstart="onSwipeStart" @mousemove.prevent="onSwipeMove"
    @touchmove.prevent="onSwipeMove" @mouseup="onSwipeEnd" @touchend="onSwipeEnd">
    <div class="swiper-item" v-for="(_, index) in data" :class="{
      'shown-item': index == shownItem,
      'next-item': index == nextItem,
      'hidden-item': index == hiddenItem
    }">
      <slot :name="index"></slot>
    </div>
  </div>
</template>

<style scoped>
.swiper-wrapper {
  position: relative;
  z-index: 0;
  width: 200px;
  height: 300px;
  border: solid 1px #000;
  overflow: hidden;
}

.swiper-item {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -150px;
}

/* TODO: 向左滑动 */
.shown-item {
  z-index: 1000;
  transform: v-bind('`rotate(${rotation}deg)`');
  transform-origin: center 400px;
  transition-duration: v-bind("swiping ? ' 0ms' : '500ms'");
}

.next-item {
  z-index: 0;
  transform: v-bind('`scale(${scale})`');
}

.hidden-item {
  z-index: -1000;
  transform-origin: center 400px;
  transform: v-bind("`rotate(${direction == 'left' ? -180 : 180}deg)`");
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
