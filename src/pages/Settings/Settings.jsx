import React from "react";
import { motion } from "framer-motion";
import { Bell, Lock, Eye, Moon, Globe, Shield } from "lucide-react";
import "./Settings.css";

const Settings = () => {
    return (
        <div className="settings-container">
            <motion.div
                className="settings-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="settings-header">
                    <h1>Settings</h1>
                    <p>Manage your account preferences and privacy settings</p>
                </div>

                <div className="settings-sections">
                    <div className="settings-section">
                        <div className="section-header">
                            <Bell size={20} />
                            <h3>Notifications</h3>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input type="checkbox" defaultChecked />
                                <span>Email notifications</span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input type="checkbox" defaultChecked />
                                <span>Push notifications</span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input type="checkbox" />
                                <span>SMS notifications</span>
                            </label>
                        </div>
                    </div>

                    <div className="settings-section">
                        <div className="section-header">
                            <Eye size={20} />
                            <h3>Privacy</h3>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input type="checkbox" defaultChecked />
                                <span>Make profile public</span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input type="checkbox" />
                                <span>Show activity status</span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input type="checkbox" defaultChecked />
                                <span>Allow direct messages</span>
                            </label>
                        </div>
                    </div>

                    <div className="settings-section">
                        <div className="section-header">
                            <Moon size={20} />
                            <h3>Appearance</h3>
                        </div>
                        <div className="setting-item">
                            <label>Theme</label>
                            <select>
                                <option>Light</option>
                                <option>Dark</option>
                                <option>Auto</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label>Language</label>
                            <select>
                                <option>English</option>
                                <option>Español</option>
                                <option>Français</option>
                                <option>Deutsch</option>
                            </select>
                        </div>
                    </div>

                    <div className="settings-section">
                        <div className="section-header">
                            <Shield size={20} />
                            <h3>Security</h3>
                        </div>
                        <div className="setting-item">
                            <button className="settings-button">
                                Change Password
                            </button>
                        </div>
                        <div className="setting-item">
                            <button className="settings-button">
                                Two-Factor Authentication
                            </button>
                        </div>
                        <div className="setting-item">
                            <button className="settings-button danger">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
