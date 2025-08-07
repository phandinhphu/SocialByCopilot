import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    FileText,
    MessageCircle,
    Image,
    Calendar,
    Users,
    ChevronDown,
    LogOut,
    User,
    Settings,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";

const Header = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navItems = [
        { path: "/", label: "Home", icon: Home },
        { path: "/posts", label: "Posts", icon: FileText },
        { path: "/comments", label: "Comments", icon: MessageCircle },
        { path: "/albums", label: "Albums", icon: Image },
        { path: "/photos", label: "Photos", icon: Image },
        { path: "/todos", label: "Board", icon: Calendar },
        { path: "/users", label: "People", icon: Users },
    ];

    return (
        <motion.header
            className="header"
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="header-container">
                <motion.div
                    className="logo"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to="/">
                        <h1>SocioSpace</h1>
                    </Link>
                </motion.div>

                <nav className="nav">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <motion.div
                                key={item.path}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={item.path}
                                    className={`nav-item ${
                                        isActive ? "active" : ""
                                    }`}
                                >
                                    <IconComponent size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* User Menu */}
                <div className="user-menu-container">
                    <motion.button
                        className="user-menu-trigger"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img
                            src={
                                user?.avatar ||
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                                    (user?.name || "guest")
                            }
                            alt={user?.name || "User"}
                            className="user-avatar"
                        />
                        <span className="user-name">
                            {user?.name || "Guest"}
                        </span>
                        <ChevronDown
                            size={16}
                            className={`chevron ${
                                showUserMenu ? "rotated" : ""
                            }`}
                        />
                    </motion.button>

                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                className="user-menu"
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link to="/profile" className="user-menu-item">
                                    <User size={16} />
                                    <span>Profile</span>
                                </Link>
                                <Link to="/settings" className="user-menu-item">
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </Link>
                                <hr className="menu-divider" />
                                <button
                                    onClick={logout}
                                    className="user-menu-item logout"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
