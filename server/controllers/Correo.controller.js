import CorreoMockService from '../service/Correo.service.js ';
import correoConfig from '../config/correodatabe.js';


class CorreoController {
  
  async verificarEstado(req, res) {
    try {
      await correoService.autenticar();
      res.json({
        exito: true,
        mensaje: 'Servicio de Correo Argentino operativo'
      });
    } catch (error) {
      res.status(500).json({
        exito: false,
        error: 'Error conectando con Correo Argentino: ' + error.message
      });
    }
  }

  async registrarUsuario(req, res) {
    try {
      
      const userInfo = req.infoUser;
      console.log('Registrando usuario en Correo Argentino para:', userInfo.email);
      
      const datosUsuario = req.body;
      
    
      datosUsuario.email = userInfo.email; 
      datosUsuario.nombre = `${userInfo.firstName} ${userInfo.lastName}`;
      
      if (!datosUsuario.tipoDocumento || !datosUsuario.numeroDocumento) {
        return res.status(400).json({
          exito: false, 
          error: 'Faltan: tipoDocumento, numeroDocumento'
        });
      }

      const resultado = await CorreoMockService.registrarUsuario(datosUsuario);
      
      res.json({
        exito: true,
        datos: resultado,
        user: {
          id: userInfo.id,
          email: userInfo.email
        }
      });
    } catch (error) {
      res.status(400).json({
        exito: false,
        error: error.message
      });
    }
  }

  async validarUsuario(req, res) {
    try {
      const { email, contraseña } = req.body;
      
      if (!email || !contraseña) {
        return res.status(400).json({
          exito: false, 
          error: 'Email y contraseña requeridos'
        });
      }

      const resultado = await CorreoMockService.validarUsuario(email, contraseña);
      
      res.json({
        exito: true,
        datos: resultado
      });
    } catch (error) {
      res.status(404).json({
        exito: false,
        error: error.message
      });
    }
  }

  async obtenerSucursales(req, res) {
    try {
      const { codigoProvincia } = req.query;
      const userInfo = req.infoUser; 
      
      if (!codigoProvincia) {
        return res.status(400).json({
          exito: false, 
          error: 'codigoProvincia es requerido'
        });
      }

      
      const sucursales = await CorreoMockService.obtenerSucursales(userInfo.id, codigoProvincia);
      
      res.json({
        exito: true,
        datos: sucursales,
        user: {
          id: userInfo.id,
          email: userInfo.email
        }
      });
    } catch (error) {
      res.status(400).json({
        exito: false,
        error: error.message
      });
    }
  }

  async cotizarEnvio(req, res) {
    try {
      const datosCotizacion = req.body;
      const userInfo = req.infoUser; 
      
    
      datosCotizacion.idCliente = userInfo.id;
      
      if (!datosCotizacion.codigoPostalOrigen || !datosCotizacion.codigoPostalDestino) {
        return res.status(400).json({
          exito: false, 
          error: 'Faltan: codigoPostalOrigen, codigoPostalDestino'
        });
      }

      if (!datosCotizacion.dimensiones || !datosCotizacion.dimensiones.peso) {
        return res.status(400).json({
          exito: false, 
          error: 'Dimensiones con peso son requeridas'
        });
      }

      const cotizacion = await CorreoMockService.cotizarEnvio(datosCotizacion);
      
      res.json({
        exito: true,
        datos: cotizacion,
        user: {
          id: userInfo.id,
          email: userInfo.email
        }
      });
    } catch (error) {
      res.status(400).json({
        exito: false,
        error: error.message
      });
    }
  }

  async importarEnvio(req, res) {
    try {
      const datosEnvio = req.body;
      const userInfo = req.infoUser; 
      
    
      datosEnvio.idCliente = userInfo.id;
      
      if (!datosEnvio.idPedidoExterno || !datosEnvio.destinatario) {
        return res.status(400).json({
          exito: false, 
          error: 'Faltan: idPedidoExterno, destinatario'
        });
      }

      const resultado = await CorreoMockService.importarEnvio(datosEnvio);
      
      res.json({
        exito: true,
        datos: resultado,
        user: {
          id: userInfo.id,
          email: userInfo.email
        }
      });
    } catch (error) {
      res.status(400).json({
        exito: false,
        error: error.message
      });
    }
  }

  async obtenerSeguimiento(req, res) {
    try {
      const { idEnvio } = req.body;
      
      if (!idEnvio) {
        return res.status(400).json({
          exito: false, 
          error: 'idEnvio es requerido'
        });
      }

      const seguimiento = await CorreoMockService.obtenerSeguimiento(idEnvio);
      
      res.json({
        exito: true,
        datos: seguimiento
      });
    } catch (error) {
      res.status(400).json({
        exito: false,
        error: error.message
      });
    }
  }

  async obtenerCodigosProvincia(req, res) {
    try {
      res.json({
        exito: true,
        datos: correoConfig.codigosProvincia
      });
    } catch (error) {
      res.status(500).json({
        exito: false,
        error: 'Error obteniendo provincias'
      });
    }
  }

  async obtenerTiposEntrega(req, res) {
    try {
      res.json({
        exito: true,
        datos: correoConfig.tiposEntrega
      });
    } catch (error) {
      res.status(500).json({
        exito: false,
        error: 'Error obteniendo tipos de entrega'
      });
    }
  }
}

export default new CorreoController();