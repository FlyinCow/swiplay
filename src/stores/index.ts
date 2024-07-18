import { defineStore } from "pinia"
import { ref } from "vue"

export const useStore = defineStore('store', () => {
  const loggedin = ref(false)
  const userId = ref()
  const loginCookie = ref()
  const currentSongID = ref()
  const nextSontID = ref()

  return { loggedin, userId, loginCookie }
})

export default useStore