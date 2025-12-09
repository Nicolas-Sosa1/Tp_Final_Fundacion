import CorreoMockService from '../service/Correo.service.js'; // ✅ CORREGIR RUTA
import correoConfig from '../config/correodatabe.js'; // ✅ NOMBRE CORRECTO

class CorreoController {
    constructor() {
        this.service = CorreoMockService;
    }

    async importarEnvio(req, res) {
        try {
            const datosEnvio = req.body;
            const userInfo = req.user; // ✅ CAMBIAR DE req.infoUser a req.user

            // Asegurar que el cliente quede asignado automáticamente
            datosEnvio.idCliente = userInfo.id;

            if (!datosEnvio.idPedidoExterno) {
                return res.status(400).json({
                    exito: false,
                    error: 'idPedidoExterno es requerido'
                });
            }

            if (!datosEnvio.destinatario) {
                return res.status(400).json({
                    exito: false,
                    error: 'destinatario es requerido'
                });
            }

            const resultado = await CorreoMockService.importarEnvio(datosEnvio);

            res.json({
                exito: true,
                datos: resultado
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
            const body = req.body;
            const userInfo = req.user; // ✅ CAMBIAR DE req.infoUser a req.user

            const datosCotizacion = {
                idCliente: userInfo.id,
                peso: Number(body.peso),
                valorDeclarado: Number(body.valorDeclarado),
                alto: Number(body.alto),
                largo: Number(body.largo),
                ancho: Number(body.ancho)
            };

            const resultado = await CorreoMockService.cotizarEnvio(datosCotizacion);

            res.json({
                exito: true,
                datos: resultado
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
            const { idEnvio } = req.params;

            if (!idEnvio) {
                return res.status(400).json({
                    exito: false,
                    error: "idEnvio es requerido"
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

    async misEnvios(req, res) {
        try {
            const userInfo = req.user; // ✅ CAMBIAR DE req.infoUser a req.user

            const lista = await CorreoMockService.misEnvios(userInfo.id);

            res.json(lista);

        } catch (error) {
            res.status(500).json({
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
                error: "Error obteniendo provincias"
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
                error: "Error obteniendo tipos de entrega"
            });
        }
    }
}

export default new CorreoController();