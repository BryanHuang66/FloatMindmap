
import * as magicaction from "addons/magicaction"
import * as autodetect from "addons/autoDetect"

// 不要包含 magication，顺序为显示的顺序，magiction 始终为第1个
const addons = [
  autodetect,
]

const genSection = (config: IConfig): ISection => {
  const rows: Array<IRow> = [
    {
      type: cellViewType.plainText,
      label: config.intro,
      link: config.link ?? ""
    }
  ]
  for (const setting of config.settings) {
    if (
      setting.help &&
      setting.type != cellViewType.buttonWithInput &&
      setting.type != cellViewType.button
    )
      rows.push({
        type: cellViewType.plainText,
        label: setting.help,
        link: setting.link ?? ""
      })
    else if (setting.label && setting.type == cellViewType.input)
      rows.push({
        type: cellViewType.plainText,
        label: setting.label,
        link: setting.link ?? ""
      })
    //@ts-ignore
    rows.push(setting)
  }
  return {
    header: config.name,
    rows
  }
}

export const genDataSource = (
  configs: Array<IConfig>,
  magicaction: IConfig
): Array<ISection> => {
  const dataSource: Array<ISection> = []
  for (let config of configs) {
    dataSource.push(genSection(config))
    if (config.actions.length) {
      for (let action of config.actions) magicaction.actions.push(action)
    }
    magicaction.settings = magicaction.actions.sort(
      (a: ISetting, b: ISetting) => {
        const val1 = a.label.length
        const val2 = b.label.length
        return val1 - val2
      }
    )
  }
  dataSource.unshift(genSection(magicaction))
  return dataSource
}

const genDataSourceIndex = (dataSource: Array<ISection>) => {
  const dataSourceIndex: {
    [k: string]: {
      [k: string]: [number, number]
    }
  } = {}
  dataSource.forEach((section, secIndex) => {
    const name = section.header.toLowerCase()
    if (name != "magicaction") {
      dataSourceIndex[name] = {}
      section.rows.forEach((row, rowIndex) => {
        switch (row.type) {
          case cellViewType.input:
          case cellViewType.switch:
          case cellViewType.select:
          case cellViewType.inlineInput:
          case cellViewType.muiltSelect:
            dataSourceIndex[name][row.key] = [secIndex, rowIndex]
        }
      })
    }
  })
  return dataSourceIndex
}

const genActionsUtils = () => {
  const actions = { ...magicaction.action }
  for (const addon of addons) {
    Object.assign(actions, addon.action)
  }
  return actions
}

export const actions = genActionsUtils()
export const dataSource = genDataSource(
  addons.map(addon => addon.config),
  magicaction.config
)
export const dataSourceIndex = genDataSourceIndex(dataSource)
