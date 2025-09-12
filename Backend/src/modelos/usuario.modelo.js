import mongoose from "mongoose";

const usuarioSchema= new mongoose.Schema({
    nombre:{
        type:String,
        require: true,
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
        required:true,
    },
    telefono: {
        type:String,
        required:true,
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