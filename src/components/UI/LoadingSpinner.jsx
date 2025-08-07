import React from "react";
import { motion } from "framer-motion";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
    const spinnerVariants = {
        start: {
            transition: {
                staggerChildren: 0.2,
            },
        },
        end: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const circleVariants = {
        start: {
            opacity: 1,
            scale: 1,
            y: 0,
        },
        end: {
            opacity: 0.3,
            scale: 0.2,
            y: -60,
        },
    };

    const circleTransition = {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
    };

    return (
        <div className={`loading-spinner ${size}`}>
            <motion.div
                className="spinner"
                variants={spinnerVariants}
                initial="start"
                animate="end"
            >
                {[...Array(8)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="spinner-circle"
                        variants={circleVariants}
                        transition={{
                            ...circleTransition,
                            delay: index * 0.1,
                        }}
                    />
                ))}
            </motion.div>
            <motion.p
                className="loading-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {text}
            </motion.p>
        </div>
    );
};

export default LoadingSpinner;
