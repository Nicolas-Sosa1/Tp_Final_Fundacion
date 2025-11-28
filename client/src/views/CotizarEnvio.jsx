import { useState } from "react";
import styles from "../css/CorreoSub.module.css";

const CotizarEnvio = () => {
    const token = localStorage.getItem("token_user");

    const [datos, setDatos] = useState({
        peso: "",
        valorDeclarado: "",
        alto: "",
        largo: "",
        ancho: ""
    });

    const [resultado, setResultado] = useState(null);

    const handle = (e) =>
        setDatos({ ...datos, [e.target.name]: e.target.value });

    const cotizar = async () => {
        const body = {
            peso: Number(datos.peso),
            valorDeclarado: Number(datos.valorDeclarado),
            alto: Number(datos.alto),
            largo: Number(datos.largo),
            ancho: Number(datos.ancho)
        };

        const res = await fetch("http://localhost:8000/correo/envio/cotizar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify(body)
        });

        setResultado(await res.json());
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Cotizar Envío</h1>

            <input className={styles.input} placeholder="Peso (kg)" name="peso" onChange={handle} />
            <input className={styles.input} placeholder="Valor declarado" name="valorDeclarado" onChange={handle} />
            <input className={styles.input} placeholder="Alto (cm)" name="alto" onChange={handle} />
            <input className={styles.input} placeholder="Largo (cm)" name="largo" onChange={handle} />
            <input className={styles.input} placeholder="Ancho (cm)" name="ancho" onChange={handle} />

            <button className={styles.btn} onClick={cotizar}>Cotizar</button>

            {resultado && (
                <pre className={styles.box}>
                    {JSON.stringify(resultado, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default CotizarEnvio;
