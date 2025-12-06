import DogsConFilters from "../../components/DogsConFilters";

const AllDogsPostulaciones = () => {
  return (
    <DogsConFilters
      context="postulaciones"
      defaultFilters={{ estado: "conPostulaciones" }}
    />
  );
};

export default AllDogsPostulaciones;
