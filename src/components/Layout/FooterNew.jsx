import React from "react";
import { motion } from "framer-motion";
import {
    Github,
    Heart,
    Coffee,
    Twitter,
    Instagram,
    Linkedin,
    Shield,
    HelpCircle,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
    return (
        <motion.footer
            className="footer"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>SocioSpace</h3>
                        <p>
                            Connect, share, and collaborate with your network.
                            Built with modern technologies for the best user
                            experience.
                        </p>
                        <div className="social-links">
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Twitter size={20} />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Instagram size={20} />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Linkedin size={20} />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Github size={20} />
                            </motion.a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Platform</h4>
                        <ul>
                            <li>
                                <a href="/posts">Posts & Stories</a>
                            </li>
                            <li>
                                <a href="/photos">Photo Sharing</a>
                            </li>
                            <li>
                                <a href="/todos">Project Boards</a>
                            </li>
                            <li>
                                <a href="/users">Network</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Support</h4>
                        <ul>
                            <li>
                                <a href="/help">Help Center</a>
                            </li>
                            <li>
                                <a href="/privacy">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="/terms">Terms of Service</a>
                            </li>
                            <li>
                                <a href="/contact">Contact Us</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li>
                                <a href="/about">About Us</a>
                            </li>
                            <li>
                                <a href="/careers">Careers</a>
                            </li>
                            <li>
                                <a href="/blog">Blog</a>
                            </li>
                            <li>
                                <a href="/press">Press</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>
                            Made with <Heart size={16} className="heart" />{" "}
                            using React Query & Framer Motion
                        </p>
                        <div className="footer-links">
                            <span className="footer-link">
                                <Shield size={16} />
                                Secure Platform
                            </span>
                            <span className="footer-link">
                                <HelpCircle size={16} />
                                24/7 Support
                            </span>
                        </div>
                    </div>
                    <p className="copyright">
                        © {new Date().getFullYear()} SocioSpace. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
