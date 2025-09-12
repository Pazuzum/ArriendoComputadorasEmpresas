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
    direccion: z.string({
        required_error:"La direccion es requerida"
    }),
    telefono: z.string({
        required_error:"El número es requerido"
    }).max(9,{
        message:"El número debe tener 9 digitos"
    }),
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