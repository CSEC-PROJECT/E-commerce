import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useCommunityStore } from "../store/communityStore";
import { useToastStore } from "../store/toastStore";
import {
    MessageCircle,
    Heart,
    Share2,
    Flag,
    Send,
    Plus,
    User as UserIcon,
    AlertCircle,
    Loader2,
    Lightbulb,
    HelpCircle,
    ShoppingBag,
    Star,
    Camera,
    Hash,
    MoreHorizontal,
    Search,
    TrendingUp,
    Bookmark,
    MessageSquare
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

const CommunityPage = () => {
    const { user } = useAuthStore();
    const { posts, fetchPosts, createPost, likePost, repostPost, commentPost, reportPost, loading, error } = useCommunityStore();
    const { addToast } = useToastStore();

    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [postType, setPostType] = useState("Idea");
    const [commentTexts, setCommentTexts] = useState({});
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!user) {
            addToast("Please login to post", "info");
            return;
        }
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            addToast("Please provide both title and content", "warning");
            return;
        }

        try {
            await createPost(newPostTitle, newPostContent, postType);
            setNewPostTitle("");
            setNewPostContent("");
            addToast("Discussion started!", "success");
        } catch (error) {
            addToast(error.message, "error");
        }
    };

    const handleComment = async (postId) => {
        if (!user) {
            addToast("Please login to comment", "info");
            return;
        }
        const text = commentTexts[postId];
        if (!text?.trim()) return;

        try {
            await commentPost(postId, text);
            setCommentTexts({ ...commentTexts, [postId]: "" });
            addToast("Comment posted", "success");
        } catch (error) {
            addToast(error.message, "error");
        }
    };

    const getTypeConfig = (type) => {
        switch (type) {
            case "Idea": return { icon: <Lightbulb className="w-3.5 h-3.5" />, color: "text-amber-500", bg: "bg-amber-500/10" };
            case "Question": return { icon: <HelpCircle className="w-3.5 h-3.5" />, color: "text-blue-500", bg: "bg-blue-500/10" };
            case "Review": return { icon: <Star className="w-3.5 h-3.5" />, color: "text-rose-500", bg: "bg-rose-500/10" };
            case "Shopping Tip": return { icon: <ShoppingBag className="w-3.5 h-3.5" />, color: "text-green-500", bg: "bg-green-500/10" };
            case "Showcase": return { icon: <Camera className="w-3.5 h-3.5" />, color: "text-purple-500", bg: "bg-purple-500/10" };
            default: return { icon: <Hash className="w-3.5 h-3.5" />, color: "text-gray-500", bg: "bg-gray-500/10" };
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesTab = activeTab === "All" || post.type === activeTab;
        const postTitle = post.title || "";
        const postContent = post.content || "";
        const matchesSearch = postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            postContent.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });


    const CATEGORIES = ["All", "Idea", "Question", "Review", "Shopping Tip", "Showcase", "Other"];

    return (
        <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#020617] pt-24 pb-20 transition-colors duration-500">
            <div className="max-w-6xl mx-auto px-4 lg:px-8">

                {/* Modern Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary text-white rounded-[40px] p-8 md:p-12 mb-12 shadow-2xl shadow-primary/20">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-[2px] mb-4">The Collective</span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                            Share your style, <br />get inspired.
                        </h1>
                        <p className="text-white/80 text-lg font-medium max-w-lg">
                            Join the conversation with thousands of shoppers. Ask questions, share reviews, and showcase your latest finds.
                        </p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-2xl" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Rail: Categories & Trends */}
                    <div className="lg:col-span-3 space-y-6 sticky top-28 hidden lg:block">
                        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[32px] p-6 shadow-sm">
                            <h2 className="text-[10px] font-black uppercase tracking-[3px] text-muted-foreground mb-6">Explore</h2>
                            <div className="space-y-2">
                                {CATEGORIES.map((cat) => {
                                    const config = getTypeConfig(cat);
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveTab(cat)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-[20px] text-[13px] font-bold transition-all ${activeTab === cat
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]'
                                                    : 'text-foreground hover:bg-muted'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {config.icon}
                                                {cat}
                                            </div>
                                            {activeTab !== cat && <Plus className="w-3 h-3 opacity-30" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Trending Section */}
                        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[32px] p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <h2 className="text-[10px] font-black uppercase tracking-[3px] text-muted-foreground">Trending Now</h2>
                            </div>
                            <div className="space-y-5">
                                {[
                                    { tag: "#SummerOutfits", posts: "2.4k discussions" },
                                    { tag: "#TechDeals", posts: "1.8k questions" },
                                    { tag: "#SkincareRoutine", posts: "950 reviews" }
                                ].map((trend, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{trend.tag}</p>
                                        <p className="text-[11px] text-muted-foreground font-bold">{trend.posts}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Post Creation & Feed */}
                    <div className="lg:col-span-9 space-y-8">

                        {/* Search & Actions Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search the community..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-card/80 backdrop-blur-md border border-border/50 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                            <button className="h-[52px] px-8 bg-foreground text-background rounded-full text-[13px] font-black uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg whitespace-nowrap hidden sm:flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Start Discussion
                            </button>
                        </div>

                        {/* Restored Creation Suite */}
                        <div className="bg-card rounded-[40px] p-8 shadow-xl shadow-black/[0.03] relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-primary/[0.05]">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-focus-within:opacity-10 transition-opacity">
                                <Plus size={120} strokeWidth={4} />
                            </div>

                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-14 h-14 rounded-[22px] bg-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/10 shadow-sm overflow-hidden transition-transform group-focus-within:scale-105">
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="text-primary/60 w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-muted/30 rounded-[28px] p-6 transition-all focus-within:bg-muted/50 focus-within:shadow-inner">
                                        <input
                                            type="text"
                                            placeholder="Give your discussion a catchy title..."
                                            value={newPostTitle}
                                            onChange={(e) => setNewPostTitle(e.target.value)}
                                            className="w-full bg-transparent border-none p-0 text-xl font-black placeholder:text-muted-foreground/30 focus:ring-0 mb-2"
                                        />
                                        <textarea
                                            placeholder={user ? `Hey ${user.name.split(' ')[0]}, what's your latest discovery?` : "Login to join the community"}
                                            value={newPostContent}
                                            onChange={(e) => setNewPostContent(e.target.value)}
                                            disabled={!user}
                                            className="w-full bg-transparent border-none p-0 text-[15px] font-medium text-foreground/70 resize-none min-h-[100px] focus:ring-0 placeholder:text-muted-foreground/30 leading-relaxed"
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6 mt-6 pt-8 border-t border-border/30 relative z-10">
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.filter(c => c !== "All").map((t) => {
                                        const config = getTypeConfig(t);
                                        const isSelected = postType === t;
                                        return (
                                            <button
                                                key={t}
                                                onClick={() => setPostType(t)}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-black tracking-tight transition-all ${isSelected
                                                        ? `${config.color} ${config.bg} shadow-lg shadow-black/5 scale-105`
                                                        : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                                                    }`}
                                            >
                                                {config.icon}
                                                {t}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={loading || !user || !newPostContent.trim() || !newPostTitle.trim()}
                                    className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-full text-[13px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Publish
                                </button>
                            </div>
                        </div>




                        {/* Feed Filter (Mobile Category Scroller) */}
                        <div className="flex lg:hidden overflow-x-auto pb-4 gap-3 no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-black transition-all ${activeTab === cat ? 'bg-primary text-white shadow-lg' : 'bg-card text-muted-foreground'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Feed Content */}
                        {loading && posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                                <Loader2 className="w-12 h-12 animate-spin mb-6 text-primary" />
                                <p className="font-black uppercase tracking-[3px] text-[10px]">Loading Collective</p>
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="bg-card/50 backdrop-blur-md border-2 border-dashed border-border/50 rounded-[40px] p-24 text-center">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">Silence in the collective</h3>
                                <p className="text-muted-foreground font-medium max-w-sm mx-auto">Be the pioneer and start the very first discussion in this category.</p>
                                <button onClick={() => setPostType(activeTab === "All" ? "Idea" : activeTab)} className="mt-8 px-8 py-3 bg-primary text-white rounded-full text-sm font-black uppercase tracking-wider hover:shadow-lg transition-all">Start Now</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredPosts.map((post) => {
                                    const config = getTypeConfig(post.type);
                                    return (
                                        <div key={post._id} className="bg-card border border-border/50 rounded-[36px] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col group h-full">
                                            <div className="p-8 flex-1 flex flex-col">
                                                {/* Meta */}
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full border-2 border-background shadow-md overflow-hidden bg-muted">
                                                            {post.user?.profilePic ? (
                                                                <img src={post.user.profilePic} alt="User" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <UserIcon className="text-muted-foreground w-4 h-4" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] font-black text-foreground leading-none mb-1">{post.user?.name || "User"}</p>
                                                            <p className="text-[10px] text-muted-foreground font-bold">
                                                                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : "recently"} ago
                                                            </p>
                                                        </div>

                                                    </div>
                                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.color}`}>
                                                        {config.icon}
                                                        <span className="text-[10px] font-black uppercase tracking-wider">{post.type}</span>
                                                    </div>
                                                </div>

                                                {/* Text Content */}
                                                <div className="mb-8 flex-1">
                                                    <h3 className="text-xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors cursor-pointer">
                                                        {post.title || "Untitled Discussion"}
                                                    </h3>

                                                    <p className="text-muted-foreground/80 font-medium text-[15px] leading-relaxed line-clamp-4">
                                                        {post.content}
                                                    </p>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center gap-6 text-muted-foreground/60 border-t border-border/40 pt-6 mt-auto">
                                                    <button onClick={() => likePost(post._id)} className={`flex items-center gap-2 text-[13px] font-black hover:text-rose-500 transition-colors ${post.likes?.includes(user?._id) ? 'text-rose-500' : ''}`}>
                                                        <Heart className={`w-4 h-4 ${post.likes?.includes(user?._id) ? 'fill-current' : ''}`} />
                                                        {post.likes?.length || 0}
                                                    </button>
                                                    <button className="flex items-center gap-2 text-[13px] font-black hover:text-primary transition-colors">
                                                        <MessageCircle className="w-4 h-4" />
                                                        {post.comments?.length || 0}
                                                    </button>
                                                    <button onClick={() => repostPost(post._id)} className={`flex items-center gap-2 text-[13px] font-black hover:text-blue-500 transition-colors ${post.reposts?.includes(user?._id) ? 'text-blue-500' : ''}`}>
                                                        <Share2 className="w-4 h-4" />
                                                        {post.reposts?.length || 0}
                                                    </button>
                                                    <div className="flex-1" />
                                                    <button onClick={() => reportPost(post._id)} className="p-1 hover:text-rose-500 transition-colors">
                                                        <Flag className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Minimal Comment Preview */}
                                            {post.comments?.length > 0 && (
                                                <div className="px-8 pb-8">
                                                    <div className="bg-muted/30 rounded-2xl p-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[11px] font-black text-foreground">{post.comments[post.comments.length - 1].user?.name || "User"}</span>
                                                            <span className="text-[10px] text-muted-foreground/50">latest comment</span>
                                                        </div>
                                                        <p className="text-[12px] text-muted-foreground line-clamp-1 italic">"{post.comments[post.comments.length - 1].content || ""}"</p>

                                                    </div>
                                                </div>
                                            )}

                                            {/* Improved Comment Input */}
                                            <div className="p-4 bg-muted/20 border-t border-border/30 flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Share your thoughts..."
                                                    value={commentTexts[post._id] || ""}
                                                    onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                                    className="flex-1 bg-background/80 border-none rounded-[20px] px-6 py-3 text-[12px] font-medium focus:ring-2 focus:ring-primary/10 transition-all"
                                                />
                                                <button onClick={() => handleComment(post._id)} className="w-11 h-11 rounded-[18px] bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
