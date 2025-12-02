import Payment from "../models/payment.model.js";
import pkg from "mercadopago";

import mercadopago from "mercadopago";


mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
});

const paymentController = {
    createOrden: async (req, res) => {
        try {
            console.log("TOKEN MP:", process.env.MP_ACCESS_TOKEN);

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
                    success: "https://www.google.com",
                    failure: "https://www.google.com",
                    pending: "https://www.google.com"
                },
                auto_return: "approved",
                notification_url: "https://unarbitrary-franklin-unperforable.ngrok-free.dev/api/payment/webhook"
            };

            const result = await mercadopago.preferences.create(preferenceData);

            console.log("RESULT:", result.body);

            return res.json({ id: result.body.id });

        } catch (error) {
            console.error("ERROR MERCADO PAGO:", error);
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
    }
};

export default paymentController;
