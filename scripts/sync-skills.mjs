// 从 ai-fde 仓库同步技能包到 skills/（单一来源仍是 ai-fde 的 .agents/skills/）。
// 用法：
//   node scripts/sync-skills.mjs              # 原样拷贝（默认）
//   node scripts/sync-skills.mjs --normalize  # 额外补齐 dsh 兼容的 whenToUse 驼峰别名
// 源目录可用 AI_FDE_SKILLS_DIR 覆盖（默认 ../ai-fde/.agents/skills）。
// 审计 A7：dsh 解析器对 when-to-use（kebab）与自定义字段的容忍度待 spike 裁决，
// 若拒载则以 --normalize 产物随包发布。
import { readdirSync } from 'node:fs'
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = process.env.AI_FDE_SKILLS_DIR ?? path.resolve('..', 'ai-fde', '.agents', 'skills')
const SRC2 = process.env.AI_FDE_CONTRACT_DIR ?? path.resolve('..', 'ai-fde', '.trae', 'skills')
const DST = path.resolve('skills')
const normalize = process.argv.includes('--normalize')

/** 在 frontmatter 中为 when-to-use 补一行等值 whenToUse（幂等） */
function patchFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
  if (!match) return raw
  const fm = match[1]
  if (!/^when-to-use:/m.test(fm) || /^whenToUse:/m.test(fm)) return raw
  const patched = fm.replace(/^when-to-use:(.*)$/m, (_line, value) => `when-to-use:${value}\nwhenToUse:${value}`)
  return raw.replace(fm, patched)
}

await rm(DST, { recursive: true, force: true })
await mkdir(DST, { recursive: true })

const entries = await readdir(SRC, { withFileTypes: true })
let count = 0
for (const entry of readdirSync(SRC2, { withFileTypes: true }).filter(e => e.isDirectory())) {
  const from = path.join(SRC2, entry.name);
  const to = path.join(DST, entry.name);
  await cp(from, to, { recursive: true, force: true });
  count++;
}
for (const entry of entries) {
  if (!entry.isDirectory()) continue
  const from = path.join(SRC, entry.name)
  const to = path.join(DST, entry.name)
  await cp(from, to, { recursive: true })
  if (normalize) {
    const skillFile = path.join(to, 'SKILL.md')
    try {
      const raw = await readFile(skillFile, 'utf8')
      await writeFile(skillFile, patchFrontmatter(raw))
    } catch {
      // 无 SKILL.md 的目录原样保留
    }
  }
  count++
}

console.log(`synced ${count} skill packages: ${SRC} -> ${DST}${normalize ? '（已补 whenToUse 别名）' : ''}`)
