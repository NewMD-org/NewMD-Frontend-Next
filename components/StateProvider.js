import { createContext, useState } from 'react';

const State = createContext();

export const ClickProvider = ({ children }) => {
    const [state, setState] = useState('');

    return (
        <State value={{ state, setState }}>
            {children}
        </State>
    );
};

export default State;