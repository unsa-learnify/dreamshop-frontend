<template>
  <q-layout view="hHh LpR lFf">
    <q-header>
      <MyHeader @changeDrawerState="drawerOpen = !drawerOpen"/>
    </q-header>

    <q-drawer
      container
      v-model="drawerOpen"
      show-if-above
      class="tw-flex tw-flex-col tw-bg-primary tw-p-4"
    >
      <MySidebar/>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

import MyHeader from "./config/MyHeader.vue"
import MySidebar from "./config/MySidebar.vue"

const drawerOpen = ref(false)

defineExpose({
  drawerOpen
})
</script>
