import mongoose from 'mongoose';
import Reserva from './src/modelos/reserva.modelo.js';

async function eliminarTodasLasReservas() {
    try {
        await mongoose.connect('mongodb://localhost:27017/rentpc-db');
        console.log('📡 Conectado a MongoDB');
        
        const resultado = await Reserva.deleteMany({});
        console.log(`✅ Eliminadas ${resultado.deletedCount} reservas`);
        
        await mongoose.connection.close();
        console.log('👋 Conexión cerrada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

eliminarTodasLasReservas();
