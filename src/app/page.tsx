"use client";
import SignInGithub from "@/components/SIgnInGithub";
import ChatApp from "@/components/ChatApp";
import useAuth from "@/hooks/useAuth";

const Home = () => {
  const { session: isLogin } = useAuth();
  return isLogin ? (
    <div>
      <h2>チャットアプリ</h2>
      <ChatApp />
    </div>
  ) : (
    <div>
      <h2>Githubでサインイン</h2>
      <SignInGithub />
    </div>
  );
};
export default Home;
