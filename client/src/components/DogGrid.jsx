import DogCard from "./DogCard";
import styles from "../css/DogGrid.module.css";

const DogGrid = ({ perros, getLink }) => {
  return (
    <section className={styles.doggrid}>
      {perros.map((perro) => (
        <DogCard key={perro._id} perro={perro} to={getLink(perro)} />
      ))}
    </section>
  );
};

export default DogGrid;
