const profileType = {
  autodetect: {
    panelPostion: [1], // 不要删除（面板位置）
    panelHeight: [1], // 不要删除（面板高度）
    doubleClick: false, // 不要删除（双击动作）
    visible: true,
    position:[0],
    theme:[0],
  }, //保持与文件名一致（小写）
}



export const enum on {
}

const docProfileType = {
  autodetect: {
    clickToactivate:true, 
  },
}

export type IProfile = typeof profileType
export type IProfile_doc = typeof docProfileType

const profile: {
  [k: string]: { [k: string]: boolean | string | number[] }
} & IProfile = {
  ...profileType
}

const docProfile: {
  [k: string]: { [k: string]: boolean | string | number[] }
} & IProfile_doc = {
  ...docProfileType
}

export { profile, docProfile }
