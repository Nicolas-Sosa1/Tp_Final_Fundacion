import DogsConFilters from "../../components/DogsConFilters";

const AllDogsAdoptados = () => {
  return (
    <DogsConFilters
      context="adoptados"
      defaultFilters={{
        tipoIngreso: "adopcion",
        estadoGeneral: "no_disponible"
      }}
    />
  );
};

export default AllDogsAdoptados;
