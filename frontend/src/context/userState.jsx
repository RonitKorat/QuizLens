import React, { useState, useEffect } from 'react';
import UserContext from './userContext';

export function UserState(props) {
    const [isLoading, setIsLoading] = useState(true);
    
    // Initialize user state from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: '', email: '' };
    });
    
    const [userStats, setUserStats] = useState(() => {
        const savedStats = localStorage.getItem('userStats');
        return savedStats ? JSON.parse(savedStats) : {
            totalQuizzes: 12,
            averageScore: 85,
            quizzesThisWeek: 3,
            streak: 5
        };
    });

    // Set loading to false after initial load
    useEffect(() => {
        setIsLoading(false);
    }, []);

    // Save user data to localStorage whenever it changes
    useEffect(() => {
        if (user.name && user.email) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    // Save user stats to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('userStats', JSON.stringify(userStats));
    }, [userStats]);

    return (
        <UserContext.Provider value={{ user, setUser, userStats, setUserStats, isLoading }}>
            {props.children}
        </UserContext.Provider>
    );
};
