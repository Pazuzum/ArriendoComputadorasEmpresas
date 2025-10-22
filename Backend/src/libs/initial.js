import Rol from "../modelos/roles.js"
import Producto from "../modelos/producto.modelo.js"


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

export const crearProductosIniciales = async () => {
    try{
        const count = await Producto.estimatedDocumentCount();
        if (count > 0) return;
        const productos = [
            { nombre: 'NOTEBOOK DELL CORE I5', descripcion: '8GB RAM, 256GB SSD', precio: 45000, disponibilidad: 40 },
            { nombre: 'NOTEBOOK HP', descripcion: '8GB RAM, 256GB SSD', precio: 40000, disponibilidad: 40 },
            { nombre: 'TORRE GAMING', descripcion: '16GB RAM, 1TB SSD', precio: 65000, disponibilidad: 40 },
        ];
        await Producto.insertMany(productos);
        console.log('Productos iniciales creados');
    }catch(e){
        console.error('Error creando productos iniciales', e)
    }
}