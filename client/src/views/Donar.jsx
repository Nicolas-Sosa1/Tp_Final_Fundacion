import axios from "axios";
import { useState } from "react";

const Donar = () => {
    const [monto, setMonto] = useState("");
    const [showModal, setShowModal] = useState(false);

    const sendData = (e) => {
        e.preventDefault();

        if (!monto || isNaN(monto) || Number(monto) <= 0) {
            setShowModal(true);
            return;
        }

        const URL = "http://localhost:8000/api/payment/create-order";

        axios.post(
            URL,
            { amount: Number(monto) },
            { headers: { token_user: localStorage.getItem("token_user") } }
        )
        .then(res => {
            // Popup de éxito
            setShowModal(true);

            // Redirige tras unos segundos
            setTimeout(() => {
                window.location.href = res.data.init_point;
            }, 1500);
        })
        .catch(err => {
            console.log(err);
            setShowModal(true);
        });
    };

    return (
        <div>
            <h1>Ayuda a la fundación</h1>
            <h3>Ingrese el monto que desea donar</h3>

            <form onSubmit={sendData}>
                <input
                    type="number"
                    placeholder="Ingrese un monto..."
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                />
                <button>Donar</button>
            </form>

            {/* ------- Modal Bootstrap ------- */}
            <div
                className={`modal fade ${showModal ? "show" : ""}`}
                style={{ display: showModal ? "block" : "none" }}
                tabIndex="-1"
            >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Información</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <p>
                                {Number(monto) > 0
                                    ? "Donación creada correctamente. Serás redirigido a MercadoPago."
                                    : "Ingresá un monto válido."}
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cerrar
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donar;
