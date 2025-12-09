const correoConfig = {
  entornos: {
    desarrollo: {
      urlBase:
        process.env.CORREO_DEV_URL ||
        "https://apitest.correoargentino.com.ar/micorreo/v1",
    },
    produccion: {
      urlBase:
        process.env.CORREO_PROD_URL ||
        "https://api.correoargentino.com.ar/micorreo/v1",
    },
  },

  codigosProvincia: {
    A: "Salta",
    B: "Buenos Aires",
    C: "CABA",
    D: "San Luis",
    E: "Entre Ríos",
    F: "La Rioja",
    G: "Santiago del Estero",
    H: "Chaco",
    J: "San Juan",
    K: "Catamarca",
    L: "La Pampa",
    M: "Mendoza",
    N: "Misiones",
    P: "Formosa",
    Q: "Neuquén",
    R: "Río Negro",
    S: "Santa Fe",
    T: "Tucumán",
    U: "Chubut",
    V: "Tierra del Fuego",
    W: "Corrientes",
    X: "Córdoba",
    Y: "Jujuy",
    Z: "Santa Cruz",
  },

  tiposEntrega: {
    D: "Domicilio",
    S: "Sucursal",
  },

  tiposDocumento: {
    DNI: "DNI",
    CUIT: "CUIT",
  },

  tiposProducto: {
    CP: "Correo Clásico",
  },
};

export default correoConfig;
