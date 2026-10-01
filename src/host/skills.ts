// 技能包同步（Sprint 1 硬点①）：dsh 启动时把插件随包技能同步到 ~/.dsh/skills。
// 该目录是 dsh-skill-filesystem 的 user-dsh root（rank 400），chokidar 热加载——
// 同步完成即可被会话技能目录发现，无需用户任何操作。
// frontmatter 兼容：我们的 SKILL.md 用 when-to-use（kebab），dsh 期望 whenToUse——
// 写入时幂等补齐驼峰别名（审计 A7 的落地方案，替代 --normalize 手工步骤）。
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function dshSkillsRoot(): string {
  const home = process.env.DSH_HOME || join(homedir(), ".dsh");
  return join(home, "skills");
}

/** 插件随包技能目录：lib/index.js 的上一级 skills/（link 安装时即仓库内目录） */
function packageSkillsDir(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "skills");
}

function normalizeFrontmatter(raw: string): string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return raw;
  const fm = match[1];
  if (!/^when-to-use:/m.test(fm) || /^whenToUse:/m.test(fm)) return raw;
  const patched = fm.replace(/^when-to-use:(.*)$/m, (_line, value) => `when-to-use:${value}\nwhenToUse:${value}`);
  return raw.replace(fm, patched);
}

/** 同步全部技能包；返回同步数量。幂等：每次启动整体覆盖（每次都把插件随包技能同步到 ~/.dsh/skills） */
export function ensureSkillsSynced(): number {
  const src = packageSkillsDir();
  if (!existsSync(src)) return 0;
  const dst = dshSkillsRoot();
  mkdirSync(dst, { recursive: true });
  let count = 0;
  // 仅同步顶层子目录（每个子目录为一个技能包，含 SKILL.md 与可能的 resources/）；不去嵌套
  for (const name of readdirSync(src)) {
    const from = join(src, name);
    if (!existsSync(join(from, "SKILL.md"))) continue;
    const to = join(dst, name);
    mkdirSync(to, { recursive: true });
    cpSync(from, to, { recursive: true, force: true });
    const skillFile = join(to, "SKILL.md");
    writeFileSync(skillFile, normalizeFrontmatter(readFileSync(skillFile, "utf8")));
    count++;
  }
  return count;
}
