"use client";
import { Database } from "@/lib/supabase";
import {
  TABLE_NAME,
  addSupabaseData,
  fetchDatabase,
} from "@/lib/supabaseFunctions";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const ChatApp = () => {
  const [inputText, setInputText] = useState(""); // 入力テキスト
  const [messageText, setMessageText] = useState<Database[]>([]); // メッセージ
  const { session: isLogin, profileFromGithub } = useAuth();
  const router = useRouter();

  // ログアウト済みの場合はログインページにリダイレクト
  if (!isLogin) router.push("/");

  // リアルタイムデータ更新
  const fetchRealtimeData = () => {
    try {
      supabase
        .channel("table_postgres_changes") // 任意のチャンネル名
        .on(
          "postgres_changes", // ここは固定
          {
            event: "*", // "INSERT" | "DELETE" | "UPDATE"  条件指定が可能
            schema: "public",
            table: TABLE_NAME, // DBのテーブル名
          },
          (payload) => {
            // データ登録
            if (payload.eventType === "INSERT") {
              console.log("payload: ", payload);
              const { createdAt, id, message, avatarUrl, nickName } =
                payload.new;
              // TODO: ここから
              setMessageText((messageText) => [
                ...messageText,
                { createdAt, id, message, avatarUrl, nickName },
              ]);
            }
          }
        )
        .subscribe();

      // リスナーの解除
      return () => supabase.channel("table_postgres_changes").unsubscribe();
    } catch (error) {
      console.error(error);
    }
  };

  // 初回のみ全データフェッチとリアルタイムリスナー登録
  useEffect(() => {
    (async () => {
      const allMessage = await fetchDatabase();
      setMessageText(allMessage as Database[]); // '{ [x: string]: any; }[] | null'
    })();
    fetchRealtimeData();
  }, []);

  // 入力したメッセージ
  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputText(() => event.target.value);

  // メッセージの送信
  const onSubmitNewMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputText === "") return;
    addSupabaseData({ message: inputText, ...profileFromGithub }); // DBに追加
    setInputText("");
  };

  return (
    <div>
      {messageText &&
        messageText.map((item) => (
          <div key={item.id} data-user-id={item.nickName}>
            <div>
              <a
                href={`https://github.com/${item.nickName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {item.avatarUrl ? (
                  <Image
                    src={item.avatarUrl}
                    alt="アイコン"
                    width={80}
                    height={80}
                  />
                ) : (
                  <Image
                    src="/noimage.png"
                    alt="no image"
                    width={80}
                    height={80}
                  />
                )}
                <p>{item.nickName ? item.nickName : "名無し"}</p>
              </a>
              <p>{item.createdAt}</p>
            </div>
            <p>{item.message}</p>
          </div>
        ))}

      <form onSubmit={onSubmitNewMessage}>
        <input
          type="text"
          name="message"
          value={inputText}
          onChange={onChangeInputText}
          aria-label="新規メッセージを入力"
        />
        <button type="submit" disabled={inputText === ""}>
          送信
        </button>
      </form>
    </div>
  );
};

export default ChatApp;
