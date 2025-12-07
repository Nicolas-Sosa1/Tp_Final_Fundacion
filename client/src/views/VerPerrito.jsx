import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../css/VerPerrito.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const VerPerrito = () => {
    const [editando, setEditando] = useState(false);
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
        tipoIngreso: "",
        estadoGeneral: true
    });

    const [tempData, setTempData] = useState(data);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) return alert("Solo puedes seleccionar hasta 5 imágenes");
        const imageURLs = files.map((file) => URL.createObjectURL(file));

        setData((prev) => ({
            ...prev,
            imagen: imageURLs
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token_user");
                const res = await axios.get(`http://localhost:8000/api/animals/${id}`, {
                    headers: { token_user: token }
                });

                setData(res.data.animal);
                setTempData(res.data.animal);
            } catch (e) {
                console.log("Error cargando perro:", e);
            }
        };

        fetchData();
    }, [id]);

    const guardarCambios = async () => {
        try {
            const token = localStorage.getItem("token_user");

            const body = {
                nombre: data.nombre,
                edad: Number(numeroEdad),
                sexo: data.sexo,
                peso: Number(data.peso),
                castrado: data.castrado,
                vacunas: data.vacunas,
                desparasitado: data.desparasitado,
                discapacidad: data.discapacidad,
                imagen: data.imagen,
                historia: data.historia,
                tamaño: data.tamaño,
                ubicacion: data.ubicacion,
                tipoIngreso: data.tipoIngreso,
                estadoGeneral: data.estadoGeneral
            };

            const res = await axios.put(
                `http://localhost:8000/api/animals/update/${id}`,
                body,
                { headers: { token_user: token } }
            );

            setData(res.data);
            setEditando(false);
            alert("Cambios guardados correctamente");
        } catch (e) {
            console.log("Error guardando cambios:", e);
            alert("Hubo un error al guardar los cambios");
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className="d-flex justify-content-between align-items-center h-75 w-75 shadow-lg rounded-5 p-3 mx-auto">
                <div className="w-50 p-3 d-flex justify-content-center align-items-center flex-column">
                    <Carousel>
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

                    <div className="d-flex w-100 align-items-center justify-content-center">
                        {editando ? (
                            <div className="mt-3 d-flex gap-3 align-items-center justify-content-center w-100">
                                <div className={styles.contenedor_img_prev}>
                                    <img className="d-block w-100 rounded-4" src="../img/perro.png" alt="" />
                                </div>

                                <div className={styles.contenedor_img_prev}>
                                    <img className="d-block w-100 rounded-4" src="../img/perro_2.png" alt="" />
                                </div>

                                <div className={styles.contenedor_img_prev}>
                                    <label htmlFor="upload" className={styles.btn_subir}>
                                        <i className="fa-solid fa-plus"></i>
                                    </label>

                                    <input
                                        id="upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 d-flex gap-3 align-items-start justify-content-center w-100">
                                <div className={styles.contenedor_img_prev}>
                                    <img className="d-block w-100 rounded-4" src="../img/perro.png" alt="" />
                                </div>

                                <div className={styles.contenedor_img_prev}>
                                    <img className="d-block w-100 rounded-4" src="../img/perro_2.png" alt="" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-100 p-3 w-50 d-flex flex-column">
                    {!editando ? (
                        <h2 className="title_orange">{data.nombre}</h2>
                    ) : (
                        <input
                            className="background-transparent-orange text-black-title rounded border-orange font-25 px-3 mb-3"
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData({ ...data, nombre: e.target.value })}
                        />
                    )}

                    <h2 className="title_orange mb-3 font-25">Historia</h2>

                    {!editando ? (
                        <h2 className="font-400 ps-3 font-20 historia_text">{data.historia}</h2>
                    ) : (
                        <textarea
                            className="background-transparent-orange text-black-title font-400 px-3 rounded border-orange no-scrollbar"
                            rows="5"
                            cols="34"
                            value={data.historia}
                            onChange={(e) => setData({ ...data, historia: e.target.value })}
                        />
                    )}

                    <h2 className="title_orange font-25">Detalles</h2>

                    <div className="d-flex flex-column gap-3 p-3">
                        {!editando ? (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange">Sexo:</h3>
                                <p className="font-400 font-20 m-0 title_orange">{data.sexo}</p>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3">Sexo:</h3>

                                <div className={styles.contenedor_genero}>
                                    <label className={data.sexo === "Hembra" ? styles.hembra : styles.opcion}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Hembra"
                                            checked={data.sexo === "Hembra"}
                                            onChange={(e) => setData({ ...data, sexo: e.target.value })}
                                        />
                                        <span>Hembra</span>
                                    </label>

                                    <label className={data.sexo === "Macho" ? styles.macho : styles.opcion}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Macho"
                                            checked={data.sexo === "Macho"}
                                            onChange={(e) => setData({ ...data, sexo: e.target.value })}
                                        />
                                        <span>Macho</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {editando ? (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3">Edad:</h3>
                                <input
                                    type="number"
                                    className='background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-25'
                                    value={data.edad}
                                    onChange={(e) => setData({ ...data, edad: Number(e.target.value) })}
                                    min="0"
                                    max="25"
                                />
                                <span className="ms-2 font-20">años</span>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange">Edad:</h3>
                                <p className="font-400 font-20 m-0 title_orange">{data.edad} años</p>
                            </div>
                        )}


                        {!editando ? (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange">Peso:</h3>
                                <p className="font-400 font-20 m-0 title_orange">{data.peso} kg</p>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3">Peso:</h3>
                                <input
                                    className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-25"
                                    type="number"
                                    value={data.peso}
                                    onChange={(e) => setData({ ...data, peso: e.target.value })}
                                />
                            </div>
                        )}

                        {!editando ? (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange">Tamaño:</h3>
                                <p className="font-400 font-20 m-0 title_orange">{data.tamaño}</p>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3">Tamaño:</h3>
                                <select
                                    className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                    value={data.tamaño}
                                    onChange={(e) => setData({ ...data, tamaño: e.target.value })}
                                >
                                    <option value="Pequeño">Pequeño</option>
                                    <option value="Mediano">Mediano</option>
                                    <option value="Grande">Grande</option>
                                </select>
                            </div>
                        )}

                        {!editando ? (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange">Ubicación:</h3>
                                <p className="font-400 font-20 m-0 title_orange">
                                    Buenos Aires, {data.ubicacion}
                                </p>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3">Ubicación:</h3>
                                <select
                                    className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                    value={data.ubicacion}
                                    onChange={(e) => setData({ ...data, ubicacion: e.target.value })}
                                >
                                    <option value="Garin">Garin</option>
                                    <option value="Jose C.Paz">Jose C.Paz</option>
                                    <option value="Pilar">Pilar</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="container">
                        {!editando ? (
                            <button
                                className="btn btn-primary float-end"
                                onClick={() => {
                                    setTempData(data);
                                    setEditando(true);
                                }}
                            >
                                Editar información
                            </button>
                        ) : (
                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setData(tempData);
                                        setEditando(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button className="btn btn-success" onClick={guardarCambios}>
                                    Guardar cambios
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerPerrito;
