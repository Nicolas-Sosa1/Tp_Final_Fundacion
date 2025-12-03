import DogCard from "./DogCard";
import styles from "../css/DogGrid.module.css";

const DogGrid = ({ perros }) => {
  return (
    <section className={styles.doggrid}>
      {perros.map((perro) => (
        <DogCard key={perro.id} perro={perro} />
      ))}
    </section>
  );
};

export default DogGrid;
