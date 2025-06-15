import React, { createContext, useContext, useState, useEffect } from "react";
import { supabaseHelpers, supabase } from "../lib/supabase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false); // <-- New state

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // --- NEW LOGIC HERE ---
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
        setUser(session?.user ?? null); // Set user so we aren't logged out
        setLoading(false);
        return;
      }

      setIsPasswordRecovery(false); // Ensure it's false for normal flows
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    const { data } = await supabaseHelpers.getProfile(userId);
    setProfile(data);
  };

  const value = {
    user,
    profile,
    loading,
    isPasswordRecovery, // <-- Expose new state
    signIn: supabaseHelpers.signIn,
    signOut: supabaseHelpers.signOut,
    // ... add other helpers you want to expose
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
