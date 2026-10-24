import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/claude/self-hosted-sandboxes 契約テスト", () => {
  it("metadata.title が非空文字列である", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
  });

  it("metadata.description が非空文字列である", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("h1 に Claude Self-hosted Sandboxes が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("Claude Self-hosted Sandboxes");
  });

  it("h1 に 完全ガイド が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("完全ガイド");
  });

  it("h2 が 13 本（セクション数と一致）", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h2").length).toBe(13);
  });

  it("外部リンクに target=_blank と rel=noopener noreferrer が付与されている", () => {
    const { container } = render(<Page />);
    const external = Array.from(container.querySelectorAll('a[href^="http"]'));
    for (const a of external) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンク（/ 始まり）に .html 拡張子がない", () => {
    const { container } = render(<Page />);
    const internal = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      (a.getAttribute("href") ?? "").startsWith("/")
    );
    for (const a of internal) {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });

  it("チェックボックスが機能し、クリックで aria-checked が切り替わる", () => {
    const { container } = render(<Page />);
    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    expect(checkboxes.length).toBeGreaterThan(0);

    const firstCheckbox = checkboxes[0];
    expect(firstCheckbox.getAttribute("aria-checked")).toBe("false");

    // クリック
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.getAttribute("aria-checked")).toBe("true");

    // 再度クリック
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.getAttribute("aria-checked")).toBe("false");
  });

  it("チェックボックスがキー入力（Enter/Space）で切り替わる", () => {
    const { container } = render(<Page />);
    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    const firstCheckbox = checkboxes[0];

    expect(firstCheckbox.getAttribute("aria-checked")).toBe("false");

    // Spaceキー
    fireEvent.keyDown(firstCheckbox, { key: " ", code: "Space" });
    expect(firstCheckbox.getAttribute("aria-checked")).toBe("true");

    // Enterキー
    fireEvent.keyDown(firstCheckbox, { key: "Enter", code: "Enter" });
    expect(firstCheckbox.getAttribute("aria-checked")).toBe("false");
  });

  it("Memory 利用時は mount_path ではなく書き込み可能な親ディレクトリをマウントするよう案内する", () => {
    const { container } = render(<Page />);
    const note = Array.from(container.querySelectorAll("p")).find((p) =>
      p.textContent?.startsWith("Memory を使う場合")
    );
    expect(note?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Memory を使う場合： --read-only ではルートファイルシステムに書き込めないため、SDK ワーカーがメモリストアを同期する親ディレクトリ（例: /mnt/memory）にも書き込み可能なマウントが必要です。上記の /tmp と /mnt/session/outputs に加えて、書き込み可能なマウントを追加し、ワーカーを実行するユーザーがこの親ディレクトリに書き込めるようにしてください。使い捨てのサンドボックスでは --tmpfs /mnt/memory を推奨します（ワーカーがサンドボックス終了前に内容をストアへ同期するため、ホストへのマウントは不要です）。-v /host/memory:/mnt/memory でホストのディレクトリを使う場合は、ワーカーを実行するユーザー以外が読み書きできないようアクセスを制限し、ワーカーが異常終了した後は残ったストアのディレクトリを削除してください（kill されたワーカーは終了処理を実行しないため、未同期の変更は失われ、ディレクトリが残ります）。各ストアの mount_path のディレクトリはワーカーがセッション開始時に作成し終了時に削除するため、mount_path に直接マウントしないでください（パスが既に存在するとワーカーはセッションの処理を開始しません）。同じ /host/memory を複数のセッションで共有すると、同時に動くセッションが同じストアのパスを奪い合って競合します。セッションが重なる場合は、セッションごとに別のファイルシステムを割り当てるか、コンテナごとに独立した --tmpfs /mnt/memory を使ってください。"
    );
  });

  it("Memory の制限 callout は ant CLI 1.33.0 以降でも対応すると案内する", () => {
    const { container } = render(<Page />);
    const note = Array.from(container.querySelectorAll("p")).find((p) =>
      p.textContent?.startsWith("制限：")
    );
    expect(note?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "制限： Self-hosted サンドボックスの Memory（永続メモリ） は 2026年8月19日から利用可能になりました。Python / TypeScript / Go の SDK ワーカー、または ant CLI 1.33.0 以降が、アタッチされたメモリストアを mount_path にダウンロードし、変更をストアへ同期します（1.33.0 より前の ant CLI は要件を満たしません）。Claude Platform on AWS と Claude Models on Google Cloud（Anthropic managed）では、Self-hosted 環境のセッションにメモリストアを利用できません。また、ant CLI と Python / TypeScript / Go SDK の組み込みワーカーは Claude Models on Google Cloud（Anthropic managed）に対応していないため、同環境では Environments Work エンドポイントを直接呼ぶ独自ワーカーを実装してください。"
    );
  });

  it("運用チェックリストの Memory 項目は SDK ワーカーと ant CLI 1.33.0 以降の両方を同期手段として挙げる", () => {
    const { container } = render(<Page />);
    const item = Array.from(container.querySelectorAll("li")).find((li) =>
      li.textContent?.includes("Memory ストアは")
    );
    expect(item?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Memory ストアは SDK ワーカーまたは ant CLI（1.33.0 以降）経由で同期される（AWS と Claude Models on Google Cloud（Anthropic managed）では利用不可）ことを把握している"
    );
  });
});
