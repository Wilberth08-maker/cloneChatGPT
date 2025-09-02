import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {

    const [darkMode, setDarkMode] = useState(() => {

        const savedMode = localStorage.getItem('darkMode');

        return savedMode === 'true';

    });

    useEffect(() => {

        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('darkMode', darkMode.toString());

    }, [darkMode]);

    const darkModeStyle = {
        darkMode,
        setDarkMode
    }

    return (
        <DarkModeContext.Provider value={darkModeStyle}>
            {children}
        </DarkModeContext.Provider>
    );
};