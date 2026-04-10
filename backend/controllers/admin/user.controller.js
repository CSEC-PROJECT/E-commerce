import User from "../../models/user.js";
import mongoose from "mongoose";


const getAllUsers = async(req,res) =>{
    try{
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        if(users.length === 0){
            return res.status(404).json({message:"No users found"})
        }
        return res.status(200).json({ users });

    }catch(error){
        console.error("Error fetching users:", error);
        return res.status(500).json({message:"Server Error",error:error.message})
    }
}

const getUserById = async(req,res) =>{
    const {id} = req.param;

    try{

    }catch(error){
        console.error("Error fetching users:", error)
        return res.status(500).
    }
}

// getAllUsers,getUserById,deleteUser