import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, authenticatedFetch, refreshAccessToken, setAccessToken } from '@/lib/auth-api';
import { toast } from 'sonner';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface User {
    id: string;
    email: string;
    name?: string;
    role: 'ADMIN' | 'CLIENT';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: any, requiredRole?: 'ADMIN' | 'CLIENT') => Promise<void>;
    signInWithGoogle: (requiredRole?: 'ADMIN' | 'CLIENT') => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (data: { email: string; otp: string; newPassword: any }) => Promise<void>;
    setSession: (user: User, token: string, refreshToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setSession = (user: User, token: string, refreshToken: string) => {
        setAccessToken(token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const initAuth = async () => {
        const token = await refreshAccessToken();
        if (token) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        initAuth();
    }, []);

    const login = async (credentials: any, requiredRole?: 'ADMIN' | 'CLIENT') => {
        try {
            const data = await apiRequest('/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            if (requiredRole && data.user.role !== requiredRole) {
                throw new Error(`Unauthorized: This gateway is for ${requiredRole.toLowerCase()}s only.`);
            }

            setSession(data.user, data.token, data.refreshToken);
            toast.success('Welcome back!');
        } catch (error: any) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (credentials: any) => {
        try {
            const data = await apiRequest('/register', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            setSession(data.user, data.token, data.refreshToken);
            toast.success('Account created successfully!');
        } catch (error: any) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const signInWithGoogle = async (requiredRole?: 'ADMIN' | 'CLIENT') => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            const data = await apiRequest('/google', {
                method: 'POST',
                body: JSON.stringify({ idToken }),
            });

            if (requiredRole && data.user.role !== requiredRole) {
                throw new Error(`Unauthorized: This gateway is for ${requiredRole.toLowerCase()}s only.`);
            }

            setSession(data.user, data.token, data.refreshToken);
            toast.success('Signed in with Google');
        } catch (error: any) {
            console.error('Google Sign-In failed', error);
            throw error;
        }
    };

    const requestPasswordReset = async (email: string) => {
        try {
            await apiRequest('/recovery/request', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
            toast.info('Verification code sent to your email');
        } catch (error: any) {
            console.error('Recovery request failed', error);
            throw error;
        }
    };

    const resetPassword = async (data: { email: string; otp: string; newPassword: any }) => {
        try {
            await apiRequest('/recovery/verify', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            toast.success('Password updated successfully!');
        } catch (error: any) {
            console.error('Password reset failed', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await apiRequest('/logout', {
                    method: 'POST',
                    body: JSON.stringify({ refreshToken }),
                });
            }
        } catch (error) {
            // Ignore logout errors
        } finally {
            setAccessToken(null);
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            toast.info('Logged out');
        }
    };

    // Listen for automatic logout events (e.g. refresh token expired)
    useEffect(() => {
        const handleLogout = () => logout();
        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            signInWithGoogle,
            register,
            logout,
            requestPasswordReset,
            resetPassword,
            setSession
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
