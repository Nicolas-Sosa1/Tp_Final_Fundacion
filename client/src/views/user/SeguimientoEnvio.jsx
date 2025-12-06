import { useState } from "react";
import styles from "../../css/user/CorreoSub.module.css";

const SeguimientoEnvio = () => {
  const token = localStorage.getItem("token_user");

  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);

  const consultar = async () => {
    const res = await fetch(
      `http://localhost:8000/correo/envio/seguimiento/${codigo}`,
      {
        headers: { Authorization: token },
      }
    );

    setResultado(await res.json());
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Seguimiento de Envío</h1>

      <input
        className={styles.input}
        placeholder="Código de seguimiento"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <button className={styles.btn} onClick={consultar}>
        Consultar
      </button>

      {resultado && (
        <pre className={styles.box}>{JSON.stringify(resultado, null, 2)}</pre>
      )}
    </div>
  );
};

export default SeguimientoEnvio;
