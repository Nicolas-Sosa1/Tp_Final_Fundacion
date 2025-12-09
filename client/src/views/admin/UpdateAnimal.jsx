import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../css/admin/Update.module.css";
import axios from "../../../../server/config/Axios"; // ✅ Importar axios configurado

const UpdateAnimal = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [editando, setEditando] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

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
                setLoading(true);
                const res = await axios.get(`/api/animals/${id}`);
                setData(res.data.animal);
                setTempData(res.data.animal);
            } catch (e) {
                console.error("Error al cargar animal:", e);
                alert("Error al cargar el animal");
            } finally {
                setLoading(false);
            }
        };

        fetchAnimal();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Para subir imagen a un servidor, necesitarías otro endpoint
        // Por ahora solo mostramos la preview local
        const reader = new FileReader();
        reader.onloadend = () => {
            setData({ ...data, imagen: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const guardarCambios = async () => {
        try {
            // Preparar datos para enviar
            const datosActualizados = {
                nombre: data.nombre,
                edad: Number(data.edad),
                sexo: data.sexo,
                peso: Number(data.peso),
                castrado: data.castrado,
                vacunas: data.vacunas,
                desparasitado: data.desparasitado,
                discapacidad: data.discapacidad,
                imagen: data.imagen, // Esto debería ser una URL si subes a servidor
                historia: data.historia,
                tamaño: data.tamaño,
                ubicacion: data.ubicacion,
                tipoIngreso: data.tipoIngreso,
                estadoGeneral: data.estadoGeneral
            };

            const res = await axios.put(`/api/animals/update/${id}`, datosActualizados);
            
            setData(res.data);
            setEditando(false);
            setErrors({});
            alert("Cambios guardados correctamente");
        } catch (error) {
            console.error("Error guardando cambios:", error);
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                alert("Hay errores en el formulario. Revísalos.");
            } else {
                alert("Error al actualizar el animal");
            }
        }
    };

    const cancelarEdicion = () => {
        setData(tempData);
        setEditando(false);
        setErrors({});
    };

    if (loading) return <div className="text-center mt-5">Cargando...</div>;

    return (
        <div className={styles.wrapper}>
            <div className="d-flex justify-content-between align-items-center h-75 w-75 shadow-lg rounded-5 p-3 mx-auto">
                
                {/* Sección de Imagen */}
                <div className="w-50 p-3 d-flex justify-content-center align-items-center flex-column">
                    <Carousel>
                        <Carousel.Item interval={4000}>
                            <div className={styles.contenedor_img}>
                                <img 
                                    className="d-block w-100 rounded-4" 
                                    src={data.imagen || "../img/perro.png"} 
                                    alt="Imagen del animal" 
                                />
                            </div>
                        </Carousel.Item>
                    </Carousel>

                    <div className="d-flex mt-3 gap-3">
                        <div className={styles.contenedor_img_prev}>
                            <img 
                                className="d-block w-100 rounded-4" 
                                src={data.imagen || "../img/perro.png"} 
                                alt="Miniatura" 
                            />
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

                {/* Sección de Información */}
                <div className="h-100 p-3 w-50 d-flex flex-column">
                    {/* Nombre */}
                    {editando ? (
                        <div className="mb-3">
                            <input
                                type="text"
                                className="background-transparent-orange text-black-title rounded border-orange font-25 px-3 w-100"
                                value={data.nombre}
                                onChange={(e) => setData({ ...data, nombre: e.target.value })}
                            />
                            {errors.nombre && <div className="text-danger small">{errors.nombre}</div>}
                        </div>
                    ) : (
                        <h2 className="title_orange">{data.nombre}</h2>
                    )}

                    <h2 className="title_orange mb-3 font-25">Historia</h2>

                    {/* Historia */}
                    {editando ? (
                        <div className="mb-3">
                            <textarea
                                className="background-transparent-orange text-black-title font-400 px-3 rounded border-orange w-100"
                                rows="5"
                                value={data.historia}
                                onChange={(e) => setData({ ...data, historia: e.target.value })}
                            />
                            {errors.historia && <div className="text-danger small">{errors.historia}</div>}
                        </div>
                    ) : (
                        <h2 className="font-400 ps-3 font-20 historia_text">{data.historia}</h2>
                    )}

                    <h2 className="title_orange font-25">Detalles</h2>

                    <div className="d-flex flex-column gap-3 p-3">
                        {/* Sexo */}
                        {editando ? (
                            <div>
                                <select
                                    className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                    value={data.sexo}
                                    onChange={(e) => setData({ ...data, sexo: e.target.value })}
                                >
                                    <option value="">Seleccionar sexo</option>
                                    <option value="Hembra">Hembra</option>
                                    <option value="Macho">Macho</option>
                                </select>
                                {errors.sexo && <div className="text-danger small">{errors.sexo}</div>}
                            </div>
                        ) : (
                            <p className="font-20 title_orange">Sexo: {data.sexo}</p>
                        )}

                        {/* Edad */}
                        {editando ? (
                            <div>
                                <input
                                    type="number"
                                    className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-25"
                                    value={data.edad}
                                    onChange={(e) => setData({ ...data, edad: Number(e.target.value) })}
                                />
                                {errors.edad && <div className="text-danger small">{errors.edad}</div>}
                            </div>
                        ) : (
                            <p className="font-20 title_orange">Edad: {data.edad} años</p>
                        )}

                        {/* Peso */}
                        {editando ? (
                            <div>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-25"
                                    value={data.peso}
                                    onChange={(e) => setData({ ...data, peso: Number(e.target.value) })}
                                />
                                {errors.peso && <div className="text-danger small">{errors.peso}</div>}
                            </div>
                        ) : (
                            <p className="font-20 title_orange">Peso: {data.peso} kg</p>
                        )}

                        {/* Tamaño */}
                        {editando ? (
                            <div>
                                <select
                                    value={data.tamaño}
                                    className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                    onChange={(e) => setData({ ...data, tamaño: e.target.value })}
                                >
                                    <option value="">Seleccionar tamaño</option>
                                    <option value="Pequeño">Pequeño</option>
                                    <option value="Mediano">Mediano</option>
                                    <option value="Grande">Grande</option>
                                </select>
                                {errors.tamaño && <div className="text-danger small">{errors.tamaño}</div>}
                            </div>
                        ) : (
                            <p className="font-20 title_orange">Tamaño: {data.tamaño}</p>
                        )}

                        {/* Ubicación - AÑADÍ TODAS LAS OPCIONES */}
                        {editando ? (
                            <div>
                                <select
                                    value={data.ubicacion}
                                    className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                    onChange={(e) => setData({ ...data, ubicacion: e.target.value })}
                                >
                                    <option value="">Seleccionar ubicación</option>
                                    <option value="Garin">Garin</option>
                                    <option value="Jose C. Paz">Jose C. Paz</option>
                                    <option value="Pilar">Pilar</option>
                                    <option value="Escobar">Escobar</option>
                                    <option value="Tigre">Tigre</option>
                                    <option value="San Miguel">San Miguel</option>
                                    <option value="Malvinas Argentinas">Malvinas Argentinas</option>
                                </select>
                                {errors.ubicacion && <div className="text-danger small">{errors.ubicacion}</div>}
                            </div>
                        ) : (
                            <p className="font-20 title_orange">Ubicación: Buenos Aires, {data.ubicacion}</p>
                        )}
                    </div>

                    {/* Botones */}
                    {!editando ? (
                        <button
                            className="btn btn-primary float-end mt-3"
                            onClick={() => {
                                setTempData(data);
                                setEditando(true);
                            }}
                        >
                            Editar información
                        </button>
                    ) : (
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button
                                className="btn btn-secondary"
                                onClick={cancelarEdicion}
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