import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import "./Auth.css";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { user, login, register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to home if user is already logged in
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (isLogin) {
                const result = await login(formData.email, formData.password);
                if (!result.success) {
                    setError(result.error);
                } else {
                    navigate("/");
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }

                const result = await register({
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                });

                if (!result.success) {
                    setError(result.error);
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setError("");
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="floating-shapes">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`shape shape-${i + 1}`} />
                    ))}
                </div>
            </div>

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="auth-header">
                    <motion.div
                        className="auth-logo"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="logo-icon">
                            {isLogin ? (
                                <LogIn size={32} />
                            ) : (
                                <UserPlus size={32} />
                            )}
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {isLogin ? "Welcome Back" : "Join Us Today"}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {isLogin
                            ? "Sign in to continue to your social experience"
                            : "Create your account and start connecting"}
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <User
                                            className="input-icon"
                                            size={20}
                                        />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <User
                                            className="input-icon"
                                            size={20}
                                        />
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <Lock
                                            className="input-icon"
                                            size={20}
                                        />
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div
                            className="error-message"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        className="auth-submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            <div className="loading-spinner" />
                        ) : (
                            <>
                                {isLogin ? (
                                    <LogIn size={20} />
                                ) : (
                                    <UserPlus size={20} />
                                )}
                                {isLogin ? "Sign In" : "Create Account"}
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}
                        <button onClick={toggleMode} className="auth-switch">
                            {isLogin ? "Sign Up" : "Sign In"}
                        </button>
                    </p>
                </div>

                {isLogin && (
                    <div className="demo-credentials">
                        <p className="demo-text">Demo credentials:</p>
                        <p>
                            <strong>Email:</strong> demo@example.com
                        </p>
                        <p>
                            <strong>Password:</strong> demo123
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Auth;
