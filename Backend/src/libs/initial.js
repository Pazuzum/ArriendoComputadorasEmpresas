import Rol from '../modelos/roles.js'
import Producto from '../modelos/producto.modelo.js'

export const crearRoles = async () => {
    try {
        const count = await Rol.estimatedDocumentCount()

        if (count > 0) return

        const values = await Promise.all([
            new Rol({ nombre: 'usuario' }).save(),
            new Rol({ nombre: 'admin' }).save(),
        ])

        console.log('Roles creados:', values)
    } catch (error) {
        console.error('Error al crear roles:', error)
    }
}

export const crearProductosIniciales = async () => {
    try {
        const count = await Producto.estimatedDocumentCount()
        
        if (count > 0) return

        const productos = [
            { 
                nombre: 'NOTEBOOK DELL CORE I5', 
                descripcion: '8GB RAM, 256GB SSD, Pantalla 15.6"', 
                precio: 45000, 
                disponibilidad: 40,
                imgs: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop'
                ]
            },
            { 
                nombre: 'NOTEBOOK HP RYZEN 5', 
                descripcion: '8GB RAM, 256GB SSD, Pantalla 14"', 
                precio: 40000, 
                disponibilidad: 40,
                imgs: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&h=400&fit=crop'
                ]
            },
            { 
                nombre: 'TORRE GAMING RGB', 
                descripcion: '16GB RAM, 1TB SSD, RTX 3060', 
                precio: 65000, 
                disponibilidad: 40,
                imgs: [
                    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=400&fit=crop'
                ]
            },
        ]

        await Producto.insertMany(productos)
        console.log('Productos iniciales creados exitosamente')
    } catch (error) {
        console.error('Error al crear productos iniciales:', error)
    }
}