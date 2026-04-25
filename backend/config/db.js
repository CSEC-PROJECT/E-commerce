import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/csec-project";
        const options = {};
        
        // Only apply TLS options if we're not connecting to localhost/127.0.0.1
        // or if explicitly required by MONGO_URI (usually Atlas)
        if (uri.includes("mongodb+srv") || (!uri.includes("localhost") && !uri.includes("127.0.0.1"))) {
            options.tls = true;
            options.tlsInsecure = true;
        }

        await mongoose.connect(uri, options);
        console.log("MongoDB connected to:", uri.includes("@") ? "Remote DB" : uri);

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;
