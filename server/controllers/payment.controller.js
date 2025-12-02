import Payment from "../models/payment.model.js";
import mercadopago from "mercadopago";

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
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
                    success: "http://localhost:5173/home?status=approved",
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

            await Payment.create({
                payment_id: paymentInfo.body.id,
                status: paymentInfo.body.status,
                transaction_amount: paymentInfo.body.transaction_amount,
                payment_method: paymentInfo.body.payment_method_id,
                payer_email: paymentInfo.body.payer?.email,
                detail: paymentInfo.body
            });

            res.sendStatus(200);

        } catch (error) {
            console.error("Error en webhook:", error);
            res.sendStatus(500);
        }
    }
};

export default paymentController;
