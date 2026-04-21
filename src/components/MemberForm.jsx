import React, { useState } from 'react';

const MemberForm = ({ onAddMember, members, onDeleteMember }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('UX');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        await onAddMember(name.trim(), role);
        setName('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>Ny Medlem</h3>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Namn"
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="UX">UX</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                </select>
                <button type="submit">Lägg till</button>
            </form>

            <div className="member-display-list">
                <p><b>Medlemmar:</b></p>
                {members.map((m) => (
                    <div key={m.id} className="member-item">
                        <small>{m.name} ({m.role})</small>
                        <button
                            className="delete-btn-small"
                            onClick={() => onDeleteMember(m.id)}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberForm;