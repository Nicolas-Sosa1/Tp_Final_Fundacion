import { useState, useEffect } from "react";
import styles from "../../css/user/CorreoArgentino.module.css";

function CorreoArgentino() {
  const token = localStorage.getItem("token_user");

  const [tab, setTab] = useState("crear");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("No estás autenticado. Por favor inicia sesión.");
    }
  }, [token]);

  const generarIdPedido = () => {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `ENV-${fecha}-${rand}`;
  };

  const [crear, setCrear] = useState({
    destinatarioNombre: "",
    destinatarioEmail: "",
    destinatarioTelefono: "",
    tipoEntrega: "D",
    peso: "",
    valorDeclarado: "",
    alto: "",
    largo: "",
    ancho: "",
  });

  const handleCrear = (e) =>
    setCrear({ ...crear, [e.target.name]: e.target.value });

  const crearEnvio = async () => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    try {
      setError("");
      const body = {
        idPedidoExterno: generarIdPedido(),
        destinatario: {
          nombre: crear.destinatarioNombre,
          email: crear.destinatarioEmail,
          telefono: crear.destinatarioTelefono,
        },
        envio: {
          tipoEntrega: crear.tipoEntrega,
          peso: Number(crear.peso) || 1,
          valorDeclarado: Number(crear.valorDeclarado) || 0,
          alto: Number(crear.alto) || 10,
          largo: Number(crear.largo) || 10,
          ancho: Number(crear.ancho) || 10,
        },
      };

      console.log("Enviando request...");

      const res = await fetch(
        "http://localhost:8000/api/correo/envio/importar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token_user: token,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Error creando envío:", err);
      setError(err.message);
    }
  };

  const [cotizar, setCotizar] = useState({
    peso: "",
    valorDeclarado: "",
    alto: "",
    largo: "",
    ancho: "",
  });

  const handleCotizar = (e) =>
    setCotizar({ ...cotizar, [e.target.name]: e.target.value });

  const cotizarEnvio = async () => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    try {
      setError("");
      const body = {
        peso: Number(cotizar.peso) || 1,
        valorDeclarado: Number(cotizar.valorDeclarado) || 0,
        alto: Number(cotizar.alto) || 10,
        largo: Number(cotizar.largo) || 10,
        ancho: Number(cotizar.ancho) || 10,
      };

      const res = await fetch(
        "http://localhost:8000/api/correo/envio/cotizar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token_user: token,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Error cotizando:", err);
      setError(err.message);
    }
  };

  const [tracking, setTracking] = useState("");

  const seguimientoEnvio = async () => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    try {
      setError("");
      const res = await fetch(
        `http://localhost:8000/api/correo/envio/seguimiento/${tracking}`,
        {
          headers: { token_user: token },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Error en seguimiento:", err);
      setError(err.message);
    }
  };

  const [misEnvios, setMisEnvios] = useState([]);

  const cargarMisEnvios = async () => {
    if (!token) {
      setError("No hay token de autenticación");
      return;
    }

    try {
      setError("");
      const res = await fetch(
        "http://localhost:8000/api/correo/envio/mis-envios",
        {
          headers: { token_user: token },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const json = await res.json();
      setMisEnvios(json);
      setResponse(null);
    } catch (err) {
      console.error("Error cargando envíos:", err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Correo Argentino</h1>

      {error && (
        <div
          style={{
            color: "red",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid red",
            borderRadius: "5px",
            backgroundColor: "#ffe6e6",
          }}
        >
          ❌ Error: {error}
        </div>
      )}

      <div className={styles.tabs}>
        <button
          className={tab === "crear" ? styles.active : ""}
          onClick={() => {
            setTab("crear");
            setError("");
          }}
        >
          Crear Envío
        </button>

        <button
          className={tab === "cotizar" ? styles.active : ""}
          onClick={() => {
            setTab("cotizar");
            setError("");
          }}
        >
          Cotizar
        </button>

        <button
          className={tab === "seguir" ? styles.active : ""}
          onClick={() => {
            setTab("seguir");
            setError("");
          }}
        >
          Seguimiento
        </button>

        <button
          className={tab === "mis" ? styles.active : ""}
          onClick={() => {
            setTab("mis");
            setError("");
            cargarMisEnvios();
          }}
        >
          Mis Envíos
        </button>
      </div>

      {tab === "crear" && (
        <div className={styles.section}>
          <h2>Crear Envío</h2>

          <input
            className={styles.input}
            name="destinatarioNombre"
            placeholder="Nombre destinatario *"
            onChange={handleCrear}
            value={crear.destinatarioNombre}
          />
          <input
            className={styles.input}
            name="destinatarioEmail"
            placeholder="Email destinatario *"
            onChange={handleCrear}
            value={crear.destinatarioEmail}
          />
          <input
            className={styles.input}
            name="destinatarioTelefono"
            placeholder="Teléfono"
            onChange={handleCrear}
            value={crear.destinatarioTelefono}
          />

          <select
            className={styles.input}
            name="tipoEntrega"
            onChange={handleCrear}
            value={crear.tipoEntrega}
          >
            <option value="D">Domicilio</option>
            <option value="S">Sucursal</option>
          </select>

          <input
            className={styles.input}
            name="peso"
            placeholder="Peso (kg) *"
            onChange={handleCrear}
            value={crear.peso}
            type="number"
          />
          <input
            className={styles.input}
            name="valorDeclarado"
            placeholder="Valor declarado"
            onChange={handleCrear}
            value={crear.valorDeclarado}
            type="number"
          />
          <input
            className={styles.input}
            name="alto"
            placeholder="Alto (cm)"
            onChange={handleCrear}
            value={crear.alto}
            type="number"
          />
          <input
            className={styles.input}
            name="largo"
            placeholder="Largo (cm)"
            onChange={handleCrear}
            value={crear.largo}
            type="number"
          />
          <input
            className={styles.input}
            name="ancho"
            placeholder="Ancho (cm)"
            onChange={handleCrear}
            value={crear.ancho}
            type="number"
          />

          <button className={styles.btn} onClick={crearEnvio}>
            Crear Envío
          </button>

          {response && (
            <pre className={styles.response}>
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
        </div>
      )}

      {tab === "cotizar" && (
        <div className={styles.section}>
          <h2>Cotizar</h2>

          <input
            className={styles.input}
            name="peso"
            placeholder="Peso (kg)"
            onChange={handleCotizar}
            value={cotizar.peso}
            type="number"
          />
          <input
            className={styles.input}
            name="valorDeclarado"
            placeholder="Valor declarado"
            onChange={handleCotizar}
            value={cotizar.valorDeclarado}
            type="number"
          />
          <input
            className={styles.input}
            name="alto"
            placeholder="Alto (cm)"
            onChange={handleCotizar}
            value={cotizar.alto}
            type="number"
          />
          <input
            className={styles.input}
            name="largo"
            placeholder="Largo (cm)"
            onChange={handleCotizar}
            value={cotizar.largo}
            type="number"
          />
          <input
            className={styles.input}
            name="ancho"
            placeholder="Ancho (cm)"
            onChange={handleCotizar}
            value={cotizar.ancho}
            type="number"
          />

          <button className={styles.btn} onClick={cotizarEnvio}>
            Cotizar
          </button>

          {response && (
            <pre className={styles.response}>
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
        </div>
      )}

      {tab === "seguir" && (
        <div className={styles.section}>
          <h2>Seguimiento</h2>

          <input
            className={styles.input}
            placeholder="Código de seguimiento"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
          />

          <button className={styles.btn} onClick={seguimientoEnvio}>
            Consultar
          </button>
          {response && (
            <pre className={styles.response}>
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
        </div>
      )}
      {tab === "mis" && (
        <div className={styles.section}>
          <h2>Mis Envíos</h2>

          {misEnvios.length === 0 ? (
            <p>No tienes envíos registrados.</p>
          ) : (
            misEnvios.map((env) => (
              <div className={styles.card} key={env._id}>
                <h3>{env.trackingNumber || "Sin tracking"}</h3>
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
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CorreoArgentino;
