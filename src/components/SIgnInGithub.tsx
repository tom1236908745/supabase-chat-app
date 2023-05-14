"use client";
import useAuth from "@/hooks/useAuth";

const SignInGithub = () => {
  const { signInWithGithub, error } = useAuth();

  return (
    <div>
      <button className="rounded-full bg-yellow-200" onClick={signInWithGithub}>
        Githubでサインインする
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};
export default SignInGithub;
