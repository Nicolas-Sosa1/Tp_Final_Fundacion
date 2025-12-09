import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import sizeIcon from "../assets/icons/tamanio.svg";
import Breadcrumbs from "../components/BreadcrumbsAdmin";

import styles from "../css/OneDog.module.css";

const OneDog = ({
  data,
  editando = false,
  onChange = () => {},
  onEditStart,
  onCancel,
  onSave,
  onToggleAdopted = () => {},
  onDeleteRequest,
  modo = "user",
}) => {

  const imageSrc = data.imagen?.startsWith("http")
    ? data.imagen
    : `http://localhost:8000/uploads/${data.imagen}`;

  return (
    <div className={styles.bread}>
      {modo === "admin" && <Breadcrumbs perro={data} />}

      <div className={styles.card}>
        <div className={styles.gallery}>
          <Carousel interval={4000}>
            <Carousel.Item>
              <img src={imageSrc} alt={data.nombre} className={styles.mainImg} />
            </Carousel.Item>
          </Carousel>

          <div className={styles.thumbRow}>
            <img src={imageSrc} className={styles.thumbnail} />
          </div>
        </div>

        <div className={styles.info}>
          {!editando ? (
            <h2 className={styles.name}>{data.nombre}</h2>
          ) : (
            <input
              className={styles.input}
              value={data.nombre}
              onChange={(e) => onChange({ ...data, nombre: e.target.value })}
            />
          )}

          <h3 className={styles.sectionTitle}>Historia</h3>

          {!editando ? (
            <p className={styles.text}>{data.historia}</p>
          ) : (
            <textarea
              className={styles.textarea}
              rows="4"
              value={data.historia}
              onChange={(e) => onChange({ ...data, historia: e.target.value })}
            />
          )}

          <h3 className={styles.sectionTitle}>Detalles</h3>

          <div className={styles.detailsList}>
            {/* SEXO */}
            <div className={styles.detailItem}>
              <img
                src={`/src/assets/icons/${data.sexo}.svg`}
                className={styles.detailIcon}
              />
              <span className={styles.detailLabel}>Sexo:</span>
              {!editando ? (
                <span>{data.sexo}</span>
              ) : (
                <select
                  className={styles.select}
                  value={data.sexo}
                  onChange={(e) => onChange({ ...data, sexo: e.target.value })}
                >
                  <option>Macho</option>
                  <option>Hembra</option>
                </select>
              )}
            </div>

            {/* EDAD */}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>🎂 Edad:</span>
              {!editando ? (
                <span>{data.edad} años</span>
              ) : (
                <input
                  type="number"
                  className={styles.number}
                  value={data.edad}
                  onChange={(e) => onChange({ ...data, edad: Number(e.target.value) })}
                />
              )}
            </div>

            {/* PESO */}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>⚖ Peso:</span>
              {!editando ? (
                <span>{data.peso} kg</span>
              ) : (
                <input
                  type="number"
                  className={styles.number}
                  value={data.peso}
                  onChange={(e) => onChange({ ...data, peso: Number(e.target.value) })}
                />
              )}
            </div>

            {/* TAMAÑO */}
            <div className={styles.detailItem}>
              <img src={sizeIcon} className={styles.sizeIcon} />
              <span className={styles.detailLabel}>Tamaño:</span>
              {!editando ? (
                <span>{data.tamaño}</span>
              ) : (
                <select
                  className={styles.select}
                  value={data.tamaño}
                  onChange={(e) => onChange({ ...data, tamaño: e.target.value })}
                >
                  <option value="Pequeño">Pequeño</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Grande">Grande</option>
                </select>
              )}
            </div>

            {/* UBICACIÓN */}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>📍 Ubicación:</span>
              {!editando ? (
                <span>{data.ubicacion}</span>
              ) : (
                <select
                  className={styles.select}
                  value={data.ubicacion}
                  onChange={(e) => onChange({ ...data, ubicacion: e.target.value })}
                >
                  <option>Garin</option>
                  <option>Jose C. Paz</option>
                  <option>Pilar</option>
                  <option>Escobar</option>
                </select>
              )}
            </div>
          </div>

          {/* -------- BOTONES ADMIN -------- */}
          <div className={styles.buttons}>
            {modo === "admin" && !editando && (
              <>
                <button className={styles.btnEdit} onClick={onEditStart}>
                  Editar
                </button>

                <div className={styles.adminActions}>
                  {/* POSTULACIONES */}
                  {Array.isArray(data.postulaciones) &&
                    data.postulaciones.length > 0 && (
                      <button
                        className={styles.btnPostulaciones}
                        onClick={() =>
                          (window.location.href = `/homeadmin/perro/${data._id}/postulaciones`)
                        }
                      >
                        Ver postulaciones
                      </button>
                    )}

                  {/* ADOPCIÓN TOGGLE */}
                  <button
                    className={styles.btnAdopted}
                    onClick={() => onToggleAdopted(data)}
                  >
                    {data.estadoGeneral === false
                      ? "Quitar adopción"
                      : "Fue adoptado"}
                  </button>

                  {/* ELIMINAR PERRO */}
                  <button
                    className={styles.btnDelete}
                    onClick={() => onDeleteRequest(data)}
                  >
                    Eliminar perro
                  </button>
                </div>
              </>
            )}

            {/* BOTONES DE EDICIÓN */}
            {editando && (
              <div className={styles.editBtns}>
                <button className={styles.btnCancel} onClick={onCancel}>
                  Cancelar
                </button>
                <button className={styles.btnSave} onClick={onSave}>
                  Guardar
                </button>
              </div>
            )}

            {/* BOTONES DEL USUARIO */}
            {modo === "user" && (
              <div className={styles.userBtns}>
                <button className={styles.btnPrimary}>Adoptar</button>
                <button className={styles.btnSecondary}>Ser hogar de tránsito</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneDog;