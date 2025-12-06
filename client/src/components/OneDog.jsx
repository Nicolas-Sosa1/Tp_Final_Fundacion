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
  onToggleAdopted,
  onDeleteRequest,
  modo = "user",
}) => {
  const [numeroEdad, unidadEdad] = data.edad.split(" ");

  return (
    <div className={styles.bread}>
      {modo === "admin" && <Breadcrumbs perro={data} />}
      <div className={styles.card}>
        {/* --------- FOTOS --------- */}
        <div className={styles.gallery}>
          <Carousel interval={4000}>
            <Carousel.Item>
              <img
                src={data.foto}
                alt={data.nombre}
                className={styles.mainImg}
              />
            </Carousel.Item>

            {Array.isArray(data.fotos) &&
              data.fotos.map((img, i) => (
                <Carousel.Item key={i}>
                  <img src={img} className={styles.mainImg} />
                </Carousel.Item>
              ))}
          </Carousel>

          <div className={styles.thumbRow}>
            <img src={data.foto} className={styles.thumbnail} />

            {Array.isArray(data.fotos) &&
              data.fotos.map((img, i) => (
                <img key={i} src={img} className={styles.thumbnail} />
              ))}
          </div>
        </div>

        {/* --------- INFO --------- */}
        <div className={styles.info}>
          {/* Nombre */}
          {!editando ? (
            <h2 className={styles.name}>{data.nombre}</h2>
          ) : (
            <input
              className={styles.input}
              value={data.nombre}
              onChange={(e) => onChange({ ...data, nombre: e.target.value })}
            />
          )}

          {/* Historia */}
          <h3 className={styles.sectionTitle}>Historia</h3>

          {!editando ? (
            <p className={styles.text}>{data.descripcion}</p>
          ) : (
            <textarea
              className={styles.textarea}
              rows="4"
              value={data.descripcion}
              onChange={(e) =>
                onChange({ ...data, descripcion: e.target.value })
              }
            />
          )}

          {/* Detalles */}
          <h3 className={styles.sectionTitle}>Detalles</h3>

          <div className={styles.detailsList}>
            {/* Género */}
            <div className={styles.detailItem}>
              <img
                src={`/src/assets/icons/${data.genero}.svg`}
                className={styles.detailIcon}
              />
              <span className={styles.detailLabel}>Género:</span>

              {!editando ? (
                <span>{data.genero}</span>
              ) : (
                <select
                  className={styles.select}
                  value={data.genero}
                  onChange={(e) =>
                    onChange({ ...data, genero: e.target.value })
                  }
                >
                  <option>Hembra</option>
                  <option>Macho</option>
                </select>
              )}
            </div>

            {/* Edad */}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>🎂 Edad:</span>

              {!editando ? (
                <span>{data.edad}</span>
              ) : (
                <>
                  <input
                    type="number"
                    className={styles.number}
                    value={numeroEdad}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        edad: `${e.target.value} ${unidadEdad}`,
                      })
                    }
                  />
                  <select
                    className={styles.select}
                    value={unidadEdad}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        edad: `${numeroEdad} ${e.target.value}`,
                      })
                    }
                  >
                    <option>Meses</option>
                    <option>Años</option>
                  </select>
                </>
              )}
            </div>

            {/* Peso */}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>⚖ Peso:</span>

              {!editando ? (
                <span>{data.peso}</span>
              ) : (
                <input
                  type="number"
                  className={styles.number}
                  value={data.peso}
                  onChange={(e) => onChange({ ...data, peso: e.target.value })}
                />
              )}
            </div>

            {/* Tamaño */}
            <div className={styles.detailItem}>
              <img src={sizeIcon} className={styles.sizeIcon} />
              <span className={styles.detailLabel}> Tamaño:</span>

              <div className={styles.sizeRow}>
                <span className={styles.sizeText}>{data.tamanio}</span>
              </div>
            </div>

            {/* Ubicación */}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>📍 Ubicación:</span>

              {!editando ? (
                <span>{data.zona}</span>
              ) : (
                <select
                  className={styles.select}
                  value={data.zona}
                  onChange={(e) => onChange({ ...data, zona: e.target.value })}
                >
                  <option>Garin</option>
                  <option>Jose C.Paz</option>
                  <option>Pilar</option>
                </select>
              )}
            </div>
          </div>

          {/* BOTONES */}
          <div className={styles.buttons}>
            {modo === "admin" && !editando && (
              <>
                {/* Botón Editar */}
                <button className={styles.btnEdit} onClick={onEditStart}>
                  Editar
                </button>

                {/* BOTONES DE ADMINISTRACIÓN */}
                <div className={styles.adminActions}>
                  {Array.isArray(data.postulaciones) &&
                    data.postulaciones.length > 0 && (
                      <button
                        className={styles.btnPostulaciones}
                        onClick={() =>
                          (window.location.href = `/homeadmin/perro/${data.id}/postulaciones`)
                        }
                      >
                        Ver postulaciones
                      </button>
                    )}
                  <button
                    className={styles.btnAdopted}
                    onClick={() => onToggleAdopted(data)}
                  >
                    {data.isAdopted ? "Quitar adopción" : "Fue adoptado"}
                  </button>
                  <button
                    className={styles.btnDelete}
                    onClick={() => onDeleteRequest(data)}
                  >
                    Eliminar perro
                  </button>
                </div>
              </>
            )}

            {/* BOTONES DE EDICIÓN SOLO CUANDO editando === true */}
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

            {modo === "user" && (
              <div className={styles.userBtns}>
                <button className={styles.btnPrimary}>Adoptar</button>
                <button className={styles.btnSecondary}>
                  Ser hogar de tránsito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneDog;
