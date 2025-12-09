// file: payment.controller.js (CORREGIDO)
import Payment from "../models/payment.model.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

const paymentController = {
    createOrden: async (req, res) => {
        try {
            console.log("TOKEN MP:", process.env.MP_ACCESS_TOKEN);

            const { amount } = req.body;

            if (!amount || isNaN(amount) || Number(amount) <= 0) {
                return res.status(400).json({ error: "Monto inválido" });
            }

            const preferenceData = {
                items: [
                    {
                        title: "Donación",
                        quantity: 1,
                        unit_price: Number(amount),
                        currency_id: "ARS"
                    }
                ],
                back_urls: {
                    success: "http://localhost:5173/donar?status=approved",
                    failure: "http://localhost:5173/donar?status=failure",
                    pending: "http://localhost:5173/donar?status=pending"
                },
                notification_url:
                    "https://unarbitrary-franklin-unperforable.ngrok-free.dev/api/payment/webhook"
            };

            const result = await mercadopago.preferences.create(preferenceData);

            console.log("PREFERENCE RESULT:", result.body);

            return res.json({
                id: result.body.id,
                init_point: result.body.init_point
            });

        } catch (error) {
            console.error("ERROR MP:", error);
            res.status(500).json({ error: "No se pudo crear la orden" });
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

            if (!paymentId) {
                return res.sendStatus(200);
            }

            const paymentInfo = await mercadopago.payment.findById(paymentId);

            await Payment.updateOne(
                { payment_id: paymentInfo.body.id }, 
                {
                    $set: {
                        status: paymentInfo.body.status,
                        transaction_amount: paymentInfo.body.transaction_amount,
                        payment_method: paymentInfo.body.payment_method_id,
                        payer_email: paymentInfo.body.payer?.email,
                        detail: paymentInfo.body,
                        date: new Date(),
                    }
                },
                { upsert: true }
            );

            res.sendStatus(200);

        } catch (error) {
            console.error("Error en webhook:", error);
            res.sendStatus(500);
        }
    },
    
    getAll: async (req, res) => {
        try {
            const pagos = await Payment.find().sort({ date: -1 });

            return res.status(200).json({
                success: true,
                total: pagos.length,
                pagos
            });

        } catch (error) {
            console.error("Error al obtener los pagos:", error);
            return res.status(500).json({
                success: false,
                error: "Error al obtener los pagos"
            });
        }
    },
    
    getMine: async (req, res) => {
        try {
            console.log("🔍 Buscando pagos para usuario:", {
                // Opción 1: Usar req.userEmail (del middleware validateToken)
                userEmail: req.userEmail,
                // Opción 2: Usar req.infoUser.email (también del middleware)
                infoUserEmail: req.infoUser?.email,
                // Opción 3: Usar req.user?.email (si existiera)
                userEmailAlt: req.user?.email
            });
            
            // CORRECCIÓN: Usa req.userEmail que viene del middleware
            const userEmail = req.userEmail || req.infoUser?.email;
            
            if (!userEmail) {
                console.error("❌ No se encontró email del usuario en la request");
                return res.status(400).json({
                    success: false,
                    error: "No se pudo identificar al usuario"
                });
            }

            const pagos = await Payment.find({ payer_email: userEmail })
                .sort({ date: -1 });

            console.log(`✅ Encontrados ${pagos.length} pagos para ${userEmail}`);
            
            return res.status(200).json({
                success: true,
                total: pagos.length,
                pagos
            });

        } catch (error) {
            console.error("❌ Error al obtener los pagos del usuario:", error);
            return res.status(500).json({
                success: false,
                error: "Error al obtener pagos del usuario",
                // Solo en desarrollo mostrar detalles del error
                ...(process.env.NODE_ENV === 'development' && { details: error.message })
            });
        }
    }
};

export default paymentController;