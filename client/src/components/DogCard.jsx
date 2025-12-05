import styles from "../css/DogCard.module.css";
import sizeIcon from "../assets/icons/tamanio.svg";
import { Link } from "react-router-dom";

const DogCard = ({ perro, to }) => {
  const { nombre, edad, peso, tamanio, genero, foto } = perro;

  return (
    <Link to={to} className={styles.link}>
      <article className={styles.dogcard}>
        <div className={styles.imageWrapper}>
          <img src={foto} alt={nombre} className={styles.dogphoto} />

          <img
            src={`/src/assets/icons/${genero}.svg`}
            alt={genero}
            className={styles.doggender}
          />
        </div>

        <div className={styles.doginfo}>
          <div className={styles.dogrow}>
            <div className={styles.dogleft}>
              <h3 className={styles.dogname}>{nombre}</h3>
              <span className={styles.dogage}>{edad}</span>
            </div>

            <div className={styles.dogright}>
              <div className={styles.dogsizes}>
                {["chico", "mediano", "grande"].map((t) => (
                  <img
                    key={t}
                    src={sizeIcon}
                    className={`${styles.sizeIcon} ${styles[t]} ${
                      tamanio === t ? styles.active : ""
                    }`}
                  />
                ))}
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
