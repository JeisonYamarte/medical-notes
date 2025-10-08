import mongoose from 'mongoose';
import './envConfig'

console.log('Conectando a MongoDB:', process.env.MONGODB_URI);

const MONGODB_URI = process.env.MONGODB_URI;

console.log('MONGO_URI:', MONGODB_URI);


if (!MONGODB_URI) {
    throw new Error(
        'Por favor define la variable de entorno MONGODB_URI en .env.local'
    );
}


export async function connectDB() {
    try {
    
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    
    const conn = await mongoose.connect(MONGODB_URI!);
    
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        throw error;
    }
}

export async function disconnectDB() {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('✅ Conexión a MongoDB cerrada');
        }
    } catch (error) {
        console.error('❌ Error cerrando la conexión a MongoDB:', error);
        throw error;
    }
}