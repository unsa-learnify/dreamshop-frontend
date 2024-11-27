import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { computed, reactive, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  const accessToken = reactive({
    value: null,
    expires: null
  })

  const refreshToken = reactive({
    value: null,
    expires: null
  })

  const isAuthenticated = computed(() => accessToken.value !== null)

  const setAccessToken = ({ value, expires }) => {
    accessToken.value = value
    accessToken.expires = expires
    LocalStorage.set('accessToken', accessToken)
  }

  const setRefreshToken = ({ value, expires }) => {
    refreshToken.value = value
    refreshToken.expires = expires
    LocalStorage.set('refreshToken', refreshToken)
  }

  const removeTokens = () => {
    accessToken.value = null
    accessToken.expires = null
    refreshToken.value = null
    refreshToken.expires = null
    LocalStorage.remove('accessToken')
    LocalStorage.remove('refreshToken')
  }

  return { 
    accessToken, 
    refreshToken, 
    
    isAuthenticated,

    setAccessToken,
    setRefreshToken,
    removeTokens
  }
  
})
