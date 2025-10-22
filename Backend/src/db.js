import mongoose from "mongoose";

export const connectDB= async()=>{

    try{
        await mongoose.connect('mongodb://localhost:27017/rentpc-db')
        console.log("La base de datos está conectada")
    
    }catch(error){
        console.log(error);
    }

}