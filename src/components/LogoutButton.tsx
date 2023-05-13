"use client";
import useAuth from "@/hooks/useAuth";

const LogoutButton = () => {
  const { signOut, session } = useAuth();
  return <div>{session && <button onClick={signOut}>ログアウト</button>}</div>;
};

export default LogoutButton;
