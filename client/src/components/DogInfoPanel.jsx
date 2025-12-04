import styles from "../css/admin/DogInfoPanel.module.css";
import sizeIcon from "../assets/icons/tamanio.svg";

const DogInfoPanel = ({ perro }) => {
  const {
    nombre,
    estado,
    zona,
    edad,
    genero,
    tamanio,
    peso,
    foto,
    descripcion,
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
        <span>📍 {zona}</span>
        <span>🎂 {edad}</span>

        <div className={styles.metaItem}>
          <img
            src={`/src/assets/icons/${genero}.svg`}
            alt={genero}
            className={styles.genderIcon}
          />
          <span>{genero}</span>
        </div>
        <span>⚖ {peso}</span>

        {/* Tamaño */}
        <div className={styles.metaItem}>
          <div className={styles.sizes}>
            <img
              src={sizeIcon}
              className={`${styles.sizeIcon} ${styles.chico} ${
                tamanio === "chico" ? styles.active : ""
              }`}
            />
            <img
              src={sizeIcon}
              className={`${styles.sizeIcon} ${styles.mediano} ${
                tamanio === "mediano" ? styles.active : ""
              }`}
            />
            <img
              src={sizeIcon}
              className={`${styles.sizeIcon} ${styles.grande} ${
                tamanio === "grande" ? styles.active : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Foto */}
      <img src={foto} alt={nombre} className={styles.photo} />

      {/* Descripción */}
      <p className={styles.description}>{descripcion}</p>
    </aside>
  );
};

export default DogInfoPanel;
