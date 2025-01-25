import React, { useState } from 'react';
import UserContext from './userContext';

export function UserState(props) {
    const [user, setUser] = useState({ name: '', email: '' });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
};
