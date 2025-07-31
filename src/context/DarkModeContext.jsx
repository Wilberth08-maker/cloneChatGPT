import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false); 

    useEffect(() => {

        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

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