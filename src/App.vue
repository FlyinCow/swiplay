<script setup lang="ts">
import { reactive, ref } from 'vue'
import Swiper from './components/Swiper.vue'
import Test from './components/Test.vue'

const onSwipeStart = () => {
  console.log('swipeStart!')
}

const onSwiping = () => {
  console.log('swiping!')
}

const onSwipeEnd = (direction: string) => {
  console.log(`swipeEnd ${direction}!`)
}

const onSwipeCancel = () => {
  console.log(`swipeCancel`)
}

const cards = [1, 2, 3]
const bgColors = ref(["#3F5C4F", "#794E8A", "#DBA22A"])


</script>

<template>
  <Swiper @swipe-start="onSwipeStart" @swiping="onSwiping" @swipe-end="onSwipeEnd" @swipe-cancel="onSwipeCancel"
    :data="cards">
    <template v-for="(card, index) in cards" #[index]>
      <div class="card" :style="{ backgroundColor: bgColors[index] }">{{ card }}</div>
    </template>
  </Swiper>
</template>

<style scoped>
.card {
  border-radius: 1rem;
  width: 200px;
  height: 300px;
}
</style>
