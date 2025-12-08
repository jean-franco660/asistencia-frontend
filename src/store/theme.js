import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const setTheme = (dark) => {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    setTheme(!isDark.value)
  }

  const loadTheme = () => {
    const t = localStorage.getItem('theme')
    setTheme(t === 'dark')
  }

  return { isDark, setTheme, toggleTheme, loadTheme }
})
