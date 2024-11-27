import { apiGateway } from 'boot/setup-axios';

let urls = {
  list: `/production/pets`, // Usaremos la misma URL para todas las operaciones simuladas
};

let data = [
  { index: 1, code: "P001", name: "Laptop", category: { id: 1, name: "Electrónica" }, unit_price: 1500, cantidad: 10 },
  { index: 2, code: "P002", name: "Refrigerador", category: { id: 2, name: "Electrodomésticos" }, unit_price: 800, cantidad: 5 },
  { index: 3, code: "P003", name: "Silla", category: { id: 3, name: "Muebles" }, unit_price: 50, cantidad: 20 },
  { index: 4, code: "P004", name: "Camiseta", category: { id: 4, name: "Ropa" }, unit_price: 20, cantidad: 50 },
  { index: 5, code: "P005", name: "Pelota", category: { id: 5, name: "Deportes" }, unit_price: 10, cantidad: 30 },
];

class ProductService {
  async list(params = {}) {
    try {
      const response = await apiGateway.get(urls.list, { params }); // Simulación
      return {
        status: true,
        data: data
          .filter(item =>
            `${item.name.toUpperCase()} ${item.category.name.toUpperCase()}`.includes(params.search?.toUpperCase() ?? '')
          )
          .filter(item => item.name.toUpperCase().includes(params.name?.toUpperCase() ?? ''))
          .filter(item => item.category.name.toUpperCase().includes(params.category?.toUpperCase() ?? '')) || response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async retrive(id) {
    try {
      const response = await apiGateway.get(urls.list); // Simulación
      const item = data.find(item => item.index === id);
      return { status: true, data: item || response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(params) {
    try {
      const response = await apiGateway.get(urls.list); // Simulación
      const newItem = {
        index: data.length + 1,
        code: params.get("code"),
        name: params.get("name"),
        category: {
          id: Number(params.get("category_id")),
          name: params.get("category_name"),
        },
        unit_price: Number(params.get("unit_price")),
        cantidad: Number(params.get("cantidad")),
      };
      data.push(newItem);
      return { status: true, data: newItem || response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id, params) {
    try {
      const response = await apiGateway.get(urls.list); // Simulación
      const index = data.findIndex(item => item.index === id);
      if (index !== -1) {
        data[index] = {
          ...data[index],
          code: params.get("code"),
          name: params.get("name"),
          category: {
            id: Number(params.get("category_id")),
            name: params.get("category_name"),
          },
          unit_price: Number(params.get("unit_price")),
          cantidad: Number(params.get("cantidad")),
        };
      }
      return { status: true, data: data[index] || response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id) {
    try {
      const response = await apiGateway.get(urls.list); // Simulación
      data = data.filter(item => item.index !== id);
      return { status: true, data: null || response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        status: false,
        data:
          error.response.status >= 400 && error.response.status < 500
            ? error.response.data
            : 'Error del servidor. Por favor, inténtelo de nuevo más tarde.',
      };
    } else {
      return {
        status: false,
        data: 'Error del cliente. Verifique su configuración.',
      };
    }
  }
}

export default new ProductService();
