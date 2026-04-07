import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/csec-project", {
          tls: true,
          tlsInsecure: true,
        });
        console.log("MongoDB connected");

    }catch(error){
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;
