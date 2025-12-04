import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/OneDog.module.css";
import { Link } from 'react-router-dom';
import { useState } from 'react';

const OneDog = () => {

    const [data, setData] = useState({
        nombre: "Kira",
        edad: "16 Meses",
        sexo: "Hembra",
        tamaño: "Mediano",
        peso: 6,
        historia: "Kira fue encontrada temblando bajo un auto, flaca y asustada. Al recibir comida por primera vez, movió la cola con esperanza. Lo rescatamos, se recuperó rápido y mostró ser un perro dulce y agradecido.",
        castrado: false,
        vacunas: [],
        ubicacion: "Garin",
        desparasitado: false,
        discapacidad: "No",
        imagen: "",
    });
    return (

        <div className="d-flex justify-content-between align-items-center h-75 w-75 shadow-lg rounded-5 pt-3 pb- mx-auto">
            <div className="w-50  d-flex justify-content-center align-items-center flex-column ">
                <Carousel >
                    <Carousel.Item interval={4000}>
                        <div className={styles.contenedor_img}>
                            <img className="d-block w-100 rounded-4" src="../img/perro.png" alt="Perrito 1" />
                        </div>
                    </Carousel.Item>
                    <Carousel.Item interval={4000}>
                        <div className={styles.contenedor_img}>
                            <img className="d-block w-100 rounded-4" src="../img/perro_2.png" alt="Perrito 2" />
                        </div>
                    </Carousel.Item>

                </Carousel>

                <div className='d-flex w-100 align-items-center justify-content-center'>

                    <div className='mt-3 d-flex gap-3 align-items-start justify-content-center w-100'>
                        <div className={styles.contenedor_img_prev}>
                            <img className="d-block w-100 rounded-4" src="../img/perro.png" alt="Perrito 1" />
                        </div>
                        <div className={styles.contenedor_img_prev}>
                            <img className="d-block w-100 rounded-4" src="../img/perro_2.png" alt="Perrito 1" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="h-100 p-3 w-50 d-flex flex-column mb-5 mt-3">
                <div>
                    <h2 className='title_orange '>{data.nombre}</h2>
                </div>
                <h2 className="title_orange mb-3 font-25">Historia</h2>
                <h2 className='font-400 ps-3 font-20 historia_text'>{data.historia}</h2>
                <h2 className="title_orange font-25 ">Detalles</h2>
                <div className="d-flex flex-column gap-3 p-3">
                    <div className="d-flex align-items-center">
                        <h3 className="font-20 mb-1 pe-3 title_orange">Sexo:</h3>
                        <p className="font-400 font-20 m-0 title_orange">{data.sexo}</p>
                    </div>
                    <div className="d-flex align-items-center">
                        <h3 className="font-20 mb-1 pe-3 title_orange">Edad:</h3>
                        <p className="font-400 font-20 m-0 title_orange">{data.edad}</p>
                    </div>



                    <div className="d-flex align-items-center">
                        <h3 className="font-20 mb-1 pe-3 title_orange">Peso:</h3>
                        <p className="font-400 font-20 m-0 title_orange">{data.peso} kg</p>
                    </div>


                    <div className="d-flex align-items-center">
                        <h3 className="font-20 mb-1 pe-3 title_orange">Tamaño:</h3>
                        <p className="font-400 font-20 m-0 title_orange">{data.tamaño}</p>
                    </div>


                    <div className="d-flex align-items-center">
                        <h3 className="font-20 mb-1 pe-3 title_orange">Ubicación:</h3>
                        <p className="font-400 font-20 m-0 title_orange ">Buenos Aires, {data.ubicacion}</p>
                    </div>

                </div>
                <div className={styles.container_btn}>
                    <Link to="/home" className={`btn_navbar ${styles.btn_adoptar}`}>Adoptar</Link>
                    <Link to="/home" className={`background-transparent-orange ${styles.btn_hogar}`}>Ser hogar de tránsito</Link>
                </div>


            </div>

        </div>
    );
};

export default OneDog;
