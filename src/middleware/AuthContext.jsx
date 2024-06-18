// src/middleware/AuthContext.jsx
import {createContext, useState, useEffect} from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        setIsLoading(true); // ustawienie na true przed rozpoczęciem zapytania
        try {
            await axios.get('http://localhost:8080/api/v1/auth/check', {withCredentials: true})
                .then(response => {
                    if (response.status === 200) {
                        setIsAuthenticated(true);
                        setUser(response.data);
                        console.log(response.data);
                    }
                    else {
                        setIsAuthenticated(false);
                    }
                });
        } catch (error) {
            console.log(error);
            setIsAuthenticated(false);
            await axios.post('http://localhost:8080/logout', {}, {withCredentials: true});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, checkAuthentication, user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};