import {createContext, useContext, useEffect, useState} from "react";
import { clearLocalStorageExcept } from "../utils/cache.ts";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
    login: (name: string, email: string, password: string) => Promise<{ success: boolean }>;
    logout: () => Promise<void>;
    user: Record<string, any> | null;
    loading: boolean;
    message: { type: 'success' | 'error', text: string } | null;
};

const AuthContext = createContext<null | AuthContextType>(null);

const AuthProvider = ({ children }: any) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<Record<string, any> | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const validateEmail = (email: string): boolean =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password: string): boolean => password.length >= 6;
    const navigate = useNavigate();

    // This is how we will persist the user
    useEffect(() => {
        const fetch = async () => {
            const isUser = await localStorage.getItem("user");
            if (isUser){
                const token = localStorage.getItem("token")
                const jsonUser = JSON.parse(isUser);
                setUser(jsonUser)
                setToken(token);
                navigate("/Dashboard")
            }
        }
        fetch()
    }, [])

    const login = async (name: string, email: string, password: string): Promise<{ success: boolean }> => {
        try {
            setLoading(true);
            if (!name || !email || !validateEmail(email) || !validatePassword(password)) {
                setMessage({
                    type: 'error',
                    text: 'Please fill all fields correctly',
                });
                setLoading(false);
                return { success: false };
            }

            const response = await fetch("https://canroute.onrender.com/api/v1/users/admin-sign-in", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const result = await response.json();
            console.log("DEBUGGIGING: ", result);
            if (!result.success) {
                throw new Error(result?.error || "Login failed");
            }

            setUser(result.data.user);
            setToken(result.data.token);
            await localStorage.setItem("user", JSON.stringify(result.data.user));
            await localStorage.setItem("token", result.data.token);
            setMessage({
                type: 'success',
                text: 'Login successful! Welcome back.',
            });
            navigate("/Dashboard");
            setLoading(false);
            return { success: true };

        } catch (error: any) {
            setLoading(false);
            setMessage({
                type: 'error',
                text: error.message || "Incorrect email or password",
            });
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            setUser(null);
            setToken(null);
            await clearLocalStorageExcept([]); // clears everything
            navigate("/Home");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ login, logout, user, loading, message }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;
