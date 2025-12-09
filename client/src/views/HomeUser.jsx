import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/user/HomeUser.module.css";
import heroImg from "../assets/dogs/perros.jpg";
import aboutImg from "../assets/dogs/perro-rescatado.png";
import { Link } from "react-router-dom";

const HomeUser = () => {
    const [adopcion, setAdopcion] = useState([]);
    const [transito, setTransito] = useState([]);
    const [misPagos, setMisPagos] = useState([]);

    // 🔥 FUNCIÓN GLOBAL QUE FUNCIONA PARA TODAS LAS IMÁGENES
    const getSafeImageUrl = (img) => {
        if (!img) return aboutImg;

        // Si ya es URL completa → usarla
        if (img.startsWith("http")) return img;

        // Si es un nombre de archivo → armar ruta
        if (img.includes("uploads")) return img;

        return `http://localhost:8000/uploads/${img}`;
    };

    useEffect(() => {
        const token = localStorage.getItem("token_user");
        const config = token ? { headers: { token_user: token } } : {};

        axios
            .get("http://localhost:8000/api/animals/public/adopcion", config)
            .then((res) => {
                const formatted = res.data.map(dog => ({
                    ...dog,
                    imagen: getSafeImageUrl(dog.imagen),
                }));
                setAdopcion(formatted);
            })
            .catch((err) => console.log("Error cargando adopción:", err));

        axios
            .get("http://localhost:8000/api/animals/public/transito", config)
            .then((res) => {
                const formatted = res.data.map(dog => ({
                    ...dog,
                    imagen: getSafeImageUrl(dog.imagen),
                }));
                setTransito(formatted);
            })
            .catch((err) => console.log("Error cargando tránsito:", err));

        axios
            .get("http://localhost:8000/api/payment/mine", {
                headers: { token_user: localStorage.getItem("token_user") },
            })
            .then((res) => setMisPagos(res.data.pagos))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className={styles.homeWrapper}>

            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <h1>Adoptá un amigo. Salvá una vida.</h1>
                    <p>Más de 100 peluditos esperan un hogar lleno de amor.</p>
                    <Link to="/animales" className={styles.heroButton}>Ver animales</Link>
                </div>
                <img className={styles.heroImg} src={heroImg} alt="Perros felices" />
            </section>

            {/* ABOUT */}
            <section className={styles.about}>
                <div className={styles.aboutText}>
                    <h2>¿Quiénes somos?</h2>
                    <p>
                        Somos una organización sin fines de lucro dedicada al rescate,
                        recuperación y adopción responsable de animales en situación de calle.
                        Trabajamos gracias al amor de voluntarios y personas como vos.
                    </p>
                    <Link to="/donar" className={styles.aboutButton}>Quiero ayudar</Link>
                </div>

                <img className={styles.aboutImg} src={aboutImg} alt="Rescate animal" />
            </section>

            {/* ADOPCIÓN */}
            <section className={styles.section}>
                <h2>Buscan Adopción</h2>

                <div className={styles.carousel}>
                    {adopcion.map((dog) => (
                        <div key={dog._id} className={styles.card}>
                            <img
                                src={dog.imagen}
                                alt={dog.nombre}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = aboutImg;
                                }}
                            />
                            <h4>{dog.nombre}</h4>
                            <p>{dog.edad} años — {dog.sexo}</p>
                        </div>
                    ))}
                </div>

                <Link to="/animales" className={styles.verMas}>Ver más perros</Link>
            </section>

            {/* TRÁNSITO */}
            <section className={styles.section}>
                <h2>Buscan Tránsito</h2>

                <div className={styles.carousel}>
                    {transito.map((dog) => (
                        <div key={dog._id} className={styles.card}>
                            <img
                                src={dog.imagen}
                                alt={dog.nombre}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = aboutImg;
                                }}
                            />
                            <h4>{dog.nombre}</h4>
                            <p>{dog.edad} años — {dog.sexo}</p>
                        </div>
                    ))}
                </div>

                <Link to="/animales" className={styles.verMas}>Ver más perros en tránsito</Link>
            </section>

            {/* ACTIVIDAD */}
            <section id="actividad" className={styles.activityWrapper}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Mi actividad</h2>

                    {misPagos.length === 0 ? (
                        <p className={styles.empty}>Todavía no realizaste donaciones.</p>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID Pago</th>
                                    <th>Monto</th>
                                    <th>Método</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>

                            <tbody>
                                {misPagos.map((pago) => (
                                    <tr key={pago._id}>
                                        <td>{pago.payment_id}</td>
                                        <td>${pago.transaction_amount}</td>
                                        <td>{pago.payment_method}</td>
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
            </section>
        </div>
    );
};

export default HomeUser;
