import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/HomePublic.module.css";
import heroImg from "../assets/dogs/perros.jpg";
import aboutImg from "../assets/dogs/perro-rescatado.png";
import { Link } from "react-router-dom";


const HomePublic = () => {
    const [adopcion, setAdopcion] = useState([]);
    const [transito, setTransito] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/animals/public/adopcion")
            .then(res => setAdopcion(res.data))
            .catch(err => console.log(err));

        axios.get("http://localhost:8000/api/animals/public/transito")
            .then(res => setTransito(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className={styles.homeWrapper}>

            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <h1>Adoptá un amigo. Salvá una vida.</h1>
                    <p>Más de 100 peluditos esperan un hogar lleno de amor.</p>
                    <Link to="/login" className={styles.heroButton}>Ver animales</Link>
                </div>
                <img className={styles.heroImg} src={heroImg} alt="Perros felices" />
            </section>
            <section className={styles.about}>
                <div className={styles.aboutText}>
                    <h2>¿Quiénes somos?</h2>
                    <p>
                        Somos una organización sin fines de lucro dedicada al rescate, 
                        recuperación y adopción responsable de animales en situación de calle.  
                        Trabajamos gracias al amor de voluntarios y personas como vos.
                    </p>
                    <Link to="/login" className={styles.aboutButton}>Quiero ayudar</Link>
                </div>

                <img className={styles.aboutImg} src={aboutImg} alt="Rescate animal"/>
            </section>
            <section className={styles.section}>
                <h2>Buscan Adopción</h2>

                <div className={styles.carousel}>
                    {adopcion.map((dog) => (
                        <div key={dog._id} className={styles.card}>
                            <img src={dog.imagen} alt={dog.nombre} />
                            <h4>{dog.nombre}</h4>
                            <p>{dog.edad} años — {dog.sexo}</p>
                        </div>
                    ))}
                </div>

                <Link to="/login" className={styles.verMas}>Ver más perros</Link>
            </section>

            <section className={styles.section}>
                <h2>Buscan Tránsito</h2>

                <div className={styles.carousel}>
                    {transito.map((dog) => (
                        <div key={dog._id} className={styles.card}>
                            <img src={dog.imagen} alt={dog.nombre} />
                            <h4>{dog.nombre}</h4>
                            <p>{dog.edad} años — {dog.sexo}</p>
                        </div>
                    ))}
                </div>

                <Link to="/login" className={styles.verMas}>Ver más perros en tránsito</Link>
            </section>

        </div>
    );
};

export default HomePublic;
