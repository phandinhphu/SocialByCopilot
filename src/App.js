import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Posts from "./pages/Posts/Posts";
import Comments from "./pages/Comments/Comments";
import Albums from "./pages/Albums/Albums";
import Photos from "./pages/Photos/Photos";
import Todos from "./pages/Todos/Todos";
import Users from "./pages/Users/Users";
import "./App.css";

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            {/* Public Auth Route */}
                            <Route path="/auth" element={<Auth />} />

                            {/* Protected Routes */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Layout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Home />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="posts" element={<Posts />} />
                                <Route path="comments" element={<Comments />} />
                                <Route path="albums" element={<Albums />} />
                                <Route path="photos" element={<Photos />} />
                                <Route path="todos" element={<Todos />} />
                                <Route path="users" element={<Users />} />
                            </Route>
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
