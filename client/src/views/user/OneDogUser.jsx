import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import OneDog from "../../components/OneDog";

const OneDogUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detallePerro, setDetallePerro] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem("token_user");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token_user");
        const config = token ? { headers: { token_user: token } } : {};
        const res = await axios.get(
          `http://localhost:8000/api/animals/${id}`,
          config
        );
        setDetallePerro(res.data.animal);
      } catch (e) {
        if (e.response?.status === 401 && isAuthenticated) {
          localStorage.removeItem("token_user");
          setError(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          );
        } else {
          setError("Error al cargar los detalles del animal.");
        }
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="text-center py-5">Cargando perro...</div>;
  if (error)
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-warning">{error}</div>
        <button
          className="btn btn_navbar mt-3"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
        {!isAuthenticated && (
          <button
            className="btn btn-outline-orange mt-3 ms-2"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    );
  if (!detallePerro) return <p>Perro no encontrado</p>;

  return (
    <div>
      {/* Botón para volver a la lista */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/animales")}
      >
        ← Volver a la lista
      </button>
      {/* Banner auth modo público */}
      {!isAuthenticated && (
        <div className="alert alert-info mb-4">
          <i className="fas fa-info-circle me-2"></i>
          Estás viendo esta página en modo público.{" "}
          <button
            className="btn btn-link p-0 ms-1"
            onClick={() =>
              navigate("/login", { state: { from: `/animales/${id}` } })
            }
          >
            Inicia sesión
          </button>{" "}
          para más opciones.
        </div>
      )}
      {/* Detalle usando tu OneDog */}
      <OneDog
        data={detallePerro}
        modo="user"
        // Si quieres pasar callbacks para los botones de adoptar, tránsito, ponlas aquí
        // por ejemplo: onAdoptClick, onTransitClick...
      />
    </div>
  );
};

export default OneDogUser;
