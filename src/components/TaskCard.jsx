import React from 'react';

const TaskCard = ({ task, members, onAssign, onComplete, onDelete }) => {
    const date = new Date(task.timestamp).toLocaleString([],
        {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

    return (
        <div className="task-card">
            <h4>{task.title}</h4>
            <div className="task-info">
                <span className="tag">{task.category}</span>
                <small>{date}</small>
            </div>

            {task.status === 'new' && (
                <select onChange={(e) => onAssign(task.id, e.target.value)} defaultValue="">
                    <option value="" disabled>Tilldela...</option>
                    {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                </select>
            )}

            {task.status === 'in progress' && (
                <div>
                    <p><small>Ansvarig: {task.assignedTo}</small></p>
                    <button onClick={() => onComplete(task.id)}>Klar</button>
                </div>
            )}

            {task.status === 'finished' && (
                <div>
                    <p><small>Utförd av: {task.assignedTo}</small></p>
                    <button className="delete-btn" onClick={() => onDelete(task.id)}>Radera</button>
                </div>
            )}
        </div>
    );
};

export default TaskCard;