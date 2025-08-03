"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: Error | null;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {

        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Error getting initial session:', sessionError);
                    setError(sessionError);
                    setLoading(false);
                    return;
                }

                setSession(initialSession);
                setUser(initialSession?.user ?? null);
            } catch (err) {
                console.error('Error initializing auth:', err);
                setError(err instanceof Error ? err : new Error('Failed to initialize authentication'));
            } finally {
                setLoading(false);
            }
        };

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                setSession(newSession);
                setUser(newSession?.user ?? null);
                setLoading(false);
            }
        );

        // Initialize auth
        initializeAuth();

        // Cleanup function
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (err) {
            console.error('Error signing out:', err);
            setError(err instanceof Error ? err : new Error('Failed to sign out'));
            throw err;
        }
    };

    const value: AuthContextType = {
        user,
        session,
        loading,
        error,
        signOut,
    };


    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};