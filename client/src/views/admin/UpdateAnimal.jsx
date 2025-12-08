import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../css/admin/Update.module.css";

const UpdateAnimal = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [editando, setEditando] = useState(false);

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

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const token = localStorage.getItem("token_user");
                const res = await axios.get(
                    `http://localhost:8000/api/animals/${id}`,
                    { headers: { token_user: token } }
                );

                setData(res.data.animal);
                setTempData(res.data.animal);
            } catch (e) {
                console.log("Error al cargar animal:", e);
            }
        };

        fetchAnimal();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setData({ ...data, imagen: url });
    };

    const guardarCambios = async () => {
        try {
            const token = localStorage.getItem("token_user");

            const res = await axios.put(
                `http://localhost:8000/api/animals/update/${id}`,
                data,
                { headers: { token_user: token } }
            );

            setData(res.data);
            setEditando(false);
            alert("Cambios guardados correctamente");
        } catch (e) {
            console.log("Error guardando cambios:", e);
            alert("Error al actualizar");
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className="d-flex justify-content-between align-items-center h-75 w-75 shadow-lg rounded-5 p-3 mx-auto">
                
                <div className="w-50 p-3 d-flex justify-content-center align-items-center flex-column">
                    <Carousel>
                        <Carousel.Item interval={4000}>
                            <div className={styles.contenedor_img}>
                                <img className="d-block w-100 rounded-4" src={data.imagen || "../img/perro.png"} alt="Imagen" />
                            </div>
                        </Carousel.Item>
                    </Carousel>

                    <div className="d-flex mt-3 gap-3">
                        <div className={styles.contenedor_img_prev}>
                            <img className="d-block w-100 rounded-4" src={data.imagen || "../img/perro.png"} alt="" />
                        </div>

                        {editando && (
                            <div className={styles.contenedor_img_prev}>
                                <label htmlFor="upload" className={styles.btn_subir}>
                                    <i className="fa-solid fa-plus"></i>
                                </label>
                                <input
                                    id="upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-100 p-3 w-50 d-flex flex-column">
                    {editando ? (
                        <input
                            type="text"
                            className="background-transparent-orange text-black-title rounded border-orange font-25 px-3 mb-3"
                            value={data.nombre}
                            onChange={(e) => setData({ ...data, nombre: e.target.value })}
                        />
                    ) : (
                        <h2 className="title_orange">{data.nombre}</h2>
                    )}

                    <h2 className="title_orange mb-3 font-25">Historia</h2>

                    {editando ? (
                        <textarea
                            className="background-transparent-orange text-black-title font-400 px-3 rounded border-orange no-scrollbar"
                            rows="5"
                            value={data.historia}
                            onChange={(e) => setData({ ...data, historia: e.target.value })}
                        />
                    ) : (
                        <h2 className="font-400 ps-3 font-20 historia_text">{data.historia}</h2>
                    )}

                    <h2 className="title_orange font-25">Detalles</h2>

                    <div className="d-flex flex-column gap-3 p-3">

                        {editando ? (
                            <select
                                className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                value={data.sexo}
                                onChange={(e) => setData({ ...data, sexo: e.target.value })}
                            >
                                <option value="Hembra">Hembra</option>
                                <option value="Macho">Macho</option>
                            </select>
                        ) : (
                            <p className="font-20 title_orange">Sexo: {data.sexo}</p>
                        )}

                        {editando ? (
                            <input
                                type="number"
                                className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-25"
                                value={data.edad}
                                onChange={(e) => setData({ ...data, edad: Number(e.target.value) })}
                            />
                        ) : (
                            <p className="font-20 title_orange">Edad: {data.edad} años</p>
                        )}

                        {editando ? (
                            <input
                                type="number"
                                className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-25"
                                value={data.peso}
                                onChange={(e) => setData({ ...data, peso: Number(e.target.value) })}
                            />
                        ) : (
                            <p className="font-20 title_orange">Peso: {data.peso} kg</p>
                        )}

                        {editando ? (
                            <select
                                value={data.tamaño}
                                className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                onChange={(e) => setData({ ...data, tamaño: e.target.value })}
                            >
                                <option value="Pequeño">Pequeño</option>
                                <option value="Mediano">Mediano</option>
                                <option value="Grande">Grande</option>
                            </select>
                        ) : (
                            <p className="font-20 title_orange">Tamaño: {data.tamaño}</p>
                        )}

                        {editando ? (
                            <select
                                value={data.ubicacion}
                                className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                onChange={(e) => setData({ ...data, ubicacion: e.target.value })}
                            >
                                <option value="Garin">Garin</option>
                                <option value="Jose C. Paz">Jose C. Paz</option>
                                <option value="Pilar">Pilar</option>
                            </select>
                        ) : (
                            <p className="font-20 title_orange">Ubicación: Buenos Aires, {data.ubicacion}</p>
                        )}
                    </div>

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
    );
};

export default UpdateAnimal;
