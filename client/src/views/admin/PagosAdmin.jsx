import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../css/admin/PagosAdmin.module.css";

const PagosAdmin = () => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8000/api/payment/all", {
            headers: { token_user: localStorage.getItem("token_user") }
        })
        .then((res) => {
            setPagos(res.data.pagos);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    if (loading) return <h3 className={styles.loading}>Cargando pagos...</h3>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>Historial de Donaciones</h2>

                {pagos.length === 0 ? (
                    <p className={styles.empty}>No hay pagos registrados aún.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID Pago</th>
                                <th>Email</th>
                                <th>Monto</th>
                                <th>Método</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pagos.map((pago) => (
                                <tr key={pago._id}>
                                    <td>{pago.payment_id}</td>
                                    <td>{pago.payer_email || "N/A"}</td>
                                    <td>${pago.transaction_amount}</td>
                                    <td>{pago.payment_method}</td>

                                    <td>
                                        <span
                                            className={
                                                pago.status === "approved"
                                                    ? styles.approved
                                                    : pago.status === "pending"
                                                    ? styles.pending
                                                    : styles.rejected
                                            }
                                        >
                                            {pago.status.toUpperCase()}
                                        </span>
                                    </td>

                                    <td>{new Date(pago.date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PagosAdmin;

