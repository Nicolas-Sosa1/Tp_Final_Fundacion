import Payment from "../models/payment.model.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

const paymentController = {
    createOrden: async (req, res) => {
        try {
            console.log("TOKEN MP:", process.env.MP_ACCESS_TOKEN?.substring(0, 10) + "...");

            const preferenceData = {
                items: [
                    {
                        title: "Donación",
                        quantity: 1,
                        unit_price: 1000,
                        currency_id: "ARS"
                    }
                ],
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/payment/success`,
                    failure: `${process.env.FRONTEND_URL}/payment/failure`,
                    pending: `${process.env.FRONTEND_URL}/payment/pending`
                },
                auto_return: "approved",
                notification_url: `${process.env.BACKEND_URL}/api/payment/webhook`
            };

            const preference = new Preference(client);
            const result = await preference.create({ body: preferenceData });

            console.log("RESULT:", result);

            return res.json({ 
                id: result.id,
                init_point: result.init_point,
                sandbox_init_point: result.sandbox_init_point
            });

        } catch (error) {
            console.error("ERROR MERCADO PAGO:", error);
            res.status(500).json({ error: "No se pudo crear la orden", details: error.message });
        }
    },

    // Nuevo método para donación protegida
    createOrdenDonacion: async (req, res) => {
        try {
            const { amount, description } = req.body;
            const userId = req.user.id; // Asumiendo que validateToken agrega user al request

            const preferenceData = {
                items: [
                    {
                        title: description || "Donación",
                        quantity: 1,
                        unit_price: amount || 1000,
                        currency_id: "ARS"
                    }
                ],
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/payment/success`,
                    failure: `${process.env.FRONTEND_URL}/payment/failure`,
                    pending: `${process.env.FRONTEND_URL}/payment/pending`
                },
                auto_return: "approved",
                notification_url: `${process.env.BACKEND_URL}/api/payment/webhook`,
                metadata: {
                    userId: userId,
                    type: "donacion"
                }
            };

            const preference = new Preference(client);
            const result = await preference.create({ body: preferenceData });

            return res.json({ 
                id: result.id,
                init_point: result.init_point,
                sandbox_init_point: result.sandbox_init_point
            });

        } catch (error) {
            console.error("ERROR creando orden de donación:", error);
            res.status(500).json({ error: "No se pudo crear la orden de donación" });
        }
    },

    webhook: async (req, res) => {
        try {
            console.log("Webhook recibido:", req.query, req.body);

            const paymentId =
                req.query["data.id"] ||
                req.body?.data?.id ||
                req.body["data.id"] ||
                req.query.id;

            const status =
                req.query.type ||
                req.query.topic ||
                req.body?.type ||
                req.body?.topic ||
                "unknown";

            if (!paymentId) {
                console.log("No se encontró paymentId, evento ignorado");
                return res.sendStatus(200);
            }

            await Payment.create({
                payment_id: paymentId,
                status: status,
                detail: { query: req.query, body: req.body }
            });

            console.log("Pago guardado correctamente");
            res.sendStatus(200);

        } catch (error) {
            console.error("Error en webhook:", error);
            res.sendStatus(500);
        }
    },

    // Nuevo método para redirección exitosa
    donacionExitosa: async (req, res) => {
        try {
            const { payment_id, status } = req.query;
            
            if (payment_id) {
                // Actualizar el pago si es necesario
                await Payment.findOneAndUpdate(
                    { payment_id: payment_id },
                    { status: status || "approved" },
                    { upsert: true }
                );
            }
            
            // Redirigir al frontend
            res.redirect(`${process.env.FRONTEND_URL}/donacion-exitosa?payment_id=${payment_id}`);
            
        } catch (error) {
            console.error("Error en donacionExitosa:", error);
            res.redirect(`${process.env.FRONTEND_URL}/error`);
        }
    },

    // Nuevo método para verificar pago
    verificarPago: async (req, res) => {
        try {
            const { paymentId } = req.params;
            const payment = await Payment.findOne({ payment_id: paymentId });
            
            if (!payment) {
                return res.status(404).json({ error: "Pago no encontrado" });
            }
            
            res.json(payment);
            
        } catch (error) {
            console.error("Error verificando pago:", error);
            res.status(500).json({ error: "Error al verificar el pago" });
        }
    },

    // Nuevo método para obtener todos los pagos (admin)
    obtenerTodosPagos: async (req, res) => {
        try {
            const pagos = await Payment.find().sort({ date: -1 });
            res.json(pagos);
            
        } catch (error) {
            console.error("Error obteniendo pagos:", error);
            res.status(500).json({ error: "Error al obtener los pagos" });
        }
    }
};

export default paymentController;