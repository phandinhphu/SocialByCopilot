import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock user data - in real app, this would come from API
            const userData = {
                id: 1,
                name: "John Doe",
                email: email,
                username: "johndoe",
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    "John Doe"
                )}&background=667eea&color=fff`,
                bio: "Software developer passionate about React and modern web technologies.",
                location: "San Francisco, CA",
                website: "https://johndoe.dev",
                joinedDate: "2023-01-15",
                followers: 1234,
                following: 567,
                posts: 89,
            };

            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        } catch (error) {
            return { success: false, error: "Invalid credentials" };
        }
    };

    const register = async (userData) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const newUser = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                username: userData.username,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    userData.name
                )}&background=667eea&color=fff`,
                bio: "",
                location: "",
                website: "",
                joinedDate: new Date().toISOString().split("T")[0],
                followers: 0,
                following: 0,
                posts: 0,
            };

            localStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser);

            return { success: true };
        } catch (error) {
            return { success: false, error: "Registration failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const updateProfile = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const value = {
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
