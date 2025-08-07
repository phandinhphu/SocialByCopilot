import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { Edit, Mail, Calendar, MapPin, Save, X } from "lucide-react";
import "./Profile.css";

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        location: user?.location || "",
        website: user?.website || "",
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            bio: user?.bio || "",
            location: user?.location || "",
            website: user?.website || "",
        });
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <motion.div
                className="profile-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="profile-header">
                    <div className="profile-avatar-section">
                        <img
                            src={
                                user?.avatar ||
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                                    (user?.name || "guest")
                            }
                            alt={user?.name}
                            className="profile-avatar-large"
                        />
                        <div className="profile-basic-info">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="profile-input profile-name-input"
                                />
                            ) : (
                                <h1 className="profile-name">{user?.name}</h1>
                            )}
                            <div className="profile-meta">
                                <span className="profile-joined">
                                    <Calendar size={16} />
                                    Joined{" "}
                                    {new Date(
                                        user?.joinDate || Date.now()
                                    ).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        className={`edit-button ${isEditing ? "editing" : ""}`}
                        onClick={
                            isEditing ? handleSave : () => setIsEditing(true)
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isEditing ? <Save size={18} /> : <Edit size={18} />}
                        {isEditing ? "Save" : "Edit Profile"}
                    </motion.button>

                    {isEditing && (
                        <motion.button
                            className="cancel-button"
                            onClick={handleCancel}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <X size={18} />
                            Cancel
                        </motion.button>
                    )}
                </div>

                <div className="profile-details">
                    <div className="profile-section">
                        <h3>About</h3>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                                className="profile-input profile-bio-input"
                                rows="4"
                            />
                        ) : (
                            <p className="profile-bio">
                                {user?.bio || "No bio available."}
                            </p>
                        )}
                    </div>

                    <div className="profile-section">
                        <h3>Contact Information</h3>
                        <div className="profile-contact">
                            <div className="contact-item">
                                <Mail size={18} />
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                        placeholder="Email address"
                                    />
                                ) : (
                                    <span>{user?.email}</span>
                                )}
                            </div>

                            <div className="contact-item">
                                <MapPin size={18} />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                        placeholder="Location"
                                    />
                                ) : (
                                    <span>
                                        {user?.location ||
                                            "Location not specified"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-number">42</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">128</span>
                            <span className="stat-label">Following</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">256</span>
                            <span className="stat-label">Followers</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
