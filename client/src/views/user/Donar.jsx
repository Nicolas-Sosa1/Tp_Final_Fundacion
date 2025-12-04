import axios from "axios";
import { useState, useEffect } from "react";
import styles from "../../css/user/Donar.module.css";
import { useLocation } from "react-router-dom";

const Donar = () => {
  const [monto, setMonto] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("status");

    if (status === "approved") {
      setModalMessage(
        "¡Gracias por tu donación! Tu pago fue procesado con éxito."
      );
      setShowModal(true);
    }

    if (status === "failure") {
      setModalMessage("Hubo un problema con tu pago. Intenta nuevamente.");
      setShowModal(true);
    }

    if (status === "pending") {
      setModalMessage(
        "Tu pago está pendiente. MercadoPago lo confirmará pronto."
      );
      setShowModal(true);
    }
  }, [location]);

  const sendData = (e) => {
    e.preventDefault();

    if (!monto || isNaN(monto) || Number(monto) <= 0) {
      setModalMessage("Ingresá un monto válido.");
      setShowModal(true);
      return;
    }

    const URL = "http://localhost:8000/api/payment/create-order";

    axios
      .post(
        URL,
        { amount: Number(monto) },
        { headers: { token_user: localStorage.getItem("token_user") } }
      )
      .then((res) => {
        setModalMessage(
          "Donación creada correctamente. Serás redirigido a MercadoPago."
        );
        setShowModal(true);

        setTimeout(() => {
          window.location.href = res.data.init_point;
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        setModalMessage("Error al procesar la donación.");
        setShowModal(true);
      });
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Ayuda a la fundación</h1>
      <h3 className={styles.subtitulo}>Ingrese el monto que desea donar</h3>

      <form className={styles.form} onSubmit={sendData}>
        <input
          type="number"
          placeholder="Ingrese un monto..."
          value={monto}
          className={styles.input}
          onChange={(e) => setMonto(e.target.value)}
        />
        <button className={styles.boton}>Donar</button>
      </form>

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
              <p>{modalMessage}</p>
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
