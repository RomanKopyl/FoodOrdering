import { Session } from "@supabase/supabase-js";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Tables } from "../types";

type AuthData = {
  session: Session | null
  profile: Tables<'profiles'> | null
  loading: boolean
  isAdmin: boolean
};

export const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSesstion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        // fetch profile
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data ?? null);     
      };

      setLoading(false);
    };

    fetchSesstion();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      profile,
      loading,
      isAdmin: profile?.group === 'ADMIN',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);