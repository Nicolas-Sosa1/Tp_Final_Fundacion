import { useState } from "react";
import styles from "../../css/user/CorreoSub.module.css";

const CrearEnvio = () => {
  const token = localStorage.getItem("token_user");

  const generarId = () => {
    const r = Math.random().toString(36).substring(2, 8).toUpperCase();
    const f = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `ENV-${f}-${r}`;
  };

  const [form, setForm] = useState({
    idPedidoExterno: "",
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

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async () => {
    try {
      setLoading(true);
      setError("");

      if (!form.destinatarioNombre || !form.destinatarioEmail) {
        setError("Nombre y email del destinatario son requeridos");
        return;
      }

      const body = {
        idPedidoExterno: form.idPedidoExterno || generarId(),
        destinatario: {
          nombre: form.destinatarioNombre,
          email: form.destinatarioEmail,
          telefono: form.destinatarioTelefono,
        },
        envio: {
          tipoEntrega: form.tipoEntrega,
          peso: Number(form.peso) || 1,
          valorDeclarado: Number(form.valorDeclarado) || 0,
          alto: Number(form.alto) || 10,
          largo: Number(form.largo) || 10,
          ancho: Number(form.ancho) || 10,
        },
      };

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
        throw new Error(
          errorData.error || `Error ${res.status}: ${res.statusText}`
        );
      }

      const data = await res.json();
      setResultado(data);
      setError("");
    } catch (err) {
      console.error("Error creando envío:", err);
      setError(err.message);
      setResultado({
        exito: false,
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Crear Envío</h1>

      {error && (
        <div
          className={styles.error}
          style={{
            color: "red",
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid red",
          }}
        >
          ❌ Error: {error}
        </div>
      )}

      <input
        className={styles.input}
        name="idPedidoExterno"
        placeholder="ID pedido (opcional, se genera solo)"
        onChange={handle}
        value={form.idPedidoExterno}
      />

      <h3 className={styles.subtitle}>Destinatario</h3>

      <input
        className={styles.input}
        name="destinatarioNombre"
        placeholder="Nombre *"
        onChange={handle}
        value={form.destinatarioNombre}
        required
      />
      <input
        className={styles.input}
        name="destinatarioEmail"
        placeholder="Email *"
        onChange={handle}
        value={form.destinatarioEmail}
        required
      />
      <input
        className={styles.input}
        name="destinatarioTelefono"
        placeholder="Teléfono"
        onChange={handle}
        value={form.destinatarioTelefono}
      />

      <h3 className={styles.subtitle}>Paquete</h3>

      <select
        className={styles.select}
        name="tipoEntrega"
        onChange={handle}
        value={form.tipoEntrega}
      >
        <option value="D">Domicilio</option>
        <option value="S">Sucursal</option>
      </select>

      <input
        className={styles.input}
        name="peso"
        type="number"
        placeholder="Peso (kg) *"
        onChange={handle}
        value={form.peso}
        required
      />
      <input
        className={styles.input}
        name="valorDeclarado"
        type="number"
        placeholder="Valor declarado"
        onChange={handle}
        value={form.valorDeclarado}
      />
      <input
        className={styles.input}
        name="alto"
        type="number"
        placeholder="Alto (cm)"
        onChange={handle}
        value={form.alto}
      />
      <input
        className={styles.input}
        name="largo"
        type="number"
        placeholder="Largo (cm)"
        onChange={handle}
        value={form.largo}
      />
      <input
        className={styles.input}
        name="ancho"
        type="number"
        placeholder="Ancho (cm)"
        onChange={handle}
        value={form.ancho}
      />

      <button className={styles.btn} onClick={enviar} disabled={loading}>
        {loading ? "Creando Envío..." : "Crear Envío"}
      </button>

      {resultado && (
        <pre className={styles.box}>{JSON.stringify(resultado, null, 2)}</pre>
      )}
    </div>
  );
};

export default CrearEnvio;
