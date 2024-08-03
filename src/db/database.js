
import { connect }from 'mongoose'

const MONGO_URL = process.env.DATA_BASE;

export const initMongoDB = async ()=>{
    try {
        await connect(MONGO_URL); 
        console.log("conectado a la base de datos");   
    } catch (error) {
        console.log(error); 
    }
}