<template>
  <q-page class="tw-bg-background tw-p-4 tw-flex tw-flex-col tw-gap-4">
    <div
      class="tw-flex tw-items-center tw-gap-1 tw-flex-wrap tw-text-secondary tw-text-2xl tw-font-roboto-condensed"
    >
      <span>Inventario</span>
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
            :loading="exportPdfButton.isLoading"
            @click="onExportPdf"
          >
            <Icon.PdfIcon class="tw-fill-primary tw-w-6 tw-h-6"/>
            <q-tooltip>Exportar Pdf</q-tooltip>
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

          <template #body-cell-price="props">
            <q-td :props="props">
              {{ Number(props.row.unitPrice).toFixed(2) }} {{ props.row.currency }} 
            </q-td>
          </template>

          <!-- Acciones con botones -->
          <template v-slot:body-cell-actions="props">
            <q-td class="tw-flex tw-justify-center tw-gap-2">
              <q-btn 
                class="tw-bg-gray-100 tw-text-red-500" 
                dense 
                round 
                flat 
                icon="archive"
                @click="onDecreaseStock(props.row)"
              >
                <q-tooltip>Disminuir Stock</q-tooltip>
              </q-btn>
              <q-btn 
                class="tw-bg-gray-100 tw-text-green-500" 
                dense 
                round 
                flat 
                icon="unarchive"
                @click="onIncreaseStock(props.row)"
              >
                <q-tooltip>Agregar Stock</q-tooltip>
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
        <!-- <h-input
          v-model="drawer.filter.name.value"
          :label="drawer.filter.name.label"
          debounce
          clearable
          @update:model-value="reloadTable"
        /> -->
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
        <h-input
          v-model="drawer.filter.min_quantity.value"
          :label="drawer.filter.min_quantity.label"
          type="number"
          min="1"
          step="1"
          debounce
          clearable
          @update:model-value="reloadTable"
        />
        <h-input
          v-model="drawer.filter.max_quantity.value"
          :label="drawer.filter.max_quantity.label"
          type="number"
          min="0"
          step="1"
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

  <create-movement
    v-model:opened="modal.initStock" 
    :data="modal.data" 
    @created="reloadTable"
  />

  <create-income
    v-model:opened="modal.increaseStock" 
    :data="modal.data" 
    @created="reloadTable"
  />

  <create-outcome
    v-model:opened="modal.decreaseStock " 
    :data="modal.data" 
    @created="reloadTable"
  />

</template>

<script setup>
import { format } from 'date-fns';
import { exportFile } from 'quasar';
import { ref, reactive, onMounted } from 'vue';

import * as Icon from 'components/icons';
import HInput from 'components/custom/h-input.vue';
import HSelect from 'components/custom/h-select.vue';
import HGroupCheckbox from 'components/custom/h-group-checkbox.vue';

import CreateMovement from './CreateMovement.vue';      /* NOTE: replaceable */
import CreateIncome from './CreateIncome.vue';      /* NOTE: replaceable */
import CreateOutcome from './CreateOutcome.vue';      /* NOTE: replaceable */


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
    name: 'category', 
    field: 'categories', 
    label: 'Categorías de Productos', 
    align: 'left',
  },
  { 
    name: 'price', 
    field: 'unitPrice', 
    label: 'Precio Unitario', 
    align: 'right', 
  },
  { 
    name: 'quantity', 
    field: 'quantity', 
    label: 'Cantidad', 
    align: 'right', 
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

const exportPdfButton = reactive({
  isLoading: false
})

// Datos de la tabla
const table = reactive({
  isLoading: false,
  search: {
    value: null,
    placeholder: "Buscar por nombre", /* NOTE: replaceable */
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
    min_quantity: { 
      label: "Cantidad Mínima", 
      value: null, 
    },
    max_quantity: { 
      label: "Cantidad Máxima", 
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
  initStock: false,
  increaseStock: false,
  decreaseStock: false,
  data: null,
});

// Metodos
const onRequest = async props => {
  table.pagination.descending = props.pagination.descending
  table.pagination.sortBy = props.pagination.sortBy
  table.isLoading = true
  const responseProduct = await ProductService.list({
    name: table.search.value,
    code: drawer.filter.code.value ,
    // name: drawer.filter.name.value ,
    categoryId: drawer.filter.category.value,
    minPrice: drawer.filter.min_price.value,
    maxPrice: drawer.filter.max_price.value,
    minQuantity: drawer.filter.min_quantity.value,
    maxQuantity: drawer.filter.max_quantity.value,
  })
  table.isLoading = false
  if(responseProduct.status){
    table.rows = responseProduct.data?.items ?? []
    table.pagination.rowsNumber = responseProduct.data?.totalItems ?? 0
    table.pagination.page = props.pagination.page
    table.pagination.rowsPerPage = props.pagination.rowsPerPage
  }
}

const onToogle = () => {
  drawer.isOpen = !drawer.isOpen
}

const onInitStock = async () => {
  modal.initStock = true
}

const onIncreaseStock = (row) => {
  modal.increaseStock = true
  modal.data = row
}

const onDecreaseStock = (row) => {
  modal.decreaseStock = true
  modal.data = row
}

const onExportPdf = async () => {
  exportPdfButton.isLoading = true;
  const { status, blob } = await ProductService.exportToPDF({
    name: table.search.value,
    code: drawer.filter.code.value ,
    // name: drawer.filter.name.value ,
    categoryId: drawer.filter.category.value,
    minPrice: drawer.filter.min_price.value,
    maxPrice: drawer.filter.max_price.value,
    minQuantity: drawer.filter.min_quantity.value,
    maxQuantity: drawer.filter.max_quantity.value,
  });
  if (status) {
    const filename = `Reporte de productos ${format(new Date(), 'yyyy-MM-dd')}.pdf`; 
    exportFile(filename, blob);
  }
  exportPdfButton.isLoading = false;
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
  const [ productCategoryResponse ] = await Promise.all([ ProductCategoryService.list({ page: 0, size: 100 }) ])
  if (productCategoryResponse.status) {
    drawer.filter.category.options = productCategoryResponse.data.items.map(item => ({ label: item.name, value: item.id }))
  }
});
</script>
