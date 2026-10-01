// hyreal-fde-ai client 半入口：只注册 UI——侧边栏入口、工作台页、工具结果卡片、设置分区、词典。
// 取数一律 fetch('/fde/...')（host 半同源代理），浏览器不接触 PAT。
import type { ClientContext } from '../dsh-types'
import { en, NS, zh } from './i18n'
import { HyrealPanelIcon } from './sidebar-icon'
import { HyrealFdeSettingsPage } from './settings-section'
import { DraftCommunicationToolView, MyActionsToolView, MyClientsToolView } from './tool-views'
import { WorkbenchPage } from './workbench-page'

export const inject = ['slots', 'locale', 'layout']

/** 侧边栏入口 id 与 main 面板 key 同名即联动（见 dsh ui-plugin-manager） */
const PANEL_ID = 'hyreal-fde-ai'

/** 延迟+重试的落位（selectPanel 过早调用会因面板未注册而抛错） */
function landOnWorkbench(ctx: ClientContext, tries = 0): void {
  setTimeout(() => {
    try {
      ctx.layout.selectPanel(PANEL_ID)
    } catch {
      if (tries < 6) landOnWorkbench(ctx, tries + 1)
    }
  }, tries === 0 ? 0 : 150 * tries)
}

export function apply(ctx: ClientContext): void {
  ctx.locale.register(NS, { zh, en })
  const t = ctx.locale.bind(NS)

  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      { name: 'sidebar.panellist', id: PANEL_ID, order: 30, label: () => t('panel'), locale: NS },
      HyrealPanelIcon,
    ),
  )

  ctx.slots.inject('main', () =>
    ctx.slots.register({ name: 'main', key: PANEL_ID, locale: NS }, WorkbenchPage),
  )

  // 首页融合：等 main 注册就绪后再切面板（过早调用会抛错并中止本插件 apply）
  landOnWorkbench(ctx)

  // dsh 设置面板的独立分区：平台接入配置与连接状态（按用户要求从工作台页右上角迁来）
  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      { name: 'settings.section', id: PANEL_ID, order: 40, label: () => t('settingsNav'), locale: NS },
      HyrealFdeSettingsPage,
    ),
  )

  ctx.slots.inject('tool.call.toolview', () => {
    const disposers = [
      ctx.slots.register(
        { name: 'tool.call.toolview', id: 'hyreal-fde-ai.actions', key: 'mcp__fde__get_my_actions', locale: NS },
        MyActionsToolView,
      ),
      ctx.slots.register(
        { name: 'tool.call.toolview', id: 'hyreal-fde-ai.clients', key: 'mcp__fde__search_my_clients', locale: NS },
        MyClientsToolView,
      ),
      ctx.slots.register(
        { name: 'tool.call.toolview', id: 'hyreal-fde-ai.draft', key: 'mcp__fde__draft_communication', locale: NS },
        DraftCommunicationToolView,
      ),
    ]
    return () => {
      for (const dispose of disposers) dispose()
    }
  })
}
