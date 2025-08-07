import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit3,
    Trash2,
    Image,
    Search,
    Filter,
    Camera,
    Download,
} from "lucide-react";
import { photosAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./Photos.css";

const Photos = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterByAlbum, setFilterByAlbum] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const queryClient = useQueryClient();

    const {
        data: photos,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["photos"],
        queryFn: photosAPI.getAll,
    });

    const createMutation = useMutation({
        mutationFn: photosAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["photos"]);
            setShowCreateForm(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => photosAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["photos"]);
            setEditingPhoto(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: photosAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["photos"]);
        },
    });

    const handleCreatePhoto = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPhoto = {
            title: formData.get("title"),
            url: formData.get("url"),
            thumbnailUrl: formData.get("thumbnailUrl"),
            albumId: parseInt(formData.get("albumId")),
        };
        createMutation.mutate(newPhoto);
    };

    const handleUpdatePhoto = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedPhoto = {
            title: formData.get("title"),
            url: formData.get("url"),
            thumbnailUrl: formData.get("thumbnailUrl"),
            albumId: editingPhoto.albumId,
        };
        updateMutation.mutate({ id: editingPhoto.id, data: updatedPhoto });
    };

    const handleDeletePhoto = (photoId) => {
        if (window.confirm("Are you sure you want to delete this photo?")) {
            deleteMutation.mutate(photoId);
        }
    };

    // Filter and search logic
    const filteredPhotos =
        photos?.filter((photo) => {
            const matchesSearch = photo.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesAlbumFilter =
                filterByAlbum === "" ||
                photo.albumId.toString() === filterByAlbum;
            return matchesSearch && matchesAlbumFilter;
        }) || [];

    if (isLoading) return <LoadingSpinner />;
    if (error)
        return (
            <div className="error">Error loading photos: {error.message}</div>
        );

    return (
        <motion.div
            className="photos-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="photos-header">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    Photos
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
                    Add Photo
                </motion.button>
            </div>

            {/* Filters */}
            <motion.div
                className="photos-filters"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search photos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-box">
                    <Filter size={20} />
                    <select
                        value={filterByAlbum}
                        onChange={(e) => setFilterByAlbum(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Albums</option>
                        {Array.from(
                            new Set(photos?.map((p) => p.albumId) || [])
                        ).map((albumId) => (
                            <option key={albumId} value={albumId}>
                                Album {albumId}
                            </option>
                        ))}
                    </select>
                </div>
            </motion.div>

            <motion.div
                className="photos-stats"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="stat">
                    <Camera size={20} />
                    <span>{filteredPhotos.length} photos found</span>
                </div>
            </motion.div>

            <motion.div
                className="photos-grid"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {filteredPhotos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        className="photo-card"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        layout
                    >
                        <div
                            className="photo-thumbnail"
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <img
                                src={photo.thumbnailUrl}
                                alt={photo.title}
                                loading="lazy"
                            />
                            <div className="photo-overlay">
                                <div className="overlay-content">
                                    <Image size={24} />
                                    <span>View Full</span>
                                </div>
                            </div>
                        </div>

                        <div className="photo-content">
                            <h3 className="photo-title">{photo.title}</h3>
                            <div className="photo-meta">
                                <span className="photo-album">
                                    Album {photo.albumId}
                                </span>
                                <span className="photo-id">#{photo.id}</span>
                            </div>

                            <div className="photo-actions">
                                <motion.button
                                    onClick={() =>
                                        window.open(photo.url, "_blank")
                                    }
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="download-btn"
                                    title="View original"
                                >
                                    <Download size={14} />
                                </motion.button>
                                <motion.button
                                    onClick={() => setEditingPhoto(photo)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Edit3 size={14} />
                                </motion.button>
                                <motion.button
                                    onClick={() => handleDeletePhoto(photo.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="delete-btn"
                                >
                                    <Trash2 size={14} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {filteredPhotos.length === 0 && (
                    <motion.div
                        className="no-photos"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Camera size={48} />
                        <h3>No photos found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Photo Modal */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        className="photo-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.div
                            className="photo-modal"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedPhoto.url}
                                alt={selectedPhoto.title}
                            />
                            <div className="photo-modal-info">
                                <h3>{selectedPhoto.title}</h3>
                                <p>
                                    Album {selectedPhoto.albumId} • Photo #
                                    {selectedPhoto.id}
                                </p>
                                <button onClick={() => setSelectedPhoto(null)}>
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Photo Modal */}
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
                            <h2>Add New Photo</h2>
                            <form onSubmit={handleCreatePhoto}>
                                <input
                                    name="title"
                                    placeholder="Photo title"
                                    required
                                    className="form-input"
                                />
                                <input
                                    name="url"
                                    placeholder="Photo URL"
                                    required
                                    className="form-input"
                                />
                                <input
                                    name="thumbnailUrl"
                                    placeholder="Thumbnail URL"
                                    required
                                    className="form-input"
                                />
                                <input
                                    name="albumId"
                                    type="number"
                                    placeholder="Album ID"
                                    min="1"
                                    max="100"
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
                                            ? "Adding..."
                                            : "Add Photo"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Photo Modal */}
            <AnimatePresence>
                {editingPhoto && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditingPhoto(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Edit Photo</h2>
                            <form onSubmit={handleUpdatePhoto}>
                                <input
                                    name="title"
                                    defaultValue={editingPhoto.title}
                                    placeholder="Photo title"
                                    required
                                    className="form-input"
                                />
                                <input
                                    name="url"
                                    defaultValue={editingPhoto.url}
                                    placeholder="Photo URL"
                                    required
                                    className="form-input"
                                />
                                <input
                                    name="thumbnailUrl"
                                    defaultValue={editingPhoto.thumbnailUrl}
                                    placeholder="Thumbnail URL"
                                    required
                                    className="form-input"
                                />
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPhoto(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isLoading}
                                    >
                                        {updateMutation.isLoading
                                            ? "Updating..."
                                            : "Update Photo"}
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

export default Photos;
