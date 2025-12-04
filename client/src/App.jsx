import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Login from "./views/Login";
import Register from "./views/Register";

import Home from "./views/user/Home";
import Donar from "./views/user/Donar";
import CorreoArgentino from "./views/user/CorreoArgentino";

import HomeAdmin from "./views/admin/HomeAdmin";
import DogPostulacionesPage from "./views/admin/DogPostulacionesPage";
import PostulacionDetallePage from "./views/admin/PostulacionDetallePage";
import NewAnimal from "./views/admin/NewAnimal";
import UpdateAnimal from "./views/admin/UpdateAnimal";
import PagosAdmin from "./views/admin/PagosAdmin";

import NavbarAdmin from "./components/NavbarAdmin";
import NavbarPublic from "./components/NavbarPublic";
import NavbarUser from "./components/NavbarUser";

function App() {
  const [listaPerros, setListaPerros] = useState([]);
  const [login, setLogin] = useState(false);
  const [me, setMe] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token_user");
    if (token) {
      const decoded = jwtDecode(token);
      setMe(decoded);
      setLogin(true);
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("token_user");
    setLogin(false);
    setMe({});
    navigate("/login");
  };

  return (
    <>
      {login ? (
        <>
          {me.role === "user" && (
            <>
              <NavbarUser logOut={logOut} />
            </>
          )}

          {me.role === "admin" && (
            <>
              <NavbarAdmin logOut={logOut} />
            </>
          )}
        </>
      ) : (
        <>
          <NavbarPublic />
        </>
      )}

      <main>
        <Routes>
          <Route path="/login" element={<Login setLogin={setLogin} />} />
          <Route path="/register" element={<Register setLogin={setLogin} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/donar" element={<Donar />} />
          <Route
            path="/correo"
            element={
              login ? <CorreoArgentino me={me} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/agregarPerro"
            element={
              login && me.role === "admin" ? (
                <NewAnimal
                  listaPerros={listaPerros}
                  setListaPerros={setListaPerros}
                  me={me}
                  logOut={logOut}
                />
              ) : (
                <Navigate to="/home" />
              )
            }
          />
          <Route
            path="/perro/update/:id"
            element={
              login && me.role === "admin" ? (
                <UpdateAnimal
                  listaPerros={listaPerros}
                  setListaPerros={setListaPerros}
                  setLogin={setLogin}
                  logOut={logOut}
                />
              ) : (
                <Navigate to="/home" />
              )
            }
          />
          <Route
            path="/pagos"
            element={
              login && me.role === "admin" ? (
                <PagosAdmin />
              ) : (
                <Navigate to="/home" />
              )
            }
          />
          <Route path="/homeadmin" element={<HomeAdmin />} />

          <Route
            path="/homeadmin/:perroId"
            element={<DogPostulacionesPage />}
          />

          <Route
            path="/homeadmin/:perroId/postulacion/:postulacionId"
            element={<PostulacionDetallePage />}
          />

          <Route
            path="/pagos"
            element={
              login && me.role === "admin" ? (
                <PagosAdmin />
              ) : (
                <Navigate to="/home" />
              )
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
