import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/VerPerrito.module.css";
import { useState } from 'react';

const VerPerrito = () => {
    const [editando, setEditando] = useState(false);
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
    const [tempData, setTempData] = useState(data);
    const [numeroEdad, unidadEdad] = data.edad.split(" ");



    const handleEdit = () => {
        setEditando(true);
    };

    const handleSave = () => {
        setEditando(false);
    };

    console.log(numeroEdad)
    console.log(unidadEdad)
    console.log(data.edad)
    return (

        <div className="d-flex justify-content-between align-items-center h-75 w-75 shadow-lg rounded-5 p-3 mx-auto">
            <div className="w-50 p-3 d-flex justify-content-center align-items-center flex-column ">
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
                <div className='mt-3 d-flex gap-3 align-items-start  w-75'>
                    <div className={styles.contenedor_img_prev}>
                        <img className="d-block w-100 rounded-4" src="../img/perro.png" alt="Perrito 1" />
                    </div>
                    <div className={styles.contenedor_img_prev}>
                        <img className="d-block w-100 rounded-4" src="../img/perro_2.png" alt="Perrito 1" />
                    </div>
                </div>
            </div>

            <div className="h-100 p-3 w-50 d-flex flex-column">
                <div>
                    {editando ? (
                        <input className='background-transparent-orange text-black-title rounded border-orange font-25 px-3 mb-3' type="text" value={data.nombre} onChange={(e) => setData({ ...data, nombre: e.target.value })} />
                    ) : (
                        <h2 className='title_orange '>{data.nombre}</h2>
                    )}
                </div>

                <h2 className="title_orange mb-3 font-25">Historia</h2>
                {editando ? (
                    <textarea className='background-transparent-orange text-black-title  font-400 px-3 rounded border-orange no-scrollbar' rows="5" cols="34" value={data.historia} onChange={(e) => setData({ ...data, historia: e.target.value })} />
                ) : (
                    <h2 className='font-400 ps-3 font-20 historia_text'>{data.historia}</h2>
                )}

                <h2 className="title_orange font-25 ">Detalles</h2>

                <div className="d-flex flex-column gap-3 p-3">
                    {editando ? (
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
                    ) : (
                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3 title_orange">Sexo:</h3>
                            <p className="font-400 font-20 m-0 title_orange">{data.sexo}</p>
                        </div>
                    )}

                    {editando ? (
                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3 ">Edad:</h3>
                            <input className='background-transparent-orange text-black-title  font-400 font-15 rounded border-orange px-3 w-25'
                                type="number"
                                value={numeroEdad}
                                onChange={(e) => setData({ ...data, edad: `${e.target.value} ${numeroEdad}` })} />

                            <div className={styles.contenedor_edad}>
                                <label className={unidadEdad === "Meses" ? styles.meses : styles.opcion}>
                                    <input
                                        type="radio"
                                        name="age"
                                        value="Meses"
                                        checked={unidadEdad === "Meses"}
                                        onChange={(e) => setData({ ...data, edad: `${numeroEdad} ${e.target.value}` })} />
                                    <span>Meses</span>
                                </label>

                                <label className={unidadEdad === "Años" ? styles.meses : styles.opcion}>
                                    <input
                                        type="radio"
                                        name="age"
                                        value="Años"
                                        checked={unidadEdad === "Años"}
                                        onChange={(e) => setData({ ...data, edad: `${numeroEdad} ${e.target.value}` })} />
                                    <span>Años</span>
                                </label>

                            </div>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3 title_orange">Edad:</h3>
                            <p className="font-400 font-20 m-0 title_orange">{data.edad}</p>
                        </div>

                    )}

                    {editando ? (
                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3  ">Peso:</h3>
                            <input className='background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-25' type="number" value={data.peso} onChange={(e) => setData({ ...data, peso: e.target.value })} />
                        </div>
                    ) : (
                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3 title_orange">Peso:</h3>
                            <p className="font-400 font-20 m-0 title_orange">{data.peso} kg</p>
                        </div>
                    )}
                    {editando ? (
                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3 ">Tamaño:</h3>
                            <select className='background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50'
                                value={data.tamaño}
                                onChange={(e) => setData({ ...data, tamaño: e.target.value })}
                            >
                                <option value="Pequeño">Pequeño</option>
                                <option value="Mediano">Mediano</option>
                                <option value="Grande">Grande</option>
                            </select>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3 title_orange">Tamaño:</h3>
                            <p className="font-400 font-20 m-0 title_orange">{data.tamaño}</p>
                        </div>
                    )}
                    {editando ? (
                        <div className="d-flex align-items-center">     
                            <h3 className="font-20 mb-1 pe-3">Ubicación:</h3>
                            <select className='background-transparent-orange text-black-title font-400 font-15 rounded border-orange px-3 w-50'
                                value={data.ubicacion}
                                onChange={(e) => setData({ ...data, ubicacion: e.target.value })}
                            >
                                <option value="Garin">Garin</option>
                                <option value="Jose C.Paz">Jose C.Paz</option>
                                <option value="Pilar">Pilar</option>
                            </select>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center">
                            <h3 className="font-20 mb-1 pe-3 title_orange">Ubicación:</h3>
                            <p className="font-400 font-20 m-0 title_orange ">Buenos Aires, {data.ubicacion}</p>
                        </div>
                    )}


                </div>
                <div className='container'>
                    {!editando ? (
                        <button 
                            className='btn btn-primary float-end' 
                            onClick={() => {
                                setTempData(data);   
                                setEditando(true);   
                            }}
                        >
                            Editar
                        </button>
                    ) : (
                        <div className="d-flex justify-content-end gap-2">
                            <button className='btn btn-secondary' onClick={() => {setData(tempData);setEditando(false);}}>
                                Cancelar
                            </button>
                            <button 
                                className='btn btn-success' onClick={() => { setTempData(data); setEditando(false);}}>
                                Guardar cambios
                            </button>
                        </div>
                    )}
</div>


            </div>

        </div>
    );
};

export default VerPerrito;
