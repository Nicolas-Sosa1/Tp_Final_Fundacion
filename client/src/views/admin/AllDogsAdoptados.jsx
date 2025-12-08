import DogsConFilters from "../../components/DogsConFilters";

const AllDogsAdoptados = () => {
  return (
    <DogsConFilters
      context="adoptados"
      defaultFilters={{ estadoGeneral: false }}
    />
  );
};

export default AllDogsAdoptados;
