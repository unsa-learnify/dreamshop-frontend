import { Notify } from 'quasar'

Notify.registerType('my-error', {
  progress: true,
  color: 'red',
  textColor: 'white',
})

Notify.registerType('my-successful', {
  progress: true,
  color: 'green',
  textColor: 'white',
})