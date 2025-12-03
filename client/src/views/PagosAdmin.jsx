import { useEffect, useState } from "react";
import axios from "axios";

const PagosAdmin = () => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8000/api/payment/all", {
            headers: {
                token_user: localStorage.getItem("token_user")
            }
        })
        .then((res) => {
            setPagos(res.data.pagos);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <h3>Cargando pagos...</h3>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Historial de Donaciones</h2>

            {pagos.length === 0 ? (
                <p>No hay pagos registrados aún.</p>
            ) : (
                <table className="table table-hover">
                    <thead className="table-dark">
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
                                                ? "text-success"
                                                : pago.status === "pending"
                                                ? "text-warning"
                                                : "text-danger"
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
    );
};

export default PagosAdmin;
