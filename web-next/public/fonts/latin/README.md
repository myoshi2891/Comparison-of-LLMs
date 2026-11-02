# Local Latin fonts

Updated 2026-11-02

JetBrains Mono and Syne are vendored from the Google Fonts repository and loaded by
`lib/fonts.ts` using `next/font/local`. This avoids the failing Turbopack Google-font
URL resolver and removes font downloads during compilation. The existing CSS
variables, normal styles, swap display, and configured weight coverage are preserved.
The original font binaries and their SIL Open Font License texts are stored together.

| File | Upstream | SHA-256 |
| --- | --- | --- |
| JetBrainsMono-Variable.ttf | [Google Fonts: JetBrains Mono](https://github.com/google/fonts/blob/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf) | `48715a42ec242c21e9f02692891e147d022299a52e48d5e413e1a942193ffeda` |
| JetBrainsMono-OFL.txt | [JetBrains Mono OFL](https://github.com/google/fonts/blob/main/ofl/jetbrainsmono/OFL.txt) | `b2fe5e8987594e9ffd1d2ca52a2f5d73eb8335243893c5d6254b5ad69269591d` |
| Syne-Variable.ttf | [Google Fonts: Syne](https://github.com/google/fonts/blob/main/ofl/syne/Syne%5Bwght%5D.ttf) | `ce5ac77142a65cab2248a1a2ebb740b1d4d9c20b52488877d3ff664d1356104a` |
| Syne-OFL.txt | [Syne OFL](https://github.com/google/fonts/blob/main/ofl/syne/OFL.txt) | `cc43cdce6f91c57989af8459341c276655e34224e954fa69c2ad700831a742d8` |

The files were retrieved on 2026-11-02. Upstream URLs point to a mutable branch;
the checksums above identify the exact vendored generation. Font replacement is a
separate task and requires rerunning `tests/latin-fonts-local.test.ts` and checking
the served assets. Noto Sans JP remains managed by `scripts/vendor-noto-sans-jp.ts`.
