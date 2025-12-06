import axios from "axios";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import styles from "../css/Donaciones.module.css";
import { useLocation } from "react-router-dom";

const Donaciones = () => {
  const [monto, setMonto] = useState("");

  const montosFijos = [1000, 5000, 10000, 20000];
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const location = useLocation();
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
    ancho: ""
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
          telefono: crear.destinatarioTelefono
        },
        envio: {
          tipoEntrega: crear.tipoEntrega,
          peso: Number(crear.peso) || 1,
          valorDeclarado: Number(crear.valorDeclarado) || 0,
          alto: Number(crear.alto) || 10,
          largo: Number(crear.largo) || 10,
          ancho: Number(crear.ancho) || 10
        }
      };

      console.log("Enviando request...");

      const res = await fetch('http://localhost:8000/api/correo/envio/importar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token_user': token
        },
        body: JSON.stringify(body)
      });

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
    ancho: ""
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
        ancho: Number(cotizar.ancho) || 10
      };

      const res = await fetch("http://localhost:8000/api/correo/envio/cotizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token_user": token
        },
        body: JSON.stringify(body)
      });

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
          headers: { "token_user": token }
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
          headers: { "token_user": token }
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

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("status");

    if (status === "approved") {
      setModalMessage("¡Gracias por tu donación! Tu pago fue procesado con éxito.");
      setShowModal(true);
    }

    if (status === "failure") {
      setModalMessage("Hubo un problema con tu pago. Intenta nuevamente.");
      setShowModal(true);
    }

    if (status === "pending") {
      setModalMessage("Tu pago está pendiente. MercadoPago lo confirmará pronto.");
      setShowModal(true);
    }

    console.log(status)

  }, [location]);
  const sendData = (e) => {
    e.preventDefault();

    if (!monto || isNaN(monto) || Number(monto) <= 0) {
      setModalMessage("Ingresá un monto válido.");
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

        setModalMessage("Estamos preparando tu donación. Te redirigiremos a Mercado Pago");
        setShowModal(true);

        setTimeout(() => {
          setShowModal(false);
          window.open(res.data.init_point, "_blank");
        }, 1500);
      })
      .catch(err => {
        console.log(err);
        setModalMessage("Error al procesar la donación.");
        setShowModal(true);
      });
  };
  return (
    <div className={styles.wrapper}>
      <div> 
        
      </div>
      <div className={styles.topSection}>
        <h2 className="title_orange">Donar a través de Mercado Pago</h2>

        <p className={styles.alias}>
          <strong>ALIAS:</strong> PATITAS.AL.RESCATE.MP
        </p>

        <div className={styles.mercadoPagoBox}>
          <img
            src="../img/mp.png"
            alt="Mercado Pago"
            className={styles.mercadoPagoImg}
          />
          <div>
            <div className={styles.botonesMontos}>
              {montosFijos.map((m) => (
                <button
                  key={m}
                  className={styles.btnMonto}
                  onClick={() => setMonto(m)}
                >
                  ${m}
                </button>
              ))}
            </div>
            <form className={styles.formDonar} onSubmit={sendData}>
              <label className="orange font-20">Elegir el monto:</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="background-transparent-orange border-orange rounded px-3"
                placeholder="200"
              />

              <button className={styles.btnDonar}>
                🐾 Donar
              </button>
            </form>
          </div>
          {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>

                <div className={styles.modalHeader}>
                  <h5 className={styles.modalTitle}>Información</h5>
                  <button
                    className={styles.closeBtn}
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <p>{modalMessage}</p>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    className={styles.modalBtn}
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      <div>
      <h2 className="title_orange w-100 text-center mt-5">Donar a través correo Argentino</h2>

      <div className={styles.container}>
        <div className="w-100 d-flex justify-content-center m-3">
          <img
            src="../img/correo_Arg.png"
            alt="Mercado Pago"
            className={styles.mercadoPagoImg}
          />
        </div>

        {error && (
          <div style={{
            color: 'red',
            padding: '10px',
            margin: '10px 0',
            border: '1px solid red',
            borderRadius: '5px',
            backgroundColor: '#ffe6e6'
          }}>
            ❌ Error: {error}
          </div>
        )}

        <div className={styles.tabs}>
          <button className={tab === "crear" ? styles.active : ""} onClick={() => { setTab("crear"); setError(""); }}>
            Crear Envío
          </button>

          <button className={tab === "cotizar" ? styles.active : ""} onClick={() => { setTab("cotizar"); setError(""); }}>
            Cotizar
          </button>

          <button className={tab === "seguir" ? styles.active : ""} onClick={() => { setTab("seguir"); setError(""); }}>
            Seguimiento
          </button>

          <button className={tab === "mis" ? styles.active : ""} onClick={() => {
            setTab("mis");
            setError("");
            cargarMisEnvios();
          }}
          >Mis Envíos</button>
        </div>

        {tab === "crear" && (
          <div className={styles.section}>
            <h2 className="orange">Crear Envío</h2>

            <input className={styles.input} name="destinatarioNombre" placeholder="Nombre destinatario *" onChange={handleCrear} value={crear.destinatarioNombre} />
            <input className={styles.input} name="destinatarioEmail" placeholder="Email destinatario *" onChange={handleCrear} value={crear.destinatarioEmail} />
            <input className={styles.input} name="destinatarioTelefono" placeholder="Teléfono" onChange={handleCrear} value={crear.destinatarioTelefono} />

            <select className={styles.input} name="tipoEntrega" onChange={handleCrear} value={crear.tipoEntrega}>
              <option value="D">Domicilio</option>
              <option value="S">Sucursal</option>
            </select>

            <input className={styles.input} name="peso" placeholder="Peso (kg) *" onChange={handleCrear} value={crear.peso} type="number" />
            <input className={styles.input} name="valorDeclarado" placeholder="Valor declarado" onChange={handleCrear} value={crear.valorDeclarado} type="number" />
            <input className={styles.input} name="alto" placeholder="Alto (cm)" onChange={handleCrear} value={crear.alto} type="number" />
            <input className={styles.input} name="largo" placeholder="Largo (cm)" onChange={handleCrear} value={crear.largo} type="number" />
            <input className={styles.input} name="ancho" placeholder="Ancho (cm)" onChange={handleCrear} value={crear.ancho} type="number" />

            <button className={styles.btn} onClick={crearEnvio}>Crear Envío</button>

            {response && <pre className={styles.response}>{JSON.stringify(response, null, 2)}</pre>}
          </div>
        )}

        {tab === "cotizar" && (
          <div className={styles.section}>
            <h2 className="orange">Cotizar</h2>

            <input className={styles.input} name="peso" placeholder="Peso (kg)" onChange={handleCotizar} value={cotizar.peso} type="number" />
            <input className={styles.input} name="valorDeclarado" placeholder="Valor declarado" onChange={handleCotizar} value={cotizar.valorDeclarado} type="number" />
            <input className={styles.input} name="alto" placeholder="Alto (cm)" onChange={handleCotizar} value={cotizar.alto} type="number" />
            <input className={styles.input} name="largo" placeholder="Largo (cm)" onChange={handleCotizar} value={cotizar.largo} type="number" />
            <input className={styles.input} name="ancho" placeholder="Ancho (cm)" onChange={handleCotizar} value={cotizar.ancho} type="number" />

            <button className={styles.btn} onClick={cotizarEnvio}>Cotizar</button>

            {response && <pre className={styles.response}>{JSON.stringify(response, null, 2)}</pre>}
          </div>
        )}

        {tab === "seguir" && (
          <div className={styles.section}>
            <h2 className="orange">Seguimiento</h2>

            <input className={styles.input} placeholder="Código de seguimiento" value={tracking} onChange={(e) => setTracking(e.target.value)} />

            <button className={styles.btn} onClick={seguimientoEnvio}>Consultar</button>
            {response && <pre className={styles.response}>{JSON.stringify(response, null, 2)}</pre>}
          </div>
        )}
        {tab === "mis" && (
          <div className={styles.section}>
            <h2 className="orange">Mis Envíos</h2>

            {misEnvios.length === 0 ? (
              <p>No tienes envíos registrados.</p>
            ) : (
              misEnvios.map((env) => (
                <div className={styles.card} key={env._id}>
                  <h3>{env.trackingNumber || "Sin tracking"}</h3>
                  <p><b>ID Pedido:</b> {env.idPedidoExterno}</p>
                  <p><b>Destinatario:</b> {env.destinatario?.nombre}</p>
                  <p><b>Peso:</b> {env.envio?.peso} kg</p>
                  <p><b>Estado:</b> {env.estado}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      </div>
     
      <div className={styles.cardsSection}>
        <h2 className={styles.tituloSection}>¿Qué hacemos con tus donaciones?</h2>

        <div className={styles.cardGrid}>

          <Card className={styles.cardBox}>
            <Card.Body>
              <div className={styles.icon}>🍖</div>
              <Card.Text className={styles.text}>
                Tu donación asegura que nuestros perritos tengan comida nutritiva todos los días.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className={styles.cardBox}>
            <Card.Body>
              <div className={styles.icon}>🩺</div>
              <Card.Text className={styles.text}>
                Con tu ayuda cubrimos vacunas, consultas y tratamientos para mantenerlos sanos.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className={styles.cardBox}>
            <Card.Body>
              <div className={styles.icon}>📦</div>
              <Card.Text className={styles.text}>
                Podés colaborar desde cualquier lugar enviando tu aporte por correo o transferencia.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className={styles.cardBox}>
            <Card.Body>
              <div className={styles.icon}>🐶</div>
              <Card.Text className={styles.text}>
                Gracias a tu ayuda, podemos rescatar perritos y darles un hogar lleno de amor.
              </Card.Text>
            </Card.Body>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Donaciones;
