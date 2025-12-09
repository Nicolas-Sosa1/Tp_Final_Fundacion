import { useEffect, useState } from "react";
import styles from "../../css/admin/PagosAdmin.module.css";
import axios from "../../../../server/config/Axios"; //

const PagosAdmin = () => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPagos = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/payment/all");
                setPagos(res.data.pagos || []);
                setError(null);
            } catch (err) {
                console.error("Error cargando pagos:", err);
                setError("Error al cargar los pagos");
                setPagos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPagos();
    }, []);

    if (loading) return <h3 className={styles.loading}>Cargando pagos...</h3>;
    if (error) return <h3 className={styles.error}>{error}</h3>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>Historial de Donaciones</h2>

                {pagos.length === 0 ? (
                    <p className={styles.empty}>No hay pagos registrados aún.</p>
                ) : (
                    <div className={styles.tableContainer}>
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
                                        <td>{pago.payment_id?.substring(0, 10)}...</td>
                                        <td>{pago.payer_email || "N/A"}</td>
                                        <td>${pago.transaction_amount?.toLocaleString()}</td>
                                        <td>{pago.payment_method || "N/A"}</td>

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
                                                {pago.status?.toUpperCase() || "DESCONOCIDO"}
                                            </span>
                                        </td>

                                        <td>
                                            {pago.date ? new Date(pago.date).toLocaleString('es-AR') : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PagosAdmin;