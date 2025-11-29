import Usuario from '../modelos/usuario.modelo.js'

export const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select('-contra')
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        
        return res.json(usuario)
    } catch (error) {
        console.error('Error al obtener perfil:', error)
        return res.status(500).json({ message: 'Error al obtener perfil', error: error.message })
    }
}

export const actualizarPerfil = async (req, res) => {
    try {
        const { nombre, email, telefono, telefonoContacto, direccion } = req.body

        if (email && email !== req.user.email) {
            const emailExiste = await Usuario.findOne({ email, _id: { $ne: req.user.id } })
            if (emailExiste) {
                return res.status(400).json({ message: 'El email ya está registrado por otro usuario' })
            }
        }

        const actualizacion = {}
        if (nombre !== undefined) actualizacion.nombre = nombre
        if (email !== undefined) actualizacion.email = email
        if (telefono !== undefined) actualizacion.telefono = telefono
        if (telefonoContacto !== undefined) actualizacion.telefonoContacto = telefonoContacto
        if (direccion !== undefined) actualizacion.direccion = direccion

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.user.id,
            actualizacion,
            { new: true, runValidators: true }
        ).select('-contra')

        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        return res.json({
            message: 'Perfil actualizado exitosamente',
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.error('Error al actualizar perfil:', error)
        return res.status(500).json({ message: 'Error al actualizar perfil', error: error.message })
    }
}