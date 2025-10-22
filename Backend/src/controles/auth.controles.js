import Usuario from "../modelos/usuario.modelo.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import Rol from "../modelos/roles.js";

export const registrarUsuario = async (req,res)=> {
    // Datos del usuario a registrar
    const {email, contra, nombre, direccion, telefono, roles, nombreEmpresa, direccionEmpresa, telefonoContacto, rutEmpresa, nombrePropietario} = req.body;
    console.log(`[REGISTER] attempt email=${email} nombre=${nombre} roles=${roles ? JSON.stringify(roles) : 'default'}`);
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
            estado: "Inactivo",
            // Campos de empresa
            nombreEmpresa: nombreEmpresa || undefined,
            direccionEmpresa: direccionEmpresa || undefined,
            telefonoContacto: telefonoContacto || undefined,
            rutEmpresa: rutEmpresa || undefined,
            nombrePropietario: nombrePropietario || undefined,
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
        console.log(`[REGISTER] created user id=${userSaved._id} email=${userSaved.email}`);

        // Devolver un único response con status 201 y mensaje amigable
        return res.status(201).json({
            message: "Su cuenta empresarial ha sido creada y quedará en revisión. Un administrador validará los datos de la empresa (nombre, RUT, dirección y contacto) y le notificará cuando la cuenta sea activada.",
            user: {
                id: userSaved._id,
                nombre: userSaved.nombre,
                email: userSaved.email,
                roles: userSaved.roles,
                createdAt: userSaved.createdAt,
            }
        });

    }   catch(error){
        console.error("Error en registrarUsuario:", error);
        res.status(500).json({ success: false, message: error.message || "Error interno del servidor" })
    }
};

// Login de usuario existente 
export const loginUsuario = async (req,res)=> {

    // Datos del usuario
    const {email,contra}=req.body;

    try{
        console.log(`[LOGIN] attempt email=${email}`);

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

    // Configurar opciones de cookie. En producción, establecer secure: true y asegurar que FRONTEND_ORIGIN sea https.
        const cookieOptions = {
            httpOnly: true,
            // permitir que la cookie cross-site sea enviada desde el frontend (withCredentials:true)
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

    res.cookie("token", token, cookieOptions);

    // Registrar que se estableció la cookie (no registrar el contenido del token)
    console.log(`[LOGIN] success user=${userFound._id} cookieSet sameSite=${cookieOptions.sameSite} secure=${cookieOptions.secure}`);

    // Devolver datos del usuario (evitar enviar el token en el body)
    res.json({
            id: userFound._id,
            nombre: userFound.nombre,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updateAt: userFound.updatedAt,
            roles: userFound.roles
            
        });
    }   catch(error){
        console.error("Error en loginUsuario:", error);
        res.status(500).json({ success: false, message: error.message || "Error interno del servidor" });
    }
};

export const cerrarSesion = async(req, res)=>{
    console.log(`[LOGOUT] request cookies present=${!!req.cookies?.token}`);
    // Expire cookie using same options to ensure browser removes it
    const cookieOptions = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    };
    res.cookie("token", "", { ...cookieOptions, expires: new Date(0) });
    console.log('[LOGOUT] cookie cleared');
    return res.sendStatus(200);
}


export const verificarToken= async(req, res)=> {
    // Leer el token de las cookies
    const {token} = req.cookies
    console.log(`[VERIFY] token present=${!!token}`);
    // Verificar si el token existe
    if (!token) return res.status(401).json({message:"No autorizado"});
    // Verificar si el token es válido
    jwt.verify(token, TOKEN_SECRET, async(err, user) =>{
        if(err) return res.status(401).json ({message: "No autorizado"});
        // Buscar el usuario por id
        const userFound = await Usuario.findById(user.id).populate("roles");
        console.log(`[VERIFY] token valid for user=${user.id}`);
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
        console.log(`[ADMIN] user=${req.user?.id} activating=${req.params.id}`);
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { estado: "Activo" },
            { new: true }
        );
        // Si no se encuentra el usuario
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
        
        res.json({ message: "Usuario activado con éxito", usuario });
    } catch (error) {
        console.error("Error en activarUsuario:", error);
        res.status(500).json({ success: false, message: "Error al activar usuario", error });
    }
};

export const obtenerUsuariosPendientes = async (req, res) => {
    try {
        console.log(`[ADMIN] user=${req.user?.id} requesting pending users`);
        const usuarios = await Usuario.find({ estado: "Inactivo" })
            .select("nombre email direccion telefono estado roles createdAt nombreEmpresa direccionEmpresa telefonoContacto rutEmpresa nombrePropietario")
            .populate("roles");
        console.log(`[ADMIN] pending count=${usuarios.length}`);
        return res.json({ usuarios });
    } catch (error) {
        console.error("Error en obtenerUsuariosPendientes:", error);
        return res.status(500).json({ success: false, message: "Error al obtener usuarios pendientes", error });
    }
};

export const obtenerTodosUsuarios = async (req, res) => {
    try {
        console.log(`[ADMIN] user=${req.user?.id} requesting all users`);
        const usuarios = await Usuario.find({})
            .select("nombre email direccion telefono estado roles createdAt nombreEmpresa direccionEmpresa telefonoContacto rutEmpresa nombrePropietario")
            .populate("roles");
        console.log(`[ADMIN] total users=${usuarios.length}`);
        return res.json({ usuarios });
    } catch (error) {
        console.error("Error en obtenerTodosUsuarios:", error);
        return res.status(500).json({ success: false, message: "Error al obtener usuarios", error });
    }
};

export const desactivarUsuario = async (req, res) => {
    // Desactivar un usuario por su ID
    try {
        console.log(`[ADMIN] user=${req.user?.id} deactivating=${req.params.id}`);
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { estado: "Inactivo" },
            { new: true }
        );
        // Si no se encuentra el usuario
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
        
        res.json({ message: "Usuario desactivado con éxito", usuario });
    } catch (error) {
        console.error("Error en desactivarUsuario:", error);
        res.status(500).json({ success: false, message: "Error al desactivar usuario", error });
    }
};