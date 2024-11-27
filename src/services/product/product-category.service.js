import { apiGateway } from 'boot/setup-axios';

let urls = {
  list: `/production/pets`, // Usaremos la misma URL para todas las operaciones simuladas
};

let data = [
  { id: 1, name: "Electrónica", description: "Dispositivos y gadgets como teléfonos inteligentes, laptops y televisores." },
  { id: 2, name: "Electrodomésticos", description: "Aparatos para el hogar como refrigeradores, microondas y lavadoras." },
  { id: 3, name: "Muebles", description: "Mobiliario para interiores y exteriores, como sillas, mesas y sofás." },
  { id: 4, name: "Ropa", description: "Prendas de vestir para hombres, mujeres y niños, incluyendo zapatos y accesorios." },
  { id: 5, name: "Deportes", description: "Equipos para actividades deportivas y al aire libre, como pelotas, raquetas y tiendas de campaña." },
];

class ProductCategoryService {
  async list(params = {}) {
    try {
      const response = await apiGateway.get(urls.list, { params });
      return {
        status: true,
        data: data
          .filter(item => `${item.name.toUpperCase()} ${item.description.toUpperCase()}`.includes(params.search?.toUpperCase() ?? ''))
          .filter(item => item.name.toUpperCase().includes(params.name?.toUpperCase() ?? ''))
          .filter(item => item.description.toUpperCase().includes(params.description?.toUpperCase() ?? '')) || response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async retrive(id) {
    try {
      const response = await apiGateway.get(urls.list); // Simulación
      const item = data.find(item => item.id === id);
      return { status: true, data: item || response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(params) {
    try {
      const response = await apiGateway.get(urls.list); // Simulación
      const name = params.get("name");
      const description = params.get("description");
      const newItem = { id: data.length + 1, name, description };
      data.push(newItem);
      return { status: true, data: newItem || response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id, params) {
    try {
      const response = await apiGateway.get(urls.list); // Simulación
      const name = params.get("name");
      const description = params.get("description");
      const index = data.findIndex(item => item.id === id);
      if (index !== -1) {
        data[index] = { ...data[index], name, description };
      }
      return { status: true, data: data[index] || response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id) {
    try {
      const response = await apiGateway.get(urls.list); // Simulación
      data = data.filter(item => item.id !== id);
      return { status: true, data: null || response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        status: false,
        data: error.response.status >= 400 && error.response.status < 500
          ? error.response.data
          : "Error del servidor. Por favor, inténtelo de nuevo más tarde."
      };
    } else {
      return {
        status: false,
        data: "Error del cliente. Verifique su configuración."
      };
    }
  }
}

export default new ProductCategoryService();
