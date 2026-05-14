# syntax=docker/dockerfile:1
# Python 3.13-slim + uv (公式イメージから COPY) + Playwright Chromium
# 用途: update.sh のワンショット実行（価格スクレイプ → pricing.json 更新）

FROM python:3.13-slim

# uv 最新版を公式 Docker イメージからコピー（curl インストール不要）
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
COPY --from=ghcr.io/astral-sh/uv:latest /uvx /usr/local/bin/uvx

# Playwright --with-deps が内部で apt-get を使うため bash と ca-certificates が必要
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── 依存レイヤー（pyproject.toml / uv.lock 変更時のみ再実行）───────────────────
COPY scraper/pyproject.toml scraper/uv.lock scraper/.python-version ./scraper/

# 本番依存のみインストール（dev グループ除外）
RUN uv sync --project ./scraper --frozen --no-dev

# Playwright Chromium + 必要な Linux システムライブラリを一括インストール
# このレイヤーは約 300–500 MB。uv sync の後に置くことでキャッシュ効率を最大化
RUN uv run --project ./scraper playwright install --with-deps chromium

# ── ソースコピー（ランタイムではバインドマウントで上書き可）──────────────────────
COPY scraper/ ./scraper/
COPY update.sh pricing.json ./

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    # Docker 内ルート実行では Chromium が --no-sandbox を要求するため有効化
    # browser.py が PLAYWRIGHT_NO_SANDBOX=1 を読んで起動引数を切り替える
    PLAYWRIGHT_NO_SANDBOX=1

CMD ["bash", "update.sh"]
