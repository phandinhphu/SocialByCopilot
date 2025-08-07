import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit3,
    Trash2,
    MessageCircle,
    User,
    Eye,
    EyeOff,
} from "lucide-react";
import { postsAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./Posts.css";

const Posts = () => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [expandedPost, setExpandedPost] = useState(null);

    const queryClient = useQueryClient();

    const {
        data: posts,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: postsAPI.getAll,
    });

    const createMutation = useMutation({
        mutationFn: postsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
            setShowCreateForm(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => postsAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
            setEditingPost(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: postsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        },
    });

    const handleCreatePost = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPost = {
            title: formData.get("title"),
            body: formData.get("body"),
            userId: parseInt(formData.get("userId")),
        };
        createMutation.mutate(newPost);
    };

    const handleUpdatePost = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedPost = {
            title: formData.get("title"),
            body: formData.get("body"),
            userId: editingPost.userId,
        };
        updateMutation.mutate({ id: editingPost.id, data: updatedPost });
    };

    const handleDeletePost = (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deleteMutation.mutate(postId);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error)
        return (
            <div className="error">Error loading posts: {error.message}</div>
        );

    return (
        <motion.div
            className="posts-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="posts-header">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    Posts
                </motion.h1>

                <motion.button
                    className="create-btn"
                    onClick={() => setShowCreateForm(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Plus size={20} />
                    Create Post
                </motion.button>
            </div>

            <motion.div
                className="posts-grid"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {posts?.map((post, index) => (
                    <motion.div
                        key={post.id}
                        className="post-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        layout
                    >
                        <div className="post-header">
                            <div className="post-user">
                                <User size={16} />
                                <span>User {post.userId}</span>
                            </div>
                            <div className="post-actions">
                                <motion.button
                                    onClick={() =>
                                        setExpandedPost(
                                            expandedPost === post.id
                                                ? null
                                                : post.id
                                        )
                                    }
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {expandedPost === post.id ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </motion.button>
                                <motion.button
                                    onClick={() => setEditingPost(post)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Edit3 size={16} />
                                </motion.button>
                                <motion.button
                                    onClick={() => handleDeletePost(post.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="delete-btn"
                                >
                                    <Trash2 size={16} />
                                </motion.button>
                            </div>
                        </div>

                        <h3 className="post-title">{post.title}</h3>

                        <AnimatePresence>
                            {expandedPost === post.id && (
                                <motion.div
                                    className="post-body"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p>{post.body}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="post-footer">
                            <motion.button
                                className="comments-btn"
                                onClick={() => setSelectedPost(post.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <MessageCircle size={16} />
                                View Comments
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Create Post Modal */}
            <AnimatePresence>
                {showCreateForm && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreateForm(false)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Create New Post</h2>
                            <form onSubmit={handleCreatePost}>
                                <input
                                    name="title"
                                    placeholder="Post title"
                                    required
                                    className="form-input"
                                />
                                <textarea
                                    name="body"
                                    placeholder="Post content"
                                    rows="5"
                                    required
                                    className="form-textarea"
                                />
                                <input
                                    name="userId"
                                    type="number"
                                    placeholder="User ID"
                                    min="1"
                                    max="10"
                                    required
                                    className="form-input"
                                />
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createMutation.isLoading}
                                    >
                                        {createMutation.isLoading
                                            ? "Creating..."
                                            : "Create Post"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Post Modal */}
            <AnimatePresence>
                {editingPost && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditingPost(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Edit Post</h2>
                            <form onSubmit={handleUpdatePost}>
                                <input
                                    name="title"
                                    defaultValue={editingPost.title}
                                    placeholder="Post title"
                                    required
                                    className="form-input"
                                />
                                <textarea
                                    name="body"
                                    defaultValue={editingPost.body}
                                    placeholder="Post content"
                                    rows="5"
                                    required
                                    className="form-textarea"
                                />
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPost(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isLoading}
                                    >
                                        {updateMutation.isLoading
                                            ? "Updating..."
                                            : "Update Post"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Posts;
