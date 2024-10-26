import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchUserProfile = async () => {

            try {
                const { data } = await axios.get('/api/users/getUser', { withCredentials: true});

                setUser(data);
            } catch (error) {
                console.error("Error Fetching User Profile: ", error);
            }

        };

        if(!user) {
            fetchUserProfile();
        }

    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );

}

