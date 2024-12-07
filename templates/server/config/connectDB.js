import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

if(!process.env.MONGODB_URI){
    throw new Error(
        "Please provide MONGODB_URI",
    )
}

async function connectToMongoDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.log("Error in Mongodb connection!!!",error);
        process.exit(1);
    }
}

export default connectToMongoDB;