// server.js - YA ESTÁ CORRECTO
import express from 'express'
import connectToDb from './config/databaseConnect.js';
import dotenv from 'dotenv'
import cors from 'cors'

// ✅ Importar rutas
import usersRoutes from './routes/users.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import correoRoutes from './routes/Correo.routes.js'
import animalsRoutes from './routes/animals.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import vacunasRoutes from './routes/vacunas.routes.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8000;

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

connectToDb();

// ✅ Montar rutas - YA ESTÁN CORRECTAS
app.use("/api/users", usersRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/correo", correoRoutes)
app.use("/api/animals", animalsRoutes)
app.use("/api/solicitudes", solicitudesRoutes)
app.use("/api/vacunas", vacunasRoutes)

// ... resto del código
// Ruta de estado general
app.get('/estado', (req, res) => {
  res.json({
    estado: 'OK',
    fecha: new Date().toISOString(),
    servicio: 'API Fundación',
    ambiente: process.env.NODE_ENV || 'desarrollo',
    version: '1.0.0'
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Fundación Huellas Sin Techo',
    version: '1.0.0',
    rutas_disponibles: {
      usuarios: '/api/users',
      pagos: '/api/payment',
      correo: '/api/correo',
      animales: '/api/animals',
      solicitudes: '/api/solicitudes',
      vacunas: '/api/vacunas',
      formularios: '/api/form',
      estado: '/estado'
    }
  });
});

// Middleware para manejar errores 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Middleware para manejar errores generales
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Error del servidor'
    });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'desarrollo'}`)
  console.log(`🌐 URL: http://localhost:${PORT}`)
  console.log(`🔍 Verificar estado: http://localhost:${PORT}/estado`)
});