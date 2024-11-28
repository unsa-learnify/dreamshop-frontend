<template>
  <div class="tw-w-full tw-h-full tw-text-white">

    <div class="tw-flex tw-flex-col tw-w-full tw-items-start tw-pt-2 tw-pb-4 tw-font-roboto">
      <div class="tw-flex tw-mb-4 tw-w-full">
        <div class="tw-bg-white tw-rounded tw-flex  tw-min-w-10 tw-min-h-10 tw-mr-4 tw-justify-center tw-items-center">
          <span class="tw-text-primary tw-font-bold tw-text-xl">{{ simpleUsername }}</span>
        </div>
        <div class="tw-flex tw-items-center">
          <span class="tw-text-lg tw-truncate">{{ username }}</span>
        </div>
      </div>

      <div class="tw-flex tw-flex-col tw-w-full tw-gap-1">

        <h-sidebar-item
          routeName="inventory-dashboard"
          label="Inventario"
          :iconComponent="Icon.HomeIcon"
        />
  
        <h-sidebar-expansion-item
          :routeNames="[
            'product-dashboard',
            'product-category-dashboard',
          ]"
          label="Gestión de Productos"
          :iconComponent="Icon.BookIcon"
        >
          <h-sidebar-item
            routeName="product-dashboard"
            label="Productos"
          />
          <h-sidebar-item
            routeName="product-category-dashboard"
            label="Categorías de Productos"
          />
        </h-sidebar-expansion-item>

        <h-sidebar-item
          routeName="user-dashboard"
          label="Usuario"
          :iconComponent="Icon.UserIcon"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { jwtDecode } from "jwt-decode";
import { computed } from 'vue';
import { useAuthStore } from "stores/authStore";

import HSidebarItem from "components/custom/h-sidebar-item.vue";
import HSidebarExpansionItem from "components/custom/h-sidebar-expansion-item.vue";

import * as Icon from "components/icons";

const authStore = useAuthStore();

const infoUser = computed(() => {
  try {
    if (authStore.accessToken.value) {
      const decode = jwtDecode(authStore.accessToken.value);
      return {
        name: decode.name || '',
        preferred_username: decode.preferred_username || '',
        given_name: decode.given_name || '',
        family_name: decode.family_name || '',
        email: decode.email || ''
      };
    }
    else {
      return {
        name: '',
        preferred_username: '',
        given_name: '',
        family_name: '',
        email: ''
      }
    }
  } catch (error) {
    console.error('Error al decodificar el token JWT:', error);
    return {
      name: '',
      preferred_username: '',
      given_name: '',
      family_name: '',
      email: ''
    };
  }
});

const username = computed(() => {
  const firstName = infoUser.value.given_name.split(" ")[0] || '';
  const firstLastName = infoUser.value.family_name.split(" ")[0] || '';
  return `${firstName} ${firstLastName}`;
});

const simpleUsername = computed(() => {
  const initialName = infoUser.value.given_name?.charAt(0) || '';
  const initialLastName = infoUser.value.family_name?.charAt(0) || '';
  return `${initialName}${initialLastName}`.toUpperCase();
});

</script>
