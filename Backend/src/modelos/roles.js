import mongoose from "mongoose";

export const ROLES=["usuario","admin"]

const rolSchema= new mongoose.Schema(
    {
        nombre:String,
    },
    {
        versionKey:false, 
    }
);

export default mongoose.model("Rol", rolSchema)