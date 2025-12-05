import DogsConFilters from "../../components/DogsConFilters";

const AllDogsAdoptados = () => {
  return (
    <DogsConFilters
      context="adoptados"
      defaultFilters={{ estado: "adoptado" }}
    />
  );
};

export default AllDogsAdoptados;
