import { connect } from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const  DB = process.env.DB

const connectToDb = async ()=>{
    try{
        await connect(DB)
        console.log("The DB is connected")

    }catch(e){
        console.log(`There is a error${e}`)
    }
}

export default connectToDb;