import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('UX');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        await onAddTask(title.trim(), category);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Ny Uppgift</h3>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titel..."
                required
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="UX">UX</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
            </select>
            <button type="submit">Skapa Uppgift</button>
        </form>
    );
};

export default TaskForm;