import React from 'react';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, members, onAssign, onComplete, onDelete }) => {
    return (
        <div className="column">
            <h3>{title}</h3>
            {tasks.map(task => (
                <TaskCard
                    key={task.id}
                    task={task}
                    members={members}
                    onAssign={onAssign}
                    onComplete={onComplete}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default TaskColumn;