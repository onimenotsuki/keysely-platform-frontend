import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithOtp: (
    email: string
  ) => Promise<{ error: Error | null; data?: { user: User | null; session: Session | null } }>;
  verifyOtp: (
    email: string,
    token: string,
    type?: 'email' | 'sms'
  ) => Promise<{ error: Error | null; data?: { user: User | null; session: Session | null } }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOtp = async (email: string) => {
    const { data, error } = await supabase.functions.invoke('auth-email-handler', {
      body: {
        user: { email },
        email_data: {
          redirect_to: `${window.location.origin}/auth/callback`,
        },
      },
    });

    return { error, data };
  };

  const verifyOtp = async (email: string, token: string, type: 'email' | 'sms' = 'email') => {
    // We ignore 'type' here as the custom edge function handles it specifically for this flow
    const { data, error } = await supabase.functions.invoke('validate-session-custom', {
      body: {
        email,
        otp_code: token,
      },
    });

    if (error) {
      return { error, data: null };
    }

    if (data?.session) {
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession(
        data.session
      );
      return { error: sessionError, data: sessionData };
    }

    return { error: new Error('No session returned from validation'), data: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signInWithOtp,
    verifyOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
