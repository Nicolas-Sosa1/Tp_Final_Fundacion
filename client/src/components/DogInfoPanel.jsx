import styles from "../css/admin/DogInfoPanel.module.css";
import sizeIcon from "../assets/icons/tamanio.svg";

const DogInfoPanel = ({ perro }) => {
  const {
    nombre,
    edad,
    sexo,
    tamaño,
    peso,
    imagen,
    historia,
    ubicacion,
    tipoIngreso,
    estadoGeneral
  } = perro;

  return (
    <aside className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.name}>{nombre}</h2>

        {/* estadoGeneral boolean */}
        <span className={styles.status}>
          {estadoGeneral ? "Disponible" : "No disponible"}
        </span>
      </div>

      {/* Meta */}
      <div className={styles.meta}>
        <span>📍 {ubicacion}</span>
        <span>🎂 {edad} años</span>

        <div className={styles.metaItem}>
          <img
            src={`/src/assets/icons/${sexo}.svg`}
            alt={sexo}
            className={styles.genderIcon}
          />
          <span>{sexo}</span>
        </div>

        <span>⚖ {peso} kg</span>

        {/* Tamaño */}
        <div className={styles.metaItem}>
          <div className={styles.sizes}>
            <img
              src={sizeIcon}
              className={`${styles.sizeIcon} ${styles.chico} ${
                tamaño === "Pequeño" ? styles.active : ""
              }`}
            />
            <img
              src={sizeIcon}
              className={`${styles.sizeIcon} ${styles.mediano} ${
                tamaño === "Mediano" ? styles.active : ""
              }`}
            />
            <img
              src={sizeIcon}
              className={`${styles.sizeIcon} ${styles.grande} ${
                tamaño === "Grande" ? styles.active : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Foto */}
      <img src={imagen} alt={nombre} className={styles.photo} />

      {/* Descripción */}
      <p className={styles.description}>{historia}</p>
    </aside>
  );
};

export default DogInfoPanel;
