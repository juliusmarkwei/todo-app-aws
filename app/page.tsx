"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    // Fetch todos on mount
    useEffect(() => {
        fetchTodosInitial();
    }, []);

    const fetchTodosInitial = async () => {
        toast.promise(
            fetch("/api/todos")
                .then((res) => res.json())
                .then((data) => {
                    setTodos(data.todos);
                }),
            {
                loading: "Fetching todos...",
                success: "Todos fetched successfully!",
                error: "Failed to fetch todos.",
            }
        );
    };

    const fetchTodos = async () => {
        const response = await fetch("/api/todos");
        if (response.ok) {
            const data = await response.json();
            setTodos(data.todos);
        }
    };

    const addTodo = async (
        e: React.KeyboardEvent<HTMLInputElement>
    ): Promise<void> => {
        if (e.key === "Enter" && newTodo.trim()) {
            toast
                .promise(
                    fetch("/api/todos", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: newTodo.trim() }),
                    }).then((res) => res.json()),
                    {
                        loading: "Adding todo...",
                        success: "Todo added successfully!",
                        error: "Failed to add todo.",
                    }
                )
                .then((todo: Todo) => {
                    setNewTodo("");
                    fetchTodos();
                });
        }
    };

    const toggleTodo = async (
        id: string,
        title: string,
        completed: boolean
    ): Promise<void> => {
        toast
            .promise(
                fetch("/api/todos", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, title, completed: !completed }),
                }).then((res) => res.json()),
                {
                    loading: "Updating todo...",
                    success: "Todo updated successfully!",
                    error: "Failed to update todo.",
                }
            )
            .then((updatedTodo: Todo) => {
                fetchTodos();
            });
    };

    const deleteTodo = async (id: string) => {
        toast
            .promise(
                fetch("/api/todos", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                }),
                {
                    loading: "Deleting todo...",
                    success: "Todo deleted successfully!",
                    error: "Failed to delete todo.",
                }
            )
            .then(() => {
                fetchTodos();
            });
    };

    const startEditing = (id: string, title: string) => {
        setEditingId(id);
        setEditTitle(title);
    };

    const saveEdit = async (id: string, completed: boolean) => {
        if (editTitle.trim()) {
            toast
                .promise(
                    fetch("/api/todos", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id,
                            title: editTitle.trim(),
                            completed,
                        }),
                    }).then((res) => res.json()),
                    {
                        loading: "Saving changes...",
                        success: "Todo updated successfully!",
                        error: "Failed to update todo.",
                    }
                )
                .then(() => {
                    fetchTodos();
                    setEditTitle("");
                    setEditingId(null);
                });
        }
        setEditingId(null);
    };

    return (
        <div className="todoapp">
            <header className="header">
                <h1>todos</h1>
                <input
                    className="new-todo"
                    placeholder="What needs to be done?"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={addTodo}
                    autoFocus
                />
            </header>
            <section className="main">
                <ul className="todo-list">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className={todo.completed ? "completed" : ""}
                        >
                            <div className="view">
                                <input
                                    className="toggle"
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() =>
                                        toggleTodo(
                                            todo.id,
                                            todo.title,
                                            todo.completed
                                        )
                                    }
                                />
                                {editingId === todo.id ? (
                                    <input
                                        className="edit"
                                        value={editTitle}
                                        onChange={(e) =>
                                            setEditTitle(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            saveEdit(todo.id, todo.completed)
                                        }
                                        onBlur={() =>
                                            saveEdit(todo.id, todo.completed)
                                        }
                                        autoFocus
                                    />
                                ) : (
                                    <label
                                        onDoubleClick={() =>
                                            startEditing(todo.id, todo.title)
                                        }
                                    >
                                        {todo.title}
                                    </label>
                                )}
                                <button
                                    className="destroy"
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    x
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
