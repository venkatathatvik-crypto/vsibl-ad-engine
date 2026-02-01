import { toast } from 'sonner';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth`;

interface AuthResponse {
    user: any;
    token: string;
    refreshToken: string;
    message?: string;
    error?: string;
}

// Simple in-memory storage for the access token
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

export const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (accessToken) {
        (headers as any)['Authorization'] = `Bearer ${accessToken}`;
    }

    const fullUrl = `${API_URL}${endpoint}`;
    console.log(`[API Request] ${options.method || 'GET'} ${fullUrl}`);

    const response = await fetch(fullUrl, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw { status: response.status, message: data.error || 'Something went wrong' };
    }

    return data;
};

export const refreshAccessToken = async (): Promise<string | null> => {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) return null;

    try {
        const response = await fetch(`${API_URL}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            setAccessToken(data.token);
            localStorage.setItem('refreshToken', data.refreshToken); // Rotate
            return data.token;
        } else {
            localStorage.removeItem('refreshToken');
            setAccessToken(null);
            window.dispatchEvent(new Event('auth:logout'));
            return null;
        }
    } catch (error) {
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        window.dispatchEvent(new Event('auth:logout'));
        return null;
    }
};

type ApiRequestFunction = (endpoint: string, options?: RequestInit) => Promise<any>;

export const authenticatedFetch: ApiRequestFunction = async (endpoint, options = {}) => {
    try {
        return await apiRequest(endpoint, options);
    } catch (error: any) {
        if (error.status === 401) {
            // Attempt refresh
            const newToken = await refreshAccessToken();
            if (newToken) {
                // Retry original request
                return await apiRequest(endpoint, options);
            }
        }
        throw error;
    }
};
