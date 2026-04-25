#!/bin/bash
# LLM Studies 日次更新スクリプト
# 使い方: bash update.sh [--no-scrape]
#   --no-scrape: スクレイピングをスキップし、既存データの為替レートのみ更新
set -euo pipefail
cd "$(dirname "$0")"

SCRIPT_DIR="$(pwd)"
SCRAPER_DIR="${SCRIPT_DIR}/scraper"
DATA_JSON="${SCRIPT_DIR}/web-next/data/pricing.json"
DATA_JSON_PUBLIC="${SCRIPT_DIR}/web-next/public/pricing.json"
OUTPUT_JSON="${SCRIPT_DIR}/pricing.json"

# uv / bun のパスを補完（CI・cron 環境向け）
export PATH="${HOME}/.local/bin:${HOME}/.bun/bin:${PATH}"

# ── 引数処理 ──────────────────────────────────────────────
NO_SCRAPE=""
for arg in "$@"; do
  [[ "${arg}" == "--no-scrape" ]] && NO_SCRAPE="--no-scrape"
done

echo "=== LLM Studies Updater ==="
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# ── 1/2 スクレイピング ────────────────────────────────────
echo ">>> [1/2] 価格スクレイピング${NO_SCRAPE:+ (スキップ)}"
uv run --project "${SCRAPER_DIR}" python -m scraper.main \
  --output "${DATA_JSON}" \
  ${NO_SCRAPE}
echo "✓ pricing.json 更新完了: ${DATA_JSON}"
echo ""

# ── 2/2 成果物コピー ──────────────────────────────────────
echo ">>> [2/2] 成果物コピー"
cp "${DATA_JSON}" "${DATA_JSON_PUBLIC}"
cp "${DATA_JSON}" "${OUTPUT_JSON}"
echo "✓ ${DATA_JSON_PUBLIC}"
echo "✓ ${OUTPUT_JSON}"
echo ""

echo "=== 完了 ==="
echo "  JPY rate   : $(python3 -c "import json; d=json.load(open('${OUTPUT_JSON}')); print(f\"{d['jpy_rate']:.2f} ({d['jpy_rate_date']})\")" 2>/dev/null || echo '(確認できません)')"
