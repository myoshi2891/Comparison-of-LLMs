import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cssPath = path.resolve(__dirname, '../app/istqb-ct-genai-complete-guide/istqb-ct-genai-complete-guide.css');

let css = fs.readFileSync(cssPath, 'utf-8');

// 1. Remove :root {} entirely
css = css.replace(/:root\s*\{[^}]+\}/, '');

// 2. Remove CSS CUSTOM PROPERTIES comment and RESET & BASE
css = css.replace(/\/\* ============================\s*CSS CUSTOM PROPERTIES[\s\S]*?\/\* ============================\s*BACKGROUND EFFECTS/m, '/* ============================\n   BACKGROUND EFFECTS');

// 3. Convert body::before and body::after to &::before and &::after since we'll wrap it
css = css.replace(/body::before/g, '&::before');
css = css.replace(/body::after/g, '&::after');

// 4. Wrap everything in .istqb-ct-genai-page
if (!css.includes('.istqb-ct-genai-page {')) {
    css = `.istqb-ct-genai-page {\n${css}\n}\n`;
}

// 5. Replace variables with globals.css theme tokens
const replacements = {
    'var(--bg-deep)': 'var(--color-bg-primary)',
    'var(--bg-card)': 'var(--color-bg-card)',
    'var(--bg-card2)': 'var(--color-bg-secondary)',
    'var(--bg-hover)': 'var(--color-bg-card-hover)',
    'var(--neon-green)': 'var(--color-accent-green)',
    'var(--neon-cyan)': 'var(--color-accent-cyan)',
    'var(--neon-purple)': 'var(--color-accent-purple)',
    'var(--neon-amber)': 'var(--color-accent-orange)',
    'var(--neon-red)': 'var(--color-accent-red)',
    'var(--neon-pink)': 'var(--color-accent-pink)',
    'var(--text-primary)': 'var(--color-text-primary)',
    'var(--text-secondary)': 'var(--color-text-secondary)',
    'var(--text-muted)': 'var(--color-text-muted)',
    'var(--border-color)': 'var(--color-border)',
    'var(--border-glow)': 'var(--color-border-bright)',
    'var(--green-dim)': 'rgba(var(--accent-green-rgb), 0.08)',
    'var(--cyan-dim)': 'rgba(var(--accent-cyan-rgb), 0.08)',
    'var(--purple-dim)': 'rgba(var(--accent-purple-rgb), 0.08)',
    'var(--amber-dim)': 'rgba(var(--accent-orange-rgb), 0.08)',
    'var(--red-dim)': 'rgba(var(--accent-red-rgb), 0.08)',
    'var(--radius)': 'var(--radius-sm, 8px)',
    'var(--radius-lg)': 'var(--radius-DEFAULT, 12px)',
    'var(--transition)': '0.2s ease',
    'var(--font-display)': 'var(--font-display, \'Syne\', sans-serif)',
    'var(--font-mono)': 'var(--font-mono, \'Space Mono\', monospace)',
    'var(--font-body)': 'var(--font-body, \'IBM Plex Sans JP\', sans-serif)'
};

for (const [oldVar, newVar] of Object.entries(replacements)) {
    css = css.split(oldVar).join(newVar);
}

// Rename keyframes camelCase to kebab-case
css = css.replace(/@keyframes fadeInDown/g, '@keyframes fade-in-down');
css = css.replace(/animation: fadeInDown/g, 'animation: fade-in-down');
css = css.replace(/@keyframes fadeInUp/g, '@keyframes fade-in-up');
css = css.replace(/animation: fadeInUp/g, 'animation: fade-in-up');
css = css.replace(/@keyframes growBar/g, '@keyframes grow-bar');
css = css.replace(/animation: growBar/g, 'animation: grow-bar');

fs.writeFileSync(cssPath, css, 'utf-8');
