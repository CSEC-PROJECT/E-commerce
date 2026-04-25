import CommunityPost from "../models/communityPost.model.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
    try {
        console.log("Create Post Request received:", req.body);
        const { title, content, type } = req.body;
        const userId = req.user._id;
        console.log("Creating post for user:", userId);

        if (req.user.isBanned) {
            console.log("Banned user attempted to post:", userId);
            return res.status(403).json({ message: "Your account is banned and cannot post." });
        }

        const newPost = new CommunityPost({
            user: userId,
            title,
            content,
            type
        });


        await newPost.save();
        console.log("Post saved successfully:", newPost._id);
        
        const populatedPost = await CommunityPost.findById(newPost._id).populate("user", "name email profilePic");
        
        res.status(201).json(populatedPost);
    } catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({ message: error.message });
    }
};


export const getPosts = async (req, res) => {
    try {
        const posts = await CommunityPost.find()
            .populate("user", "name email profilePic")
            .populate("comments.user", "name profilePic")
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await CommunityPost.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const repostPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await CommunityPost.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!post.reposts.includes(userId)) {
            post.reposts.push(userId);
            await post.save();
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const post = await CommunityPost.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push({
            user: userId,
            content
        });

        await post.save();
        
        const updatedPost = await CommunityPost.findById(id)
            .populate("user", "name email profilePic")
            .populate("comments.user", "name profilePic");

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const reportPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await CommunityPost.findById(id).populate("user");
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.reports.includes(userId)) {
            return res.status(400).json({ message: "You have already reported this post" });
        }

        post.reports.push(userId);
        await post.save();

        // Handle user reporting logic
        const targetUser = await User.findById(post.user._id);
        if (targetUser) {
            targetUser.reportCount += 1;
            if (targetUser.reportCount >= 5) {
                targetUser.isBanned = true;
            }
            await targetUser.save();
        }

        res.status(200).json({ message: "Post reported successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
