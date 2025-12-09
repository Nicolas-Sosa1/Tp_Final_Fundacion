import styles from "../css/admin/DogInfoPanel.module.css";
import sizeIcon from "../assets/icons/tamanio.svg";

const DogInfoPanel = ({ perro }) => {
  const {
    nombre,
    estado,
    ubicacion,
    edad,
    sexo,
    tamaño,
    peso,
    imagen,
    historia,
  } = perro;

  return (
    <aside className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.name}>{nombre}</h2>
        <span className={styles.status}>{estado}</span>
      </div>

      {/* Meta */}
      <div className={styles.meta}>
        <span>📍 {ubicacion}</span>
        <span>🎂 {edad} año</span>

        <div className={styles.metaItem}>
          <img
            src={`/src/assets/icons/${sexo}.svg`}
            alt={sexo}
            className={styles.genderIcon}
          />
          <span>{sexo}</span>
        </div>
        <span>⚖ {peso}</span>

        {/* tamaño */}
        <div className={styles.metaItem}>
          <div className={styles.sizes}>
            <img
              src={sizeIcon}
              className={`${styles.sizeIcon} ${styles.chico} ${
                tamaño === "Chico" ? styles.active : ""
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

      {/* imagen */}
      <img src={imagen} alt={nombre} className={styles.photo} />

      {/* Descripción */}
      <p className={styles.description}>{historia}</p>
    </aside>
  );
};

export default DogInfoPanel;
