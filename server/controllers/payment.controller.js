import Payment from "../models/payment.model.js";
import { MercadoPagoConfig, Preference, Payment as MPPayment } from "mercadopago";


const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

const paymentController = {
    createOrden: async (req, res) => {
        try {
            const { amount } = req.body;

            if (!amount || isNaN(amount) || Number(amount) <= 0) {
                return res.status(400).json({ error: "Monto inválido" });
            }

            const preference = new Preference(client);

            const result = await preference.create({
                body: {
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
                }
        });


            return res.json({
                id: result.id,
                init_point: result.init_point
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

            if (!paymentId) return res.sendStatus(200);

            const mpPayment = new MPPayment(client);
            const paymentInfo = await mpPayment.get({ id: paymentId });

            await Payment.updateOne(
                { payment_id: paymentInfo.id },
                {
                    $set: {
                        status: paymentInfo.status,
                        transaction_amount: paymentInfo.transaction_amount,
                        payment_method: paymentInfo.payment_method_id,
                        payer_email: paymentInfo.payer?.email,
                        detail: paymentInfo,
                        date: new Date()
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
            const userEmail = req.user.email;

            const pagos = await Payment.find({ payer_email: userEmail })
                .sort({ date: -1 });

            return res.status(200).json({
                success: true,
                total: pagos.length,
                pagos
            });

        } catch (error) {
            console.error("Error al obtener los pagos del usuario:", error);
            return res.status(500).json({
                success: false,
                error: "Error al obtener pagos del usuario"
            });
        }
    }
};

export default paymentController;