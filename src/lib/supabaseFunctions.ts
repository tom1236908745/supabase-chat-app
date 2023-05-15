import { log } from "console";
import supabase, { Database } from "./supabase";

// テーブル名
export const TABLE_NAME = "chat-app";

/**
 * supabaseからデータを取得
 */
export const fetchDatabase = async () => {
  try {
    const { data } = await supabase.from(TABLE_NAME).select("*");
    // TODO: order確認する
    // .order("createdAt");
    return data;
  } catch (error) {
    console.error(error);
  }
};

type InsertProps = Pick<Database, "message" | "nickName" | "avatarUrl">;

/**
 * データベースに必要なデータを追加する関数
 * @param {string} message
 * @param {string} avatarUrl
 * @param {string} nickName
 */
export const addSupabaseData = async ({
  message,
  avatarUrl,
  nickName,
}: InsertProps) => {
  try {
    await supabase.from(TABLE_NAME).insert({ message, avatarUrl, nickName });
  } catch (error) {
    console.error(error);
  }
};
