import {z} from "zod";

export const registerSchema= z.object({
    nombre: z.string({
        required_error:"El nombre es requerido"
    }),
    email: z.string({
        required_error: "El correo es requerido"
    }).email("El correo no tiene un formato valido"),
    contra:z.string({
        required_error:"La contraseña es requerida"
    })
    .min(8, {
        message:"La contraseña debe tener al menos 8 caracteres"
    }),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    // Company fields (required for enterprise accounts)
    nombreEmpresa: z.string({ required_error: 'El nombre de la empresa es requerido' }),
    rutEmpresa: z.string({ required_error: 'El RUT de la empresa es requerido' }),
    direccionEmpresa: z.string({ required_error: 'La dirección de la empresa es requerida' }),
    telefonoContacto: z.string({ required_error: 'El teléfono de contacto es requerido' }),
    roles: z.array(z.string()).optional({
        required_error:"El rol es requerido"
    })
})

export const loginSchema= z.object({
    email:z.string({
        required_error:"El correo es requerido"
    }).email({
        message:"Correo invalidado",
    }),
    contra:z.string({
        required_error:"La contraseña es requerida"
    }).min(8, {
        message:"La contraseña debe tener al menos 8 caracteres"
    })
})