const routes = [
  {
    path: "/dashboard",
    component: () => import("layouts/dashboard/DashboardLayout.vue"),
    children: [
      {
        path: "",
        name: "inventory-dashboard",
        meta: { requiresAuth: true },
        component: () => import("views/dashboard/inventory/InventoryList.vue"),
      },
      { 
        path: 'product/product', 
        alias: 'product',
        name: 'product-dashboard',
        meta: { requiresAuth: true },
        component: () => import('views/dashboard/product/product/ProductList.vue') 
      },
      { 
        path: 'product/product-category', 
        name: 'product-category-dashboard',
        meta: { requiresAuth: true },
        component: () => import('views/dashboard/product/product-category/ProductCategoryList.vue') 
      },
      {
        path: "user",
        name: "user-dashboard",
        meta: { requiresAuth: true },
        component: () => import("views/dashboard/user/UserList.vue"),
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/screen/ScreenLayout.vue"),
    children: [
      {
        path: "",
        name: "login-screen",
        meta: { requiresNoAuth: true },
        component: () => import("views/screen/autentication/LoginPage.vue"),
      },
      {
        path: "/:catchAll(.*)*",
        name: "not-found",
        component: () => import("views/screen/not-found/NotFoundPage.vue"),
      },
    ],
  },
];

export default routes;
