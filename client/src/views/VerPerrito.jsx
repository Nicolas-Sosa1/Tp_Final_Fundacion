import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../css/VerPerrito.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const VerPerrito = () => {
    const [editando, setEditando] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

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
        imagen: [], // Cambiado a array para múltiples imágenes
        tipoIngreso: "",
        estadoGeneral: true
    });

    const [tempData, setTempData] = useState(data);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert("Solo puedes seleccionar hasta 5 imágenes");
            return;
        }
        
        const imageURLs = files.map((file) => URL.createObjectURL(file));
        
        setData((prev) => ({
            ...prev,
            imagen: [...prev.imagen, ...imageURLs].slice(0, 5) // Mantener máximo 5 imágenes
        }));
    };

    const removeImage = (index) => {
        setData((prev) => ({
            ...prev,
            imagen: prev.imagen.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token_user");
                
                if (!id) {
                    setError("No se especificó un ID de perro");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(`http://localhost:8000/api/animals/${id}`, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        token_user: token 
                    }
                });

                if (res.data.animal) {
                    setData(res.data.animal);
                    setTempData(res.data.animal);
                } else {
                    setError("Perro no encontrado");
                }
                
                setLoading(false);
            } catch (e) {
                console.error("Error cargando perro:", e);
                setError("Error al cargar la información del perro");
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        } else {
            setError("No se proporcionó ID del perro");
            setLoading(false);
        }
    }, [id]);

    const guardarCambios = async () => {
        try {
            const token = localStorage.getItem("token_user");

            const body = {
                nombre: data.nombre,
                edad: Number(data.edad),
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
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        token_user: token 
                    } 
                }
            );

            setData(res.data);
            setEditando(false);
            alert("Cambios guardados correctamente");
        } catch (e) {
            console.error("Error guardando cambios:", e);
            alert("Hubo un error al guardar los cambios");
        }
    };

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-orange" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando información del perrito...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
                <button 
                    className="btn btn_navbar mt-3"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className="container mt-4 mb-5">
                <button 
                    className="btn btn-outline-secondary mb-4"
                    onClick={() => navigate(-1)}
                >
                    ← Volver
                </button>
                
                <div className="d-flex justify-content-between align-items-center shadow-lg rounded-4 p-4 mx-auto bg-white">
                    <div className="col-md-6 p-3 d-flex justify-content-center align-items-center flex-column">
                        {data.imagen && data.imagen.length > 0 ? (
                            <>
                                <Carousel className="w-100">
                                    {data.imagen.map((img, index) => (
                                        <Carousel.Item key={index} interval={4000}>
                                            <div className={styles.contenedor_img}>
                                                <img 
                                                    className="d-block w-100 rounded-4" 
                                                    src={img} 
                                                    alt={`${data.nombre} ${index + 1}`} 
                                                    style={{ height: "400px", objectFit: "cover" }}
                                                />
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>

                                <div className="d-flex w-100 align-items-center justify-content-center mt-3">
                                    {editando ? (
                                        <div className="mt-3 d-flex gap-3 align-items-center justify-content-center w-100 flex-wrap">
                                            {data.imagen.map((img, index) => (
                                                <div key={index} className={`${styles.contenedor_img_prev} position-relative`}>
                                                    <img 
                                                        className="d-block w-100 rounded-4" 
                                                        src={img} 
                                                        alt={`Preview ${index + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        className={`btn btn-danger btn-sm ${styles.removeImageBtn}`}
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            
                                            {data.imagen.length < 5 && (
                                                <div className={styles.contenedor_img_prev}>
                                                    <label htmlFor="upload" className={styles.btn_subir}>
                                                        <i className="fa-solid fa-plus fa-2x"></i>
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
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mt-3 d-flex gap-3 align-items-start justify-content-center w-100 flex-wrap">
                                            {data.imagen.map((img, index) => (
                                                <div key={index} className={styles.contenedor_img_prev}>
                                                    <img 
                                                        className="d-block w-100 rounded-4" 
                                                        src={img} 
                                                        alt={`${data.nombre} ${index + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className={`${styles.contenedor_img} d-flex align-items-center justify-content-center`}>
                                <img 
                                    className="d-block w-100 rounded-4" 
                                    src="/img/default-dog.jpg" 
                                    alt={data.nombre}
                                    style={{ height: "400px", objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 p-4 d-flex flex-column">
                        {!editando ? (
                            <h1 className="title_orange mb-3">{data.nombre}</h1>
                        ) : (
                            <input
                                className="background-transparent-orange text-black-title rounded border-orange font-25 px-3 mb-3"
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData({ ...data, nombre: e.target.value })}
                                placeholder="Nombre del perrito"
                            />
                        )}

                        <h2 className="title_orange mb-3 font-25">Historia</h2>

                        {!editando ? (
                            <div className="mb-4">
                                <p className="font-400 ps-3 font-20 historia_text">{data.historia || "No hay historia disponible"}</p>
                            </div>
                        ) : (
                            <textarea
                                className="background-transparent-orange text-black-title font-400 px-3 rounded border-orange no-scrollbar mb-4"
                                rows="5"
                                value={data.historia}
                                onChange={(e) => setData({ ...data, historia: e.target.value })}
                                placeholder="Cuenta la historia de este perrito..."
                            />
                        )}

                        <h2 className="title_orange font-25 mb-3">Detalles</h2>

                        <div className="d-flex flex-column gap-3 p-3 bg-light rounded-3">
                            {/* Sexo */}
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange w-25">Sexo:</h3>
                                {!editando ? (
                                    <p className="font-400 font-20 m-0">{data.sexo}</p>
                                ) : (
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
                                )}
                            </div>

                            {/* Edad */}
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange w-25">Edad:</h3>
                                {!editando ? (
                                    <p className="font-400 font-20 m-0">{data.edad} años</p>
                                ) : (
                                    <>
                                        <input
                                            type="number"
                                            className='background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-25'
                                            value={data.edad}
                                            onChange={(e) => setData({ ...data, edad: Number(e.target.value) })}
                                            min="0"
                                            max="25"
                                        />
                                        <span className="ms-2 font-20">años</span>
                                    </>
                                )}
                            </div>

                            {/* Peso */}
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange w-25">Peso:</h3>
                                {!editando ? (
                                    <p className="font-400 font-20 m-0">{data.peso} kg</p>
                                ) : (
                                    <>
                                        <input
                                            className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-25"
                                            type="number"
                                            value={data.peso}
                                            onChange={(e) => setData({ ...data, peso: e.target.value })}
                                        />
                                        <span className="ms-2 font-20">kg</span>
                                    </>
                                )}
                            </div>

                            {/* Tamaño */}
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange w-25">Tamaño:</h3>
                                {!editando ? (
                                    <p className="font-400 font-20 m-0">{data.tamaño}</p>
                                ) : (
                                    <select
                                        className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                        value={data.tamaño}
                                        onChange={(e) => setData({ ...data, tamaño: e.target.value })}
                                    >
                                        <option value="">Seleccionar tamaño</option>
                                        <option value="Pequeño">Pequeño</option>
                                        <option value="Mediano">Mediano</option>
                                        <option value="Grande">Grande</option>
                                    </select>
                                )}
                            </div>

                            {/* Ubicación */}
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange w-25">Ubicación:</h3>
                                {!editando ? (
                                    <p className="font-400 font-20 m-0">{data.ubicacion}</p>
                                ) : (
                                    <select
                                        className="background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50"
                                        value={data.ubicacion}
                                        onChange={(e) => setData({ ...data, ubicacion: e.target.value })}
                                    >
                                        <option value="">Seleccionar ubicación</option>
                                        <option value="Garin">Garin</option>
                                        <option value="Jose C.Paz">Jose C.Paz</option>
                                        <option value="Pilar">Pilar</option>
                                        <option value="Buenos Aires">Buenos Aires</option>
                                    </select>
                                )}
                            </div>

                            {/* Estado General */}
                            <div className="d-flex align-items-center">
                                <h3 className="font-20 mb-1 pe-3 title_orange w-25">Estado:</h3>
                                {!editando ? (
                                    <p className="font-400 font-20 m-0">
                                        {data.estadoGeneral ? "Disponible" : "No disponible"}
                                    </p>
                                ) : (
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="estadoGeneral"
                                            checked={data.estadoGeneral}
                                            onChange={(e) => setData({ ...data, estadoGeneral: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="estadoGeneral">
                                            {data.estadoGeneral ? "Disponible" : "No disponible"}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 d-flex justify-content-end">
                            {!editando ? (
                                <button
                                    className="btn btn_navbar"
                                    onClick={() => {
                                        setTempData(data);
                                        setEditando(true);
                                    }}
                                >
                                    Editar información
                                </button>
                            ) : (
                                <div className="d-flex gap-2">
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
        </div>
    );
};

export default VerPerrito;