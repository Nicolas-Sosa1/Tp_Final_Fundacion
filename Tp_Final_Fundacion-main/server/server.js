import express from 'express'
import connectToDb from './config/databaseConnect.js';
import dotenv from 'dotenv'
import cors from 'cors'
import usersRoutes from './routes/users.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import correoRoutes from './routes/Correo.routes.js'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


connectToDb();

app.use("/api/users", usersRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/correo", correoRoutes)

// Ruta de estado general
app.get('/estado', (req, res) => {
  res.json({
    estado: 'OK',
    fecha: new Date().toISOString(),
    servicio: 'API Fundación',
    ambiente: process.env.NODE_ENV || 'desarrollo'
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Fundación con Correo Argentino',
    version: '1.0.0',
    rutas: {
      usuarios: '/api/usuarios',
      pagos: '/api/pagos',
      correo: '/api/correo',
      estado: '/estado'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'desarrollo'}`)
  console.log(`🌐 Verificar estado: http://localhost:${PORT}/estado`)
})