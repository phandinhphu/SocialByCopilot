import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, User, Image, Eye, Camera } from "lucide-react";
import { albumsAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./Albums.css";

const Albums = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const queryClient = useQueryClient();

    const {
        data: albums,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["albums"],
        queryFn: albumsAPI.getAll,
    });

    const createMutation = useMutation({
        mutationFn: albumsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["albums"]);
            setShowCreateForm(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => albumsAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["albums"]);
            setEditingAlbum(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: albumsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["albums"]);
        },
    });

    const handleCreateAlbum = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newAlbum = {
            title: formData.get("title"),
            userId: parseInt(formData.get("userId")),
        };
        createMutation.mutate(newAlbum);
    };

    const handleUpdateAlbum = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedAlbum = {
            title: formData.get("title"),
            userId: editingAlbum.userId,
        };
        updateMutation.mutate({ id: editingAlbum.id, data: updatedAlbum });
    };

    const handleDeleteAlbum = (albumId) => {
        if (window.confirm("Are you sure you want to delete this album?")) {
            deleteMutation.mutate(albumId);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error)
        return (
            <div className="error">Error loading albums: {error.message}</div>
        );

    return (
        <motion.div
            className="albums-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="albums-header">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    Albums
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
                    Create Album
                </motion.button>
            </div>

            <motion.div
                className="albums-stats"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="stat">
                    <Camera size={20} />
                    <span>{albums?.length || 0} albums available</span>
                </div>
            </motion.div>

            <motion.div
                className="albums-grid"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {albums?.map((album, index) => (
                    <motion.div
                        key={album.id}
                        className="album-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        layout
                    >
                        <div className="album-thumbnail">
                            <div className="album-icon">
                                <Image size={32} />
                            </div>
                            <div className="album-overlay">
                                <motion.button
                                    className="view-photos-btn"
                                    onClick={() => setSelectedAlbum(album.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Eye size={16} />
                                    View Photos
                                </motion.button>
                            </div>
                        </div>

                        <div className="album-content">
                            <div className="album-header">
                                <div className="album-user">
                                    <User size={16} />
                                    <span>User {album.userId}</span>
                                </div>
                                <div className="album-actions">
                                    <motion.button
                                        onClick={() => setEditingAlbum(album)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Edit3 size={16} />
                                    </motion.button>
                                    <motion.button
                                        onClick={() =>
                                            handleDeleteAlbum(album.id)
                                        }
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="delete-btn"
                                    >
                                        <Trash2 size={16} />
                                    </motion.button>
                                </div>
                            </div>

                            <h3 className="album-title">{album.title}</h3>

                            <div className="album-id">Album #{album.id}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Create Album Modal */}
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
                            <h2>Create New Album</h2>
                            <form onSubmit={handleCreateAlbum}>
                                <input
                                    name="title"
                                    placeholder="Album title"
                                    required
                                    className="form-input"
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
                                            : "Create Album"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Album Modal */}
            <AnimatePresence>
                {editingAlbum && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditingAlbum(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Edit Album</h2>
                            <form onSubmit={handleUpdateAlbum}>
                                <input
                                    name="title"
                                    defaultValue={editingAlbum.title}
                                    placeholder="Album title"
                                    required
                                    className="form-input"
                                />
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => setEditingAlbum(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isLoading}
                                    >
                                        {updateMutation.isLoading
                                            ? "Updating..."
                                            : "Update Album"}
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

export default Albums;
