import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIセキュリティ ベストプラクティスガイド (Failing Metadata) | LLM-Studies",
  description: "Failing Description",
};

export default function AISecurityBestPracticesPage() {
  return (
    <div>
      <h1>別のタイトル</h1>
      <p>このページはテストを失敗させるための仮実装です。</p>
    </div>
  );
}
