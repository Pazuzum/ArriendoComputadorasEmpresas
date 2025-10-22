import mongoose from "mongoose";

const usuarioSchema= new mongoose.Schema({
    nombre:{
        type:String,
        require: true,
        trim: true,
    },
    // Datos de la empresa (requeridos para cuentas de empresa)
    nombreEmpresa: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type:String,
        required: true,
        trim: true,
        unique:true,
    },
    contra: {
        type:String,
        required:true,
    },
    direccion: {
        type:String,
        required:false,
    },
    // Información de contacto general
    telefono: {
        type:String,
        required:false,
    },
    // Datos de contacto de la empresa
    telefonoContacto: {
        type: String,
        required: false,
    },
    rutEmpresa: {
        type: String,
        required: false,
    },
    nombrePropietario: {
        type: String,
        required: false,
    },
    roles:[{
        ref: "Rol",
        type: mongoose.Schema.Types.ObjectId
    }],
    estado:{
        type: String,
        enum: ["Activo","Inactivo"],
        default: "Inactivo"
    }
},{
    timestamps:true,
    versionKey: false
})

export default mongoose.model("Usuario",usuarioSchema)