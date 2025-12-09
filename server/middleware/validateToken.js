// file: middleware/validateToken.js (MEJORADO)
import jwt from 'jsonwebtoken'

const SECRET = process.env.SECRET;

const validateToken = (req, res, next) => {
    try {
        const { token_user } = req.headers;
        
        console.log('🔍 Validating token for route:', req.originalUrl);
        
        if (!token_user) {
            console.log('❌ No token provided');
            return res.status(401).json({
                success: false,
                message: "Token requerido"
            });
        }
       
        // Verificar el token
        const decoded = jwt.verify(token_user, SECRET);
        
        console.log('✅ Token decodificado:', decoded);
        
        // Adjuntar información del usuario en múltiples lugares para compatibilidad
        req.user = decoded;           // Forma estándar
        req.infoUser = decoded;       // Para compatibilidad con código existente
        
        // Propiedades específicas para fácil acceso
        req.userId = decoded.id; 
        req.userEmail = decoded.email;
        req.userRole = decoded.role;
        req.userName = decoded.name || decoded.nombre; // Si existe

        console.log('✅ Usuario autenticado:', {
            id: req.userId,
            email: req.userEmail,
            role: req.userRole,
            name: req.userName
        });
        
        next();
        
    } catch (error) {
        console.error('❌ Error en validateToken:', error.message);
        
        let errorMessage = "Token inválido";
        let statusCode = 401;
        
        if (error.name === 'TokenExpiredError') {
            errorMessage = "Token expirado";
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = "Token inválido";
        } else {
            statusCode = 500;
            errorMessage = "Error interno del servidor";
        }
        
        return res.status(statusCode).json({ 
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export default validateToken;