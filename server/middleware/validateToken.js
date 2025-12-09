import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

const validateToken = (req, res, next) => {
    try {
        console.log("🔍 Validating token for route:", req.originalUrl);

        // 👉 Obtener token desde Authorization: Bearer xxx
        let token = null;

        if (req.headers.authorization) {
            const parts = req.headers.authorization.split(" ");
            if (parts.length === 2 && parts[0] === "Bearer") {
                token = parts[1];
            }
        }

        // 👉 Obtener token desde token_user (modo viejo)
        if (!token && req.headers.token_user) {
            token = req.headers.token_user;
        }

        // 👉 Si no hay token, cortar acá
        if (!token) {
            console.log("❌ No token provided");
            return res.status(401).json({
                success: false,
                message: "Token requerido"
            });
        }

        // 👉 Verificar token
        const decoded = jwt.verify(token, SECRET);

        console.log("✅ Token decodificado:", decoded);

        req.user = decoded;
        req.infoUser = decoded;
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.userRole = decoded.role;

        next();

    } catch (error) {
        console.error("❌ Error en validateToken:", error.message);

        let msg = "Token inválido";
        if (error.name === "TokenExpiredError") msg = "Token expirado";

        return res.status(401).json({
            success: false,
            message: msg
        });
    }
};

export default validateToken;