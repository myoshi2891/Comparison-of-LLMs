import type { Metadata } from "next";
import SlashCommandsGuideClient from "./SlashCommandsGuideClient";

export const metadata: Metadata = {
  title: "Claude Code スラッシュコマンド完全ガイド 2026",
  description:
    "Claude Code セッションを制御するためのショートカット（スラッシュコマンド）を網羅した完全ガイド。セッション管理からモデル設定、実践ワークフローまでを解説。",
};

/**
 * Renders the page that displays the Claude Code slash commands guide.
 *
 * @returns The React element tree containing the `SlashCommandsGuideClient` component.
 */
export default function Page() {
  return <SlashCommandsGuideClient />;
}
