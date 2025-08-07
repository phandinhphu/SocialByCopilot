import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit3,
    Trash2,
    Mail,
    User,
    MessageCircle,
    Search,
    Filter,
} from "lucide-react";
import { commentsAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./Comments.css";

const Comments = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterByPost, setFilterByPost] = useState("");

    const queryClient = useQueryClient();

    const {
        data: comments,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["comments"],
        queryFn: commentsAPI.getAll,
    });

    const createMutation = useMutation({
        mutationFn: commentsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
            setShowCreateForm(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => commentsAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
            setEditingComment(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: commentsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
        },
    });

    const handleCreateComment = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newComment = {
            name: formData.get("name"),
            email: formData.get("email"),
            body: formData.get("body"),
            postId: parseInt(formData.get("postId")),
        };
        createMutation.mutate(newComment);
    };

    const handleUpdateComment = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedComment = {
            name: formData.get("name"),
            email: formData.get("email"),
            body: formData.get("body"),
            postId: editingComment.postId,
        };
        updateMutation.mutate({ id: editingComment.id, data: updatedComment });
    };

    const handleDeleteComment = (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            deleteMutation.mutate(commentId);
        }
    };

    // Filter and search logic
    const filteredComments =
        comments?.filter((comment) => {
            const matchesSearch =
                comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                comment.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                comment.body.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesPostFilter =
                filterByPost === "" ||
                comment.postId.toString() === filterByPost;

            return matchesSearch && matchesPostFilter;
        }) || [];

    if (isLoading) return <LoadingSpinner />;
    if (error)
        return (
            <div className="error">Error loading comments: {error.message}</div>
        );

    return (
        <motion.div
            className="comments-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="comments-header">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    Comments
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
                    Add Comment
                </motion.button>
            </div>

            {/* Filters */}
            <motion.div
                className="comments-filters"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search comments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-box">
                    <Filter size={20} />
                    <select
                        value={filterByPost}
                        onChange={(e) => setFilterByPost(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Posts</option>
                        {Array.from(
                            new Set(comments?.map((c) => c.postId) || [])
                        ).map((postId) => (
                            <option key={postId} value={postId}>
                                Post {postId}
                            </option>
                        ))}
                    </select>
                </div>
            </motion.div>

            <motion.div
                className="comments-stats"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="stat">
                    <MessageCircle size={20} />
                    <span>{filteredComments.length} comments found</span>
                </div>
            </motion.div>

            <motion.div
                className="comments-list"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {filteredComments.map((comment, index) => (
                    <motion.div
                        key={comment.id}
                        className="comment-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        layout
                    >
                        <div className="comment-header">
                            <div className="comment-meta">
                                <div className="comment-author">
                                    <User size={16} />
                                    <span className="author-name">
                                        {comment.name}
                                    </span>
                                </div>
                                <div className="comment-email">
                                    <Mail size={14} />
                                    <span>{comment.email}</span>
                                </div>
                                <div className="comment-post">
                                    <span>Post #{comment.postId}</span>
                                </div>
                            </div>

                            <div className="comment-actions">
                                <motion.button
                                    onClick={() => setEditingComment(comment)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Edit3 size={16} />
                                </motion.button>
                                <motion.button
                                    onClick={() =>
                                        handleDeleteComment(comment.id)
                                    }
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="delete-btn"
                                >
                                    <Trash2 size={16} />
                                </motion.button>
                            </div>
                        </div>

                        <div className="comment-body">
                            <p>{comment.body}</p>
                        </div>
                    </motion.div>
                ))}

                {filteredComments.length === 0 && (
                    <motion.div
                        className="no-comments"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <MessageCircle size={48} />
                        <h3>No comments found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Create Comment Modal */}
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
                            <h2>Add New Comment</h2>
                            <form onSubmit={handleCreateComment}>
                                <input
                                    name="name"
                                    placeholder="Your name"
                                    required
                                    className="form-input"
                                />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Your email"
                                    required
                                    className="form-input"
                                />
                                <input
                                    name="postId"
                                    type="number"
                                    placeholder="Post ID"
                                    min="1"
                                    max="100"
                                    required
                                    className="form-input"
                                />
                                <textarea
                                    name="body"
                                    placeholder="Your comment"
                                    rows="4"
                                    required
                                    className="form-textarea"
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
                                            ? "Adding..."
                                            : "Add Comment"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Comment Modal */}
            <AnimatePresence>
                {editingComment && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditingComment(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Edit Comment</h2>
                            <form onSubmit={handleUpdateComment}>
                                <input
                                    name="name"
                                    defaultValue={editingComment.name}
                                    placeholder="Your name"
                                    required
                                    className="form-input"
                                />
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={editingComment.email}
                                    placeholder="Your email"
                                    required
                                    className="form-input"
                                />
                                <textarea
                                    name="body"
                                    defaultValue={editingComment.body}
                                    placeholder="Your comment"
                                    rows="4"
                                    required
                                    className="form-textarea"
                                />
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => setEditingComment(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isLoading}
                                    >
                                        {updateMutation.isLoading
                                            ? "Updating..."
                                            : "Update Comment"}
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

export default Comments;
