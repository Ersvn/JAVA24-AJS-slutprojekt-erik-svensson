import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAXGewG2BCWKeuUEXtXk3qykDCehp8oLHk',
    authDomain: 'ajs-java24.firebaseapp.com',
    projectId: 'ajs-java24',
    storageBucket: 'ajs-java24.firebasestorage.app',
    messagingSenderId: '610340807123',
    appId: '1:610340807123:web:ed6716b7764c8a71000f26'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);