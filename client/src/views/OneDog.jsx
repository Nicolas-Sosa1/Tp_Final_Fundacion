import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../css/OneDog.module.css";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const OneDog = () => {
    const { id } = useParams();

    const [data, setData] = useState({
        nombre: "",
        edad: 0,
        sexo: "",
        tamaño: "",
        peso: 0,
        historia: "",
        castrado: false,
        vacunas: [],
        ubicacion: "",
        desparasitado: false,
        discapacidad: "",
        imagen: "",
        tipoIngreso: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token_user");
                const res = await axios.get(`http://localhost:8000/api/animals/${id}`, {
                    headers: { token_user: token }
                });

                setData(res.data.animal);
            } catch (e) {
                console.log("Error cargando perro:", e);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div className={styles.wrapper}>
            <div className="d-flex justify-content-between align-items-center h-75 w-75 shadow-lg rounded-5 pt-3 pb-3 mx-auto">
                <div className="w-50 d-flex justify-content-center align-items-center flex-column">
                    <Carousel>
                        <Carousel.Item interval={4000}>
                            <div className={styles.contenedor_img}>
                                <img 
                                    className="d-block w-100 rounded-4" 
                                    src={data.imagen || "../img/perro.png"} 
                                    alt="Perrito" 
                                />
                            </div>
                        </Carousel.Item>

                    </Carousel>

                    <div className="d-flex w-100 align-items-center justify-content-center mt-3">
                        <div className={styles.contenedor_img_prev}>
                            <img 
                                className="d-block w-100 rounded-4" 
                                src={data.imagen || "../img/perro.png"} 
                                alt="Miniatura" 
                            />
                        </div>
                    </div>
                </div>

                <div className="h-100 p-3 w-50 d-flex flex-column mb-5 mt-3">
                    <h2 className="title_orange">{data.nombre}</h2>

                    <h2 className="title_orange mb-3 font-25">Historia</h2>
                    <h2 className="font-400 ps-3 font-20 historia_text">{data.historia}</h2>

                    <h2 className="title_orange font-25">Detalles</h2>

                    <div className="d-flex flex-column gap-3 p-3">
                        
                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3 title_orange">Sexo:</h3>
                            <p className="font-400 font-20 m-0 title_orange">{data.sexo}</p>
                        </div>

                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3 title_orange">Edad:</h3>
                            <p className="font-400 font-20 m-0 title_orange">{data.edad} años</p>
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
                            <p className="font-400 font-20 m-0 title_orange">
                                Buenos Aires, {data.ubicacion}
                            </p>
                        </div>
                    </div>

                    <div className={styles.container_btn}>
                        <Link to="/home" className={`btn_navbar ${styles.btn_adoptar}`}>
                            Adoptar
                        </Link>

                        <Link to="/home" className={`background-transparent-orange ${styles.btn_hogar}`}>
                            Ser hogar de tránsito
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OneDog;

