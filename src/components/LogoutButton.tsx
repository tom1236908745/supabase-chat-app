"use client";
import useAuth from "@/hooks/useAuth";

const LogoutButton = () => {
  const { signOut, session } = useAuth();
  return (
    <div>
      {session && (
        <button className="py-2 px-3 rounded-full bg-red-200" onClick={signOut}>
          ログアウト
        </button>
      )}
    </div>
  );
};

export default LogoutButton;
