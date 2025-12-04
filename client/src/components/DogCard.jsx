import styles from "../css/DogCard.module.css";
import sizeIcon from "../assets/icons/tamanio.svg";
import { Link } from "react-router-dom";

const DogCard = ({ perro }) => {
  const { nombre, edad, peso, tamanio, genero, foto } = perro;

  return (
    <Link to={`/homeadmin/${perro.id}`} className={styles.link}>
      <article className={styles.dogcard}>
        <div className={styles.imageWrapper}>
          {/* Foto */}
          <img src={foto} alt={nombre} className={styles.dogphoto} />

          {/* Género */}
          <img
            src={`/src/assets/icons/${genero}.svg`}
            alt={genero}
            className={styles.doggender}
          />
        </div>

        {/* Info */}
        <div className={styles.doginfo}>
          <div className={styles.dogrow}>
            {/* Izquierda */}
            <div className={styles.dogleft}>
              <h3 className={styles.dogname}>{nombre}</h3>
              <span className={styles.dogage}>{edad}</span>
            </div>

            {/* Derecha */}
            <div className={styles.dogright}>
              <div className={styles.dogsizes}>
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
              <span className={styles.dogweight}>{peso}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default DogCard;
