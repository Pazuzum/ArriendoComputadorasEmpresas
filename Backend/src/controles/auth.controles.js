import Usuario from "../modelos/usuario.modelo.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import Rol from "../modelos/roles.js";

export const registrarUsuario = async (req,res)=> {
    // Datos del usuario a registrar
    const {email, contra, nombre, direccion, telefono, roles}=req.body
    try{
        // Verificar si el usuario ya existe en la base de datos por email
        const userFound= await Usuario.findOne({email});
        if(userFound)
            return res.status(400).json(["El correo ya esta en uso"]);
        // Encriptar la contraseña
        const ContraHash= await bcrypt.hash(contra, 8)
        // Crear un nuevo usuario
        const newUser= new Usuario({
            nombre,
            email,
            contra: ContraHash,
            direccion,
            telefono,
            estado: "Inactivo"
        })
        // Asignar roles al usuario
        if (roles){
            const foundrol= await Rol.find({nombre: {$in: roles}})
            newUser.roles = foundrol.map(rol=> rol._id)
        }else{
            const rol= await Rol.findOne({nombre: "usuario"})
            newUser.roles= [rol._id]
        }
        // Guardar el usuario en la base de datos
        const userSaved= await newUser.save();
        
        res.json({
            id: userSaved._id,
            nombre: userSaved.nombre,
            email: userSaved.email,
            roles: userSaved.roles,
            createdAt: userSaved.createdAt,
            updateAt: userSaved.updatedAt
            
        })

        res.status(201).json({
            message:"Tu cuenta fue creada con éxito, un administrador está revisando tus datos.",
        });

    }   catch(error){
        res.status(500).json({message: error.message })
    }
};

// Login de usuario existente 
export const loginUsuario = async (req,res)=> {

    // Datos del usuario
    const {email,contra}=req.body;

    try{

        // Buscar usuario en la base de datos por email 
        const userFound= await Usuario.findOne({email})
            .populate("roles");
        if (!userFound) return res.status(400).json({message: "No tienes una cuenta creada"});
        // Comparar contraseñas
        const isMatch = await bcrypt.compare(contra, userFound.contra);

        if(!isMatch) return res.status(400).json({message:"Contraseña incorrecta"});
        
        // Verificar si el usuario está activo

        if (userFound.estado === "Inactivo") {
            return res.status(403).json({
                message: "Tu cuenta aún está en revisión. Un administrador debe activarla.",
            });
        }

        const token= await createAccessToken({id: userFound._id});

        res.cookie("token", token);
        res.json({
            id: userFound._id,
            nombre: userFound.nombre,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updateAt: userFound.updatedAt,
            roles: userFound.roles
            
        });
    }   catch(error){
        res.status(500).json({message: error.message });
    }
};

export const cerrarSesion = async(req, res)=>{
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
}


export const verificarToken= async(req, res)=> {
    // Leer el token de las cookies
    const {token} = req.cookies
    // Verificar si el token existe
    if (!token) return res.status(401).json({message:"No autorizado"});
    // Verificar si el token es válido
    jwt.verify(token, TOKEN_SECRET, async(err, user) =>{
        if(err) return res.status(401).json ({message: "No autorizado"});
        // Buscar el usuario por id
        const userFound = await Usuario.findById(user.id).populate("roles");
        // Si no se encuentra el usuario
        if (!userFound) return res.status(401).json ({message: "No autorizado"});

        return res.json({
            id: userFound._id,
            username: userFound.nombre,
            email: userFound.email,
            roles: userFound.roles

        });
    });
};

export const activarUsuario = async (req, res) => {
    // Activar un usuario por su ID
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { estado: "Activo" },
            { new: true }
        );
        // Si no se encuentra el usuario
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
        
        res.json({ message: "Usuario activado con éxito", usuario });
    } catch (error) {
        res.status(500).json({ message: "Error al activar usuario", error });
    }
};