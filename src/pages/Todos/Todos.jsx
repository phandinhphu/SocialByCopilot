import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit3,
    Trash2,
    User,
    MoreHorizontal,
    Calendar,
    Clock,
    Target,
    CheckCircle2,
    AlertCircle,
    PlayCircle,
    CheckCircle,
    Circle,
    Filter,
} from "lucide-react";
import { todosAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./Todos.css";

const Todos = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [newTodoColumn, setNewTodoColumn] = useState("todo");

    const queryClient = useQueryClient();

    const {
        data: todos,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["todos"],
        queryFn: todosAPI.getAll,
    });

    const createMutation = useMutation({
        mutationFn: todosAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
            setShowCreateForm(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => todosAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
            setEditingTodo(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: todosAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
        },
    });

    const columns = [
        {
            id: "todo",
            title: "To Do",
            icon: <AlertCircle size={18} />,
            color: "#ef4444",
            bgColor: "#fef2f2",
        },
        {
            id: "in-progress",
            title: "In Progress",
            icon: <PlayCircle size={18} />,
            color: "#f59e0b",
            bgColor: "#fffbeb",
        },
        {
            id: "review",
            title: "Review",
            icon: <Clock size={18} />,
            color: "#3b82f6",
            bgColor: "#eff6ff",
        },
        {
            id: "done",
            title: "Done",
            icon: <CheckCircle2 size={18} />,
            color: "#10b981",
            bgColor: "#f0fdf4",
        },
    ];

    // Convert todos to match Trello columns
    const getColumnTodos = (columnId) => {
        if (!todos) return [];

        return todos.filter((todo) => {
            if (columnId === "todo")
                return !todo.completed && !todo.inProgress && !todo.inReview;
            if (columnId === "in-progress")
                return todo.inProgress && !todo.completed;
            if (columnId === "review") return todo.inReview && !todo.completed;
            if (columnId === "done") return todo.completed;
            return false;
        });
    };

    const handleDragStart = (e, todo) => {
        setDraggedItem(todo);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        if (!draggedItem) return;

        const updatedTodo = { ...draggedItem };

        // Update todo status based on column
        switch (columnId) {
            case "todo":
                updatedTodo.completed = false;
                updatedTodo.inProgress = false;
                updatedTodo.inReview = false;
                break;
            case "in-progress":
                updatedTodo.completed = false;
                updatedTodo.inProgress = true;
                updatedTodo.inReview = false;
                break;
            case "review":
                updatedTodo.completed = false;
                updatedTodo.inProgress = false;
                updatedTodo.inReview = true;
                break;
            case "done":
                updatedTodo.completed = true;
                updatedTodo.inProgress = false;
                updatedTodo.inReview = false;
                break;
        }

        updateMutation.mutate({ id: draggedItem.id, data: updatedTodo });
        setDraggedItem(null);
    };

    const handleCreateTodo = (formData) => {
        const newTodo = {
            ...formData,
            completed: newTodoColumn === "done",
            inProgress: newTodoColumn === "in-progress",
            inReview: newTodoColumn === "review",
            priority: formData.priority || "medium",
            dueDate: formData.dueDate || null,
        };
        createMutation.mutate(newTodo);
    };

    const handleUpdateTodo = (formData) => {
        updateMutation.mutate({ id: editingTodo.id, data: formData });
    };

    const handleDeleteTodo = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="error">Error loading todos</div>;

    return (
        <div className="kanban-board">
            <div className="board-header">
                <div className="board-title">
                    <Target size={24} />
                    <h1>Project Board</h1>
                </div>
                <motion.button
                    className="add-task-btn"
                    onClick={() => setShowCreateForm(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={18} />
                    Add Task
                </motion.button>
            </div>

            <div className="kanban-columns">
                {columns.map((column) => {
                    const columnTodos = getColumnTodos(column.id);

                    return (
                        <motion.div
                            key={column.id}
                            className="kanban-column"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div
                                className="column-header"
                                style={{ backgroundColor: column.bgColor }}
                            >
                                <div className="column-title">
                                    <span style={{ color: column.color }}>
                                        {column.icon}
                                    </span>
                                    <h3>{column.title}</h3>
                                    <span className="task-count">
                                        {columnTodos.length}
                                    </span>
                                </div>
                                <motion.button
                                    className="add-column-task"
                                    onClick={() => {
                                        setNewTodoColumn(column.id);
                                        setShowCreateForm(true);
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Plus size={16} />
                                </motion.button>
                            </div>

                            <div className="column-tasks">
                                <AnimatePresence>
                                    {columnTodos.map((todo) => (
                                        <motion.div
                                            key={todo.id}
                                            className="task-card"
                                            draggable
                                            onDragStart={(e) =>
                                                handleDragStart(e, todo)
                                            }
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            whileHover={{
                                                y: -2,
                                                boxShadow:
                                                    "0 8px 25px rgba(0,0,0,0.15)",
                                            }}
                                            layout
                                        >
                                            <div className="task-content">
                                                <h4>{todo.title}</h4>
                                                {todo.body && (
                                                    <p>{todo.body}</p>
                                                )}

                                                <div className="task-meta">
                                                    {todo.priority && (
                                                        <span
                                                            className={`priority priority-${todo.priority}`}
                                                        >
                                                            {todo.priority}
                                                        </span>
                                                    )}
                                                    {todo.dueDate && (
                                                        <span className="due-date">
                                                            <Calendar
                                                                size={12}
                                                            />
                                                            {new Date(
                                                                todo.dueDate
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="task-footer">
                                                    <div className="task-assignee">
                                                        <User size={14} />
                                                        <span>
                                                            User {todo.userId}
                                                        </span>
                                                    </div>

                                                    <div className="task-actions">
                                                        <motion.button
                                                            onClick={() =>
                                                                setEditingTodo(
                                                                    todo
                                                                )
                                                            }
                                                            whileHover={{
                                                                scale: 1.1,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.9,
                                                            }}
                                                        >
                                                            <Edit3 size={14} />
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() =>
                                                                handleDeleteTodo(
                                                                    todo.id
                                                                )
                                                            }
                                                            className="delete-btn"
                                                            whileHover={{
                                                                scale: 1.1,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.9,
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Create/Edit Todo Modal */}
            <AnimatePresence>
                {(showCreateForm || editingTodo) && (
                    <TodoModal
                        todo={editingTodo}
                        onSubmit={
                            editingTodo ? handleUpdateTodo : handleCreateTodo
                        }
                        onClose={() => {
                            setShowCreateForm(false);
                            setEditingTodo(null);
                        }}
                        isLoading={
                            createMutation.isLoading || updateMutation.isLoading
                        }
                        defaultColumn={newTodoColumn}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Todo Modal Component
const TodoModal = ({ todo, onSubmit, onClose, isLoading, defaultColumn }) => {
    const [formData, setFormData] = useState({
        title: todo?.title || "",
        body: todo?.body || "",
        priority: todo?.priority || "medium",
        dueDate: todo?.dueDate || "",
        userId: todo?.userId || 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="todo-modal"
                initial={{ opacity: 0, scale: 0.7, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>{todo ? "Edit Task" : "Create New Task"}</h2>
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="todo-form">
                    <div className="form-group">
                        <label>Task Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter task title"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="body"
                            value={formData.body}
                            onChange={handleInputChange}
                            placeholder="Enter task description"
                            rows="4"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Saving..."
                                : todo
                                ? "Update Task"
                                : "Create Task"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Todos;
