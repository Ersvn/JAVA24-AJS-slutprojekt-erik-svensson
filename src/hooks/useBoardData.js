import { useEffect, useState } from 'react';
import {collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc} from 'firebase/firestore';
import { db } from '../firebase';

export const useBoardData = () => {
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const unsubMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
            setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
            setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubMembers();
            unsubTasks();
        };
    }, []);

    const addMember = async (name, role) => {
        await addDoc(collection(db, 'members'), { name, role });
    };

    const deleteMember = async (id) => {
        const memberToDelete = members.find(m => m.id === id);

        if (memberToDelete) {
            const affectedTasks = tasks.filter(t => t.assignedTo === memberToDelete.name);

            for (const task of affectedTasks) {
                await updateDoc(doc(db, 'tasks', task.id), {
                    status: 'new',
                    assignedTo: null
                });
            }
        }

        await deleteDoc(doc(db, 'members', id));
    };

    const addTask = async (title, category) => {
        await addDoc(collection(db, 'tasks'), {
            title,
            category,
            status: 'new',
            timestamp: new Date().toISOString(),
            assignedTo: null
        });
    };

    const assignTask = async (taskId, memberId) => {
        const member = members.find(m => m.id === memberId);
        const task = tasks.find(t => t.id === taskId);

        if (!member || !task) {
            throw new Error('Kunde inte hitta medlem eller uppgift.');
        }

        if (task.status !== 'new') {
            throw new Error('Bara uppgifter med status "new" kan tilldelas.');
        }

        if (member.role !== task.category) {
            throw new Error(`Fel: Endast en ${task.category}-medlem kan ta denna uppgift!`);
        }

        await updateDoc(doc(db, 'tasks', taskId), {
            status: 'in progress',
            assignedTo: member.name
        });
    };

    const completeTask = async (id) => {
        const task = tasks.find(t => t.id === id);

        if (!task || task.status !== 'in progress') {
            throw new Error('Bara uppgifter med status "in progress" kan markeras som klara.');
        }

        await updateDoc(doc(db, 'tasks', id), {
            status: 'finished'
        });
    };

    const deleteTask = async (id) => {
        const task = tasks.find(t => t.id === id);

        if (!task || task.status !== 'finished') {
            throw new Error('Bara uppgifter med status "finished" kan raderas.');
        }

        await deleteDoc(doc(db, 'tasks', id));
    };

    return { members, tasks, addMember, deleteMember, addTask, assignTask, completeTask, deleteTask };
};