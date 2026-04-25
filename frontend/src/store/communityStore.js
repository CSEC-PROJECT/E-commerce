import { create } from "zustand";
import { apiRequest } from "../lib/apiClient";

export const useCommunityStore = create((set, get) => ({
    posts: [],
    loading: false,
    error: null,

    fetchPosts: async () => {
        set({ loading: true, error: null });
        try {
            const data = await apiRequest("/api/community");
            set({ posts: data, loading: false });
        } catch (error) {
            set({ error: error.message || "Failed to fetch posts", loading: false });
        }
    },

    createPost: async (title, content, type) => {
        set({ loading: true, error: null });
        try {
            const data = await apiRequest("/api/community", {
                method: "POST",
                body: { title, content, type }
            });

            set((state) => ({ 
                posts: [data, ...state.posts], 
                loading: false 
            }));
            return data;
        } catch (error) {
            set({ error: error.message || "Failed to create post", loading: false });
            throw error;
        }
    },

    likePost: async (postId) => {
        try {
            const data = await apiRequest(`/api/community/${postId}/like`, {
                method: "POST"
            });
            set((state) => ({
                posts: state.posts.map((post) => post._id === postId ? { ...post, likes: data.likes } : post)
            }));
        } catch (error) {
            console.error("Failed to like post", error);
        }
    },

    repostPost: async (postId) => {
        try {
            const data = await apiRequest(`/api/community/${postId}/repost`, {
                method: "POST"
            });
            set((state) => ({
                posts: state.posts.map((post) => post._id === postId ? { ...post, reposts: data.reposts } : post)
            }));
        } catch (error) {
            console.error("Failed to repost", error);
        }
    },

    commentPost: async (postId, content) => {
        try {
            const data = await apiRequest(`/api/community/${postId}/comment`, {
                method: "POST",
                body: { content }
            });
            set((state) => ({
                posts: state.posts.map((post) => post._id === postId ? data : post)
            }));
        } catch (error) {
            console.error("Failed to comment", error);
        }
    },

    reportPost: async (postId) => {
        try {
            await apiRequest(`/api/community/${postId}/report`, {
                method: "POST"
            });
            // You might want to update the UI to show it's reported or hide it
            set((state) => ({
                posts: state.posts.filter(p => p._id !== postId) // Hide reported post for current session
            }));
        } catch (error) {
            console.error("Failed to report", error);
        }
    }
}));
