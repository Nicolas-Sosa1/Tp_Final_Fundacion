import dotenv from 'dotenv';
dotenv.config();

const getCorreoService = () => {
  const useMock = process.env.USE_MOCK_CORREO === 'true' || 
                 !process.env.CORREO_USERNAME || 
                 process.env.CORREO_USERNAME === 'tu_usuario_correo';
  
  if (useMock) {
    console.log('🔧 Usando servicio MOCK de Correo Argentino');
    return import('./correoMock.service.js');
  } else {
    console.log('🚚 Usando servicio REAL de Correo Argentino');
    return import('./correoService.js');
  }
};

export default getCorreoService;