// services/correoMock.service.js
import dotenv from 'dotenv';
dotenv.config();

class CorreoMockService {
  constructor() {
    this.baseUrl = process.env.CORREO_BASE_URL || 'https://apitest.correoargentino.com.ar/micorreo/v1';
    this.usuario = process.env.CORREO_USERNAME || 'mock_user';
    this.contraseña = process.env.CORREO_PASSWORD || 'mock_password';
    this.token = null;
    this.expiracionToken = null;
  }

  // Simular autenticación
  async autenticar() {
    console.log('🔐 Simulando autenticación con Correo Argentino');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.token = `mock-token-${Date.now()}`;
        this.expiracionToken = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
        
        resolve({
          token: this.token,
          expires: this.expiracionToken,
          message: 'Autenticación simulada exitosa'
        });
      }, 500);
    });
  }

  // Verificar token
  async verificarToken() {
    if (!this.token || new Date() >= this.expiracionToken) {
      await this.autenticar();
    }
  }

  // Simular petición autenticada
  async peticionAutenticada(url, opciones = {}) {
    await this.verificarToken();
    
    console.log(`📤 Simulando petición a: ${url}`, opciones);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Crear respuesta mock
        const mockResponse = {
          ok: true,
          status: 200,
          json: async () => this.generarRespuestaMock(url, opciones)
        };
        resolve(mockResponse);
      }, 800);
    });
  }
  generarRespuestaMock(url, opciones) {
    const mockData = {
      '/token': {
        token: this.token,
        expires: this.expiracionToken,
        message: 'Token generado exitosamente'
      },
      
      '/register': {
        customerId: `CLI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'active',
        message: 'Usuario registrado exitosamente',
        email: JSON.parse(opciones.body || '{}').email
      },
      
      '/users/validate': {
        valid: true,
        customerId: 'CLI-MOCK123',
        userType: 'premium',
        message: 'Usuario validado correctamente'
      },
      
      '/agencies': {
        agencies: [
          {
            id: 'AG001',
            name: 'Sucursal Centro',
            address: 'Av. Corrientes 720, CABA',
            phone: '011-1234-5678',
            hours: '09:00-18:00'
          },
          {
            id: 'AG002', 
            name: 'Sucursal Palermo',
            address: 'Av. Santa Fe 3250, CABA',
            phone: '011-2345-6789',
            hours: '09:00-17:00'
          },
          {
            id: 'AG003',
            name: 'Sucursal Flores',
            address: 'Av. Rivadavia 6800, CABA',
            phone: '011-3456-7890',
            hours: '08:30-17:30'
          }
        ],
        total: 3
      },
      
      '/rates': {
        rates: [
          {
            service: 'Correo Clásico',
            price: 1250.50,
            deliveryDays: '3-5 días',
            estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            productType: 'CP'
          },
          {
            service: 'Correo Express',
            price: 2100.75,
            deliveryDays: '1-2 días',
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            productType: 'EX'
          }
        ],
        currency: 'ARS'
      },
      
      '/shipping/import': {
        shippingId: `ENV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        trackingNumber: `RR${Math.random().toString().substr(2, 13)}AR`,
        status: 'imported',
        labelUrl: 'https://mock.correo.com.ar/labels/mock-label.pdf',
        message: 'Envío importado exitosamente'
      },
      
      '/shipping/tracking': {
        shippingId: 'ENV-MOCK123',
        trackingNumber: 'RR123456789AR',
        status: 'in_transit',
        events: [
          {
            event: 'Envío recibido en sucursal de origen',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            branch: 'Sucursal Centro',
            status: 'received'
          },
          {
            event: 'Envío en tránsito',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            branch: 'Centro de Distribución',
            status: 'in_transit'
          }
        ],
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      
      '/shipping/statuses': {
        statuses: [
          { code: 'pending', name: 'Pendiente', description: 'Envío creado' },
          { code: 'imported', name: 'Importado', description: 'Envío importado en sistema' },
          { code: 'in_transit', name: 'En tránsito', description: 'Envío en camino' },
          { code: 'delivered', name: 'Entregado', description: 'Envío entregado' },
          { code: 'cancelled', name: 'Cancelado', description: 'Envío cancelado' }
        ]
      }
    };

    return mockData[url] || { message: 'Endpoint mock no configurado', url, method: opciones.method };
  }


  async registrarUsuario(datosUsuario) {
    try {
      const respuesta = await this.peticionAutenticada('/register', {
        method: 'POST',
        body: JSON.stringify(datosUsuario)
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error mock registrando usuario:', error);
      throw error;
    }
  }

  async validarUsuario(email, contraseña) {
    try {
      const respuesta = await this.peticionAutenticada('/users/validate', {
        method: 'POST',
        body: JSON.stringify({ email, contraseña })
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error validando usuario:', error);
      throw error;
    }
  }

  async obtenerSucursales(idCliente, codigoProvincia) {
    try {
      const respuesta = await this.peticionAutenticada('/agencies', {
        method: 'GET'
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error mock obteniendo sucursales:', error);
      throw error;
    }
  }

  async cotizarEnvio(datosCotizacion) {
    try {
      const respuesta = await this.peticionAutenticada('/rates', {
        method: 'POST',
        body: JSON.stringify(datosCotizacion)
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error mock cotizando envío:', error);
      throw error;
    }
  }

  async importarEnvio(datosEnvio) {
    try {
      const respuesta = await this.peticionAutenticada('/shipping/import', {
        method: 'POST',
        body: JSON.stringify(datosEnvio)
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error mock importando envío:', error);
      throw error;
    }
  }

  async obtenerSeguimiento(idEnvio) {
    try {
      const respuesta = await this.peticionAutenticada('/shipping/tracking', {
        method: 'GET'
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error mock obteniendo seguimiento:', error);
      throw error;
    }
  }

  async obtenerEstadosEnvio() {
    try {
      const respuesta = await this.peticionAutenticada('/shipping/statuses', {
        method: 'GET'
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error mock obteniendo estados:', error);
      throw error;
    }
  }

  async cancelarEnvio(idEnvio) {
    try {
      const respuesta = await this.peticionAutenticada(`/shipping/${idEnvio}/cancel`, {
        method: 'POST'
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error mock cancelando envío:', error);
      throw error;
    }
  }

  async verificarSalud() {
    try {
      await this.autenticar();
      return { 
        estado: 'conectado', 
        mensaje: 'Servicio MOCK de Correo Argentino funcionando',
        modo: 'MOCK/SIMULACIÓN',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return { 
        estado: 'error', 
        mensaje: error.message 
      };
    }
  }
}

export default new CorreoMockService();