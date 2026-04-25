import User from "../../models/user.model.js";
import mongoose from "mongoose";


const getAllUsers = async(req,res) =>{
    try{
        const { page = 1, limit = 20, search } = req.query;
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 20;

        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select("-password -refreshTokenHash -passwordResetToken -verificationToken")
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        return res.status(200).json({
            users,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    }catch(error){
        console.error("Error fetching users:", error);
        return res.status(500).json({message:"Server Error",error:error.message})
    }
}

const getUserById = async(req,res) =>{
    const {id} = req.params;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid user ID"})
        }
        const user = await User.findById(id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json({ user });


    }catch(error){
        console.error("Error fetching users:", error)
        return res.status(500).json({message:"Server Error"})
    }
}

const deleteUser = async(req,res) =>{
    const {id} = req.params;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid user ID"})
        }
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json({message:"User deleted successfully"});
    }catch(error){
        console.error("Error deleting user:", error);
        return res.status(500).json({message:"Server Error"});

    }
}

const toggleBanUser = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" })
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        user.isBanned = !user.isBanned;
        if (user.isBanned === false) {
            user.reportCount = 0; // Reset report count when unbanning
        }
        await user.save();

        return res.status(200).json({ 
            message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
            user: { _id: user._id, isBanned: user.isBanned, reportCount: user.reportCount }
        });
    } catch (error) {
        console.error("Error toggling ban:", error);
        return res.status(500).json({ message: "Server Error" });
    }
}


export { getAllUsers, getUserById, deleteUser, toggleBanUser }