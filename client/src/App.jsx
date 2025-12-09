import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ========== VIEWS ==========
// Public Views
import HomePublic from "./views/HomePublic.jsx";
import Login_Registro from "./views/Login_Registro.jsx";

// User Views
import HomeUser from "./views/user/HomeUser.jsx";
import AllDogsUser from "./views/user/AllDogsUser.jsx";
import OneDogUser from "./views/user/OneDogUser.jsx";
import Donaciones from "./views/user/Donaciones.jsx";
import CorreoArgentino from "./views/user/CorreoArgentino.jsx";
import Form from "./views/user/Form.jsx";
import FormTransit from "./views/user/FormTransit.jsx"; // Importar FormTransit

// Vista de Actividades (nueva)
import Actividades from "./views/user/Actividades.jsx";

// Admin Views
import AllDogsAdmin from "./views/admin/AllDogsAdmin.jsx";
import OneDogAdmin from "./views/admin/OneDogAdmin.jsx";
import AllDogsAdoptados from "./views/admin/AllDogsAdoptados.jsx";
import AddDog from "./views/admin/AddDog.jsx";
import AllDogsPostulaciones from "./views/admin/AllDogsPostulaciones.jsx";
import OneDogPostulaciones from "./views/admin/OneDogPostulaciones.jsx";
import OnePostulacion from "./views/admin/OnePostulacion.jsx";
import PagosAdmin from "./views/admin/PagosAdmin.jsx";
import VerPerrito from "./views/VerPerrito.jsx";

// ========== COMPONENTS ==========
import NavbarAdmin from "./components/NavbarAdmin";
import NavbarPublic from "./components/NavbarPublic";
import NavbarUser from "./components/NavbarUser";
import Footer from "./components/Footer";

function App() {
  const [listaPerros, setListaPerros] = useState([]);
  const [login, setLogin] = useState(false);
  const [me, setMe] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const token = localStorage.getItem("token_user");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setMe(decoded);
        setLogin(true);
      } catch (error) {
        console.error("Token inválido:", error);
        logOut();
      }
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("token_user");
    setLogin(false);
    setMe({});
    navigate("/login");
  };

  // ========== FUNCIÓN PARA RUTA HOME ==========
  const HomeRoute = () => {
    if (!login) {
      return <HomePublic />;
    }

    if (me.role === "admin") {
      return <Navigate to="/homeadmin" />;
    }

    return <HomeUser />;
  };

  // ========== COMPONENTE PARA RUTAS PROTEGIDAS ==========
  const ProtectedRoute = ({
    children,
    requireLogin = true,
    allowedRoles = [],
  }) => {
    if (requireLogin && !login) {
      // Guardar la ruta actual para redirigir después del login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (
      requireLogin &&
      login &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(me.role)
    ) {
      // Usuario logueado pero sin el rol necesario
      return <Navigate to="/home" />;
    }

    return children;
  };

  return (
    <>
      {!isLoginPage && (
        <>
          {login ? (
            <>
              {me.role === "user" && <NavbarUser logOut={logOut} />}
              {me.role === "admin" && <NavbarAdmin logOut={logOut} />}
            </>
          ) : (
            <NavbarPublic />
          )}
        </>
      )}
      <main>
        <Routes>
          {/* ========== RUTAS PÚBLICAS (sin login requerido) ========== */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomeRoute />} />
          <Route
            path="/login"
            element={<Login_Registro setLogin={setLogin} setMe={setMe} />}
          />
          <Route path="/donaciones" element={<Donaciones />} />

          {/* ========== RUTAS DE ANIMALES (PROTEGIDAS - solo para usuarios autenticados) ========== */}
          <Route
            path="/animales"
            element={
              <ProtectedRoute
                requireLogin={true}
                allowedRoles={["user", "admin"]}
              >
                <AllDogsUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/animales/:id"
            element={
              <ProtectedRoute
                requireLogin={true}
                allowedRoles={["user", "admin"]}
              >
                <OneDogUser />
              </ProtectedRoute>
            }
          />

          {/* Alias para compatibilidad - también protegidos */}
          <Route
            path="/perros"
            element={
              <ProtectedRoute
                requireLogin={true}
                allowedRoles={["user", "admin"]}
              >
                <AllDogsUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perro/:id"
            element={
              <ProtectedRoute
                requireLogin={true}
                allowedRoles={["user", "admin"]}
              >
                <OneDogUser />
              </ProtectedRoute>
            }
          />

          {/* ========== RUTAS DE FORMULARIOS (requieren login y rol user) ========== */}

          {/* RUTA ESPECÍFICA PARA ADOPCIÓN - Usando Form.jsx */}
          <Route
            path="/formulario/adopcion"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["user"]}>
                <Form />
              </ProtectedRoute>
            }
          />

          {/* RUTA ESPECÍFICA PARA TRÁNSITO - Usando FormTransit.jsx */}
          <Route
            path="/formulario/transito"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["user"]}>
                <FormTransit />
              </ProtectedRoute>
            }
          />

          {/* ========== RUTA DE ACTIVIDADES (nueva) ========== */}
          <Route
            path="/actividades"
            element={
              <ProtectedRoute
                requireLogin={true}
                allowedRoles={["user", "admin"]}
              >
                <Actividades />
              </ProtectedRoute>
            }
          />

          {/* Rutas de compatibilidad */}
          <Route
            path="/formulario"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["user"]}>
                <Navigate to="/formulario/adopcion" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transito"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["user"]}>
                <Navigate to="/formulario/transito" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/adoptar"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["user"]}>
                <Navigate to="/formulario/adopcion" replace />
              </ProtectedRoute>
            }
          />

          {/* ========== OTRAS RUTAS DE USUARIO ========== */}
          <Route
            path="/donaciones"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["user"]}>
                <Donaciones />
              </ProtectedRoute>
            }
          />

          <Route
            path="/correo"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["user"]}>
                <CorreoArgentino />
              </ProtectedRoute>
            }
          />

          {/* ========== RUTAS DE ADMIN (requieren login y rol admin) ========== */}
          <Route
            path="/homeadmin"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["admin"]}>
                <AllDogsAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/homeadmin/todos"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["admin"]}>
                <AllDogsAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/homeadmin/postulaciones"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["admin"]}>
                <AllDogsPostulaciones />
              </ProtectedRoute>
            }
          />

          <Route
            path="/homeadmin/adoptados"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["admin"]}>
                <AllDogsAdoptados />
              </ProtectedRoute>
            }
          />

          <Route
            path="/homeadmin/perro/:id"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["admin"]}>
                <OneDogAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/homeadmin/perro/:id/postulaciones"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["admin"]}>
                <OneDogPostulaciones />
              </ProtectedRoute>
            }
          />

          <Route
            path="/homeadmin/perro/:id/postulacion/:postulacionId"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["admin"]}>
                <OnePostulacion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agregarPerro"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["admin"]}>
                <AddDog
                  listaPerros={listaPerros}
                  setListaPerros={setListaPerros}
                  me={me}
                  logOut={logOut}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagos"
            element={
              <ProtectedRoute requireLogin={true} allowedRoles={["admin"]}>
                <PagosAdmin />
              </ProtectedRoute>
            }
          />

          {/* ========== RUTA PARA 404 ========== */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </main>

      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
