import Rol from "../modelos/roles.js"


export const crearRoles= async () => {
    try {
        const count= await Rol.estimatedDocumentCount();

        if (count > 0) return;
    
        const values= await Promise.all([
            new Rol({nombre: "usuario"}).save(),
            new Rol({nombre: "admin"}).save(),
        ]);
    
        console.log(values);
    } catch (error) {
        console.error(error);
    }
};