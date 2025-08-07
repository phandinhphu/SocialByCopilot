import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit3,
    Trash2,
    User,
    Mail,
    Phone,
    Globe,
    MapPin,
    Building,
} from "lucide-react";
import { usersAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./Users.css";

const Users = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const queryClient = useQueryClient();

    const {
        data: users,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["users"],
        queryFn: usersAPI.getAll,
    });

    const createMutation = useMutation({
        mutationFn: usersAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            setShowCreateForm(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => usersAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            setEditingUser(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: usersAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });

    const handleCreateUser = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newUser = {
            name: formData.get("name"),
            username: formData.get("username"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            website: formData.get("website"),
            address: {
                street: formData.get("street"),
                city: formData.get("city"),
                zipcode: formData.get("zipcode"),
            },
            company: {
                name: formData.get("companyName"),
            },
        };
        createMutation.mutate(newUser);
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedUser = {
            name: formData.get("name"),
            username: formData.get("username"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            website: formData.get("website"),
            address: {
                ...editingUser.address,
                street: formData.get("street"),
                city: formData.get("city"),
                zipcode: formData.get("zipcode"),
            },
            company: {
                ...editingUser.company,
                name: formData.get("companyName"),
            },
        };
        updateMutation.mutate({ id: editingUser.id, data: updatedUser });
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteMutation.mutate(userId);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error)
        return (
            <div className="error">Error loading users: {error.message}</div>
        );

    return (
        <motion.div
            className="users-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="users-header">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    Users
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
                    Add User
                </motion.button>
            </div>

            <motion.div
                className="users-stats"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="stat">
                    <User size={20} />
                    <span>{users?.length || 0} users registered</span>
                </div>
            </motion.div>

            <motion.div
                className="users-grid"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {users?.map((user, index) => (
                    <motion.div
                        key={user.id}
                        className="user-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        layout
                    >
                        <div className="user-avatar">
                            <User size={32} />
                        </div>

                        <div className="user-info">
                            <h3 className="user-name">{user.name}</h3>
                            <p className="user-username">@{user.username}</p>

                            <div className="user-details">
                                <div className="detail-item">
                                    <Mail size={14} />
                                    <span>{user.email}</span>
                                </div>
                                <div className="detail-item">
                                    <Phone size={14} />
                                    <span>{user.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <Globe size={14} />
                                    <span>{user.website}</span>
                                </div>
                                <div className="detail-item">
                                    <MapPin size={14} />
                                    <span>{user.address?.city}</span>
                                </div>
                                <div className="detail-item">
                                    <Building size={14} />
                                    <span>{user.company?.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="user-actions">
                            <motion.button
                                onClick={() => setSelectedUser(user)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="view-btn"
                            >
                                View Details
                            </motion.button>
                            <motion.button
                                onClick={() => setEditingUser(user)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Edit3 size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => handleDeleteUser(user.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="delete-btn"
                            >
                                <Trash2 size={16} />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* User Details Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedUser(null)}
                    >
                        <motion.div
                            className="modal-content user-details-modal"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="user-details-header">
                                <div className="user-avatar large">
                                    <User size={48} />
                                </div>
                                <div>
                                    <h2>{selectedUser.name}</h2>
                                    <p>@{selectedUser.username}</p>
                                </div>
                            </div>

                            <div className="user-details-content">
                                <div className="details-section">
                                    <h4>Contact Information</h4>
                                    <div className="detail-item">
                                        <Mail size={16} />
                                        <span>{selectedUser.email}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Phone size={16} />
                                        <span>{selectedUser.phone}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Globe size={16} />
                                        <span>{selectedUser.website}</span>
                                    </div>
                                </div>

                                <div className="details-section">
                                    <h4>Address</h4>
                                    <div className="detail-item">
                                        <MapPin size={16} />
                                        <span>
                                            {selectedUser.address?.street},{" "}
                                            {selectedUser.address?.city}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span>
                                            Zipcode:{" "}
                                            {selectedUser.address?.zipcode}
                                        </span>
                                    </div>
                                </div>

                                <div className="details-section">
                                    <h4>Company</h4>
                                    <div className="detail-item">
                                        <Building size={16} />
                                        <span>
                                            {selectedUser.company?.name}
                                        </span>
                                    </div>
                                    {selectedUser.company?.catchPhrase && (
                                        <div className="detail-item">
                                            <span>
                                                "
                                                {
                                                    selectedUser.company
                                                        .catchPhrase
                                                }
                                                "
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                className="close-btn"
                                onClick={() => setSelectedUser(null)}
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create User Modal */}
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
                            <h2>Add New User</h2>
                            <form onSubmit={handleCreateUser}>
                                <div className="form-row">
                                    <input
                                        name="name"
                                        placeholder="Full name"
                                        required
                                        className="form-input"
                                    />
                                    <input
                                        name="username"
                                        placeholder="Username"
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="form-input"
                                />
                                <div className="form-row">
                                    <input
                                        name="phone"
                                        placeholder="Phone"
                                        required
                                        className="form-input"
                                    />
                                    <input
                                        name="website"
                                        placeholder="Website"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-row">
                                    <input
                                        name="street"
                                        placeholder="Street address"
                                        className="form-input"
                                    />
                                    <input
                                        name="city"
                                        placeholder="City"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-row">
                                    <input
                                        name="zipcode"
                                        placeholder="Zip code"
                                        className="form-input"
                                    />
                                    <input
                                        name="companyName"
                                        placeholder="Company name"
                                        className="form-input"
                                    />
                                </div>
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
                                            : "Add User"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit User Modal */}
            <AnimatePresence>
                {editingUser && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditingUser(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Edit User</h2>
                            <form onSubmit={handleUpdateUser}>
                                <div className="form-row">
                                    <input
                                        name="name"
                                        defaultValue={editingUser.name}
                                        placeholder="Full name"
                                        required
                                        className="form-input"
                                    />
                                    <input
                                        name="username"
                                        defaultValue={editingUser.username}
                                        placeholder="Username"
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={editingUser.email}
                                    placeholder="Email"
                                    required
                                    className="form-input"
                                />
                                <div className="form-row">
                                    <input
                                        name="phone"
                                        defaultValue={editingUser.phone}
                                        placeholder="Phone"
                                        required
                                        className="form-input"
                                    />
                                    <input
                                        name="website"
                                        defaultValue={editingUser.website}
                                        placeholder="Website"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-row">
                                    <input
                                        name="street"
                                        defaultValue={
                                            editingUser.address?.street
                                        }
                                        placeholder="Street address"
                                        className="form-input"
                                    />
                                    <input
                                        name="city"
                                        defaultValue={editingUser.address?.city}
                                        placeholder="City"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-row">
                                    <input
                                        name="zipcode"
                                        defaultValue={
                                            editingUser.address?.zipcode
                                        }
                                        placeholder="Zip code"
                                        className="form-input"
                                    />
                                    <input
                                        name="companyName"
                                        defaultValue={editingUser.company?.name}
                                        placeholder="Company name"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isLoading}
                                    >
                                        {updateMutation.isLoading
                                            ? "Updating..."
                                            : "Update User"}
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

export default Users;
