import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUserProfile = async () => {

            try {
                const { data } = await axios.get('/api/users/getUser', { withCredentials: true});

                setUser(data);
            } catch (error) {
                setUser(null);
                console.error("Error Fetching User Profile: ", error);
            } finally {
                setLoading(false);
            }

        };

        if(!user) {
            fetchUserProfile();
        }

    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );

}

