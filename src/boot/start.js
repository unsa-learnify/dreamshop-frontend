import { LocalStorage } from 'quasar'
import { useAuthStore } from 'stores/authStore'

export default async function () {
  const accessToken = LocalStorage.getItem('accessToken')
  const refreshToken = LocalStorage.getItem('refreshToken')
  if (accessToken && refreshToken) {
    const authStore = useAuthStore()
    authStore.setAccessToken(accessToken)
    authStore.setRefreshToken(refreshToken)
  }
}