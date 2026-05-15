# syntax=docker/dockerfile:1
# oven/bun:1-debian — Bun 最新 1.x + Debian (musl 回避のため alpine 不使用)
# マルチステージ:
#   deps  — bun install のみ（キャッシュ層）
#   dev   — 開発サーバー用（ホットリロード、ソースはバインドマウント）
#   build — CI / 本番ビルド用（静的エクスポート → out/）

# ── deps: 依存インストール層（キャッシュ最大化）──────────────────────────────────
FROM oven/bun:1-debian AS deps
WORKDIR /app

# package.json + bun.lock のみコピーしてキャッシュ層を独立させる
COPY web-next/package.json web-next/bun.lock ./
RUN bun install --frozen-lockfile

# ── dev: 開発サーバー（ホットリロード）──────────────────────────────────────────
FROM oven/bun:1-debian AS dev
WORKDIR /app

# deps 層の node_modules をコピー
# docker-compose.yml の named volume がこの内容を保持し、
# バインドマウントで流入する macOS バイナリを上書きする
COPY --from=deps /app/node_modules ./node_modules

# package.json は Next.js の起動に必要
COPY web-next/package.json web-next/bun.lock ./

EXPOSE 3000
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=development

# ソースは docker-compose でバインドマウントされるためここでは COPY しない
CMD ["bun", "run", "dev"]

# ── build: 静的エクスポート（CI / 本番）─────────────────────────────────────────
FROM deps AS build
WORKDIR /app

# ソース全体をコピー（web-next/data/pricing.json が存在することを前提とする）
# pricing.json が未存在の場合は make scrape を先に実行すること
COPY web-next/ .
COPY --from=deps /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# 静的エクスポート → /app/out/
RUN bun run build
