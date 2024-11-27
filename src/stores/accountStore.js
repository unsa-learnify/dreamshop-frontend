import { defineStore } from 'pinia'
import { reactive } from 'vue'

// Define el store para la cuenta 
export const useAccountStore = defineStore('account', () => {

  const defaultAccount = {
    id: null,
    username: '',
    email: '',
    image: null,
    roles: [],
    permissions: {}
  }

  const account = reactive({ ...defaultAccount })

  const setAccount = ({ id, username, email, image, roles = [], permissions = {} }) => {
    account.id = id
    account.username = username
    account.email = email
    account.image = image
    account.roles = roles
    account.permissions = permissions
  }

  const removeAccount = () => {
    account.id = defaultAccount.id
    account.username = defaultAccount.username
    account.email = defaultAccount.email
    account.image = defaultAccount.image
    account.roles = []
    account.permissions = {}
  }

  return { 
    account,
    setAccount,
    removeAccount,
  }

})
