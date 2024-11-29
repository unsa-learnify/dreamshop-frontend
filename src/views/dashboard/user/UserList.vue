<template>
  <q-page class="tw-bg-background tw-p-4 tw-flex tw-flex-col tw-gap-4">
    <div
      class="tw-flex tw-items-center tw-gap-1 tw-flex-wrap tw-text-secondary tw-text-2xl tw-font-roboto-condensed"
    >
      <span>Usuarios</span>
    </div>

    <div class="tw-p-6 tw-shadow-md tw-bg-white tw-gap-4">
      <h2 class="tw-mb-4 tw-text-xl tw-text-primary">Lista de Usuarios</h2> <!-- NOTE: replaceable -->

      <div class="tw-grid md:tw-grid-cols-2 tw-gap-2">
        <!-- Campo de búsqueda principal -->
        <h-input
          data-test="search-input"
          :placeholder="table.search.placeholder"
          v-model="table.search.value"
          debounce
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" class="tw-text-[#0000008a]" />
          </template>
        </h-input>

        <!-- Botones de acciones -->
        <div class="tw-flex tw-justify-end tw-items-center tw-gap-2">
          <q-btn 
            class="tw-bg-gray-100" 
            dense 
            round 
            flat 
            @click="onCreate"
          >
            <Icon.PlusIcon class="tw-fill-primary tw-w-6 tw-h-6"/>
            <q-tooltip>Filtros</q-tooltip>
          </q-btn>
          <q-btn 
            class="tw-bg-gray-100" 
            dense 
            round 
            flat 
            @click="onToogle"
          >
            <Icon.FilterIcon class="tw-fill-primary tw-w-6 tw-h-6"/>
            <q-tooltip>Filtros</q-tooltip>
          </q-btn>
        </div>
        
      </div>

      <!-- Tabla -->
      <div>
        <q-table
          ref="$table"
          color="tw-bg-primary"
          flat
          :filter="table.search.value"
          :grid="table.isGrid"
          :loading="table.isLoading"
          :rows="table.rows"
          :columns="table.columns"
          :visible-columns="drawer.column.value"
          v-model:pagination="table.pagination"
          :rows-per-page-options="table.pagination.rowsPerPageOptions"
          @request="onRequest"
          class="tw-mt-8"
        >
          <template #body-cell-index="props">
            <q-td :props="props">
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>

          <template #body-cell-category="props">
            <q-td :props="props">
              <q-chip 
                v-for="{ id, name } in props.value" :key="id"
                outline 
                dense
                color="primary" 
                text-color="white"
              >
                {{ name }}
              </q-chip>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>


  <q-drawer 
    v-model="drawer.isOpen" 
    side="right" 
    class="tw-p-4 tw-border-t-[1px] tw-border-decoration"
  >
    <q-form data-test="filter-form" class="tw-grid tw-w-full">
      <div class="tw-flex tw-flex-col tw-gap-3 tw-mb-6">
        <h3 class="tw-font-roboto-condensed tw-text-secondary tw-font-bold tw-text-base">Filtros por columna</h3>
        <!-- NOTE: replaceable zone -->
        <h-input
          v-model="drawer.filter.name.value"
          :label="drawer.filter.name.label"
          debounce
          clearable
          @update:model-value="reloadTable"
        />
        <h-input
          v-model="drawer.filter.lastname.value"
          :label="drawer.filter.lastname.label"
          debounce
          clearable
          @update:model-value="reloadTable"
        />
        <h-input
          v-model="drawer.filter.username.value"
          :label="drawer.filter.username.label"
          debounce
          clearable
          @update:model-value="reloadTable"
        />
        <h-input
          v-model="drawer.filter.email.value"
          :label="drawer.filter.email.label"
          debounce
          clearable
          @update:model-value="reloadTable"
        />
        <!---------------------------->
      </div>

      <h-group-checkbox
        title="Visualizar columnas"
        v-model="drawer.column.value"
        :label="drawer.column.label"
        :options="drawer.column.options"
      />
    </q-form>
  </q-drawer>

  <create-user
    v-model:opened="modal.create" 
    :data="modal.data" 
    @created="resetPageAndReloadTable"
  />

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

import * as Icon from 'components/icons';
import HInput from 'components/custom/h-input.vue';
import HGroupCheckbox from 'components/custom/h-group-checkbox.vue';

import UserService from "services/user/user.service";

import CreateUser from './CreateUser.vue';      /* NOTE: replaceable */

/* NOTE: replaceable zone */
const columns = [
  { 
    name: 'index', 
    field: 'index', 
    label: 'N°',  
    align: 'left', 
    required: true,
  },
  { 
    name: 'code', 
    field: 'firstname', 
    label: 'Nombre', 
    align: 'center', 
    required: true,
  },
  { 
    name: 'name', 
    field: 'lastname', 
    label: 'Apellidos', 
    align: 'left', 
  },
  { 
    name: 'username', 
    field: 'username', 
    label: 'Nombre de Usuario', 
    align: 'left',
  },
  { 
    name: 'price', 
    field: 'email', 
    label: 'Correo Electrónico', 
    align: 'left', 
  },
  { 
    name: 'roles', 
    field: 'roles', 
    label: 'Roles', 
    align: 'left', 
    format: value => value.join(', ')
  },
];
/* ----------------------- */

// Referencias
const $table = ref(null);

// Datos de la tabla
const table = reactive({
  isLoading: false,
  search: {
    value: null,
    placeholder: "Buscar nombre", /* NOTE: replaceable */
  },
  columns: columns,
  rows: [],
  pagination: { 
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    rowsPerPageOptions: [5, 10, 20, 50],
  },
});

// Filtros
const drawer = reactive({
  isOpen: true,
  filter: {
    /* NOTE: replaceable zone */
    name: { 
      label: "Nombres", 
      value: null, 
    },
    lastname: { 
      label: "Apellidos", 
      value: null, 
    },
    username: { 
      label: "Nombre de Usuario", 
      value: null, 
    },
    email: { 
      label: "Correo Electrónico", 
      value: null, 
    },
    /* ----------------------- */
  },
  column: {
    options: columns.flatMap(({ required, label, name }) => !required ? { label: `Visualizar ${label}`, value: name, } : []),
    value: columns.flatMap(({ required, name }) => !required ? name : []),
  },
})

// Controlador de modals
const modal = reactive({
  create: false,
  data: null,
});


// Metodos
const onRequest = async props => {
  table.pagination.descending = props.pagination.descending
  table.pagination.sortBy = props.pagination.sortBy
  table.isLoading = true
  const responseUser = await UserService.list({
    search: table.search.value,
    name: drawer.filter.name.value,
    lastname: drawer.filter.lastname.value,
    username: drawer.filter.username.value,
    email: drawer.filter.email.value,
  })
  table.isLoading = false
  if(responseUser.status){
    table.rows = responseUser.data ?? []
    table.pagination.rowsNumber = responseUser.data ?? 0
    table.pagination.page = props.pagination.page
    table.pagination.rowsPerPage = props.pagination.rowsPerPage
  }
}

const onToogle = () => {
  drawer.isOpen = !drawer.isOpen
}

const onCreate = () => {
  modal.create = true
}

const resetPageAndReloadTable = () => {
  table.pagination.page = 1;
  $table.value.requestServerInteraction();
};

const reloadTable = () => {
  $table.value.requestServerInteraction();
};

onMounted(async () => {
  resetPageAndReloadTable();
});
</script>
