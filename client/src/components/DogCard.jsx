import styles from "../css/DogCard.module.css";
import sizeIcon from "../assets/icons/tamanio.svg";
import { Link } from "react-router-dom";

const DogCard = ({ perro, to }) => {
  const { nombre, edad, peso, tamaño, sexo, imagen } = perro;

  
  const imageSrc = imagen?.startsWith("http")
    ? imagen
    : `http://localhost:8000/uploads/${imagen}`;

  return (
    <Link to={to} className={styles.link}>
      <article className={styles.dogcard}>
        <div className={styles.imageWrapper}>
          <img src={imageSrc} alt={nombre} className={styles.dogphoto} />

          <img
            src={`/src/assets/icons/${sexo}.svg`}
            alt={sexo}
            className={styles.doggender}
          />
        </div>

        <div className={styles.doginfo}>
          <div className={styles.dogrow}>
            <div className={styles.dogleft}>
              <h3 className={styles.dogname}>{nombre}</h3>
              <span className={styles.dogage}>{edad} años</span>
            </div>

            <div className={styles.dogright}>
              <div className={styles.dogsizes}>
                {["Pequeño", "Mediano", "Grande"].map((t) => (
                  <img
                    key={t}
                    src={sizeIcon}
                    className={`${styles.sizeIcon} ${styles[t.toLowerCase()]} ${
                      tamaño === t ? styles.active : ""
                    }`}
                  />
                ))}
              </div>

              <span className={styles.dogweight}>{peso} kg</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default DogCard;