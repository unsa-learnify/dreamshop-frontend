import { apiKeycloak } from 'boot/setup-axios'

let urls = {
  login: `/protocol/openid-connect/token`,
  logout: `/protocol/openid-connect/logout`,
  refresh: `/protocol/openid-connect/token`,
};

class AuthService {
  async login({ username, password }) {
    try {
      const response = await apiKeycloak.post(urls.login, {
        client_id: `${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}`,
        client_secret: `${import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET}`,
        grant_type: 'password',
        username: username,
        password: password,
      }, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response) {
        return {
          status: false,
          data:
            error.response.status >= 400 && error.response.status < 500
              ? error.response.data
              : "Error del servidor. Por favor, inténtelo de nuevo más tarde.",
        };
      } else {
        return {
          status: false,
          data: "Error del cliente. Verifique su configuración.",
        };
      }
    }
  }

  async logout({ refresh_token }) {
    try {
      const response = await apiKeycloak.post(urls.logout, {
        client_id: `${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}`,
        client_secret: `${import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET}`,
        refresh_token: refresh_token,
      }, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response) {
        return {
          status: false,
          data:
            error.response.status >= 400 && error.response.status < 500
              ? error.response.data
              : "Error del servidor. Por favor, inténtelo de nuevo más tarde.",
        };
      } else {
        return {
          status: false,
          data: "Error del cliente. Verifique su configuración.",
        };
      }
    }
  }

  async refresh({ refreshToken }) {
    try {
      const response = await apiKeycloak.post(urls.refresh, {
        client_id: `${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}`,
        client_secret: `${import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET}`,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response) {
        return {
          status: false,
          data:
            error.response.status >= 400 && error.response.status < 500
              ? error.response.data
              : "Error del servidor. Por favor, inténtelo de nuevo más tarde.",
        };
      } else {
        return {
          status: false,
          data: "Error del cliente. Verifique su configuración.",
        };
      }
    }
  }
}

export default new AuthService();
