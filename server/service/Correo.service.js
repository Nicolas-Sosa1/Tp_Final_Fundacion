import dotenv from 'dotenv';
dotenv.config();

class CorreoMockService {
  constructor() {
    this.baseUrl = process.env.CORREO_BASE_URL || 'https://apitest.correoargentino.com.ar/micorreo/v1';


    this.envios = []; 
    this.token = null;
    this.expiracionToken = null;
    
    this.inicializarDatosMock();
  }

  async autenticar() {
    this.token = `mock-token-${Date.now()}`;
    this.expiracionToken = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return {
      token: this.token,
      expires: this.expiracionToken,
      message: "Autenticación simulada exitosa"
    };
  }

  async verificarToken() {
    if (!this.token || new Date() >= this.expiracionToken) {
      await this.autenticar();
    }
  }


  inicializarDatosMock() {
    
    this.envios = [
      {
        _id: 'ENV-001',
        idPedidoExterno: 'PED-001',
        trackingNumber: 'RR123456789AR',
        destinatario: {
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          telefono: '1122334455'
        },
        envio: {
          tipoEntrega: 'D',
          peso: 2.5,
          valorDeclarado: 1500,
          alto: 20,
          largo: 30,
          ancho: 15
        },
        estado: "entregado",
        fecha: new Date('2024-01-15'),
        idCliente: 'user-123'
      },
      {
        _id: 'ENV-002',
        idPedidoExterno: 'PED-002',
        trackingNumber: 'RR987654321AR',
        destinatario: {
          nombre: 'María García',
          email: 'maria@example.com',
          telefono: '1133445566'
        },
        envio: {
          tipoEntrega: 'S',
          peso: 1.8,
          valorDeclarado: 800,
          alto: 15,
          largo: 25,
          ancho: 10
        },
        estado: "enviado",
        fecha: new Date('2024-01-20'),
        idCliente: 'user-456'
      }
    ];
  }

  async importarEnvio(datosEnvio) {
    await this.verificarToken();

    const shippingId = `ENV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const tracking = `RR${Math.floor(Math.random() * 999999999)}AR`;

    const nuevo = {
      _id: shippingId,
      idPedidoExterno: datosEnvio.idPedidoExterno,
      trackingNumber: tracking,
      destinatario: datosEnvio.destinatario,
      envio: datosEnvio.envio,
      estado: "imported",
      fecha: new Date(),
      idCliente: datosEnvio.idCliente
    };

    // Guardar en lista mock
    this.envios.push(nuevo);

    return {
      mensaje: "Envío creado correctamente",
      envio: nuevo
    };
  }

  async cotizarEnvio(datos) {
    await this.verificarToken();

    const precio = (datos.peso * 600) + (datos.valorDeclarado * 0.02);

    return {
      precio,
      moneda: "ARS",
      estimadoDias: "3-5 días",
      fechaEstimadaEntrega: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      detalles: datos
    };
  }

  async obtenerSeguimiento(idEnvio) {
    await this.verificarToken();

    const encontrado = this.envios.find(e => e._id === idEnvio || e.trackingNumber === idEnvio);

    if (!encontrado) {
      return {
        encontrado: false,
        mensaje: "No existe un envío con ese ID o tracking"
      };
    }

    return {
      encontrado: true,
      trackingNumber: encontrado.trackingNumber,
      estado: encontrado.estado,
      eventos: [
        {
          evento: "Envío recibido",
          fecha: new Date(Date.now() - 86400000),
          estado: "received"
        },
        {
          evento: "En tránsito",
          fecha: new Date(),
          estado: "in_transit"
        }
      ]
    };
  }

  async misEnvios(idCliente) {
    await this.verificarToken();

    return this.envios.filter(env => env.idCliente === idCliente);
  }

  
  async obtenerTodosEnvios() {
    await this.verificarToken();
    return this.envios;
  }

  
  async obtenerEnviosPorUsuario(userId) {
    await this.verificarToken();
    return this.envios.filter(env => env.idCliente === userId);
  }

  async actualizarEstadoEnvio(idEnvio, nuevoEstado) {
    await this.verificarToken();
    
    const envio = this.envios.find(e => e._id === idEnvio || e.trackingNumber === idEnvio);
    if (!envio) {
      throw new Error('Envío no encontrado');
    }

  
    const estadosValidos = ['pendiente', 'importado', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido. Estados permitidos: ${estadosValidos.join(', ')}`);
    }

    envio.estado = nuevoEstado;
    envio.ultimaActualizacion = new Date();
    
    return {
      mensaje: `Estado actualizado a: ${nuevoEstado}`,
      envio: envio
    };
  }


  async obtenerEstadisticas() {
    await this.verificarToken();
    
    const totalEnvios = this.envios.length;
    const enviosPendientes = this.envios.filter(e => e.estado === 'pendiente' || e.estado === 'imported').length;
    const enviosEntregados = this.envios.filter(e => e.estado === 'entregado').length;
    const enviosEnTransito = this.envios.filter(e => e.estado === 'enviado' || e.estado === 'in_transit').length;
    const enviosCancelados = this.envios.filter(e => e.estado === 'cancelado').length;

    // Calcular ingresos estimados
    const ingresosTotales = this.envios.reduce((total, envio) => {
      return total + (envio.envio.valorDeclarado * 0.02) + (envio.envio.peso * 600);
    }, 0);

    return {
      totalEnvios,
      enviosPendientes,
      enviosEntregados,
      enviosEnTransito,
      enviosCancelados,
      tasaEntrega: totalEnvios > 0 ? ((enviosEntregados / totalEnvios) * 100).toFixed(2) : 0,
      ingresosTotales: Math.round(ingresosTotales),
      ingresosPromedio: totalEnvios > 0 ? Math.round(ingresosTotales / totalEnvios) : 0
    };
  }

  async eliminarEnvio(idEnvio) {
    await this.verificarToken();
    
    const index = this.envios.findIndex(e => e._id === idEnvio || e.trackingNumber === idEnvio);
    if (index === -1) {
      throw new Error('Envío no encontrado');
    }

    const envioEliminado = this.envios.splice(index, 1)[0];
    
    return {
      mensaje: 'Envío eliminado correctamente',
      envio: envioEliminado
    };
  }

  async obtenerSucursales() {
    return [
      { id: "SUC-001", nombre: "Centro", direccion: "Av. Corrientes 700" },
      { id: "SUC-002", nombre: "Palermo", direccion: "Av. Santa Fe 3200" }
    ];
  }


  async obtenerEstadosEnvio() {
    return [
      { code: "pending", name: "Pendiente" },
      { code: "imported", name: "Importado" },
      { code: "in_transit", name: "En tránsito" },
      { code: "delivered", name: "Entregado" }
    ];
  }
}

export default new CorreoMockService();