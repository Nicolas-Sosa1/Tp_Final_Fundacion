import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/HomePublic.module.css";
import heroImg from "../assets/dogs/perros.jpg";
import aboutImg from "../assets/dogs/perro-rescatado.png";
import { Link } from "react-router-dom";

const HomePublic = () => {
    const [adopcion, setAdopcion] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/animals/public/adopcion/all")
            .then((res) => {
                const limitedData = res.data.slice(0, 4);
                setAdopcion(limitedData);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className={styles.homeWrapper}>

            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <h1>Adoptá un amigo. Salvá una vida.</h1>
                    <p>Más de 100 peluditos esperan un hogar lleno de amor.</p>
                    <Link to="/login" className={styles.heroButton}>
                        Ingresar para ver
                    </Link>
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
                    <Link to="/donaciones" className={styles.aboutButton}>
                        Quiero donar
                    </Link>
                </div>

                <img className={styles.aboutImg} src={aboutImg} alt="Rescate animal" />
            </section>

            {/* RESCATADOS */}
            <section className={styles.section}>
                <h2>Algunos de nuestros rescatados</h2>
                <p className="text-center mb-4">
                    Regístrate o inicia sesión para ver todos los animales disponibles.
                </p>

                <div className={styles.carousel}>
                    {adopcion.map((dog) => {

                        // 🔥 FIX DEFINITIVO PARA IMÁGENES
                        const imageSrc =
                            dog.imagen?.includes("uploads") || dog.imagen?.startsWith("http")
                                ? dog.imagen
                                : dog.imagen
                                ? `http://localhost:8000/uploads/${dog.imagen}`
                                : aboutImg;

                        return (
                            <div key={dog._id} className={styles.card}>
                                <img
                                    src={imageSrc}
                                    alt={dog.nombre}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = aboutImg; // fallback
                                    }}
                                />

                                <h4>{dog.nombre}</h4>
                                <p>{dog.edad} años — {dog.sexo}</p>
                            </div>
                        );
                    })}
                </div>

                <Link to="/login" className={styles.verMas}>
                    Ingresar para ver más perros
                </Link>
            </section>
        </div>
    );
};

export default HomePublic;
