import axios from 'axios'

import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/authStore'

import AuthService from "services/auth/auth.service";

const apiGateway = axios.create({ baseURL: `${import.meta.env.VITE_API}` })
const apiKeycloak = axios.create({ baseURL: `${import.meta.env.VITE_KEYCLOAK_SERVER_URL}/realms/${import.meta.env.VITE_KEYCLOAK_CLIENT_REALM}` })

export default boot(({ router }) => {
  const authStore = useAuthStore()

  apiGateway.interceptors.request.use(
    config => {
      if (authStore.accessToken){
        config.headers["Authorization"] = `Bearer ${authStore.accessToken.value}`
      }
      return config
    },
    error => {
      return Promise.reject(error);
    }
  )

  apiGateway.interceptors.response.use(
    response => {
      return response
    },
    async error => {
      if (error.response.status === 403) {
        const { status, data } = await AuthService.refresh({ refreshToken: authStore.refreshToken.value })
        if(status){
          authStore.setAccessToken({
            value: data.access_token, 
            expires: data.expires_in
          });
          authStore.setRefreshToken({
            value: data.refresh_token, 
            expires: data.refresh_expires_in
          });
          error.config.headers["Authorization"] = `Bearer ${data.access_token}`
          return axios(error.config)
        }
        else{
          authStore.removeTokens()
          router.push({name: 'login'})
        }
      } 
      return Promise.reject(error)
    }
  )

  apiKeycloak.interceptors.response.use(
    response => response,
    async error => {
      if (error.response.status === 403) {
        authStore.removeTokens()
        router.push({ name: 'login' })
      }
      return Promise.reject(error)
    }
  )
})

export { apiGateway, apiKeycloak }
