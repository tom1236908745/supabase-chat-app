const {useState} from 'react'
const [session, setSession] = useState<Session | null>(null); // ログイン状態を管理

useEffect(() => {
  // ログイン状態の変化を監視
  const { data: authData } = supabase.auth.onAuthStateChange((_, session) => {
    setSession(session);
  });

  // リスナーの解除
  return () => authData.subscription.unsubscribe();
}, []);
