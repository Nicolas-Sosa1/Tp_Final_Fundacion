import mongoose from "mongoose";

const envioSchema = new mongoose.Schema({

  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  
  idCliente: {
    type: String,
    required: true
  },
  idEnvioCorreo: {
    type: String
  },

  idPedidoExterno: {
    type: String,
    required: true,
    unique: true
  },
  numeroOrden: {
    type: String
  },
  
  
  remitente: {
    nombre: String,
    telefono: String,
    celular: String,
    email: String,
    direccionOrigen: {
      calle: String,
      numero: String,
      piso: String,
      departamento: String,
      ciudad: String,
      codigoProvincia: String,
      codigoPostal: String
    }
  },
  
  
  destinatario: {
    nombre: {
      type: String,
      required: true
    },
    telefono: String,
    celular: String,
    email: {
      type: String,
      required: true
    }
  },
  

  envio: {
    tipoEntrega: {
      type: String,
      enum: ['D', 'S'],
      required: true
    },
    tipoProducto: {
      type: String,
      default: 'CP'
    },
    sucursal: String,
    direccion: {
      calle: String,
      numero: String,
      piso: String,
      departamento: String,
      ciudad: String,
      codigoProvincia: String,
      codigoPostal: String
    },
    peso: {
      type: Number,
      required: true
    },
    valorDeclarado: {
      type: Number,
      required: true
    },
    alto: {
      type: Number,
      required: true
    },
    largo: {
      type: Number,
      required: true
    },
    ancho: {
      type: Number,
      required: true
    }
  },
  
  
  estado: {
    type: String,
    enum: ['pendiente', 'importado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  
  seguimiento: {
    numeroSeguimiento: String,
    eventos: [{
      evento: String,
      fecha: Date,
      sucursal: String,
      estado: String,
      firma: String
    }],
    ultimaActualizacion: Date
  },
  
  cotizacion: {
    precio: Number,
    tiempoEntregaMin: Number,
    tiempoEntregaMax: Number,
    nombreProducto: String,
    validoHasta: Date
  }
}, { 
  timestamps: true 
});


envioSchema.index({ usuarioId: 1 });
envioSchema.index({ idPedidoExterno: 1 });
envioSchema.index({ estado: 1 });
envioSchema.index({ 'seguimiento.numeroSeguimiento': 1 });

const Envio = mongoose.model("Envio", envioSchema);

export default Envio;