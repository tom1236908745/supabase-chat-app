"use client";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null); // ログイン状態を管理

  useEffect(() => {
    // ログイン状態の変化を監視
    const { data: authData } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    // リスナーの解除
    return () => authData.subscription.unsubscribe();
  }, []);
};
