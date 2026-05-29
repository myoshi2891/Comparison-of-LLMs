import fs from 'fs';
import path from 'path';

// Usage: node scripts/html-to-tsx.mjs <input.html> <page-name>
// Example: node scripts/html-to-tsx.mjs integration-functional-testing-guide.html integration-functional-testing-guide

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: node scripts/html-to-tsx.mjs <input.html> <page-name>");
    process.exit(1);
}

const inputPath = args[0];
const pageName = args[1];

if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(pageName)) {
    console.error(`Error: Invalid page-name '${pageName}'. Only alphanumeric characters and hyphens are allowed, and it must start with a letter.`);
    process.exit(1);
}

let html;
try {
    html = fs.readFileSync(inputPath, 'utf8');
} catch (error) {
    console.error(`Error reading file ${inputPath}: ${error.message}`);
    process.exit(1);
}

const mainMatch = html.match(/<main(?:\s+[^>]*)?>([\s\S]*?)<\/main>/);
if (!mainMatch) {
    console.error(`Error: Could not find <main> tag in ${inputPath}`);
    process.exit(1);
}
let mainContent = mainMatch[1];

// 1. Extract <pre> blocks to preserve them as raw HTML
const preBlocks = [];
mainContent = mainContent.replace(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/g, (match, attrs, content) => {
    let normalizedAttrs = attrs.replace(/(?<!data-)class=/g, 'className=');
    normalizedAttrs = normalizedAttrs.replace(/style="([^"]*)"/g, (m, styleString) => {
        const styleObj = {};
        styleString.split(';').forEach(declaration => {
            if (declaration.trim() === '') return;
            const idx = declaration.indexOf(':');
            if (idx === -1) return;
            const property = declaration.slice(0, idx).trim();
            const value = declaration.slice(idx + 1).trim();
            if (property && value) {
                const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                styleObj[camelProperty] = value;
            }
        });
        return `style={{${Object.entries(styleObj).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ')}}}`;
    });
    preBlocks.push({ attrs: normalizedAttrs, content });
    return `___PRE_BLOCK_${preBlocks.length - 1}___`;
});

// Escape { and }
mainContent = mainContent.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');

// JSX conversions
mainContent = mainContent.replace(/(?<!data-)class=/g, 'className=');
mainContent = mainContent.replace(/(?<!data-)for=/g, 'htmlFor=');
mainContent = mainContent.replace(/<!--/g, '{/*');
mainContent = mainContent.replace(/-->/g, '*/}');
mainContent = mainContent.replace(/<br>/g, '<br />');
mainContent = mainContent.replace(/<hr>/g, '<hr />');
mainContent = mainContent.replace(/<hr className="div">/g, '<hr className="divider" />');

// Replace specific class names within className or class attributes
mainContent = mainContent.replace(/(className|class)="([^"]*)"/g, (match, attrName, attrValue) => {
    let newVal = attrValue;
    
    // Specific class names
    newVal = newVal.replace(/\bsh\b/g, 'section-header');
    newVal = newVal.replace(/\bsh-num\b/g, 'section-num');
    newVal = newVal.replace(/\baccent-rule\b/g, 'accent-line');
    newVal = newVal.replace(/\btw\b/g, 'table-wrapper');
    newVal = newVal.replace(/\bstat-pill\b/g, 'stat');
    newVal = newVal.replace(/\bstat-v\b/g, 'stat-num');
    newVal = newVal.replace(/\bstat-l\b/g, 'stat-label');
    newVal = newVal.replace(/\bcode-hdr\b/g, 'code-header');
    newVal = newVal.replace(/\bdots\b/g, 'code-dots');
    newVal = newVal.replace(/\bstep-n\b/g, 'step-num-circle');
    newVal = newVal.replace(/\bstep-body\b/g, 'step-content');

    // Badges
    newVal = newVal.replace(/\bb-sky\b/g, 'badge-int');
    newVal = newVal.replace(/\bb-teal\b/g, 'badge-int');
    newVal = newVal.replace(/\bb-amber\b/g, 'badge-e2e');
    newVal = newVal.replace(/\bb-red\b/g, 'badge-sec');
    newVal = newVal.replace(/\bb-green\b/g, 'bg-accent-green/10 text-[var(--color-accent-green)] border-[rgba(104,211,145,0.3)]'); 
    newVal = newVal.replace(/\bb-violet\b/g, 'badge-func');
    newVal = newVal.replace(/\bb-slate\b/g, 'badge-unit');

    // Callouts
    newVal = newVal.replace(/\bc-sky\b/g, 'callout-info');
    newVal = newVal.replace(/\bc-amber\b/g, 'callout-warn');
    newVal = newVal.replace(/\bc-red\b/g, 'callout-danger');
    newVal = newVal.replace(/\bc-green\b/g, 'callout-good');
    newVal = newVal.replace(/\bc-teal\b/g, 'callout-info');
    newVal = newVal.replace(/\bc-violet\b/g, 'callout-info');

    // Grids & Flex
    newVal = newVal.replace(/\bg2\b/g, 'grid-2');
    newVal = newVal.replace(/\bflex ia gap1 mt1\b/g, 'flex items-center gap-1 mt-1');
    newVal = newVal.replace(/\bflex ia gap1\b/g, 'flex items-center gap-1');
    newVal = newVal.replace(/\bflex ia\b/g, 'flex items-center');

    // Spacing
    newVal = newVal.replace(/\bgap1\b/g, 'gap-1');
    newVal = newVal.replace(/\bgap2\b/g, 'gap-2');
    newVal = newVal.replace(/\bmt1\b/g, 'mt-1');
    newVal = newVal.replace(/\bmt2\b/g, 'mt-2');
    newVal = newVal.replace(/\bmt3\b/g, 'mt-3');
    newVal = newVal.replace(/\bmt4\b/g, 'mt-4');

    return `${attrName}="${newVal}"`;
});

const varMap = {
    '--forest': 'var(--color-bg-primary)',
    '--forest2': 'var(--color-bg-secondary)',
    '--forest3': 'var(--color-bg-card)',
    '--forest4': 'var(--color-bg-card-hover)',
    '--moss': 'var(--color-accent-green)',
    '--sage': 'var(--color-accent-green)',
    '--sage2': 'var(--color-accent-green)',
    '--mint': 'var(--color-accent-green)',
    '--mint2': 'var(--color-accent-green)',
    '--gold': 'var(--color-accent-yellow)',
    '--gold2': 'var(--color-accent-orange)',
    '--gold3': 'var(--color-accent-yellow)',
    '--gold4': 'var(--color-accent-yellow)',
    '--gold5': 'var(--color-accent-yellow)',
    '--ivory': 'var(--color-text-primary)',
    '--ivory2': 'var(--color-text-primary)',
    '--warm': 'var(--color-text-secondary)',
    '--muted': 'var(--color-text-muted)',
    '--shadow3': 'var(--color-bg-primary)',
    '--ok': 'var(--color-accent-green)',
    '--warn': 'var(--color-accent-yellow)',
    '--danger': 'var(--color-accent-red)',
    '--info': 'var(--color-accent-blue)',
    '--purple': 'var(--color-accent-purple)',
    '--navy': 'var(--color-bg-primary)',
    '--navy2': 'var(--color-bg-secondary)',
    '--navy3': 'var(--color-bg-card)',
    '--navy4': 'var(--color-bg-card-hover)',
    '--slate': 'var(--color-border)',
    '--wire': 'var(--color-border)',
    '--wire2': 'var(--color-border-bright)',
    '--sky': 'var(--color-accent-blue)',
    '--sky2': 'var(--color-accent-blue)',
    '--sky3': 'var(--color-accent-cyan)',
    '--electric': 'var(--color-accent-cyan)',
    '--teal': 'var(--color-accent-cyan)',
    '--amber': 'var(--color-accent-orange)',
    '--amber2': 'var(--color-accent-yellow)',
    '--red': 'var(--color-accent-red)',
    '--red2': 'var(--color-accent-red)',
    '--green': 'var(--color-accent-green)',
    '--green2': 'var(--color-accent-green)',
    '--violet': 'var(--color-accent-purple)',
    '--text1': 'var(--color-text-primary)',
    '--text2': 'var(--color-text-secondary)',
    '--text3': 'var(--color-text-muted)',
    '--r': 'var(--radius-DEFAULT, 12px)',
    '--r-sm': 'var(--radius-sm, 8px)'
};

for (const [key, value] of Object.entries(varMap)) {
    mainContent = mainContent.replace(new RegExp(`var\\(${key}\\)`, 'g'), value);
}

mainContent = mainContent.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styleObj = {};
    styleString.split(';').forEach(declaration => {
        if (declaration.trim() === '') return;
        const idx = declaration.indexOf(':');
        if (idx === -1) return;
        const property = declaration.slice(0, idx).trim();
        const value = declaration.slice(idx + 1).trim();
        if (property && value) {
        const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[camelProperty] = value;
        }
        });
        return `style={{${Object.entries(styleObj).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ')}}}`;
        });
// Replace old colspan with colSpan
mainContent = mainContent.replace(/colspan="(\d+)"/g, 'colSpan={$1}');

// Restore <pre> blocks using dangerouslySetInnerHTML
mainContent = mainContent.replace(/___PRE_BLOCK_(\d+)___/g, (match, index) => {
    const { attrs, content } = preBlocks[index];
    return `<pre${attrs} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(content)} }} />`;
});

// Generate Component Name (PascalCase)
let componentName = pageName.split('-').filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
if (!componentName) {
    componentName = 'DefaultPage';
}

const cssExists = fs.existsSync(path.join('app', `${pageName}.css`));
const cssImport = cssExists ? `import '../${pageName}.css';\n` : '';

const out = `${cssImport}
export default function ${componentName}() {
    return (
        <>
            ${mainContent}
        </>
    );
}
`;

const outputDir = path.join('app', pageName);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'page.tsx');
fs.writeFileSync(outputPath, out);
console.log(`Successfully converted ${inputPath} -> ${outputPath}`);
