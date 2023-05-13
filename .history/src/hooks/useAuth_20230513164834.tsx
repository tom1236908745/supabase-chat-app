"use client";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null); // ログイン状態を管理
  // GitHubでサインイン
  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });
      if (error) {
        setError(error.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        console.error("GitHubとの連携に失敗しました。");
      }
    }
  };

  // ログインユーザーのプロフィール取得: GitHub
  const profileFromGithub: {
    nickName: string;
    avatarUrl: string;
  } = {
    nickName: session?.user?.user_metadata.user_name,
    avatarUrl: session?.user?.user_metadata.avatar_url,
  };
  useEffect(() => {
    // ログイン状態の変化を監視
    const { data: authData } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    // リスナーの解除
    return () => authData.subscription.unsubscribe();
  }, []);
};
