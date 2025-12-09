import DogsConFilters from "../../components/DogsConFilters";

const AllDogsUser = () => {
  // Si querés filtrar por defecto podés pasar defaultFilters igual que los otros
  return <DogsConFilters context="user" />;
};

export default AllDogsUser;
