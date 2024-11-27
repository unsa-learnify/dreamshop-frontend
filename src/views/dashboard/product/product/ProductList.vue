<template>
  <q-page class="tw-bg-background tw-p-4 tw-flex tw-flex-col tw-gap-4">
    <div
      class="tw-flex tw-items-center tw-gap-1 tw-flex-wrap tw-text-secondary tw-text-2xl tw-font-roboto-condensed"
    >
      <span>Gestión de Productos</span>
      <Icon.DownArrowIcon class="tw-fill-secondary tw-w-8 tw-h-8 -tw-rotate-90"/>
      <span>Productos</span>
    </div>

    <div class="tw-p-6 tw-shadow-md tw-bg-white tw-gap-4">
      <h2 class="tw-mb-4 tw-text-xl tw-text-primary">Lista de Productos</h2> <!-- NOTE: replaceable -->

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
            flat 
            round 
            dense 
            @click="onCreate"
          >
            <Icon.PlusIcon class="tw-fill-primary tw-w-6 tw-h-6"/>
            <q-tooltip>Añadir</q-tooltip>
          </q-btn>
          <!-- Botón para abrir el panel de filtros avanzados -->
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

          <template #body-cell-price="props">
            <q-td :props="props">
              {{ Number(props.row.unitPrice).toFixed(2) }} {{ props.row.currency }} 
            </q-td>
          </template>

          <!-- Acciones con botones -->
          <template v-slot:body-cell-actions="props">
            <q-td class="tw-flex tw-justify-center tw-gap-2">
              <q-btn 
                class="tw-bg-gray-100" 
                dense 
                round 
                flat 
                @click="onEdit(props.row)"
              >
                <Icon.PenIcon class="tw-fill-amber-500 tw-w-6 tw-h-6"/>
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn 
                class="tw-bg-gray-100" 
                dense 
                round 
                flat 
                @click="onDelete(props.row)"
              >
                <Icon.TrashIcon class="tw-fill-red-500 tw-w-6 tw-h-6"/>
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
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
          v-model="drawer.filter.code.value"
          :label="drawer.filter.code.label"
          debounce
          clearable
          @update:model-value="reloadTable"
        />
        <h-input
          v-model="drawer.filter.name.value"
          :label="drawer.filter.name.label"
          debounce
          clearable
          @update:model-value="reloadTable"
        />
        <h-select
          v-model="drawer.filter.category.value"
          :label="drawer.filter.category.label"
          :options="drawer.filter.category.options"
          clearable
          @update:model-value="reloadTable"
        />
        <h-input
          v-model="drawer.filter.min_price.value"
          :label="drawer.filter.min_price.label"
          type="number"
          min="0"
          step="0.01"
          debounce
          clearable
          @update:model-value="reloadTable"
        />
        <h-input
          v-model="drawer.filter.max_price.value"
          :label="drawer.filter.max_price.label"
          type="number"
          min="0"
          step="0.01"
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

  <!-- NOTE: replaceable zone -->
  <create-product
    v-model:opened="modal.create" 
    :data="modal.data" 
    @created="resetPageAndReloadTable"
  />

  <edit-product
    v-model:opened="modal.edit" 
    :data="modal.data" 
    @updated="reloadTable"
  />

  <delete-product
    v-model:opened="modal.delete" 
    :data="modal.data" 
    @deleted="resetPageAndReloadTable"
  />
  <!---------------------------->

</template>

<script setup>
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ref, reactive, onMounted } from 'vue';

import * as Icon from 'components/icons';
import HInput from 'components/custom/h-input.vue';
import HSelect from 'components/custom/h-select.vue';
import HGroupCheckbox from 'components/custom/h-group-checkbox.vue';

import CreateProduct from './CreateProduct.vue';      /* NOTE: replaceable */
import EditProduct from './EditProduct.vue';          /* NOTE: replaceable */
import DeleteProduct from './DeleteProduct.vue';      /* NOTE: replaceable */

import ProductService from "services/product/product.service";
import ProductCategoryService from "services/product/product-category.service";

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
    field: 'code', 
    label: 'Código', 
    align: 'center', 
    required: true,
  },
  { 
    name: 'name', 
    field: 'name', 
    label: 'Nombre', 
    align: 'left', 
    required: true,
  },
  { 
    name: 'description', 
    field: 'description', 
    label: 'Descripción', 
    format: value => value?.length > 100 ? value.slice(0, 100) + '...' : value,
    align: 'left', 
  },
  { 
    name: 'category', 
    field: 'category', 
    label: 'Categorías de Productos', 
    align: 'center',
    format: value => value?.name,
    required: true,
  },
  { 
    name: 'price', 
    field: 'unitPrice', 
    label: 'Precio Unitario', 
    align: 'right', 
  },
  { 
    name: 'createdAt', 
    field: 'createdAt', 
    label: 'Fecha de Creación', 
    align: 'center', 
    format: value => value ? format(parseISO(value), 'PPpp', { locale: es }) : '',
  },
  { 
    name: 'updatedAt', 
    field: 'updatedAt', 
    label: 'Fecha de Actualización', 
    align: 'center', 
    format: value => value ? format(parseISO(value), 'PPpp', { locale: es }) : '',
  },
  { 
    name: 'actions', 
    field: 'actions', 
    label: 'Acciones', 
    align: 'center', 
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
    placeholder: "Buscar por código o nombre", /* NOTE: replaceable */
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
    code: { 
      label: "Código", 
      value: null, 
    },
    name: { 
      label: "Nombre", 
      value: null, 
    },
    category: { 
      label: "Categoría de Productos", 
      value: null, 
      options: [] 
    },
    min_price: { 
      label: "Precio Unitario Mínimo", 
      value: null, 
    },
    max_price: { 
      label: "Precio Unitario Máximo", 
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
  edit: false,
  delete: false,
  export: false,
  data: null,
});

// Metodos
const onRequest = async props => {
  table.pagination.descending = props.pagination.descending
  table.pagination.sortBy = props.pagination.sortBy
  table.isLoading = true
  const responseProduct = await ProductService.list({
    code: drawer.filter.code.value || table.search.value,
    name: drawer.filter.name.value || table.search.value,
    category: drawer.filter.category.value,
    min_price: drawer.filter.min_price.value,
    max_price: drawer.filter.max_price.value,
  })
  table.isLoading = false
  if(responseProduct.status){
    table.rows = responseProduct.data
    table.pagination.rowsNumber = responseProduct.data.length
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

const onEdit = (row) => {
  modal.edit = true
  modal.data = row
}

const onDelete = (row) => {
  modal.delete = true
  modal.data = row
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
  const [ productCategoryResponse ] = await Promise.all([ ProductCategoryService.list() ])
  if (productCategoryResponse.status) {
    drawer.filter.category.options = productCategoryResponse.data.map(item => ({ label: item.name, value: item.id }))
  }
});
</script>
