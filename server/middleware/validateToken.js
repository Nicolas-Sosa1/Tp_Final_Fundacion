import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

const validateToken = (req, res, next) => {
    try {
        console.log("\n" + "=".repeat(60));
        console.log(`🔍 [${new Date().toISOString()}] Validating token for: ${req.method} ${req.originalUrl}`);
        console.log("📨 Headers recibidos:");
        console.log("  - Authorization:", req.headers.authorization ? `Present (${req.headers.authorization.substring(0, 30)}...)` : "Missing");
        console.log("  - token_user:", req.headers.token_user ? `Present (${req.headers.token_user.substring(0, 20)}...)` : "Missing");
        console.log("  - Origin:", req.headers.origin || "Missing");

        let token = null;

        // Opción 1: Bearer token
        if (req.headers.authorization) {
            const parts = req.headers.authorization.split(" ");
            if (parts.length === 2 && parts[0] === "Bearer") {
                token = parts[1];
                console.log("✅ Token obtenido de Authorization header");
            }
        }

        // Opción 2: token_user header
        if (!token && req.headers.token_user) {
            token = req.headers.token_user;
            console.log("✅ Token obtenido de token_user header");
        }

        // Opción 3: Query parameter (para debugging)
        if (!token && req.query.token) {
            token = req.query.token;
            console.log("⚠️ Token obtenido de query parameter (solo para debugging)");
        }

        if (!token) {
            console.log("❌ ERROR: No se proporcionó token");
            return res.status(401).json({
                success: false,
                message: "Token de autenticación requerido",
                help: "Incluye el token en el header 'Authorization: Bearer <token>' o 'token_user: <token>'"
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, SECRET);
        console.log("✅ Token válido. Usuario decodificado:", {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        });

        // Asignar información al request
        req.user = decoded;
        req.infoUser = decoded;
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.userRole = decoded.role;

        console.log("✅ Middleware validateToken completado exitosamente");
        console.log("=".repeat(60) + "\n");

        next();

    } catch (error) {
        console.error("\n❌ ERROR en validateToken:", error.message);
        console.error("Stack:", error.stack);
        
        let msg = "Token inválido";
        let status = 401;
        
        if (error.name === "TokenExpiredError") {
            msg = "Token expirado. Por favor, inicia sesión nuevamente.";
        } else if (error.name === "JsonWebTokenError") {
            msg = "Token malformado";
        }
        
        return res.status(status).json({
            success: false,
            message: msg,
            error: error.message
        });
    }
};

export default validateToken;