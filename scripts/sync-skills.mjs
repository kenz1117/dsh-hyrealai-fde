// 从 ai-fde 仓库同步技能包到 skills/（单一来源仍是 ai-fde 的 .agents/skills/）。
// 用法：
//   node scripts/sync-skills.mjs              # 原样拷贝（默认）
//   node scripts/sync-skills.mjs --normalize  # 额外补齐 dsh 兼容的 whenToUse 驼峰别名
// 源目录可用 AI_FDE_SKILLS_DIR / AI_FDE_CONTRACT_DIR 覆盖（默认 ../ai-fde/...）。
// 审计 A7：dsh 解析器对 when-to-use（kebab）与自定义字段的容忍度待 spike 裁决，
// 若拒载则以 --normalize 产物随包发布。
//
// 重要（可安装性）：源目录是开发机上的**兄弟仓库**，不在本仓库内、也不是依赖。
// 从 git/npm 安装时 pnpm 会执行 prepack，此时源目录必然不存在——必须跳过同步并
// 保留**已提交的 skills/**，否则安装会以 ENOENT 直接失败（ERR_PNPM_PREPARE_PACKAGE）。
import { existsSync, readdirSync } from 'node:fs'
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

const hasSrc = existsSync(SRC)
const hasSrc2 = existsSync(SRC2)

// 走安装路径（git/npm/CI）时源目录不存在：保留随包提交的 skills/，视为成功。
if (!hasSrc && !hasSrc2) {
  if (existsSync(DST)) {
    const kept = readdirSync(DST).filter(n => !n.startsWith('.')).length
    console.log(`sync:skills 跳过——源目录不存在（${SRC}）；保留随包提交的 skills/（${kept} 个技能包）`)
    process.exit(0)
  }
  console.error('sync:skills 失败：源目录不存在，且包内也没有 skills/ 可保留。')
  console.error(`  期望的源目录：${SRC}`)
  console.error('  本地开发请先 clone ai-fde 到同级目录，或用 AI_FDE_SKILLS_DIR 指定。')
  process.exit(1)
}

// 仅在确认源可用之后才清空目标目录（旧实现先 rm 再读源，源缺失时会毁掉 skills/）。
await rm(DST, { recursive: true, force: true })
await mkdir(DST, { recursive: true })

let count = 0

if (hasSrc2) {
  for (const entry of readdirSync(SRC2, { withFileTypes: true }).filter(e => e.isDirectory())) {
    await cp(path.join(SRC2, entry.name), path.join(DST, entry.name), { recursive: true, force: true })
    count++
  }
}

if (hasSrc) {
  for (const entry of await readdir(SRC, { withFileTypes: true })) {
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
}

console.log(`synced ${count} skill packages: ${SRC} -> ${DST}${normalize ? '（已补 whenToUse 别名）' : ''}`)
