.PHONY: help \
        build-images build-scraper build-web \
        dev dev-detach \
        scrape scrape-no-scrape \
        build \
        test test-web test-scraper \
        typecheck lint lint-fix format \
        down logs logs-web \
        shell-web shell-scraper \
        clean clean-images

COMPOSE := docker compose

# ── ヘルプ ─────────────────────────────────────────────────────────────────────
help: ## このヘルプを表示
	@echo "LLM-Studies Docker 管理コマンド"
	@echo ""
	@echo "  初回セットアップ: make build-images && make scrape && make dev"
	@echo "  価格更新のみ:     make scrape"
	@echo "  静的ビルド (CI):  make scrape && make build"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ \
	    { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# ── イメージビルド ─────────────────────────────────────────────────────────────
build-images: ## 全 Docker イメージをビルド（scraper + web）
	$(COMPOSE) build

build-scraper: ## scraper イメージのみビルド
	$(COMPOSE) build scraper

build-web: ## web イメージのみビルド
	$(COMPOSE) build web

# ── 開発サーバー ───────────────────────────────────────────────────────────────
dev: ## Next.js 開発サーバー起動 (http://localhost:3000)
	$(COMPOSE) up web

dev-detach: ## 開発サーバーをバックグラウンドで起動
	$(COMPOSE) up -d web

# ── スクレイパー ───────────────────────────────────────────────────────────────
scrape: ## 全プロバイダーの価格をスクレイプ + pricing.json を更新
	$(COMPOSE) run --rm scraper bash update.sh

scrape-no-scrape: ## 為替レートのみ更新（Playwright スキップ）
	$(COMPOSE) run --rm scraper bash update.sh --no-scrape

# ── 静的ビルド ─────────────────────────────────────────────────────────────────
build: ## Next.js 静的エクスポート → web-next/out/
	@if [ ! -f web-next/data/pricing.json ]; then \
	    echo "ERROR: web-next/data/pricing.json が見つかりません"; \
	    echo "先に make scrape を実行してください"; \
	    exit 1; \
	fi
	$(COMPOSE) run --rm web bun run build

# ── テスト・品質チェック ───────────────────────────────────────────────────────
test: ## 全テスト実行（frontend vitest + backend pytest）
	$(COMPOSE) run --rm --no-deps web bun run test
	$(COMPOSE) run --rm scraper uv run pytest

test-web: ## フロントエンドテストのみ（vitest）
	$(COMPOSE) run --rm --no-deps web bun run test

test-scraper: ## バックエンドテストのみ（pytest）
	$(COMPOSE) run --rm scraper uv run pytest

typecheck: ## TypeScript 型チェック（tsc --noEmit）
	$(COMPOSE) run --rm --no-deps web bun run typecheck

lint: ## Biome リント
	$(COMPOSE) run --rm --no-deps web bun run lint

lint-fix: ## Biome リント（自動修正）
	$(COMPOSE) run --rm --no-deps web bun run lint:fix

format: ## Biome フォーマット
	$(COMPOSE) run --rm --no-deps web bun run format

# ── コンテナ管理 ───────────────────────────────────────────────────────────────
down: ## 全コンテナ停止・削除（ボリューム・イメージは保持）
	$(COMPOSE) down

logs: ## 全コンテナのログをフォロー
	$(COMPOSE) logs -f

logs-web: ## web コンテナのログのみフォロー
	$(COMPOSE) logs -f web

shell-web: ## web コンテナ内でシェルを起動
	$(COMPOSE) run --rm --no-deps web bash

shell-scraper: ## scraper コンテナ内でシェルを起動
	$(COMPOSE) run --rm scraper bash

# ── クリーンアップ ─────────────────────────────────────────────────────────────
clean: ## コンテナ・ボリューム・プロジェクトイメージを完全削除（フルリセット）
	$(COMPOSE) down -v --remove-orphans
	@echo "クリーン完了。再ビルドは make build-images を実行してください"

clean-images: ## イメージのみ削除してキャッシュなしで再ビルド
	$(COMPOSE) down --remove-orphans
	$(COMPOSE) build --no-cache
