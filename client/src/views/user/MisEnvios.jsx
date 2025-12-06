import { useEffect, useState } from "react";
import styles from "../../css/user/CorreoSub.module.css";

const MisEnvios = () => {
  const token = localStorage.getItem("token_user");

  const [lista, setLista] = useState([]);

  const cargar = async () => {
    const res = await fetch("http://localhost:8000/correo/envio/mis-envios", {
      headers: { Authorization: token },
    });

    const data = await res.json();
    setLista(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mis Envíos</h1>

      {lista.length === 0 && <p>No tenés envíos registrados.</p>}

      {lista.map((env) => (
        <div key={env._id} className={styles.card}>
          <h3>{env.trackingNumber || "Sin Tracking"}</h3>

          <p>
            <b>ID Pedido:</b> {env.idPedidoExterno}
          </p>
          <p>
            <b>Destinatario:</b> {env.destinatario?.nombre}
          </p>
          <p>
            <b>Peso:</b> {env.envio?.peso} kg
          </p>
          <p>
            <b>Estado:</b> {env.estado}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MisEnvios;
