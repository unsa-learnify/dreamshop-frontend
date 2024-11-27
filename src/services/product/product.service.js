import { apiGateway } from 'boot/setup-axios'

let urls = {
  create: `/production/products`,
  retrieve: `/production/products`,
  list: `/production/products`,
  update: `/production/products`,
  delete: `/production/products`,
  exportToPDF: `/production/products`,
}
class ProductService {

  async retrieve(id) {
    try {
      const response = await apiGateway.get(urls.retrieve + `/${id}/`)
      return { 
        status: true, 
        data: response.data 
      }
    } catch (error) {
      if (error.response) {
        return {
          status: false,
          data: error.response.status >= 400 && error.response.status < 500 
            ? error.response.data
            : "Error del servidor. Por favor, inténtelo de nuevo más tarde."
        }
      } else {
        return {
          status: false,
          data: "Error del cliente. Verifique su configuración."
        }
      }
    }
  }

  async list(params) {
    try {
      const response = await apiGateway.get(urls.list, { params: params })
      if (response.status === 200) {
        return { 
          status: true, 
          data: response.data 
        }
      }
      else {
        return { 
          status: true, 
          data: []
        }
      }
    } catch (error) {
      if (error.response) {
        return {
          status: false,
          data: error.response.status >= 400 && error.response.status < 500 
            ? error.response.data
            : "Error del servidor. Por favor, inténtelo de nuevo más tarde."
        }
      } else {
        return {
          status: false,
          data: "Error del cliente. Verifique su configuración."
        }
      }
    }
  }

  async create(params) {
    try {
      console.log(urls.create);
      const response = await apiGateway.post(urls.create, params)
      return { 
        status: true, 
        data: response.data 
      }
    } catch (error) {
      if (error.response) {
        return {
          status: false,
          data: error.response.status >= 400 && error.response.status < 500 
            ? error.response.data
            : "Error del servidor. Por favor, inténtelo de nuevo más tarde."
        }
      } else {
        return {
          status: false,
          data: "Error del cliente. Verifique su configuración."
        }
      }
    }
  }

  async update(id, params) {
    try {
      const response = await apiGateway.patch(urls.update + `/${id}/`, params)
      return { 
        status: true, 
        data: response.data 
      }
    } catch (error) {
      if (error.response) {
        return {
          status: false,
          data: error.response.status >= 400 && error.response.status < 500 
            ? error.response.data
            : "Error del servidor. Por favor, inténtelo de nuevo más tarde."
        }
      } else {
        return {
          status: false,
          data: "Error del cliente. Verifique su configuración."
        }
      }
    }
  }
  
  async delete(id) {
    try {
      const response = await apiGateway.delete(urls.delete + `/${id}/`)
      return { 
        status: true, 
        data: response.data 
      }
    } catch (error) {
      if (error.response) {
        return {
          status: false,
          data: error.response.status >= 400 && error.response.status < 500 
            ? error.response.data
            : "Error del servidor. Por favor, inténtelo de nuevo más tarde."
        }
      } else {
        return {
          status: false,
          data: "Error del cliente. Verifique su configuración."
        }
      }
    }
  }

  async exportToPDF(params) {
    try {
      const response = await apiGateway.get(urls.exportToPDF, { responseType: "blob", params: params })
      return { 
        status: true,
        blob: response.data
      }
    } catch (error) {
      return { 
        status: false,
        blob: error.response.data
      }
    }
  }

}

export default new ProductService()