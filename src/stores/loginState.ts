import { defineStore } from "pinia"
import { ref } from "vue"


export const useloginStateStore = defineStore('loginstate', () => {
  const loggedin = ref(false)

  return { loggedin }
})