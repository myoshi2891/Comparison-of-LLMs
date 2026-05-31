import type { Metadata } from "next";
import SlashCommandsGuideClient from "./SlashCommandsGuideClient";

export const metadata: Metadata = {
  title: "Claude Code スラッシュコマンド完全ガイド 2026",
  description:
    "Claude Code セッションを制御するためのショートカット（スラッシュコマンド）を網羅した完全ガイド。セッション管理からモデル設定、実践ワークフローまでを解説。",
};

export default function Page() {
  return <SlashCommandsGuideClient />;
}
