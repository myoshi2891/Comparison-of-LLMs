"""3 層フォールバックの出自追跡ユーティリティ。

「スクレイプ成功 → 既存 JSON の値 → ハードコード値」の 2 層目は、本来
**過去に実際にスクレイプ成功した値**を保持するためのもの。しかし判定材料が
`scrape_status`（= その実行でスクレイプが成功したか）しかないと、
スクレイプが 2 回連続で失敗したときに 1 回目で `"fallback"` へ落ちた
過去の成功値が 2 回目で破棄され、ハードコード値まで巻き戻ってしまう。

`FallbackResolver` は `ApiModel.provenance` を読み書きすることでこれを防ぎつつ、
`_FALLBACKS` の月次改定が既存 JSON に固着する逆バグ（2026-09-12 の設計判断）も
再発させない。採用ルールは以下のとおり。

1. `provenance.origin == "scraped"` かつ記録時点のハードコード値が現在の
   `_FALLBACKS` と一致 → 既存値（過去のスクレイプ成功値）を採用
2. ハードコード値が改定されている → ハードコード値を採用（月次更新が勝つ）
3. `provenance` を持たない旧スキーマの JSON → 従来どおり
   `scrape_status == "success"` のときのみ既存値を採用
"""

from __future__ import annotations

from dataclasses import dataclass, field

from scraper.models import ApiModel, PriceProvenance


@dataclass
class FallbackResolver:
    """プロバイダー 1 社分のフォールバック価格と出自を解決する。"""

    provider: str
    hardcoded: dict[str, tuple[float, float]]
    # name -> 採用するフォールバック価格（従来の fallback_map と同じ形）
    prices: dict[str, tuple[float, float]] = field(default_factory=dict)
    # 既存 JSON から引き継いだ出自（= 過去のスクレイプ成功値を採用したモデル）
    carried: dict[str, PriceProvenance] = field(default_factory=dict)

    @classmethod
    def build(
        cls,
        provider: str,
        hardcoded: dict[str, tuple[float, float]],
        existing: list[ApiModel] | None = None,
    ) -> FallbackResolver:
        """既存 JSON とハードコード値からフォールバック解決器を構築する。

        Parameters:
            provider: `ApiModel.provider` と突き合わせるプロバイダー名。
            hardcoded: 各 provider モジュールの `_FALLBACKS`。
            existing: 既存 `pricing.json` から読み込んだ全モデル（None 可）。
        """
        resolver = cls(provider=provider, hardcoded=dict(hardcoded))
        for m in existing or []:
            if m.provider != provider or m.name not in resolver.hardcoded:
                continue
            prov = resolver._adoptable_provenance(m)
            if prov is None:
                continue
            resolver.prices[m.name] = (m.price_in, m.price_out)
            resolver.carried[m.name] = prov
        for name, price in resolver.hardcoded.items():
            resolver.prices.setdefault(name, price)
        return resolver

    def _adoptable_provenance(self, m: ApiModel) -> PriceProvenance | None:
        """既存モデルの価格を採用してよければ、その出自を返す。"""
        fb_in, fb_out = self.hardcoded[m.name]
        if m.provenance is None:
            # 旧スキーマ: scrape_status しか手掛かりがない（従来の挙動を維持）
            if m.scrape_status != "success":
                return None
            return PriceProvenance(origin="scraped", fallback_in=fb_in, fallback_out=fb_out)
        if m.provenance.origin != "scraped":
            return None
        if (m.provenance.fallback_in, m.provenance.fallback_out) != (fb_in, fb_out):
            # ハードコード値が改定された → 月次更新を優先し既存値は捨てる
            return None
        return m.provenance

    def provenance(
        self,
        name: str,
        scraped: bool,
        prices: tuple[float, float] | None = None,
    ) -> PriceProvenance:
        """出力する `ApiModel.provenance` を組み立てる。

        Parameters:
            name: モデル名。
            scraped: 今回の実行で価格を実際に抽出できたか
                （= `scrape_status == "success"`）。入出力で成否が割れた場合は
                False を渡す。保守的に「ハードコード由来」として扱われ、
                次回実行でハードコード値が優先されるだけなので安全側に倒れる。
            prices: 実際に出力する `(price_in, price_out)`。渡された場合、
                引き継いだ出自を返すのは出力価格が引き継ぎ元と**完全に一致**する
                ときだけに限定する。入出力の片方だけ抽出できた部分成功では
                出力が「今回の抽出値 + 引き継ぎ値」の混成になるため、これを
                「過去のスクレイプ成功値」として記録すると、次回実行で
                混成ペアが 2 層目に採用されてしまう。
        """
        fb_in, fb_out = self.hardcoded.get(name, (0.0, 0.0))
        if scraped:
            return PriceProvenance(origin="scraped", fallback_in=fb_in, fallback_out=fb_out)
        carried = self.carried.get(name)
        if carried is not None and (prices is None or prices == self.prices.get(name)):
            # 出力価格は引き継いだ過去のスクレイプ成功値そのもの
            return carried
        return PriceProvenance(origin="hardcoded", fallback_in=fb_in, fallback_out=fb_out)
