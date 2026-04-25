import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Question", "Idea", "Review", "Shopping Tip", "Showcase", "Other"],
        default: "Idea"
    },


    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    reposts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);

export default CommunityPost;
