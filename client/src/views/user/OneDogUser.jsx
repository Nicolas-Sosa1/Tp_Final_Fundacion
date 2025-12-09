import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
// import styles from "../../css/user/OneDogUser.module.css";

const OneDogUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [perro, setPerro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuthenticated = !!localStorage.getItem("token_user");

  useEffect(() => {
    const fetchPerro = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token_user");
        const config = token ? { headers: { token_user: token } } : {};
        const res = await axios.get(
          `http://localhost:8000/api/animals/${id}`,
          config
        );
        setPerro(res.data.animal);
        setLoading(false);
      } catch (e) {
        setError("No se pudo cargar el animal.");
        setLoading(false);
      }
    };

    fetchPerro();
  }, [id]);

  const handleAccion = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/animales/${id}` } });
      return;
    }

    // Redirige según el tipo de ingreso
    navigate(`/solicitud/${perro.tipoIngreso}/${perro._id}`);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/animales")}
      >
        ← Volver
      </button>

      <div className="row">
        <div className="col-md-6">
          <Carousel>
            <Carousel.Item>
              <img
                src={perro.imagen || "/img/perro.png"}
                className="d-block w-100 rounded"
                alt={perro.nombre}
              />
            </Carousel.Item>
          </Carousel>
        </div>

        <div className="col-md-6">
          <h2>{perro.nombre}</h2>
          <p>
            <strong>Edad:</strong> {perro.edad} años
          </p>
          <p>
            <strong>Sexo:</strong> {perro.sexo}
          </p>
          <p>
            <strong>Tamaño:</strong> {perro.tamaño}
          </p>
          <p>{perro.historia}</p>

          <button className="btn btn-success me-3" onClick={handleAccion}>
            {perro.tipoIngreso === "adopcion"
              ? "Quiero Adoptar"
              : "Quiero Ser Hogar de Tránsito"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OneDogUser;
