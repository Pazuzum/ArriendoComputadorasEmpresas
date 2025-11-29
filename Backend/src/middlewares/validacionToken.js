import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'
import Usuario from '../modelos/usuario.modelo.js'
import Rol from '../modelos/roles.js'

export const authRequired = (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ message: 'No tiene token, acceso denegado' })
    }

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({ message: 'Token invalido' })
        }

        req.user = user
        next()
    })
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await Usuario.findById(req.user.id)
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        const roles = await Rol.find({ _id: { $in: user.roles } })

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].nombre === 'admin') {
                next()
                return
            }
        }

        return res.status(403).json({ message: 'Se requiere el rol de Admin' })
    } catch (error) {
        console.error('Error en isAdmin:', error)
        return res.status(500).json({ message: 'Error al verificar permisos' })
    }
}