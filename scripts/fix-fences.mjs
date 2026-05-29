import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

/**
 * コードフェンスの言語指定漏れを `text` に補完する。
 * - 開きフェンス (``` または ~~~) で言語指定が空のとき `text` を付与する。
 * - 末尾改行を1つに正規化する。
 *
 * @param {string} filePath - 対象 Markdown ファイル（上書き保存）。
 */
export default async function fixFences(filePath) {
  const absolutePath = resolve(filePath);
  const content = await readFile(absolutePath, 'utf8');
  const lines = content.split('\n');

  let inCodeBlock = false;
  let currentFence = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 開きフェンス判定
    const openMatch = line.match(/^(`{3,}|~{3,})(.*)$/);
    if (!inCodeBlock && openMatch) {
      inCodeBlock = true;
      currentFence = openMatch[1];
      const info = openMatch[2].trim();
      if (info === '') {
        lines[i] = lines[i].replace(currentFence, `${currentFence}text`);
      }
      continue;
    }

    // 閉じフェンス判定
    if (inCodeBlock && (line[0] === '`' || line[0] === '~') && line[0] === currentFence[0]) {
      const fenceChar = currentFence[0];
      const match = line.match(new RegExp(`^(${fenceChar === '`' ? '\\`' : '~'}{${currentFence.length},})$`));
      if (match) {
        inCodeBlock = false;
      }
    }
  }

  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  lines.push('');
  await writeFile(absolutePath, lines.join('\n'), 'utf8');
  console.log(`Successfully fixed fences in ${filePath}`);
}

// CLI エントリポイント: `bun scripts/fix-fences.mjs <file>` での直接起動時のみ実行
if (import.meta.main) {
  const targetFile = process.argv[2];
  if (!targetFile) {
    console.error('Usage: bun scripts/fix-fences.mjs <file-path>');
    process.exit(1);
  }
  try {
    await fixFences(targetFile);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
