import React, { useMemo, useState } from 'react';
import { useBoardData } from './hooks/useBoardData';
import MemberForm from './components/MemberForm';
import TaskForm from './components/TaskForm';
import TaskColumn from './components/TaskColumn';
import './index.css';

const App = () => {
    const {
        members,
        tasks,
        addMember,
        deleteMember,
        addTask,
        assignTask,
        completeTask,
        deleteTask
    } = useBoardData();

    const [error, setError] = useState('');
    const [filterMember, setFilterMember] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortField, setSortField] = useState('timestamp');
    const [sortOrder, setSortOrder] = useState('desc');

    const handleAddMember = async (name, role) => {
        try {
            setError('');
            await addMember(name, role);
        } catch (err) {
            setError(err.message || 'Kunde inte lägga till medlem.');
        }
    };

    const handleDeleteMember = async (id) => {
        try {
            setError('');
            await deleteMember(id);
        } catch (err) {
            setError(err.message || 'Kunde inte ta bort medlem.');
        }
    };

    const handleAddTask = async (title, category) => {
        try {
            setError('');
            await addTask(title, category);
        } catch (err) {
            setError(err.message || 'Kunde inte skapa uppgift.');
        }
    };

    const handleAssign = async (taskId, memberId) => {
        try {
            setError('');
            await assignTask(taskId, memberId);
        } catch (err) {
            setError(err.message || 'Kunde inte tilldela uppgiften.');
        }
    };

    const handleComplete = async (taskId) => {
        try {
            setError('');
            await completeTask(taskId);
        } catch (err) {
            setError(err.message || 'Kunde inte markera uppgiften som klar.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            setError('');
            await deleteTask(taskId);
        } catch (err) {
            setError(err.message || 'Kunde inte radera uppgiften.');
        }
    };

    const filteredTasks = useMemo(() => {
        const result = tasks.filter((t) => {
            const matchesMember = filterMember === 'All' || t.assignedTo === filterMember;
            const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
            return matchesMember && matchesCategory;
        });

        result.sort((a, b) => {
            let comparison = 0;

            if (sortField === 'timestamp') {
                comparison = new Date(a.timestamp) - new Date(b.timestamp);
            } else if (sortField === 'title') {
                comparison = a.title.localeCompare(b.title, 'sv');
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [tasks, filterMember, filterCategory, sortField, sortOrder]);

    return (
        <div className="app-container">
            <h1>Scrum Board</h1>
            {error && <div className="error-banner">{error}</div>}

            <div className="setup-section">
                <div className="form-box">
                    <MemberForm
                        onAddMember={handleAddMember}
                        members={members}
                        onDeleteMember={handleDeleteMember}
                    />
                </div>
                <div className="form-box">
                    <TaskForm onAddTask={handleAddTask} />
                </div>
            </div>

            <div className="filter-bar">
                <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)}>
                    <option value="All">Alla medlemmar</option>
                    {members.map((m) => (
                        <option key={m.id} value={m.name}>
                            {m.name}
                        </option>
                    ))}
                </select>

                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="All">Alla kategorier</option>
                    <option value="UX">UX</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                </select>

                <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                    <option value="timestamp">Sortera: Tid</option>
                    <option value="title">Sortera: Titel</option>
                </select>

                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="desc">Fallande</option>
                    <option value="asc">Stigande</option>
                </select>
            </div>

            <main className="board">
                <TaskColumn
                    title="New"
                    tasks={filteredTasks.filter((t) => t.status === 'new')}
                    members={members}
                    onAssign={handleAssign}
                />
                <TaskColumn
                    title="In Progress"
                    tasks={filteredTasks.filter((t) => t.status === 'in progress')}
                    onComplete={handleComplete}
                />
                <TaskColumn
                    title="Finished"
                    tasks={filteredTasks.filter((t) => t.status === 'finished')}
                    onDelete={handleDeleteTask}
                />
            </main>
        </div>
    );
};

export default App;