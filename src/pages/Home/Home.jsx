import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    FileText,
    MessageCircle,
    Image,
    Calendar,
    Users,
    TrendingUp,
    Heart,
    Share2,
    Plus,
    Bell,
    Target,
} from "lucide-react";
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const quickActions = [
        {
            icon: Plus,
            title: "Create Post",
            description: "Share something with your network",
            path: "/posts",
            color: "#667eea",
            action: "create",
        },
        {
            icon: Target,
            title: "Add Task",
            description: "Add a new task to your board",
            path: "/todos",
            color: "#f59e0b",
            action: "create",
        },
        {
            icon: Image,
            title: "Upload Photo",
            description: "Share photos with your friends",
            path: "/photos",
            color: "#10b981",
            action: "upload",
        },
        {
            icon: Users,
            title: "Find People",
            description: "Connect with new people",
            path: "/users",
            color: "#8b5cf6",
            action: "explore",
        },
    ];

    const stats = [
        {
            icon: FileText,
            label: "Posts",
            value: user?.posts || 0,
            color: "#667eea",
        },
        {
            icon: Users,
            label: "Following",
            value: user?.following || 0,
            color: "#10b981",
        },
        {
            icon: Heart,
            label: "Followers",
            value: user?.followers || 0,
            color: "#f59e0b",
        },
        {
            icon: TrendingUp,
            label: "Engagement",
            value: "95%",
            color: "#8b5cf6",
        },
    ];

    const recentActivity = [
        {
            type: "like",
            user: "Sarah Wilson",
            action: "liked your post",
            time: "2 minutes ago",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Wilson&background=667eea&color=fff",
        },
        {
            type: "comment",
            user: "John Smith",
            action: "commented on your photo",
            time: "5 minutes ago",
            avatar: "https://ui-avatars.com/api/?name=John+Smith&background=10b981&color=fff",
        },
        {
            type: "follow",
            user: "Alice Johnson",
            action: "started following you",
            time: "1 hour ago",
            avatar: "https://ui-avatars.com/api/?name=Alice+Johnson&background=f59e0b&color=fff",
        },
        {
            type: "mention",
            user: "Mike Davis",
            action: "mentioned you in a comment",
            time: "2 hours ago",
            avatar: "https://ui-avatars.com/api/?name=Mike+Davis&background=8b5cf6&color=fff",
        },
    ];

    return (
        <div className="home-container">
            {/* Welcome Section */}
            <motion.div
                className="welcome-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="welcome-content">
                    <h1>Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
                    <p>Here's what's happening in your network today</p>
                </div>
                <div className="welcome-time">
                    <span>
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                className="stats-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            className="stat-card"
                            whileHover={{ scale: 1.05, y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div
                                className="stat-icon"
                                style={{
                                    backgroundColor: `${stat.color}20`,
                                    color: stat.color,
                                }}
                            >
                                <IconComponent size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                className="section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h2>Quick Actions</h2>
                <div className="quick-actions-grid">
                    {quickActions.map((action, index) => {
                        const IconComponent = action.icon;
                        return (
                            <motion.div
                                key={action.title}
                                className="action-card"
                                onClick={() => navigate(action.path)}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                            >
                                <div
                                    className="action-icon"
                                    style={{
                                        backgroundColor: `${action.color}20`,
                                    }}
                                >
                                    <IconComponent
                                        size={24}
                                        style={{ color: action.color }}
                                    />
                                </div>
                                <div className="action-content">
                                    <h3>{action.title}</h3>
                                    <p>{action.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
                className="section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <div className="section-header">
                    <h2>Recent Activity</h2>
                    <Bell size={20} />
                </div>
                <div className="activity-list">
                    {recentActivity.map((activity, index) => (
                        <motion.div
                            key={index}
                            className="activity-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ x: 5 }}
                        >
                            <img
                                src={activity.avatar}
                                alt={activity.user}
                                className="activity-avatar"
                            />
                            <div className="activity-content">
                                <span className="activity-text">
                                    <strong>{activity.user}</strong>{" "}
                                    {activity.action}
                                </span>
                                <span className="activity-time">
                                    {activity.time}
                                </span>
                            </div>
                            <div className="activity-icon">
                                {activity.type === "like" && (
                                    <Heart size={16} className="like-icon" />
                                )}
                                {activity.type === "comment" && (
                                    <MessageCircle
                                        size={16}
                                        className="comment-icon"
                                    />
                                )}
                                {activity.type === "follow" && (
                                    <Users size={16} className="follow-icon" />
                                )}
                                {activity.type === "mention" && (
                                    <Share2
                                        size={16}
                                        className="mention-icon"
                                    />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.button
                    className="view-all-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    View All Notifications
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Home;
