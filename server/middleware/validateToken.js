import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET;

const validateToken = (req, res, next) => {
  try {
    console.log("📌 Validando token...");
    console.log("Headers recibidos:", req.headers);

    // OPCIÓN 1: Buscar token en Authorization header
    const authHeader = req.headers.authorization;

    // OPCIÓN 2: Buscar token en token_user header (para compatibilidad)
    const tokenFromCustomHeader = req.headers.token_user;

    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("✅ Token encontrado en Authorization header");
    } else if (tokenFromCustomHeader) {
      token = tokenFromCustomHeader;
      console.log("✅ Token encontrado en token_user header");
    } else {
      console.log("❌ No se encontró token en ningún header");
      return res.status(401).json({
        success: false,
        error: "Token de autorización requerido",
      });
    }

    if (!token || token === "null" || token === "undefined") {
      console.log("❌ Token vacío o inválido");
      return res.status(401).json({
        success: false,
        error: "Token no proporcionado o inválido",
      });
    }

    console.log("📋 Token a verificar:", token.substring(0, 20) + "...");

    const decoded = jwt.verify(token, SECRET);

    console.log("✅ Token válido. Usuario:", decoded.email);

    // Asegurarse de que req.userId esté disponible
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    req.infoUser = decoded; // Para compatibilidad

    console.log("📋 Datos del usuario decodificados:", {
      id: req.userId,
      email: req.userEmail,
      role: req.userRole,
    });

    next();
  } catch (error) {
    console.error("❌ Error al validar token:", error.message);
    console.error("Tipo de error:", error.name);

    let errorMessage = "Token inválido";
    if (error.name === "TokenExpiredError") {
      errorMessage = "Token expirado";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Token inválido";
    }

    return res.status(401).json({
      success: false,
      error: errorMessage,
      details: error.message,
    });
  }
};

export default validateToken;
