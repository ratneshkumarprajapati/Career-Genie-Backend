import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const DB_URI=process.env.DB_URI as string



export const  dbConnectFxn=()=>{
    try {
        mongoose.connect(DB_URI)
        .then(()=>console.log("db connection successfull"))
        .catch((error)=>console.error("error",error))
    } catch (error) {
        console.log("error while connecting to database",error)
    }

}