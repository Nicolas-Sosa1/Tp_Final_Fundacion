import jwt from 'jsonwebtoken'

const SECRET = process.env.SECRET;

const validateToken = (req, res, next) => {
    try {
        const { token_user } = req.headers;
        
        if (!token_user) {
            return res.status(401).json({
                success: false,
                message: "Token requerido",
                instructions: "Incluye el token en el header: token_user: tu_token_jwt"
            });
        }
       
        jwt.verify(token_user, SECRET, (err, decoded) => {
            if (err) {
                console.error('Error verificando token:', err.message);
                
                let errorMessage = "Not allowed";
                if (err.name === 'TokenExpiredError') {
                    errorMessage = "Token expirado";
                } else if (err.name === 'JsonWebTokenError') {
                    errorMessage = "Token inválido";
                }
                
                return res.status(401).json({
                    success: false,
                    message: errorMessage,
                    error: err.message
                });
            }
            
            req.infoUser = decoded;
            req.userId = decoded.id; 
            req.userEmail = decoded.email;
            req.userRole = decoded.role;

            
            console.log('Usuario autenticado:', {
                id: req.userId,
                email: req.userEmail,
                role: req.userRole
            });
            
            next();
        });
        
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        return res.status(500).json({ 
            success: false,
            message: "Error interno del servidor"
        });
    }
}


export default validateToken;